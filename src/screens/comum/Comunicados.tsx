import { useState } from "react";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { COMUNICADOS } from "@/data/aluno";
import { GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function Comunicados({ back }: { back: () => void }) {
  const [cat, setCat] = useState("Todos");
  const list = COMUNICADOS.filter((c) => cat === "Todos" || c.cat === cat);
  return (
    <>
      <TopBar title="Comunicados" subtitle="Avisos e notícias" onBack={back} accent={GREEN} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["Todos", "Secretaria", "Escola", "Turma"].map((f) => (
            <button key={f} onClick={() => setCat(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={cat === f ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {list.map((c) => (
            <div key={c.t} className="card p-4">
              <div className="flex items-center justify-between"><Pill color={c.cor}>{c.cat}</Pill><span className="text-[11px]" style={{ color: INK_SOFT }}>{c.data}</span></div>
              <div className="mt-2 flex items-center gap-2"><p className="text-[14px] font-bold" style={{ color: INK }}>{c.t}</p>{c.novo && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: RED }}>NOVO</span>}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>{c.d}</p>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
