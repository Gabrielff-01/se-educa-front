/* Diário sucinto: uma linha por aula (data · conteúdo · presentes/total), separado por unidade.
   A unidade atual (ou a mais recente) já vem aberta; as outras abrem com um toque no título.
   Tocar numa aula chama onTocar: o professor usa pra editar, a escola pra ver o conteúdo inteiro.
   Usado em ProfDiario (professor) e AdmDiario (supervisão da escola). */

import { useState, type ReactNode } from "react";
import { IconChevron } from "@/components/icons";
import { dataBR } from "@/lib/formato";
import type { Aula } from "@/lib/tipos";
import { INK, INK_SOFT, RED } from "@/theme/colors";

export function DiarioSucinto({ aulas, cor, unidadeAtual, aberta, onTocar, detalhe }: {
  aulas: Aula[];
  cor: string;
  unidadeAtual?: number | null;
  aberta: number | null;            // id da aula tocada (mostra o "detalhe" embaixo dela)
  onTocar: (a: Aula) => void;
  detalhe: (a: Aula) => ReactNode;
}) {
  // Agrupa por unidade, da mais nova pra mais velha; dentro dela, as aulas mais novas primeiro.
  const grupos = new Map<number, Aula[]>();
  for (const a of [...aulas].sort((x, y) => y.data.localeCompare(x.data))) {
    const u = a.unidade ?? 0;
    grupos.set(u, [...(grupos.get(u) ?? []), a]);
  }
  const unidades = [...grupos.keys()].sort((a, b) => b - a);
  const primeira = unidadeAtual && grupos.has(unidadeAtual) ? unidadeAtual : unidades[0];
  // "trocadas" = unidades que a pessoa abriu ou fechou (por padrão só a primeira fica aberta).
  const [trocadas, setTrocadas] = useState<number[]>([]);
  const estaAberta = (u: number) => (u === primeira) !== trocadas.includes(u);
  const alternar = (u: number) => setTrocadas(trocadas.includes(u) ? trocadas.filter((x) => x !== u) : [...trocadas, u]);

  return (
    <div className="space-y-2.5">
      {unidades.map((u) => {
        const lista = grupos.get(u) ?? [];
        const total = lista.reduce((s, a) => s + a.quantidade, 0); // aula dupla conta 2
        const aberto = estaAberta(u);
        return (
          <div key={u} className="card overflow-hidden">
            <button onClick={() => alternar(u)} className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left" style={{ background: cor + "0f" }}>
              <span className="flex-1 text-[12.5px] font-bold" style={{ color: cor }}>
                {u ? `${u}ª unidade` : "Sem unidade"}{u === unidadeAtual ? " (atual)" : ""}
              </span>
              <span className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{total} aula{total === 1 ? "" : "s"}</span>
              <IconChevron size={15} style={{ color: INK_SOFT, transform: aberto ? "rotate(90deg)" : undefined, transition: "transform .15s" }} />
            </button>
            {aberto && (
              <div className="divide-y divide-[color:var(--color-line)]">
                {lista.map((a) => (
                  <div key={a.id}>
                    <button onClick={() => onTocar(a)} className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left" style={aberta === a.id ? { background: cor + "0a" } : undefined}>
                      <span className="w-11 flex-none text-[12px] font-bold tabular-nums" style={{ color: cor }}>{dataBR(a.data).slice(0, 5)}</span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: a.conteudo ? INK : INK_SOFT }}>
                        {a.quantidade > 1 && <b>{a.quantidade}× </b>}{a.conteudo || "Sem conteúdo"}
                      </span>
                      <span className="flex-none text-[11.5px] font-semibold tabular-nums" style={{ color: a.presentes < a.total_alunos ? RED : INK_SOFT }}>{a.presentes}/{a.total_alunos}</span>
                    </button>
                    {aberta === a.id && <div className="px-3.5 pb-3">{detalhe(a)}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
