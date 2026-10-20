/* Grade de horários da turma do aluno (segunda a sexta).
   Dados: /api/boletim/ diz qual é a turma (matricula.turma) e /api/horarios/?turma=ID traz as aulas.
   No celular mostra um dia de cada vez; no computador mostra também a semana inteira numa tabela. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconClock, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { horaCurta } from "@/lib/formato";
import type { Boletim, Horario } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PINK, RED, TEAL, VIOLET } from "@/theme/colors";

/* dia_semana da API: 1 = segunda ... 5 = sexta (igual ao getDay() do JavaScript nesses dias) */
const DIAS = [
  { n: 1, sigla: "SEG", nome: "segunda-feira" },
  { n: 2, sigla: "TER", nome: "terça-feira" },
  { n: 3, sigla: "QUA", nome: "quarta-feira" },
  { n: 4, sigla: "QUI", nome: "quinta-feira" },
  { n: 5, sigla: "SEX", nome: "sexta-feira" },
];

/* Cada matéria ganha sempre a mesma cor (pelo id), pra ficar fácil de achar na grade */
const CORES = [BLUE, GREEN, AMBER, TEAL, VIOLET, PINK, INDIGO, RED];
export const corDaMateria = (materia: number) => CORES[materia % CORES.length];

export function Horarios({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<Boletim>(comAluno("/api/boletim/"));
  const turma = boletim.dados?.matricula?.turma ?? null;
  const horarios = useApi<Horario[]>(turma ? `/api/horarios/?turma=${turma}` : null);

  const hoje = new Date().getDay(); // 0 = domingo, 6 = sábado
  const [dia, setDia] = useState(hoje >= 1 && hoje <= 5 ? hoje : 1);
  const lista = horarios.dados ?? [];
  const doDia = lista.filter((h) => h.dia_semana === dia).sort((a, b) => a.inicio.localeCompare(b.inicio));
  // Todos os horários de início da semana, pra montar as linhas da tabela
  const inicios = [...new Set(lista.map((h) => h.inicio))].sort();
  const m = boletim.dados?.matricula;

  return (
    <>
      <TopBar title="Horários" subtitle={m ? `${m.turma_nome ?? "Sem turma"}${m.turno_nome ? ` · Turno ${m.turno_nome.toLowerCase()}` : ""}` : "Grade semanal"} onBack={back} accent={TEAL} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={TEAL} />
        <EstadoApi carregando={filhos.carregando || boletim.carregando || horarios.carregando} erro={filhos.erro ?? boletim.erro ?? horarios.erro} onRetry={turma ? horarios.recarregar : boletim.recarregar}>
          {!atual ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : !turma ? (
            <EmptyState title="Sem turma" text="O aluno ainda não está numa turma. A grade aparece depois da enturmação." icon={<IconClock size={26} />} />
          ) : lista.length === 0 ? (
            <EmptyState title="Grade ainda não montada" text="A escola ainda não cadastrou os horários desta turma." icon={<IconClock size={26} />} />
          ) : (
            <>
              <div className="flex gap-2">
                {DIAS.map((d) => (
                  <button key={d.n} onClick={() => setDia(d.n)} className="flex-1 rounded-xl py-2.5 text-[12px] font-bold transition" style={dia === d.n ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
                    {d.sigla}
                    {d.n === hoje && <span className="block text-[9px] font-semibold opacity-80">hoje</span>}
                  </button>
                ))}
              </div>
              <SectionHeader title={`Aulas de ${DIAS[dia - 1].nome}`} />
              {doDia.length === 0 ? (
                <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Sem aulas cadastradas neste dia.</p>
              ) : (
                <div className="relative space-y-3 pl-4">
                  <span className="absolute bottom-2 left-[5px] top-2 w-0.5 rounded" style={{ background: "#e2e8f0" }} />
                  {doDia.map((a) => {
                    const cor = corDaMateria(a.materia);
                    return (
                      <div key={a.id} className="relative card flex items-center gap-3 p-3.5">
                        <span className="absolute -left-[13px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: cor }} />
                        <div className="w-12 flex-none text-center"><p className="text-[13px] font-extrabold" style={{ color: INK }}>{horaCurta(a.inicio)}</p></div>
                        <div className="h-9 w-1 rounded-full" style={{ background: cor }} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold" style={{ color: INK }}>{a.materia_nome}</p>
                          <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{a.professor_nome}{a.sala ? ` · ${a.sala}` : ""}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Semana inteira (só em telas largas) */}
              <div className="hidden md:block">
                <SectionHeader title="Semana inteira" />
                <div className="card overflow-hidden">
                  <table className="w-full table-fixed text-left">
                    <thead>
                      <tr className="text-[10.5px] font-bold uppercase" style={{ background: "#f4f7fb", color: INK_SOFT }}>
                        <th className="w-16 px-3 py-2.5">Hora</th>
                        {DIAS.map((d) => <th key={d.n} className="px-2 py-2.5" style={d.n === hoje ? { color: TEAL } : undefined}>{d.sigla}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {inicios.map((inicio) => (
                        <tr key={inicio} className="border-t border-[color:var(--color-line)] align-top">
                          <td className="px-3 py-2 text-[12px] font-bold" style={{ color: INK }}>{horaCurta(inicio)}</td>
                          {DIAS.map((d) => {
                            const aula = lista.find((h) => h.dia_semana === d.n && h.inicio === inicio);
                            return (
                              <td key={d.n} className="px-1.5 py-1.5">
                                {aula && (
                                  <div className="rounded-lg px-2 py-1.5" style={{ background: corDaMateria(aula.materia) + "14", borderLeft: `3px solid ${corDaMateria(aula.materia)}` }}>
                                    <p className="truncate text-[11.5px] font-semibold" style={{ color: INK }}>{aula.materia_nome}</p>
                                    <p className="truncate text-[10px]" style={{ color: INK_SOFT }}>{aula.professor_nome.split(" ")[0]}{aula.sala ? ` · ${aula.sala}` : ""}</p>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
