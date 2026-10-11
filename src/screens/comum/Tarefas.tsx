import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconClock, IconPlus } from "@/components/icons";
import { ALUNO, TAREFAS } from "@/data/aluno";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, TEAL, VIOLET } from "@/theme/colors";

export function Tarefas({ back, role }: { back: () => void; role: "aluno" | "professor" }) {
  const [filtro, setFiltro] = useState("Todas");
  if (role === "professor") {
    const tarefas = [
      { mat: "9º ano B", t: "Lista de equações do 2º grau", prazo: "08/09", entregues: 18, total: 32, cor: BLUE },
      { mat: "8º ano A", t: "Trabalho sobre funções", prazo: "14/09", entregues: 5, total: 29, cor: AMBER },
      { mat: "7º ano C", t: "Exercícios de frações", prazo: "10/09", entregues: 31, total: 31, cor: GREEN },
    ];
    return (
      <>
        <TopBar title="Tarefas" subtitle="Atividades atribuídas" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
        <Screen>
          <div className="space-y-2.5">
            {tarefas.map((t) => {
              const pct = Math.round((t.entregues / t.total) * 100);
              return (
                <div key={t.t} className="card p-4">
                  <div className="flex items-center justify-between"><Pill color={t.cor}>{t.mat}</Pill><span className="text-[11.5px]" style={{ color: INK_SOFT }}>Prazo {t.prazo}</span></div>
                  <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{t.t}</p>
                  <div className="mt-2.5 flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.cor }} /></div><span className="text-[12px] font-bold" style={{ color: t.cor }}>{t.entregues}/{t.total}</span></div>
                  <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{t.entregues} entregas · {t.total - t.entregues} pendentes</p>
                </div>
              );
            })}
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Nova tarefa</button>
        </Screen>
      </>
    );
  }
  const list = TAREFAS.filter((t) => filtro === "Todas" || (filtro === "Pendentes" && t.status !== "Entregue") || (filtro === "Entregues" && t.status === "Entregue"));
  return (
    <>
      <TopBar title="Tarefas" subtitle={`${ALUNO.turma} · atividades`} onBack={back} accent={VIOLET} />
      <Screen>
        <div className="flex gap-2">
          {["Todas", "Pendentes", "Entregues"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState title="Nada por aqui" text="Não há tarefas nesta categoria no momento." icon={<IconCheck size={26} />} />
        ) : (
          <div className="mt-4 space-y-2.5">
            {list.map((t) => (
              <div key={t.t} className="card p-3.5" style={{ borderLeft: `3px solid ${t.cor}` }}>
                <div className="flex items-center justify-between"><Pill color={BLUE}>{t.mat}</Pill><Pill color={t.cor}>{t.status}</Pill></div>
                <p className="mt-2 text-[13.5px] font-semibold" style={{ color: INK }}>{t.t}</p>
                <p className="mt-1 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconClock size={13} />Entrega até {t.prazo}</p>
              </div>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
