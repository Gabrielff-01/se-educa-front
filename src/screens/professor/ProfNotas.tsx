import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { ALUNOS_TURMA } from "@/data/professor";
import { BLUE, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function ProfNotas({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const [uni, setUni] = useState(2);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"idle" | "salvando" | "salvo">("idle");
  const salvar = () => { setEstado("salvando"); setTimeout(() => setEstado("salvo"), 1000); };
  return (
    <>
      <TopBar title="Lançar notas" subtitle="Matemática" onBack={back} accent={BLUE} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["9º ano B", "8º ano A", "7º ano C"].map((t) => (
            <button key={t} onClick={() => setTurma(t)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t ? { background: BLUE, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t}</button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">{[1, 2, 3, 4].map((u) => <button key={u} onClick={() => setUni(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{u}ª Uni.</button>)}</div>
        {estado === "salvo" && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />Notas salvas com sucesso!</div>}
        <SectionHeader title={`Alunos · ${turma}`} />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {ALUNOS_TURMA.map((a, i) => (
            <div key={a} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="w-5 text-[11px] font-bold" style={{ color: "#94a3b8" }}>{i + 1}</span>
              <Avatar name={a} color={BLUE} size={32} />
              <span className="flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{a}</span>
              <input value={notas[a] ?? ""} onChange={(e) => setNotas({ ...notas, [a]: e.target.value })} inputMode="decimal" placeholder="0,0" className="w-16 rounded-xl border border-[color:var(--color-line)] px-2 py-2 text-center text-[14px] font-bold outline-none focus:border-[color:var(--color-brand-blue)]" style={{ color: INK }} />
            </div>
          ))}
        </div>
        <div className="mt-4"><PrimaryButton onClick={salvar} loading={estado === "salvando"}>{estado === "salvando" ? "Salvando..." : "Salvar notas"}</PrimaryButton></div>
      </Screen>
    </>
  );
}
