/* Turmas da escola (só leitura: quem cria e muda turma é a DIES; a escola pede em "Pedidos à DIES").
   Tocar numa turma mostra os alunos (matrículas confirmadas) e quem dá cada matéria.
   Dados: GET /api/turmas/?escola=ID, /api/matriculas/?turma=ID&situacao=confirmada e /api/escola/diario/. */

import { useState } from "react";
import { EstadoApi } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBack, IconChat, IconChevron, IconGrid } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { ANO_ATUAL } from "@/lib/formato";
import type { Matricula, SituacaoDiario, Turma } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

export function AdmTurmas({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const turmas = useApi<Turma[]>(usuario?.escola ? `/api/turmas/?escola=${usuario.escola}&ano_letivo=${ANO_ATUAL}` : null);
  const [aberta, setAberta] = useState<Turma | null>(null);

  if (aberta) return <DetalheTurma turma={aberta} voltar={() => setAberta(null)} />;

  const lista = turmas.dados ?? [];
  const alunos = lista.reduce((soma, t) => soma + t.alunos, 0);
  return (
    <>
      <TopBar title="Turmas" subtitle={turmas.dados ? `${lista.length} turmas · ${alunos} alunos em ${ANO_ATUAL}` : `Ano letivo ${ANO_ATUAL}`} onBack={back} accent={TEAL} />
      <Screen>
        <EstadoApi carregando={turmas.carregando} erro={turmas.erro} onRetry={turmas.recarregar}>
          {lista.length === 0 ? <EmptyState title="Nenhuma turma" text="A escola ainda não tem turmas neste ano. Quem cria as turmas é a DIES." icon={<IconGrid size={26} />} /> : (
            <div className="grid gap-2.5 lg:grid-cols-2">
              {lista.map((t) => {
                const lot = t.capacidade ? Math.round((t.alunos / t.capacidade) * 100) : 0;
                return (
                  <button key={t.id} onClick={() => setAberta(t)} className="card block w-full p-3.5 text-left transition active:scale-[.99]">
                    <div className="flex items-center justify-between gap-2"><p className="text-[14px] font-bold" style={{ color: INK }}>{t.nome}</p><div className="flex items-center gap-1"><Pill color={TEAL}>{t.turno_nome}</Pill><IconChevron size={18} style={{ color: "#cbd5e1" }} /></div></div>
                    <p className="mt-1 text-[11.5px]" style={{ color: INK_SOFT }}>{t.curso_nome} · {t.sala || "sem sala"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(lot, 100)}%`, background: lot >= 95 ? AMBER : GREEN }} /></div>
                      <span className="text-[11.5px] font-bold" style={{ color: INK }}>{t.alunos}/{t.capacidade} alunos</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </EstadoApi>
        <button onClick={() => nav("escPedidos")} className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left transition active:scale-[.99]">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: BLUE + "16", color: BLUE }}><IconChat size={20} /></div>
          <div className="min-w-0 flex-1"><p className="text-[13px] font-bold" style={{ color: INK }}>Precisa de turma nova ou mudar a capacidade?</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Peça à DIES e converse com eles por aqui</p></div>
          <IconChevron size={18} style={{ color: "#cbd5e1" }} />
        </button>
      </Screen>
    </>
  );
}

function DetalheTurma({ turma, voltar }: { turma: Turma; voltar: () => void }) {
  const alunos = useApi<Matricula[]>(`/api/matriculas/?turma=${turma.id}&situacao=confirmada`);
  const diario = useApi<SituacaoDiario[]>("/api/escola/diario/");
  const professores = (diario.dados ?? []).filter((d) => d.turma === turma.id);
  return (
    <>
      <TopBar title={turma.nome} subtitle={`${turma.turno_nome} · ${turma.sala || "sem sala"} · ${turma.alunos}/${turma.capacidade} alunos`} onBack={voltar} accent={TEAL} />
      <Screen>
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          <div>
            <SectionHeader title="Professores e matérias" />
            <EstadoApi carregando={diario.carregando} erro={diario.erro} onRetry={diario.recarregar}>
              {professores.length === 0 ? <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum professor nesta turma. Dê a turma a um professor em Professores e funções.</p> : (
                <div className="card divide-y divide-[color:var(--color-line)]">
                  {professores.map((p) => (
                    <div key={p.lotacao} className="flex items-center gap-3 px-3.5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold" style={{ color: INK }}>{p.materia_nome}</p>
                        <p className="text-[11px]" style={{ color: INK_SOFT }}>{p.professor_nome} · {p.aulas_semanais} aulas/semana{p.tem_grade ? "" : " · fora da grade"}</p>
                      </div>
                      <Pill color={p.status_diario === "Em dia" ? GREEN : p.status_diario === "Pendente" ? AMBER : RED}>Diário {p.status_diario.toLowerCase()}</Pill>
                    </div>
                  ))}
                </div>
              )}
            </EstadoApi>
          </div>
          <div>
            <SectionHeader title="Alunos" />
            <EstadoApi carregando={alunos.carregando} erro={alunos.erro} onRetry={alunos.recarregar}>
              {(alunos.dados ?? []).length === 0 ? <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno confirmado nesta turma.</p> : (
                <ol className="card divide-y divide-[color:var(--color-line)]">
                  {(alunos.dados ?? []).map((m, i) => (
                    <li key={m.id} className="flex items-center gap-3 px-3.5 py-2.5 text-[12.5px]">
                      <span className="w-5 text-right text-[11px] font-bold" style={{ color: INK_SOFT }}>{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate font-medium" style={{ color: INK }}>{m.aluno_nome}</span>
                      {m.programa_social && <Pill color={GREEN}>{m.programa_social === "bolsa_familia" ? "Bolsa Família" : "Pé-de-Meia"}</Pill>}
                      <span className="text-[10.5px]" style={{ color: INK_SOFT }}>{m.aluno_codigo}</span>
                    </li>
                  ))}
                </ol>
              )}
            </EstadoApi>
          </div>
        </div>
        <button onClick={voltar} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-[13px] font-semibold shadow-sm" style={{ color: TEAL }}><IconBack size={16} />Todas as turmas</button>
      </Screen>
    </>
  );
}
