/* Boletim completo do ano: cada matéria com as notas das 4 unidades, média, faltas, frequência e situação.
   Dados: /api/boletim/ (o responsável escolhe o filho no topo).
   Unidade "fechada" = a escola já fechou as notas dela (o professor não pode mais mudar). */

import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconDoc, IconShield, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { notaBR, porcentoBR } from "@/lib/formato";
import type { Boletim as TipoBoletim } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export const UNIDADES = ["1", "2", "3", "4"] as const;

/* Cor de cada situação que a API devolve (Cursando, Aprovado, Recuperação, Reprovado, Reprovado por falta) */
export function corDaSituacao(situacao: string) {
  if (situacao === "Aprovado") return GREEN;
  if (situacao === "Recuperação") return AMBER;
  if (situacao.startsWith("Reprovado")) return RED;
  return BLUE; // Cursando
}

/* A nota vem como texto ("7.5") ou número; abaixo da média de aprovação fica vermelha. */
export function abaixoDaMedia(nota: string | number | null | undefined, mediaAprovacao: string | number) {
  return nota !== null && nota !== undefined && nota !== "" && Number(nota) < Number(mediaAprovacao);
}

export function Boletim({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<TipoBoletim>(comAluno("/api/boletim/"));
  const b = boletim.dados;
  const fechadas = b?.unidades_fechadas ?? [];
  const aprovacao = b?.media_aprovacao ?? "6.0";
  const minimo = b?.frequencia_minima ?? 75;

  return (
    <>
      <TopBar title="Boletim" subtitle={b?.matricula ? `${b.matricula.ano_letivo} · ${b.matricula.turma_nome ?? b.matricula.serie_nome}` : "Ano letivo atual"} onBack={back} accent={AMBER}
        right={<button onClick={() => window.print()} aria-label="Imprimir boletim" title="Imprimir" className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconDoc size={18} /></button>} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={AMBER} />
        <EstadoApi carregando={filhos.carregando || boletim.carregando} erro={filhos.erro ?? boletim.erro} onRetry={boletim.recarregar}>
          {!atual || !b ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : !b.matricula ? (
            <EmptyState title="Sem matrícula neste ano" text="O boletim aparece quando o aluno estiver matriculado." />
          ) : (
            <>
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={b.aluno.nome} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{b.aluno.nome}</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{b.matricula.turma_nome ?? "Sem turma"} · Código {b.aluno.codigo}</p>
                  </div>
                </div>
                <div className="mt-3 border-t border-[color:var(--color-line)] pt-3 text-[11.5px]" style={{ color: INK_SOFT }}>
                  <p>{b.matricula.escola_nome} · {b.matricula.municipio}</p>
                  <p>{b.matricula.curso_nome} · {b.matricula.serie_nome}{b.matricula.turno_nome ? ` · ${b.matricula.turno_nome}` : ""}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Média geral</p><p className="text-[24px] font-extrabold" style={{ color: abaixoDaMedia(b.media_geral, aprovacao) ? RED : BLUE }}>{notaBR(b.media_geral)}</p></div>
                <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Frequência geral</p><p className="text-[24px] font-extrabold" style={{ color: b.frequencia_geral !== null && b.frequencia_geral < minimo ? RED : GREEN }}>{porcentoBR(b.frequencia_geral)}</p></div>
              </div>

              <SectionHeader title="Quadro de notas" />
              {/* Tabela larga: no celular ela rola para o lado */}
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead>
                    <tr className="text-[10.5px] font-bold uppercase" style={{ background: "#f4f7fb", color: INK_SOFT }}>
                      <th className="sticky left-0 px-3 py-2.5" style={{ background: "#f4f7fb" }}>Matéria</th>
                      {UNIDADES.map((u) => (
                        <th key={u} className="px-1 py-2.5 text-center">
                          {u}ª uni.
                          {fechadas.includes(Number(u)) ? <span className="block text-[9px] normal-case" style={{ color: GREEN }}>fechada</span>
                            : b.unidade_atual === Number(u) ? <span className="block text-[9px] normal-case" style={{ color: BLUE }}>atual</span>
                            : <span className="block text-[9px]">&nbsp;</span>}
                        </th>
                      ))}
                      <th className="px-1 py-2.5 text-center">Média</th>
                      <th className="px-1 py-2.5 text-center">Faltas</th>
                      <th className="px-1 py-2.5 text-center">Freq.</th>
                      <th className="px-3 py-2.5 text-center">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.materias.map((m) => (
                      <tr key={m.materia} className="border-t border-[color:var(--color-line)]">
                        <td className="sticky left-0 bg-white px-3 py-2.5 text-[12.5px] font-semibold" style={{ color: INK }}>{m.materia_nome}</td>
                        {UNIDADES.map((u) => (
                          <td key={u} className="px-1 py-2.5 text-center text-[13px] font-semibold" style={{ color: abaixoDaMedia(m.notas[u], aprovacao) ? RED : m.notas[u] === null ? "#94a3b8" : INK }}>{notaBR(m.notas[u])}</td>
                        ))}
                        <td className="px-1 py-2.5 text-center text-[13.5px] font-extrabold" style={{ color: abaixoDaMedia(m.media, aprovacao) ? RED : m.media === null ? "#94a3b8" : BLUE }}>{notaBR(m.media)}</td>
                        <td className="px-1 py-2.5 text-center text-[12.5px]" style={{ color: INK }}>{m.aulas ? m.faltas : "—"}</td>
                        <td className="px-1 py-2.5 text-center text-[12.5px]" style={{ color: m.frequencia !== null && m.frequencia < minimo ? RED : INK }}>{porcentoBR(m.frequencia)}</td>
                        <td className="px-3 py-2.5 text-center"><span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: corDaSituacao(m.situacao) + "1a", color: corDaSituacao(m.situacao) }}>{m.situacao}</span></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[color:var(--color-line)] text-[12px] font-bold" style={{ background: "#f8fafc", color: INK }}>
                      <td className="sticky left-0 px-3 py-2.5" style={{ background: "#f8fafc" }}>Geral</td>
                      <td colSpan={4} />
                      <td className="px-1 py-2.5 text-center" style={{ color: abaixoDaMedia(b.media_geral, aprovacao) ? RED : BLUE }}>{notaBR(b.media_geral)}</td>
                      <td className="px-1 py-2.5 text-center">{b.faltas_total}</td>
                      <td className="px-1 py-2.5 text-center">{porcentoBR(b.frequencia_geral)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-2 text-[11px] md:hidden" style={{ color: INK_SOFT }}>Arraste a tabela para o lado para ver faltas e situação.</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px]" style={{ color: INK_SOFT }}>
                {["Cursando", "Aprovado", "Recuperação", "Reprovado"].map((s) => (
                  <span key={s} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: corDaSituacao(s) }} />{s}</span>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: AMBER + "12" }}>
                <IconShield size={18} className="mt-0.5 flex-none" style={{ color: AMBER }} />
                <div className="text-[11.5px] leading-relaxed" style={{ color: INK }}>
                  <p className="font-bold">Como funciona a aprovação</p>
                  <p>Média anual = média das 4 unidades. Passa com média <b>{notaBR(aprovacao)}</b> ou mais e frequência de pelo menos <b>{minimo}%</b>. Média entre 4,0 e {notaBR(aprovacao)} vai para a recuperação. A situação final só sai quando as 4 unidades têm nota; até lá aparece "Cursando".</p>
                  {fechadas.length > 0 && <p className="mt-1" style={{ color: INK_SOFT }}>Unidades fechadas pela escola: {fechadas.map((u) => `${u}ª`).join(", ")}.</p>}
                </div>
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
