/* Notas do aluno por matéria, uma unidade de cada vez (1ª a 4ª), com a média anual e a situação.
   Dados: /api/boletim/ (o responsável escolhe o filho no topo).
   Nota abaixo da média de aprovação (media_aprovacao, 6,0) fica em vermelho. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Ring } from "@/components/Ring";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconStar, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { notaBR } from "@/lib/formato";
import type { Boletim } from "@/lib/tipos";
import { abaixoDaMedia, corDaSituacao, UNIDADES } from "@/screens/aluno/Boletim";
import { BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Unidade = (typeof UNIDADES)[number]; // "1" | "2" | "3" | "4"

export function Notas({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<Boletim>(comAluno("/api/boletim/"));
  const b = boletim.dados;
  // Unidade escolhida; enquanto ninguém escolheu, mostra a unidade em andamento
  const [escolhida, setEscolhida] = useState<Unidade | null>(null);
  const uni: Unidade = escolhida ?? UNIDADES[(b?.unidade_atual ?? 1) - 1] ?? "1";

  const aprovacao = b?.media_aprovacao ?? "6.0";
  const materias = b?.materias ?? [];
  const notasDaUnidade = materias.map((m) => m.notas[uni]).filter((n): n is string => n !== null && n !== undefined);
  const mediaDaUnidade = notasDaUnidade.length ? notasDaUnidade.reduce((s, n) => s + Number(n), 0) / notasDaUnidade.length : null;
  const abaixo = materias.filter((m) => abaixoDaMedia(m.notas[uni], aprovacao));
  // Quantas das notas desta unidade estão na média ou acima (vai no anel)
  const naMedia = notasDaUnidade.length ? Math.round(((notasDaUnidade.length - abaixo.length) / notasDaUnidade.length) * 100) : 0;
  // Matérias sem nenhuma nota no ano ficam numa linha só, no fim
  const comNotas = materias.filter((m) => UNIDADES.some((u) => m.notas[u] !== null));
  const semNotas = materias.filter((m) => !comNotas.includes(m));
  const fechada = (b?.unidades_fechadas ?? []).includes(Number(uni));

  return (
    <>
      <TopBar title="Notas" subtitle={b?.matricula ? `${b.matricula.turma_nome ?? b.matricula.serie_nome} · Código ${b.aluno.codigo}` : atual?.nome} onBack={back} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} />
        <EstadoApi carregando={filhos.carregando || boletim.carregando} erro={filhos.erro ?? boletim.erro} onRetry={boletim.recarregar}>
          {!atual || !b ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : !b.matricula ? (
            <EmptyState title="Sem matrícula neste ano" text="As notas aparecem quando o aluno estiver matriculado numa turma." icon={<IconStar size={26} />} />
          ) : (
            <>
              <div className="flex gap-2">
                {UNIDADES.map((u) => (
                  <button key={u} onClick={() => setEscolhida(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: BLUE, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
                    {u}ª Uni.
                    {(b.unidades_fechadas ?? []).includes(Number(u)) && <span className="block text-[9px] font-medium opacity-80">fechada</span>}
                  </button>
                ))}
              </div>

              <div className="mt-4 card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px]" style={{ color: INK_SOFT }}>Média da {uni}ª unidade</p>
                    <p className="text-[28px] font-extrabold" style={{ color: abaixoDaMedia(mediaDaUnidade, aprovacao) ? RED : BLUE }}>{notaBR(mediaDaUnidade)}</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>
                      {notasDaUnidade.length} de {materias.length} matérias com nota{fechada ? " · unidade fechada" : b.unidade_atual === Number(uni) ? " · em andamento" : ""}
                    </p>
                  </div>
                  <Ring value={naMedia} color={abaixo.length ? RED : GREEN} label="na média" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-line)] pt-3 text-[12px]" style={{ color: INK_SOFT }}>
                  <span>Média geral do ano até agora</span>
                  <b style={{ color: abaixoDaMedia(b.media_geral, aprovacao) ? RED : INK }}>{notaBR(b.media_geral)}</b>
                </div>
              </div>

              {abaixo.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: RED + "10" }}>
                  <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: RED }} />
                  <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Abaixo da média ({notaBR(aprovacao)}) na {uni}ª unidade: <b>{abaixo.map((m) => m.materia_nome).join(", ")}</b>.</p>
                </div>
              )}

              <SectionHeader title="Por matéria" />
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {comNotas.map((m) => {
                  const nota = m.notas[uni];
                  const corNota = abaixoDaMedia(nota, aprovacao) ? RED : nota === null ? "#94a3b8" : GREEN;
                  return (
                    <div key={m.materia} className="card p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{m.materia_nome}</p>
                          <p className="truncate text-[11px]" style={{ color: INK_SOFT }}>{m.professores.length ? m.professores.join(", ") : "Professor a definir"}</p>
                        </div>
                        <Pill color={corDaSituacao(m.situacao)}>{m.situacao}</Pill>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: corNota + "14" }}>
                          <div className="text-[10px] font-medium" style={{ color: INK_SOFT }}>{uni}ª unidade</div>
                          <div className="text-[16px] font-extrabold" style={{ color: corNota }}>{nota === null ? "sem nota" : notaBR(nota)}</div>
                        </div>
                        <div className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: "#f4f7fb" }}>
                          <div className="text-[10px] font-medium" style={{ color: INK_SOFT }}>Média do ano</div>
                          <div className="text-[16px] font-extrabold" style={{ color: abaixoDaMedia(m.media, aprovacao) ? RED : INK }}>{notaBR(m.media)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {comNotas.length === 0 && <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma nota lançada ainda neste ano.</p>}
              {semNotas.length > 0 && <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Ainda sem notas: {semNotas.map((m) => m.materia_nome).join(", ")}.</p>}
              <p className="mt-3 text-[11px]" style={{ color: INK_SOFT }}>Média para aprovação: {notaBR(aprovacao)}. O quadro completo está no Boletim.</p>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
