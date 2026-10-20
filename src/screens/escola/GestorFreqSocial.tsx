/* Frequência do mês dos alunos com programa social (Bolsa Família exige 85%; Pé-de-Meia, 80%).
   A API já calcula a frequência e o status: Regular, Atenção (até 3 pontos acima do mínimo),
   Risco (abaixo do mínimo) ou Sem aulas (nenhuma chamada no mês).
   Dados: GET /api/escola/programas/?mes=AAAA-MM. */

import { useState } from "react";
import { EstadoApi } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { Select } from "@/components/Select";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { dataBR, porcentoBR } from "@/lib/formato";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Status = "Regular" | "Atenção" | "Risco" | "Sem aulas";
type Beneficiario = {
  aluno: number; nome: string; nis: string; turma_nome: string | null; programa: string; programa_nome: string;
  minimo: number; aulas: number; faltas: number; frequencia: number | null; status: Status;
};
type RespostaProgramas = { mes: string; inicio: string; fim: string; alunos: Beneficiario[] };

const COR: Record<Status, string> = { Regular: GREEN, Atenção: AMBER, Risco: RED, "Sem aulas": INK_SOFT };
const NOMES_MES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/* Meses do ano letivo até hoje, do mais novo pro mais velho: [{ valor: "2026-10", nome: "Outubro/2026" }, ...] */
function mesesDoAno() {
  const hoje = new Date();
  const meses = [];
  for (let m = hoje.getMonth(); m >= 1; m--) { // de fevereiro (1) até o mês atual
    meses.push({ valor: `${hoje.getFullYear()}-${String(m + 1).padStart(2, "0")}`, nome: `${NOMES_MES[m]}/${hoje.getFullYear()}` });
  }
  return meses.length ? meses : [{ valor: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`, nome: `${NOMES_MES[hoje.getMonth()]}/${hoje.getFullYear()}` }];
}

export function GestorFreqSocial({ back }: { back: () => void }) {
  const meses = mesesDoAno();
  const [mes, setMes] = useState(meses[0].valor);
  const [prog, setProg] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const dados = useApi<RespostaProgramas>(`/api/escola/programas/?mes=${mes}`);
  const nomeMes = meses.find((m) => m.valor === mes)?.nome ?? mes;

  const todos = dados.dados?.alunos ?? [];
  const doPrograma = todos.filter((b) => prog === "Todos" || b.programa_nome === prog);
  const lista = doPrograma.filter((b) => status === "Todos" || b.status === status);
  const conta = (s: Status) => doPrograma.filter((b) => b.status === s).length;
  const emRisco = doPrograma.filter((b) => b.status === "Risco");

  return (
    <>
      <TopBar title="Programas sociais" subtitle="Frequência dos alunos beneficiários" onBack={back} accent={GREEN} />
      <Screen>
        <div className="card p-3.5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="block min-w-0 flex-1">
              <span className="mb-1 block text-[10.5px] font-semibold" style={{ color: INK_SOFT }}>Mês</span>
              <select value={mes} onChange={(e) => setMes(e.target.value)} className="w-full rounded-xl border bg-white px-2.5 py-2 text-[12.5px] font-semibold outline-none" style={{ borderColor: "#e2e8f0", color: INK }}>
                {meses.map((m) => <option key={m.valor} value={m.valor}>{m.nome}</option>)}
              </select>
            </label>
            <div className="flex flex-1 gap-2">
              <Select label="Programa" value={prog} onChange={setProg} options={["Todos", "Bolsa Família", "Pé-de-Meia"]} />
              <Select label="Status" value={status} onChange={setStatus} options={["Todos", "Risco", "Atenção", "Regular", "Sem aulas"]} />
            </div>
          </div>
        </div>

        <EstadoApi carregando={dados.carregando} erro={dados.erro} onRetry={dados.recarregar}>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(["Regular", "Atenção", "Risco", "Sem aulas"] as Status[]).map((s) => (
              <button key={s} onClick={() => setStatus(status === s ? "Todos" : s)} className="card p-2.5 text-center" style={status === s ? { outline: `2px solid ${COR[s]}` } : undefined}>
                <div className="text-[19px] font-extrabold" style={{ color: COR[s] }}>{conta(s)}</div><div className="text-[10px]" style={{ color: INK_SOFT }}>{s}</div>
              </button>
            ))}
          </div>

          {emRisco.length > 0 && (
            <div className="mt-3 flex gap-2.5 rounded-2xl p-3.5" style={{ background: "#fef3c7", border: `1px solid ${AMBER}55` }}>
              <span className="mt-0.5" style={{ color: "#b45309" }}><IconAlert size={19} /></span>
              <div>
                <p className="text-[13.5px] font-bold" style={{ color: "#78350f" }}>{emRisco.length} aluno(s) abaixo do mínimo em {nomeMes}</p>
                <p className="text-[11.5px]" style={{ color: "#92400e" }}>Abaixo do mínimo, a família pode perder o benefício. Contate os responsáveis.</p>
              </div>
            </div>
          )}

          <SectionHeader title={`Relatório · ${nomeMes}`} />
          {dados.dados && <p className="-mt-1.5 mb-2 px-1 text-[11px]" style={{ color: INK_SOFT }}>Chamadas de {dataBR(dados.dados.inicio)} a {dataBR(dados.dados.fim)} · {doPrograma.length} beneficiário(s)</p>}
          {lista.length === 0 ? <EmptyState title="Sem beneficiários" text="Nenhum aluno beneficiário para estes filtros." icon={<IconUsers size={26} />} /> : (
            <>
            {/* No celular: um cartão por aluno. Na tela larga: tabela. */}
            <div className="space-y-2 sm:hidden">
              {lista.map((b) => (
                <div key={b.aluno} className="card p-3" style={{ borderLeft: `4px solid ${COR[b.status]}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="text-[13px] font-semibold" style={{ color: INK }}>{b.nome}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{b.turma_nome ?? "sem turma"} · NIS {b.nis || "—"}</p></div>
                    <span className="text-[15px] font-extrabold" style={{ color: COR[b.status] }}>{porcentoBR(b.frequencia)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]" style={{ color: INK_SOFT }}>
                    <span>{b.programa_nome} (mín. {b.minimo}%) · {b.faltas} falta(s) em {b.aulas} aulas</span>
                    <Pill color={COR[b.status]}>{b.status}</Pill>
                  </div>
                </div>
              ))}
            </div>
            <div className="card hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[520px] text-left text-[11.5px]">
                <thead><tr style={{ color: INK_SOFT, background: "#f8fafc" }}>{["Aluno", "Turma", "Programa", "Freq.", "Faltas", "Status"].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {lista.map((b) => (
                    <tr key={b.aluno} className="border-t" style={{ borderColor: "#eef2f7", background: b.status === "Risco" ? RED + "08" : b.status === "Atenção" ? AMBER + "0a" : undefined }}>
                      <td className="px-3 py-2.5"><p className="font-semibold" style={{ color: INK }}>{b.nome}</p><p className="text-[10px]" style={{ color: INK_SOFT }}>NIS {b.nis || "—"}</p></td>
                      <td className="whitespace-nowrap px-3 py-2.5" style={{ color: INK_SOFT }}>{b.turma_nome ?? "sem turma"}</td>
                      <td className="whitespace-nowrap px-3 py-2.5" style={{ color: INK_SOFT }}>{b.programa_nome}<br /><span className="text-[10px]">mín. {b.minimo}%</span></td>
                      <td className="px-3 py-2.5 font-bold" style={{ color: COR[b.status] }}>{porcentoBR(b.frequencia)}</td>
                      <td className="px-3 py-2.5" style={{ color: INK }}>{b.faltas} de {b.aulas}</td>
                      <td className="px-3 py-2.5"><Pill color={COR[b.status]}>{b.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
          <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Mínimo exigido: Bolsa Família 85% · Pé-de-Meia 80%. "Atenção" = até 3 pontos acima do mínimo.</p>
        </EstadoApi>
      </Screen>
    </>
  );
}
