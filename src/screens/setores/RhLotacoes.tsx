/* RH — Alocação nas escolas: o RH só diz EM QUAL ESCOLA o professor trabalha e quantas horas por semana
   (com a portaria). Função (professor, diretor, coordenador, secretário), turmas, matérias e horário
   quem escolhe é a escola, na tela "Professores e funções".
   A API confere: professor ativo, horas da alocação ≤ carga dele e a soma das escolas ≤ carga.
   Dados: GET/POST/PATCH/DELETE /api/alocacoes/?escola=ID, professores de /api/professores/, horas de /api/opcoes/. */

import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR, opcoesDe } from "@/lib/formato";
import type { Alocacao, Escola, Opcoes, Professor } from "@/lib/tipos";
import { AMBER, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

// id = null → alocação nova; id = número → editando uma que já existe (só horas e portaria).
type FormAlocacao = { id: number | null; professor: string; horas_semanais: string; portaria: string };

export function RhLotacoes({ back }: { back: () => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const [escola, setEscola] = useState("");
  const escolaId = escola || String(escolas.dados?.[0]?.id ?? "");
  const alocacoes = useApi<Alocacao[]>(escolaId ? `/api/alocacoes/?escola=${escolaId}` : null);
  const professores = useApi<Professor[]>("/api/professores/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState<FormAlocacao | null>(null);
  const envio = useEnvio(["professor", "horas_semanais", "portaria"]);

  // Na alocação nova só aparecem os professores ativos que ainda não estão nesta escola.
  const jaAqui = new Set((alocacoes.dados ?? []).map((a) => a.professor));
  const livres = (professores.dados ?? []).filter((p) => p.ativo && !jaAqui.has(p.id));

  const recarregar = () => { alocacoes.recarregar(); professores.recarregar(); };
  const nova = () => {
    envio.limpar();
    setForm({ id: null, professor: String(livres[0]?.id ?? ""), horas_semanais: String(livres[0]?.carga_horaria_semanal ?? 40), portaria: "" });
  };
  const editar = (a: Alocacao) => {
    envio.limpar();
    setForm({ id: a.id, professor: String(a.professor), horas_semanais: String(a.horas_semanais), portaria: a.portaria });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const corpo = { horas_semanais: Number(form.horas_semanais), portaria: form.portaria };
    if (form.id) await api(`/api/alocacoes/${form.id}/`, { method: "PATCH", body: corpo });
    else await api("/api/alocacoes/", { method: "POST", body: { ...corpo, professor: Number(form.professor), escola: Number(escolaId) } });
    setForm(null);
    recarregar();
  });
  const tirar = (a: Alocacao) => envio.enviar(async () => {
    if (!window.confirm(`Tirar ${a.professor_nome} da ${a.escola_nome}?`)) return;
    await api(`/api/alocacoes/${a.id}/`, { method: "DELETE" });
    recarregar();
  });
  const mudar = (campo: keyof FormAlocacao) => (v: string) => form && setForm({ ...form, [campo]: v });
  const editando = form?.id ? alocacoes.dados?.find((a) => a.id === form.id) : undefined;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Alocação nas escolas" subtitle="RH · em qual escola cada professor trabalha" onBack={back} accent={GREEN} right={<BotaoNovo label="Alocar professor" cor={GREEN} onClick={nova} />} />
      <Screen>
        <div className="mb-3"><Escolha label="Escola" value={escolaId} onChange={(v) => { setEscola(v); setForm(null); }} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} /></div>

        {form && (
          <CartaoForm titulo={editando ? `Alocação de ${editando.professor_nome}` : "Alocar professor nesta escola"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
            {!form.id && livres.length === 0 && <p className="text-[12px]" style={{ color: INK_SOFT }}>Todos os professores ativos já estão nesta escola.</p>}
            {!form.id && livres.length > 0 && (
              <Escolha label="Professor" value={form.professor} onChange={mudar("professor")}
                opcoes={livres.map((p) => ({ valor: String(p.id), nome: `${p.nome} · ${p.carga_horaria_semanal} h` }))} erro={envio.campos.professor} />
            )}
            <div className="flex gap-2">
              <Escolha label="Horas nesta escola" value={form.horas_semanais} onChange={mudar("horas_semanais")} opcoes={opcoes.dados?.cargas ?? []} erro={envio.campos.horas_semanais} />
              <Entrada label="Portaria" value={form.portaria} onChange={mudar("portaria")} placeholder="Ex.: 1234/2026" erro={envio.campos.portaria} />
            </div>
            <p className="text-[11px]" style={{ color: INK_SOFT }}>A função e as turmas dele quem define é a escola.</p>
          </CartaoForm>
        )}
        {!form && envio.erro && <div className="mb-3"><AvisoErro texto={envio.erro} /></div>}

        <EstadoApi carregando={escolas.carregando || alocacoes.carregando} erro={escolas.erro || alocacoes.erro} onRetry={alocacoes.recarregar}>
          <div className="grid gap-2.5 lg:grid-cols-2">
            {(alocacoes.dados ?? []).map((a) => (
              <div key={a.id} className="card p-3.5">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{a.professor_nome}</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>
                      {a.horas_semanais} h nesta escola (de {a.carga_professor} h) · {a.vinculo_nome}
                    </p>
                    <p className="text-[11px]" style={{ color: INK_SOFT }}>
                      {a.portaria ? `Portaria ${a.portaria} · ` : ""}desde {dataBR(a.desde)}
                    </p>
                  </div>
                  <Pill color={a.funcao === "professor" ? TEAL : AMBER}>{a.funcao_nome}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <p className="flex-1 text-[11.5px]" style={{ color: a.aulas_ano_atual > a.limite_aulas ? RED : INK_SOFT }}>
                    {a.funcao === "professor" ? `${a.aulas_ano_atual}/${a.limite_aulas} aulas por semana em ${ANO_ATUAL}` : "Função diretiva (sem turmas)"}
                  </p>
                  {a.afastamento_atual && <Pill color={RED}>Afastado</Pill>}
                  <button onClick={() => editar(a)} className="text-[11.5px] font-semibold" style={{ color: GREEN }}>Editar</button>
                  <button onClick={() => tirar(a)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Tirar</button>
                </div>
              </div>
            ))}
          </div>
          {alocacoes.dados?.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum professor alocado nesta escola.</p>}
        </EstadoApi>
        <p className="mt-3 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Para tirar um professor de uma escola, ela precisa antes tirar as turmas dele.</p>
      </Screen>
    </div>
  );
}
