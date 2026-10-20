/* Secretaria — Matrículas da rede, por regional.
   Dados: GET /api/rede/matriculas/ -> por regional: escolas, confirmadas, em análise, sem turma e vagas
   (vagas = capacidade das turmas - alunos confirmados). Os totais do topo são a soma das regionais. */

import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { ANO_ATUAL } from "@/lib/formato";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

export type MatriculasRegional = { regional: number; regional_nome: string; escolas: number; confirmadas: number; em_analise: number; sem_turma: number; vagas: number };

/* Soma um campo de todas as regionais. */
function somar(lista: MatriculasRegional[] | null, campo: keyof Omit<MatriculasRegional, "regional_nome">) {
  return (lista ?? []).reduce((total, r) => total + r[campo], 0);
}

const numero = (n: number) => n.toLocaleString("pt-BR");

export function SecMatriculas({ back }: { back: () => void }) {
  const rede = useApi<MatriculasRegional[]>("/api/rede/matriculas/");
  const lista = rede.dados ?? [];
  return (
    <>
      <TopBar title="Matrículas da rede" subtitle={`Rede estadual · ${ANO_ATUAL}`} onBack={back} accent={AMBER} />
      <Screen>
        <EstadoApi carregando={rede.carregando} erro={rede.erro} onRetry={rede.recarregar}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              { n: somar(lista, "confirmadas"), l: "Confirmadas", c: GREEN },
              { n: somar(lista, "em_analise"), l: "Em análise", c: AMBER },
              { n: somar(lista, "sem_turma"), l: "Sem turma", c: RED },
              { n: somar(lista, "vagas"), l: "Vagas abertas", c: BLUE },
              { n: somar(lista, "escolas"), l: "Escolas", c: TEAL, largo: true },
            ].map((k) => (
              <div key={k.l} className={`card p-4 ${k.largo ? "col-span-2 md:col-span-1" : ""}`}><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{numero(k.n)}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
            ))}
          </div>
          <SectionHeader title="Por regional" />
          {lista.length === 0 && <EmptyState title="Nenhuma regional" text="Cadastre as regionais e escolas para ver as matrículas aqui." />}
          <div className="space-y-2.5">
            {lista.map((r) => (
              <div key={r.regional} className="card p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{r.regional_nome}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{r.escolas} {r.escolas === 1 ? "escola" : "escolas"}</p></div>
                  <span className="text-right text-[12px] font-semibold" style={{ color: GREEN }}>{numero(r.confirmadas)} confirmadas</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px]" style={{ color: INK_SOFT }}>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />{numero(r.vagas)} vagas</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: AMBER }} />{r.em_analise} em análise</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RED }} />{r.sem_turma} sem turma</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: INK_SOFT }}>"Sem turma" são matrículas ativas que ainda não foram colocadas numa turma (veja em Enturmação).</p>
        </EstadoApi>
      </Screen>
    </>
  );
}
