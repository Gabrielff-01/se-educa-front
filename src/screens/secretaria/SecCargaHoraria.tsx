/* Secretaria — Carga horária: em cada escola, quantas aulas por semana a matriz pede
   e quantas já têm professor lotado (cobertura).
   Dados: GET /api/rede/carga-horaria/ -> por escola: turmas, dias letivos do calendário,
   aulas_previstas (soma da matriz das turmas), aulas_com_professor e cobertura (%). */

import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { porcentoBR } from "@/lib/formato";
import { AMBER, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type CargaEscola = {
  escola: number; escola_nome: string; regional_nome: string; turmas: number; dias_letivos: number | null;
  aulas_previstas: number; aulas_com_professor: number; cobertura: number | null;
};

/* Cor e rótulo da cobertura: 100% completa, 80% quase, abaixo disso falta professor. */
function situacao(c: CargaEscola) {
  if (c.aulas_previstas === 0) return { cor: INK_SOFT, rotulo: "Sem matriz" };
  const pct = c.cobertura ?? 0;
  if (pct >= 100) return { cor: GREEN, rotulo: "Completa" };
  if (pct >= 80) return { cor: AMBER, rotulo: "Quase completa" };
  return { cor: RED, rotulo: "Falta professor" };
}

export function SecCargaHoraria({ back }: { back: () => void }) {
  const carga = useApi<CargaEscola[]>("/api/rede/carga-horaria/");
  const lista = [...(carga.dados ?? [])].sort((a, b) => (a.cobertura ?? 0) - (b.cobertura ?? 0)); // piores primeiro
  const previstas = lista.reduce((s, c) => s + c.aulas_previstas, 0);
  const cobertas = lista.reduce((s, c) => s + c.aulas_com_professor, 0);
  return (
    <>
      <TopBar title="Carga horária" subtitle="Aulas da matriz × aulas com professor" onBack={back} accent={TEAL} />
      <Screen>
        <EstadoApi carregando={carga.carregando} erro={carga.erro} onRetry={carga.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhuma escola ativa" text="Quando houver escolas com turmas, a cobertura aparece aqui." />
          ) : (
            <>
              <div className="card mb-3 p-4">
                <p className="text-[12px]" style={{ color: INK_SOFT }}>Rede toda (aulas por semana)</p>
                <p className="text-[22px] font-extrabold" style={{ color: TEAL }}>{porcentoBR(previstas ? Math.round((cobertas / previstas) * 1000) / 10 : null)}</p>
                <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{cobertas} de {previstas} aulas semanais já têm professor</p>
              </div>
              <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {lista.map((c) => {
                  const { cor, rotulo } = situacao(c);
                  return (
                    <div key={c.escola} className="card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.escola_nome}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{c.regional_nome} · {c.turmas} {c.turmas === 1 ? "turma" : "turmas"} · {c.dias_letivos === null ? "sem calendário" : `${c.dias_letivos} dias letivos`}</p></div>
                        <span className="flex-none whitespace-nowrap"><Pill color={cor}>{rotulo}</Pill></span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(c.cobertura ?? 0, 100)}%`, background: cor }} /></div>
                        <span className="text-[11.5px] font-bold" style={{ color: cor }}>{porcentoBR(c.cobertura)}</span>
                      </div>
                      <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{c.aulas_com_professor} de {c.aulas_previstas} aulas semanais com professor</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px]" style={{ color: INK_SOFT }}>Aulas previstas = soma das matrizes curriculares das turmas. Para cobrir o que falta, faça a lotação de professores (RH).</p>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
