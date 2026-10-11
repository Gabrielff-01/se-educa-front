import { useState } from "react";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { DIAS, HORARIOS } from "@/data/aluno";
import { INK, INK_SOFT, TEAL } from "@/theme/colors";

export function Horarios({ back }: { back: () => void }) {
  const [dia, setDia] = useState("SEG");
  return (
    <>
      <TopBar title="Horários" subtitle="Grade semanal · Turno matutino" onBack={back} accent={TEAL} />
      <Screen>
        <div className="flex gap-2">
          {DIAS.map((d) => (
            <button key={d} onClick={() => setDia(d)} className="flex-1 rounded-xl py-2.5 text-[12px] font-bold transition" style={dia === d ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{d}</button>
          ))}
        </div>
        <SectionHeader title={`Aulas de ${dia === "SEG" ? "segunda" : dia === "TER" ? "terça" : dia === "QUA" ? "quarta" : dia === "QUI" ? "quinta" : "sexta"}-feira`} />
        <div className="relative space-y-3 pl-4">
          <span className="absolute bottom-2 left-[5px] top-2 w-0.5 rounded" style={{ background: "#e2e8f0" }} />
          {HORARIOS[dia].map((a) => (
            <div key={a.h} className="relative card flex items-center gap-3 p-3.5">
              <span className="absolute -left-[13px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: a.cor }} />
              <div className="w-12 flex-none text-center"><p className="text-[13px] font-extrabold" style={{ color: INK }}>{a.h}</p></div>
              <div className="h-9 w-1 rounded-full" style={{ background: a.cor }} />
              <div className="flex-1"><p className="text-[14px] font-semibold" style={{ color: INK }}>{a.m}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{a.sala}</p></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
