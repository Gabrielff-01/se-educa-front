/* Fechamento das unidades: quanto das notas cada turma já tem, o que falta, e os botões
   "Fechar unidade" (o boletim sai e as notas travam) e "Reabrir".
   Dados: GET /api/escola/boletins/?unidade=N, GET/POST /api/fechamentos/ e DELETE /api/fechamentos/ID/. */

import { useState } from "react";
import { AvisoErro, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconCheck } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { porcentoBR } from "@/lib/formato";
import type { Fechamento } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, RED } from "@/theme/colors";

type BoletimTurma = {
  turma: number; turma_nome: string; unidade: number; unidade_atual: number; alunos: number;
  notas_esperadas: number; notas_lancadas: number; porcentagem: number;
  faltando: { materia: string; alunos: number }[];
  fechada: boolean; unidades_fechadas: number[]; pode_fechar: boolean;
};

/* Situação da turma nesta unidade, em palavras. */
function situacao(b: BoletimTurma): { texto: string; cor: string } {
  if (b.fechada) return { texto: "Fechada", cor: GREEN };
  if (b.pode_fechar) return { texto: "Pronta para fechar", cor: BLUE };
  if (b.alunos === 0) return { texto: "Sem alunos", cor: INK_SOFT };
  if (b.faltando.length) return { texto: "Faltam notas", cor: AMBER };
  return { texto: `Feche a ${b.unidade - 1}ª antes`, cor: RED }; // notas completas, mas a unidade anterior está aberta
}

export function AdmBoletins({ back }: { back: () => void }) {
  // null = cada turma mostra a próxima unidade que ainda não fechou (a API escolhe).
  const [unidade, setUnidade] = useState<number | null>(null);
  const boletins = useApi<BoletimTurma[]>(`/api/escola/boletins/${unidade ? `?unidade=${unidade}` : ""}`);
  const fechamentos = useApi<Fechamento[]>("/api/fechamentos/");
  const envio = useEnvio();
  const [mexendo, setMexendo] = useState<number | null>(null); // turma do último botão tocado
  const [aviso, setAviso] = useState("");

  const recarregar = () => { boletins.recarregar(); fechamentos.recarregar(); };
  const fechar = (b: BoletimTurma) => {
    setMexendo(b.turma);
    envio.enviar(async () => {
      await api("/api/fechamentos/", { method: "POST", body: { turma: b.turma, unidade: b.unidade } });
      setAviso(`${b.unidade}ª unidade da ${b.turma_nome} fechada. O boletim já aparece para alunos e famílias.`);
      recarregar();
    });
  };
  const reabrir = (b: BoletimTurma) => {
    const fechamento = (fechamentos.dados ?? []).find((f) => f.turma === b.turma && f.unidade === b.unidade);
    if (!fechamento || !window.confirm(`Reabrir a ${b.unidade}ª unidade da ${b.turma_nome}? Os professores voltam a poder mudar as notas.`)) return;
    setMexendo(b.turma);
    envio.enviar(async () => {
      await api(`/api/fechamentos/${fechamento.id}/`, { method: "DELETE" });
      setAviso(`${b.unidade}ª unidade da ${b.turma_nome} reaberta.`);
      recarregar();
    });
  };

  const lista = boletins.dados ?? [];
  return (
    <>
      <TopBar title="Boletins" subtitle={unidade ? `Fechamento da ${unidade}ª unidade` : "Próxima unidade de cada turma"} onBack={back} accent={PINK} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {[null, 1, 2, 3, 4].map((u) => (
            <button key={u ?? 0} onClick={() => { setUnidade(u); envio.limpar(); setAviso(""); }} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={unidade === u ? { background: PINK, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{u ? `${u}ª unidade` : "Próxima a fechar"}</button>
          ))}
        </div>
        {aviso && <div className="mt-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
        <EstadoApi carregando={boletins.carregando} erro={boletins.erro} onRetry={boletins.recarregar}>
          {lista.length === 0 ? <EmptyState title="Nenhuma turma" text="A escola ainda não tem turmas neste ano." icon={<IconBook size={26} />} /> : (
            <div className="mt-3 grid gap-2.5 lg:grid-cols-2">
              {lista.map((b) => {
                const s = situacao(b);
                const cor = b.fechada || b.porcentagem >= 100 ? GREEN : b.porcentagem >= 50 ? AMBER : RED;
                return (
                  <div key={b.turma} className="card p-4">
                    <div className="flex items-center justify-between gap-2"><p className="text-[14px] font-bold" style={{ color: INK }}>{b.turma_nome} <span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>· {b.unidade}ª unidade</span></p><Pill color={s.cor}>{s.texto}</Pill></div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(b.porcentagem, 100)}%`, background: cor }} /></div>
                      <span className="text-[11.5px] font-bold" style={{ color: cor }}>{porcentoBR(b.porcentagem)}</span>
                    </div>
                    <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>{b.notas_lancadas} de {b.notas_esperadas} notas lançadas · {b.alunos} alunos · unidades fechadas: {b.unidades_fechadas.length ? b.unidades_fechadas.map((u) => `${u}ª`).join(", ") : "nenhuma"}</p>
                    {!b.fechada && b.faltando.length > 0 && (
                      <ul className="mt-2 space-y-0.5 rounded-xl px-3 py-2 text-[11.5px]" style={{ background: AMBER + "12", color: INK }}>
                        {b.faltando.map((f) => <li key={f.materia}>Falta nota de <b>{f.alunos}</b> aluno(s) em {f.materia}</li>)}
                      </ul>
                    )}
                    {mexendo === b.turma && envio.erro && <div className="mt-2"><AvisoErro texto={envio.erro} /></div>}
                    {b.fechada ? (
                      <button onClick={() => reabrir(b)} disabled={envio.enviando} className="mt-2.5 w-full rounded-xl border py-2.5 text-[12.5px] font-semibold disabled:opacity-60" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Reabrir unidade</button>
                    ) : (
                      <button onClick={() => fechar(b)} disabled={!b.pode_fechar || envio.enviando} className="mt-2.5 w-full rounded-xl py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-40" style={{ background: b.pode_fechar ? PINK : INK_SOFT }}>
                        {envio.enviando && mexendo === b.turma ? "Salvando..." : `Fechar ${b.unidade}ª unidade`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </EstadoApi>
        <p className="mt-3 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>As unidades fecham em ordem e só com todas as notas lançadas. Para reabrir, reabra antes as unidades seguintes.</p>
      </Screen>
    </>
  );
}
