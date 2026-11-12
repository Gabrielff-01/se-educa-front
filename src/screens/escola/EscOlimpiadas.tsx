/* Escola — Olimpíadas escolares (diferencial pedido pelo mentor).
   A escola cadastra a olimpíada, inscreve alunos (ou eles se inscrevem pelo app), fecha as inscrições,
   lança as notas e publica o resultado. A classificação e as medalhas a API calcula sozinha.
   Dados: /api/olimpiadas/ (+ /inscrever/, /sair/, /notas/, /classificacao/), /api/materias/,
          /api/ofertas/?escola= (séries que podem participar) e /api/alunos/?busca= (inscrever). */

import { useEffect, useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconChevron, IconEdit, IconPlus, IconTrophy, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR, notaBR } from "@/lib/formato";
import type { Aluno, LinhaOlimpiada, Materia, Oferta, Olimpiada } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

export const COR_STATUS: Record<Olimpiada["status"], string> = { inscricoes: GREEN, andamento: AMBER, resultado: VIOLET };
export const MEDALHA: Record<string, { cor: string; nome: string }> = {
  ouro: { cor: "#d4a017", nome: "Ouro" },
  prata: { cor: "#8b97a8", nome: "Prata" },
  bronze: { cor: "#b4733c", nome: "Bronze" },
  destaque: { cor: BLUE, nome: "Medalha" },
};

type Form = { id?: number; nome: string; materia: string; data_prova: string; nota_maxima: string; premiados: string; series: number[]; descricao: string };
const VAZIO: Form = { nome: "", materia: "", data_prova: "", nota_maxima: "10", premiados: "3", series: [], descricao: "" };

/* A medalha (ou a posição) de uma linha da classificação. */
export function Posicao({ linha }: { linha: LinhaOlimpiada }) {
  const medalha = MEDALHA[linha.medalha];
  if (linha.posicao == null) return <span className="w-9 flex-none text-center text-[11px]" style={{ color: INK_SOFT }}>—</span>;
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-full text-[12px] font-extrabold" title={medalha?.nome}
      style={medalha ? { background: medalha.cor, color: "#fff" } : { background: "#eef2f7", color: INK }}>
      {linha.posicao}º
    </span>
  );
}

function Cartao({ o, aberto, abrir, editar, mudou }: { o: Olimpiada; aberto: boolean; abrir: () => void; editar: () => void; mudou: (texto: string) => void }) {
  const cor = COR_STATUS[o.status];
  const classificacao = useApi<LinhaOlimpiada[]>(aberto ? `/api/olimpiadas/${o.id}/classificacao/` : null);
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
  useEffect(() => { const t = setTimeout(() => setTermo(busca.trim()), 400); return () => clearTimeout(t); }, [busca]);
  const achados = useApi<Aluno[]>(aberto && termo.length >= 2 ? `/api/alunos/?busca=${encodeURIComponent(termo)}` : null);
  const envio = useEnvio(["aluno"]); // erro das notas e do andamento vai pro aviso vermelho
  const linhas = classificacao.dados ?? [];
  const inscritos = new Set(linhas.map((l) => l.aluno));

  // Quando a classificação chega, preenche as caixas de nota com o que já foi lançado.
  useEffect(() => {
    setNotas(Object.fromEntries((classificacao.dados ?? []).map((l) => [l.id, l.nota == null ? "" : notaBR(l.nota)])));
  }, [classificacao.dados]);

  const recarregar = (texto: string) => { classificacao.recarregar(); mudou(texto); };
  const status = (novo: Olimpiada["status"], texto: string) => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/`, { method: "PATCH", body: { status: novo } });
    recarregar(texto);
  });
  const inscrever = (aluno: Aluno) => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/inscrever/`, { method: "POST", body: { aluno: aluno.id } });
    setBusca("");
    recarregar(`${aluno.nome} inscrito(a) na ${o.nome}.`);
  });
  const tirar = (l: LinhaOlimpiada) => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/sair/`, { method: "POST", body: { aluno: l.aluno } });
    recarregar(`${l.aluno_nome} saiu da ${o.nome}.`);
  });
  const salvarNotas = () => envio.enviar(async () => {
    const corpo = linhas.map((l) => ({ participacao: l.id, nota: notas[l.id]?.trim() ? notas[l.id].replace(",", ".") : null }));
    await api(`/api/olimpiadas/${o.id}/notas/`, { method: "POST", body: { notas: corpo } });
    recarregar("Notas salvas. A classificação já está atualizada.");
  });
  const apagar = () => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/`, { method: "DELETE" });
    mudou(`${o.nome} apagada.`);
  });

  return (
    <div className="card overflow-hidden">
      <button onClick={abrir} aria-expanded={aberto} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><IconTrophy size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight" style={{ color: INK }}>{o.nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.materia_nome ?? "Conhecimentos gerais"} · prova em {dataBR(o.data_prova)}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Pill color={cor}>{o.status_nome}</Pill>
            <Pill color={INK_SOFT}>{o.inscritos} {o.inscritos === 1 ? "inscrito" : "inscritos"}</Pill>
            <Pill color={INK_SOFT}>{o.series_nomes.length ? o.series_nomes.join(", ") : "todas as séries"}</Pill>
          </div>
        </div>
        <IconChevron size={18} className="mt-1 flex-none transition" style={{ color: "#cbd5e1", transform: aberto ? "rotate(90deg)" : undefined }} />
      </button>

      {aberto && (
        <div className="space-y-3 border-t px-4 pb-4 pt-3" style={{ borderColor: "#eef2f7" }}>
          {o.descricao && <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{o.descricao}</p>}
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Nota de 0 a {Number(o.nota_maxima).toLocaleString("pt-BR")} · {o.premiados} primeiros lugares ganham medalha.</p>

          {/* O andamento da olimpíada */}
          <div className="flex flex-wrap gap-2">
            {o.status === "inscricoes" && <button onClick={() => status("andamento", "Inscrições fechadas. Agora é lançar as notas.")} className="rounded-xl px-3 py-2 text-[12.5px] font-semibold text-white" style={{ background: AMBER }}>Fechar inscrições</button>}
            {o.status === "andamento" && <>
              <button onClick={() => status("resultado", `Resultado da ${o.nome} publicado. Os alunos já veem as medalhas.`)} className="rounded-xl px-3 py-2 text-[12.5px] font-semibold text-white" style={{ background: VIOLET }}>Publicar resultado</button>
              <button onClick={() => status("inscricoes", "Inscrições reabertas.")} className="rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Reabrir inscrições</button>
            </>}
            {o.status === "resultado" && <button onClick={() => status("andamento", "Resultado despublicado. Corrija as notas e publique de novo.")} className="rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Corrigir notas</button>}
            <button onClick={editar} className="flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: BLUE }}><IconEdit size={14} />Editar</button>
            {o.inscritos === 0 && <button onClick={apagar} className="rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: RED + "55", color: RED }}>Apagar</button>}
          </div>
          {envio.erro && <AvisoErro texto={envio.erro} />}

          {/* Inscrever aluno (até publicar o resultado) */}
          {o.status !== "resultado" && (
            <div>
              <Entrada label="Inscrever aluno" value={busca} onChange={setBusca} placeholder="Digite o nome do aluno" erro={envio.campos.aluno} />
              {termo.length >= 2 && (
                <div className="mt-1.5 space-y-1">
                  {(achados.dados ?? []).slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center gap-2 rounded-xl bg-[#f6f8fb] px-3 py-2 text-[12.5px]">
                      <span className="min-w-0 flex-1 truncate" style={{ color: INK }}><b>{a.nome}</b> <span style={{ color: INK_SOFT }}>· {a.matricula_atual?.turma_nome ?? a.matricula_atual?.serie_nome ?? "sem matrícula"}</span></span>
                      {inscritos.has(a.id) ? <Pill color={GREEN}>inscrito</Pill> : (
                        <button onClick={() => inscrever(a)} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: GREEN + "16", color: GREEN }}><IconPlus size={13} />Inscrever</button>
                      )}
                    </div>
                  ))}
                  {achados.dados?.length === 0 && <p className="text-[12px]" style={{ color: INK_SOFT }}>Nenhum aluno com esse nome.</p>}
                </div>
              )}
            </div>
          )}

          {/* Inscritos e classificação */}
          <div>
            <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>{o.status === "inscricoes" ? "Inscritos" : "Classificação"}</p>
            <EstadoApi carregando={classificacao.carregando} erro={classificacao.erro} onRetry={classificacao.recarregar}>
              {linhas.length === 0 ? (
                <p className="rounded-xl bg-[#f6f8fb] px-3 py-3 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno inscrito ainda. Os alunos também podem se inscrever pelo app, em Olimpíadas.</p>
              ) : (
                <div className="divide-y rounded-xl border" style={{ borderColor: "#eef2f7" }}>
                  {linhas.map((l) => (
                    <div key={l.id} className="flex items-center gap-2.5 px-3 py-2">
                      {o.status !== "inscricoes" && <Posicao linha={l} />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{l.aluno_nome}</p>
                        <p className="text-[11px]" style={{ color: INK_SOFT }}>{l.turma_nome}{l.medalha && MEDALHA[l.medalha] ? ` · ${MEDALHA[l.medalha].nome}` : ""}</p>
                      </div>
                      {o.status === "andamento" ? (
                        <div className="w-20 flex-none">
                          <input value={notas[l.id] ?? ""} onChange={(e) => setNotas({ ...notas, [l.id]: e.target.value })} inputMode="decimal" placeholder="nota" aria-label={`Nota de ${l.aluno_nome}`}
                            className="w-full rounded-lg border bg-white px-2 py-1.5 text-right text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
                        </div>
                      ) : o.status === "resultado" ? (
                        <span className="text-[14px] font-extrabold" style={{ color: INK }}>{l.nota == null ? "faltou" : notaBR(l.nota)}</span>
                      ) : null}
                      {o.status !== "resultado" && (
                        <button onClick={() => tirar(l)} aria-label={`Tirar ${l.aluno_nome}`} className="grid h-7 w-7 flex-none place-items-center rounded-full" style={{ color: INK_SOFT }}><IconX size={15} /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </EstadoApi>
            {o.status === "andamento" && linhas.length > 0 && (
              <button onClick={salvarNotas} disabled={envio.enviando} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-60" style={{ background: GREEN }}>
                <IconCheck size={16} />{envio.enviando ? "Salvando..." : "Salvar notas"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function EscOlimpiadas({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const olimpiadas = useApi<Olimpiada[]>("/api/olimpiadas/");
  const materias = useApi<Materia[]>("/api/materias/");
  const ofertas = useApi<Oferta[]>(usuario?.escola ? `/api/ofertas/?escola=${usuario.escola}&ano_letivo=${ANO_ATUAL}` : null);
  const [form, setForm] = useState<Form | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["nome", "materia", "data_prova", "nota_maxima", "premiados", "series", "descricao"]);

  const series = (ofertas.dados ?? []).flatMap((o) => o.series.map((id, i) => ({ id, nome: o.series_nomes[i] })));
  const lista = olimpiadas.dados ?? [];
  const mudou = (texto: string) => { setAviso(texto); olimpiadas.recarregar(); };
  const muda = (campo: keyof Form) => (v: string) => form && setForm({ ...form, [campo]: v });
  const marcaSerie = (id: number) => form && setForm({ ...form, series: form.series.includes(id) ? form.series.filter((s) => s !== id) : [...form.series, id] });

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, ...dados } = form;
    const corpo = { ...dados, materia: dados.materia ? Number(dados.materia) : null, premiados: Number(dados.premiados), nota_maxima: dados.nota_maxima.replace(",", ".") };
    const salva = await api<Olimpiada>(id ? `/api/olimpiadas/${id}/` : "/api/olimpiadas/", { method: id ? "PATCH" : "POST", body: corpo });
    setForm(null);
    setAberto(salva.id);
    mudou(id ? `${salva.nome} atualizada.` : `${salva.nome} cadastrada. As inscrições já estão abertas no app dos alunos.`);
  });
  const editar = (o: Olimpiada) => {
    envio.limpar();
    setForm({ id: o.id, nome: o.nome, materia: o.materia ? String(o.materia) : "", data_prova: o.data_prova, nota_maxima: Number(o.nota_maxima).toLocaleString("pt-BR"), premiados: String(o.premiados), series: o.series, descricao: o.descricao });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Olimpíadas" subtitle={usuario?.escola_nome ?? "Olimpíadas da escola"} onBack={back} accent={VIOLET} right={<BotaoNovo label="Nova olimpíada" cor={VIOLET} onClick={() => { envio.limpar(); setForm({ ...VAZIO }); }} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar olimpíada" : "Nova olimpíada"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
            <Entrada label="Nome" value={form.nome} onChange={muda("nome")} erro={envio.campos.nome} placeholder="Ex.: Olimpíada de Matemática do Atheneu" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Escolha label="Matéria" value={form.materia} onChange={muda("materia")} opcoes={(materias.dados ?? []).map((m) => ({ valor: String(m.id), nome: m.nome }))} vazio="Conhecimentos gerais" erro={envio.campos.materia} />
              <Entrada label="Data da prova" type="date" value={form.data_prova} onChange={muda("data_prova")} erro={envio.campos.data_prova} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Nota máxima" value={form.nota_maxima} onChange={muda("nota_maxima")} erro={envio.campos.nota_maxima} inputMode="numeric" />
              <Entrada label="Quantos ganham medalha" value={form.premiados} onChange={muda("premiados")} erro={envio.campos.premiados} inputMode="numeric" />
            </div>
            <div>
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Quem pode participar {form.series.length === 0 && "(nenhuma marcada = todas as séries)"}</span>
              <div className="flex flex-wrap gap-1.5">
                {series.map((s) => {
                  const on = form.series.includes(s.id);
                  return <button key={s.id} type="button" onClick={() => marcaSerie(s.id)} className="rounded-full border px-3 py-1.5 text-[12px] font-semibold" style={on ? { background: VIOLET, borderColor: VIOLET, color: "#fff" } : { background: "#fff", borderColor: "#e2e8f0", color: INK_SOFT }}>{s.nome}</button>;
                })}
              </div>
              {envio.campos.series && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.series}</span>}
            </div>
            <label className="block">
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Como funciona (os alunos leem)</span>
              <textarea value={form.descricao} onChange={(e) => muda("descricao")(e.target.value)} rows={3} placeholder="Ex.: Prova de 20 questões no auditório. Os 3 primeiros representam a escola na OBMEP."
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
            </label>
          </CartaoForm>
        )}

        {aviso && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
        <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>Cadastre a olimpíada, inscreva os alunos (eles também podem se inscrever pelo app), feche as inscrições, lance as notas e publique o resultado. A classificação e as medalhas saem sozinhas.</p>

        <EstadoApi carregando={olimpiadas.carregando} erro={olimpiadas.erro} onRetry={olimpiadas.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhuma olimpíada ainda" text="Toque em Nova olimpíada para cadastrar a primeira." icon={<IconTrophy size={26} />} />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2" style={{ alignItems: "start" }}>
              {lista.map((o) => <Cartao key={o.id} o={o} aberto={aberto === o.id} abrir={() => setAberto(aberto === o.id ? null : o.id)} editar={() => editar(o)} mudou={mudou} />)}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </div>
  );
}
