import { useState } from "react";
import { Pill } from "@/components/Pill";
import { Ring } from "@/components/Ring";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { ALUNO, NOTAS } from "@/data/aluno";
import { BLUE, INK, INK_SOFT } from "@/theme/colors";

export function Notas({ back }: { back: () => void }) {
  const [uni, setUni] = useState(2);
  return (
    <>
      <TopBar title="Notas" subtitle={`${ALUNO.turma} · ${ALUNO.matricula}`} onBack={back} />
      <Screen>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((u) => (
            <button key={u} onClick={() => setUni(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: BLUE, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{u}ª Uni.</button>
          ))}
        </div>
        <div className="mt-4 card p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Média da unidade</p><p className="text-[28px] font-extrabold" style={{ color: BLUE }}>7,3</p></div>
            <Ring value={73} color={BLUE} label="da meta" />
          </div>
        </div>
        <SectionHeader title="Por disciplina" />
        <div className="space-y-2.5">
          {NOTAS.map((n) => (
            <div key={n.mat} className="card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold" style={{ color: INK }}>{n.mat}</p>
                <Pill color={n.cor}>{n.status}</Pill>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[["N1", n.n1], ["N2", n.n2], ["Média", n.media]].map(([l, v], i) => (
                  <div key={l as string} className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: i === 2 ? n.cor + "14" : "#f4f7fb" }}>
                    <div className="text-[10px] font-medium" style={{ color: INK_SOFT }}>{l}</div>
                    <div className="text-[16px] font-extrabold" style={{ color: i === 2 ? n.cor : INK }}>{(v as number).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
