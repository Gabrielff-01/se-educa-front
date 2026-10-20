/* Professores que dão aula na escola: matérias, turmas, aulas por semana e afastamento.
   Só leitura: cadastro e lotação são do RH. Dados: GET /api/escola/professores/. */

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EstadoApi } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { dataBR } from "@/lib/formato";
import { GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type ProfessorDaEscola = {
  id: number; nome: string; carga: number; vinculo_nome: string; materias: string[]; turmas: string[];
  aulas_na_escola: number; afastamento: { tipo_nome: string; fim: string } | null;
};

export function AdmProfessores({ back }: { back: () => void }) {
  const professores = useApi<ProfessorDaEscola[]>("/api/escola/professores/");
  const [q, setQ] = useState("");
  const todos = professores.dados ?? [];
  const lista = todos.filter((p) => `${p.nome} ${p.materias.join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const afastados = todos.filter((p) => p.afastamento).length;
  return (
    <>
      <TopBar title="Professores" subtitle={professores.dados ? `${todos.length} na escola · ${afastados} afastado(s)` : "Quadro docente"} onBack={back} accent={TEAL} />
      <Screen>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou matéria" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        <EstadoApi carregando={professores.carregando} erro={professores.erro} onRetry={professores.recarregar}>
          {lista.length === 0 ? <EmptyState title="Nenhum professor" text={q ? "Ninguém com esse nome ou matéria." : "Nenhum professor lotado na escola neste ano."} icon={<IconSearch size={26} />} /> : (
            <div className="mt-3 grid gap-2.5 lg:grid-cols-2">
              {lista.map((p) => (
                <div key={p.id} className="card p-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.nome} color={p.afastamento ? RED : TEAL} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{p.nome}</p>
                      <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.materias.join(", ")} · {p.aulas_na_escola} aulas/semana aqui</p>
                    </div>
                    {p.afastamento ? <Pill color={RED}>Afastado</Pill> : <Pill color={GREEN}>Em atividade</Pill>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.turmas.map((t) => <span key={t} className="rounded-lg px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: TEAL + "12", color: TEAL }}>{t}</span>)}
                  </div>
                  <p className="mt-2 text-[11px]" style={{ color: INK_SOFT }}>{p.carga} h semanais · {p.vinculo_nome}</p>
                  {p.afastamento && (
                    <p className="mt-2 rounded-xl px-3 py-2 text-[11.5px] font-medium" style={{ background: RED + "10", color: RED }}>{p.afastamento.tipo_nome} até {dataBR(p.afastamento.fim)}.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </EstadoApi>
        <p className="mt-3 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Cadastro, lotação e afastamentos são feitos pelo RH.</p>
      </Screen>
    </>
  );
}
