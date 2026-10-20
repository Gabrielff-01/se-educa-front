/* Supervisão do diário: para cada professor x turma x matéria, a última aula registrada,
   quantas aulas da grade ficaram sem registro e como estão as notas da unidade.
   Dados: GET /api/escola/diario/ (o "status" vem pronto da API: Em dia / Pendente / Atrasado;
   nas notas também "Em andamento" = a unidade atual ainda não venceu, então não é pendência). */

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EstadoApi } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { dataBR } from "@/lib/formato";
import type { SituacaoDiario } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

const corDo = (status: string) => (status === "Em dia" ? GREEN : status === "Em andamento" ? BLUE : status === "Pendente" ? AMBER : RED);
const notasPendentes = (d: SituacaoDiario) => d.status_notas === "Pendente" || d.status_notas === "Atrasado";
const temPendencia = (d: SituacaoDiario) => d.status_diario !== "Em dia" || notasPendentes(d);

export function AdmDiario({ back }: { back: () => void }) {
  const diario = useApi<SituacaoDiario[]>("/api/escola/diario/");
  const [filtro, setFiltro] = useState<"Atrasados" | "Todos">("Atrasados");
  const todos = diario.dados ?? [];
  const lista = filtro === "Todos" ? todos : todos.filter(temPendencia);
  const conta = (status: string) => todos.filter((d) => d.status_diario === status).length;
  return (
    <>
      <TopBar title="Supervisão do diário" subtitle="Lançamentos dos professores" onBack={back} accent={VIOLET} />
      <Screen>
        <EstadoApi carregando={diario.carregando} erro={diario.erro} onRetry={diario.recarregar}>
          <div className="grid grid-cols-3 gap-2.5">
            {[{ l: "Em dia", c: GREEN }, { l: "Pendente", c: AMBER }, { l: "Atrasado", c: RED }].map((k) => (
              <div key={k.l} className="card p-3 text-center"><div className="text-[19px] font-extrabold" style={{ color: k.c }}>{conta(k.l)}</div><div className="text-[10.5px]" style={{ color: INK_SOFT }}>Diário {k.l.toLowerCase()}</div></div>
            ))}
          </div>
          <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Pendente = 1 a 4 aulas da grade sem registro; atrasado = 5 ou mais.</p>
          <div className="mt-3 flex gap-1.5">
            {(["Atrasados", "Todos"] as const).map((f) => (
              <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold" style={filtro === f ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
                {f === "Atrasados" ? `Com pendência (${todos.filter(temPendencia).length})` : `Todos (${todos.length})`}
              </button>
            ))}
          </div>
          {lista.length === 0 ? <EmptyState title="Tudo em dia" text={filtro === "Atrasados" ? "Nenhum diário ou nota pendente." : "Nenhum professor lotado na escola."} icon={<IconCheck size={26} />} /> : (
            <div className="mt-3 grid gap-2.5 lg:grid-cols-2">
              {lista.map((d) => (
                <div key={d.lotacao} className="card p-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={d.professor_nome} color={VIOLET} size={36} />
                    <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{d.professor_nome}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{d.turma_nome} · {d.materia_nome} · {d.aulas_semanais} aulas/sem.</p></div>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <Quadro titulo="Diário" status={d.status_diario} detalhe={!d.tem_grade ? "sem horário na grade" : d.aulas_sem_registro ? `${d.aulas_sem_registro} aula(s) sem registro desde ${dataBR(d.sem_registro_desde)}` : "nenhuma aula sem registro"} />
                    <Quadro titulo={`Notas · ${d.unidade_notas ?? "–"}ª unid.`} status={d.status_notas} detalhe={`${d.notas_lancadas} de ${d.alunos} lançadas`} />
                  </div>
                  <p className="mt-2 text-[10.5px]" style={{ color: INK_SOFT }}>Última aula registrada: {d.ultima_aula ? dataBR(d.ultima_aula) : "nenhuma"}</p>
                </div>
              ))}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}

function Quadro({ titulo, status, detalhe }: { titulo: string; status: string; detalhe: string }) {
  const cor = corDo(status);
  return (
    <div className="rounded-xl px-2.5 py-2" style={{ background: cor + "14" }}>
      <div className="flex items-center justify-between gap-1"><span className="text-[10px] font-medium" style={{ color: INK_SOFT }}>{titulo}</span><span className="text-[11px] font-bold" style={{ color: cor }}>{status}</span></div>
      <div className="mt-0.5 text-[10.5px] leading-snug" style={{ color: INK }}>{detalhe}</div>
    </div>
  );
}
