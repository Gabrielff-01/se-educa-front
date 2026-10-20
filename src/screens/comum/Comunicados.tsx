/* Comunicados: avisos da rede, da escola e da turma. Todos os perfis leem (GET /api/comunicados/;
   a API já devolve só o que cada um pode ver).
   Quem pode escrever (POST /api/comunicados/):
   - professor: para uma turma onde dá aula (turmas do /api/painel/professor/);
   - escola: para a escola inteira (a dela) ou uma turma da escola;
   - secretaria: para a rede toda, uma escola ou uma turma.
   Aluno e responsável só leem. O autor pode apagar o seu (DELETE /api/comunicados/ID/). */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconChat, IconCheck, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { dataHoraBR, hojeISO, opcoesDe } from "@/lib/formato";
import type { Comunicado, Escola, Opcao, PainelProfessor, Turma } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

type Alcance = Comunicado["alcance"];
const COR_ALCANCE: Record<Alcance, string> = { rede: BLUE, escola: TEAL, turma: AMBER, pessoa: VIOLET };
const NOME_ALCANCE: Record<Alcance, string> = { rede: "Rede toda", escola: "Escola", turma: "Turma", pessoa: "Para você" };

type FormComunicado = { titulo: string; texto: string; alcance: Alcance; escola: string; turma: string };

export function Comunicados({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const perfil = usuario?.perfil;
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");

  // Para onde cada perfil pode mandar
  const alcances: Alcance[] = perfil === "professor" ? ["turma"] : perfil === "escola" ? ["escola", "turma"] : perfil === "secretaria" ? ["rede", "escola", "turma"] : [];
  const podeEscrever = alcances.length > 0;

  // Listas pro formulário (só busca o que o perfil usa)
  const painel = useApi<PainelProfessor>(perfil === "professor" ? "/api/painel/professor/" : null);
  const escolas = useApi<Escola[]>(perfil === "secretaria" ? "/api/escolas/" : null);
  const [form, setForm] = useState<FormComunicado | null>(null);
  const escolaDasTurmas = perfil === "escola" ? usuario?.escola : form?.escola ? Number(form.escola) : null;
  const turmas = useApi<Turma[]>(perfil === "escola" || perfil === "secretaria" ? `/api/turmas/${escolaDasTurmas ? `?escola=${escolaDasTurmas}` : ""}` : null);

  const opcoesTurma: Opcao[] = perfil === "professor"
    // O professor pode ter duas matérias na mesma turma: tira as repetidas
    ? [...new Map((painel.dados?.turmas ?? []).map((t) => [t.turma, { valor: String(t.turma), nome: `${t.turma_nome} · ${t.escola_nome}` }])).values()]
    : opcoesDe(turmas.dados, (t) => perfil === "secretaria" && !form?.escola ? `${t.nome} · ${t.escola_nome}` : t.nome);

  const [filtro, setFiltro] = useState<"todos" | Alcance>("todos");
  const [salvo, setSalvo] = useState("");
  const [apagando, setApagando] = useState<number | null>(null); // pede confirmação antes de apagar
  const envio = useEnvio(["titulo", "texto", "alcance", "escola", "turma"]);
  const apagar = useEnvio();

  const abrir = () => {
    envio.limpar();
    setSalvo("");
    setForm({ titulo: "", texto: "", alcance: alcances[0], escola: perfil === "escola" ? String(usuario?.escola ?? "") : "", turma: "" });
  };
  const mudar = (campo: keyof FormComunicado) => (v: string) => form && setForm({ ...form, [campo]: v, ...(campo === "escola" ? { turma: "" } : {}) });

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    // Só manda escola/turma quando o alcance precisa delas
    await api("/api/comunicados/", {
      method: "POST",
      body: {
        titulo: form.titulo, texto: form.texto, alcance: form.alcance,
        escola: form.alcance === "escola" && form.escola ? Number(form.escola) : null,
        turma: form.alcance === "turma" && form.turma ? Number(form.turma) : null,
      },
    });
    setForm(null);
    setSalvo("Comunicado enviado!");
    comunicados.recarregar();
  });

  const confirmarApagar = (c: Comunicado) => apagar.enviar(async () => {
    await api(`/api/comunicados/${c.id}/`, { method: "DELETE" });
    setApagando(null);
    setSalvo("Comunicado apagado.");
    comunicados.recarregar();
  });

  const todos = comunicados.dados ?? [];
  const presentes = (["rede", "escola", "turma", "pessoa"] as Alcance[]).filter((a) => todos.some((c) => c.alcance === a));
  const lista = todos.filter((c) => filtro === "todos" || c.alcance === filtro);
  const hoje = hojeISO();

  return (
    <>
      <TopBar title="Comunicados" subtitle="Avisos da rede, da escola e da turma" onBack={back} accent={GREEN} right={podeEscrever && !form ? <BotaoNovo label="Novo comunicado" cor={GREEN} onClick={abrir} /> : undefined} />
      <Screen>
        {form && (
          <CartaoForm titulo="Novo comunicado" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
            <Entrada label="Título" value={form.titulo} onChange={mudar("titulo")} erro={envio.campos.titulo} placeholder="Ex.: Reunião de pais" />
            <label className="block">
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Mensagem</span>
              <textarea value={form.texto} onChange={(e) => mudar("texto")(e.target.value)} rows={4} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.texto ? RED : "#e2e8f0", color: INK }} />
              {envio.campos.texto && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.texto}</span>}
            </label>
            {alcances.length > 1 && (
              <Escolha label="Para quem" value={form.alcance} onChange={mudar("alcance")} opcoes={alcances.map((a) => ({ valor: a, nome: a === "escola" && perfil === "escola" ? `Escola inteira (${usuario?.escola_nome ?? ""})` : NOME_ALCANCE[a] }))} erro={envio.campos.alcance} />
            )}
            {/* A secretaria escolhe a escola (pra mandar pra escola toda ou pra filtrar as turmas) */}
            {perfil === "secretaria" && form.alcance !== "rede" && (
              <Escolha label="Escola" value={form.escola} onChange={mudar("escola")} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} erro={envio.campos.escola} vazio={form.alcance === "turma" ? "Todas as escolas" : "Escolha a escola"} />
            )}
            {form.alcance === "turma" && (
              <Escolha label="Turma" value={form.turma} onChange={mudar("turma")} opcoes={opcoesTurma} erro={envio.campos.turma} vazio="Escolha a turma" />
            )}
          </CartaoForm>
        )}

        {salvo && <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />{salvo}</div>}
        {apagar.erro && <div className="mb-3 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}>{apagar.erro}</div>}

        {presentes.length > 1 && (
          <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
            {(["todos", ...presentes] as const).map((f) => (
              <button key={f} onClick={() => setFiltro(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f === "todos" ? "Todos" : NOME_ALCANCE[f]}</button>
            ))}
          </div>
        )}

        <EstadoApi carregando={comunicados.carregando} erro={comunicados.erro} onRetry={comunicados.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhum comunicado" text="Quando a escola, a rede ou um professor mandar um aviso, ele aparece aqui." icon={<IconChat size={26} />} />
          ) : (
            <div className="mt-3 space-y-3">
              {lista.map((c) => {
                const meu = usuario !== null && c.autor === usuario.id;
                return (
                  <div key={c.id} className="card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Pill color={COR_ALCANCE[c.alcance]}>{c.alcance_nome}</Pill>
                      <span className="text-[11px]" style={{ color: INK_SOFT }}>{dataHoraBR(c.criado_em)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-[14px] font-bold" style={{ color: INK }}>{c.titulo}</p>
                      {c.criado_em.startsWith(hoje) && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: RED }}>HOJE</span>}
                    </div>
                    <p className="mt-1 whitespace-pre-line text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>{c.texto}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[color:var(--color-line)] pt-2.5">
                      <p className="min-w-0 text-[11px] leading-snug" style={{ color: INK_SOFT }}>De <b>{meu ? "você" : c.autor_nome}</b> · para {c.para}</p>
                      {meu && (apagando === c.id ? (
                        <span className="flex flex-none gap-1.5">
                          <button onClick={() => setApagando(null)} className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "#f1f5f9", color: INK_SOFT }}>Não</button>
                          <button onClick={() => confirmarApagar(c)} disabled={apagar.enviando} className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60" style={{ background: RED }}>{apagar.enviando ? "Apagando..." : "Apagar mesmo"}</button>
                        </span>
                      ) : (
                        <button onClick={() => { apagar.limpar(); setApagando(c.id); }} aria-label={`Apagar ${c.titulo}`} className="flex flex-none items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: RED + "12", color: RED }}><IconX size={13} />Apagar</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
