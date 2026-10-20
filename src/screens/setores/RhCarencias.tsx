/* RH — Carências: onde falta professor.
   Dados: GET /api/rh/carencias/ -> uma linha por turma + matéria, de dois tipos:
   - "sem_professor": a matriz pede X aulas e ninguém (ou não o bastante) está lotado;
   - "substituicao": o professor lotado está afastado hoje e precisa de substituto. */

import { useState } from "react";
import { Chips } from "@/components/Chips";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { AMBER, INK, INK_SOFT, RED } from "@/theme/colors";

type Carencia = {
  tipo: "sem_professor" | "substituicao";
  escola_nome: string;
  turma: number;
  turma_nome: string;
  materia_nome: string;
  aulas: number;
  professor_nome: string | null;
  motivo: string;
};
type Filtro = "todas" | Carencia["tipo"];

const TIPOS = { sem_professor: { nome: "Sem professor", cor: RED }, substituicao: { nome: "Substituição", cor: AMBER } };

export function RhCarencias({ back }: { back: () => void }) {
  const carencias = useApi<Carencia[]>("/api/rh/carencias/");
  const [filtro, setFiltro] = useState<Filtro[]>(["todas"]);
  const todas = carencias.dados ?? [];
  const lista = todas.filter((c) => filtro[0] === "todas" || c.tipo === filtro[0]);
  const aulas = (itens: Carencia[]) => itens.reduce((s, c) => s + c.aulas, 0);

  // Agrupa por escola (e dentro da escola, na ordem que a API mandou: por turma).
  const porEscola = new Map<string, Carencia[]>();
  for (const c of lista) porEscola.set(c.escola_nome, [...(porEscola.get(c.escola_nome) ?? []), c]);

  return (
    <>
      <TopBar title="Carências" subtitle="Aulas sem professor na rede" onBack={back} accent={RED} />
      <Screen>
        <EstadoApi carregando={carencias.carregando} erro={carencias.erro} onRetry={carencias.recarregar}>
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4"><div className="text-[22px] font-extrabold" style={{ color: RED }}>{aulas(todas.filter((c) => c.tipo === "sem_professor"))}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>Aulas/semana sem professor</div></div>
            <div className="card p-4"><div className="text-[22px] font-extrabold" style={{ color: AMBER }}>{aulas(todas.filter((c) => c.tipo === "substituicao"))}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>Aulas/semana para substituir</div></div>
          </div>
          <div className="mt-3">
            <Chips<Filtro> items={[{ id: "todas", label: `Todas (${todas.length})` }, { id: "sem_professor", label: "Sem professor" }, { id: "substituicao", label: "Substituição" }]} value={filtro} onChange={setFiltro} cor={RED} />
          </div>
          {lista.length === 0 && <EmptyState title="Nenhuma carência" text="Todas as aulas da matriz têm professor nesta seleção." icon={<IconCheck size={26} />} />}
          {[...porEscola.entries()].map(([escola, itens]) => (
            <div key={escola}>
              <div className="mb-2.5 mt-5 flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-bold" style={{ color: INK }}>{escola}</h2>
                <span className="flex-none text-[12px] font-semibold" style={{ color: RED }}>{aulas(itens)} aulas/sem.</span>
              </div>
              <div className="card divide-y">
                {itens.map((c) => (
                  <div key={`${c.tipo}-${c.turma}-${c.materia_nome}-${c.professor_nome}`} className="flex items-start gap-3 px-4 py-3" style={{ borderColor: "#eef2f7" }}>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold" style={{ color: INK }}>{c.turma_nome} · {c.materia_nome}</p>
                      <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{c.tipo === "substituicao" ? `${c.professor_nome}: ${c.motivo}` : c.motivo}</p>
                    </div>
                    <div className="flex flex-none flex-col items-end gap-1">
                      <Pill color={TIPOS[c.tipo].cor}>{TIPOS[c.tipo].nome}</Pill>
                      <span className="text-[11.5px] font-bold" style={{ color: INK }}>{c.aulas} {c.aulas === 1 ? "aula" : "aulas"}/sem.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </EstadoApi>
      </Screen>
    </>
  );
}
