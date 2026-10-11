import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { ALUNOS_TURMA } from "@/data/professor";
import { GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function ProfFrequencia({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const [pres, setPres] = useState<Record<string, boolean>>(() => Object.fromEntries(ALUNOS_TURMA.map((a) => [a, true])));
  const [estado, setEstado] = useState<"idle" | "salvando" | "salvo">("idle");
  const presentes = Object.values(pres).filter(Boolean).length;
  const faltas = ALUNOS_TURMA.length - presentes;
  const salvar = () => { setEstado("salvando"); setTimeout(() => setEstado("salvo"), 1000); };
  return (
    <>
      <TopBar title="Frequência" subtitle="Registro de chamada · Hoje, 17/09" onBack={back} accent={GREEN} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["9º ano B", "8º ano A", "7º ano C"].map((t) => (
            <button key={t} onClick={() => setTurma(t)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t}</button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Presentes</p><p className="text-[22px] font-extrabold" style={{ color: GREEN }}>{presentes}</p></div>
          <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Faltas</p><p className="text-[22px] font-extrabold" style={{ color: RED }}>{faltas}</p></div>
        </div>
        {estado === "salvo" && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />Chamada registrada!</div>}
        <SectionHeader title={`Alunos · ${turma}`} />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {ALUNOS_TURMA.map((a) => {
            const on = pres[a];
            return (
              <div key={a} className="flex items-center gap-3 px-3.5 py-2.5">
                <Avatar name={a} color={on ? GREEN : RED} size={32} />
                <span className="flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{a}</span>
                <button onClick={() => setPres({ ...pres, [a]: true })} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={on ? { background: GREEN, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>P</button>
                <button onClick={() => setPres({ ...pres, [a]: false })} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={!on ? { background: RED, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>F</button>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><PrimaryButton onClick={salvar} color={GREEN} loading={estado === "salvando"}>{estado === "salvando" ? "Salvando..." : "Salvar chamada"}</PrimaryButton></div>
      </Screen>
    </>
  );
}
