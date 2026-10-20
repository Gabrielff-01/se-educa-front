/* Frequência do aluno: presença geral e por matéria no ano letivo.
   Dados: /api/boletim/ (aulas dadas, faltas e % de cada matéria).
   O responsável escolhe o filho no topo (useAlunoEscolhido + SeletorAluno).
   Avisa quando a presença está abaixo do mínimo da escola (75%) ou do programa social. */

import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Ring } from "@/components/Ring";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconCheck, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { porcentoBR } from "@/lib/formato";
import type { Boletim } from "@/lib/tipos";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

/* Frequência mínima exigida por cada programa social (a mesma regra da API, em academico/models.py).
   Usada aqui e nas telas iniciais do aluno e do responsável. */
export const FREQUENCIA_DO_PROGRAMA: Record<string, number> = { bolsa_familia: 85, pe_de_meia: 80 };

export function minimoDoPrograma(programa: string | null | undefined) {
  return programa ? FREQUENCIA_DO_PROGRAMA[programa] ?? null : null;
}

export function Frequencia({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<Boletim>(comAluno("/api/boletim/"));
  const b = boletim.dados;

  const minimoEscola = b?.frequencia_minima ?? 75;
  const minimoProg = minimoDoPrograma(b?.aluno.programa_social);
  const geral = b?.frequencia_geral ?? null;
  const materias = b?.materias ?? [];
  // Matérias que já tiveram aula (as outras ainda não têm frequência pra mostrar)
  const comAulas = materias.filter((m) => m.aulas > 0);
  const semAulas = materias.filter((m) => m.aulas === 0);
  const abaixoEscola = comAulas.filter((m) => m.frequencia !== null && m.frequencia < minimoEscola);

  // Cor da porcentagem: vermelho abaixo do mínimo da escola, amarelo abaixo do mínimo do programa
  const corDa = (pct: number | null) => pct === null ? INK_SOFT : pct < minimoEscola ? RED : minimoProg && pct < minimoProg ? AMBER : GREEN;

  return (
    <>
      <TopBar title="Frequência" subtitle={b?.matricula ? `Ano letivo ${b.matricula.ano_letivo} · ${b.aluno.nome.split(" ")[0]}` : atual?.nome} onBack={back} accent={GREEN} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={GREEN} />
        <EstadoApi carregando={filhos.carregando || boletim.carregando} erro={filhos.erro ?? boletim.erro} onRetry={boletim.recarregar}>
          {!atual ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : !b?.matricula ? (
            <EmptyState title="Sem matrícula neste ano" text="Quando o aluno estiver matriculado numa turma, a frequência aparece aqui." icon={<IconCheck size={26} />} />
          ) : (
            <>
              <div className="card flex items-center gap-4 p-4">
                <Ring value={Math.round(geral ?? 0)} size={82} color={corDa(geral)} label="presença" />
                <div className="flex-1">
                  <p className="text-[13px] font-bold" style={{ color: INK }}>Frequência geral</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>{porcentoBR(geral)} de presença · {b.faltas_total} faltas em {b.aulas_total} aulas</p>
                  <div className="mt-2 inline-flex">
                    {geral === null ? <Pill color={INK_SOFT}>Sem aulas registradas</Pill>
                      : geral < minimoEscola ? <Pill color={RED}>Abaixo do mínimo ({minimoEscola}%)</Pill>
                      : <Pill color={GREEN}>Dentro do limite (mín. {minimoEscola}%)</Pill>}
                  </div>
                </div>
              </div>

              {/* Alerta da escola: abaixo de 75% no fim do ano, reprova por falta */}
              {geral !== null && geral < minimoEscola && (
                <Alerta cor={RED}>A frequência geral está em <b>{porcentoBR(geral)}</b>, abaixo dos {minimoEscola}% exigidos. Abaixo disso no fim do ano o aluno é <b>reprovado por falta</b>.</Alerta>
              )}
              {/* Alerta do programa social (Bolsa Família / Pé-de-Meia) */}
              {minimoProg && geral !== null && (geral < minimoProg ? (
                <Alerta cor={AMBER}>O <b>{b.aluno.programa_nome}</b> exige pelo menos <b>{minimoProg}%</b> de presença. Hoje a frequência é {porcentoBR(geral)}: o benefício pode ser suspenso.</Alerta>
              ) : (
                <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: GREEN + "12" }}>
                  <IconCheck size={18} className="mt-0.5 flex-none" style={{ color: GREEN }} />
                  <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{b.aluno.programa_nome}: mínimo de {minimoProg}% de presença. Está em dia.</p>
                </div>
              ))}
              {abaixoEscola.length > 0 && (
                <Alerta cor={AMBER}>Atenção em <b>{abaixoEscola.map((m) => m.materia_nome).join(", ")}</b>: presença abaixo de {minimoEscola}% nessa matéria.</Alerta>
              )}

              <SectionHeader title="Detalhe por matéria" />
              {comAulas.length === 0 ? (
                <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma aula registrada no diário ainda.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {comAulas.map((m) => {
                    const cor = corDa(m.frequencia);
                    return (
                      <div key={m.materia} className="card p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[14px] font-semibold" style={{ color: INK }}>{m.materia_nome}</p>
                          <span className="text-[14px] font-extrabold" style={{ color: cor }}>{porcentoBR(m.frequencia)}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${m.frequencia ?? 0}%`, background: cor }} /></div>
                        <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{m.faltas} {m.faltas === 1 ? "falta" : "faltas"} em {m.aulas} aulas</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {semAulas.length > 0 && (
                <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Ainda sem aulas no diário: {semAulas.map((m) => m.materia_nome).join(", ")}.</p>
              )}
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}

function Alerta({ cor, children }: { cor: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: cor + "12" }}>
      <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: cor }} />
      <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{children}</p>
    </div>
  );
}
