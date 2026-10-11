import { Pill } from "@/components/Pill";
import { Ring } from "@/components/Ring";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert } from "@/components/icons";
import { FREQ } from "@/data/aluno";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function Frequencia({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Frequência" subtitle="Ano letivo 2025" onBack={back} accent={GREEN} />
      <Screen>
        <div className="card flex items-center gap-4 p-4">
          <Ring value={90} size={82} color={GREEN} label="presença" />
          <div className="flex-1">
            <p className="text-[13px] font-bold" style={{ color: INK }}>Frequência geral</p>
            <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>37 faltas de 360 aulas</p>
            <div className="mt-2 inline-flex"><Pill color={GREEN}>Dentro do limite (mín. 75%)</Pill></div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: AMBER + "12" }}>
          <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: AMBER } as any} />
          <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Atenção: <b>Inglês</b> está com 74% de presença, abaixo do mínimo exigido.</p>
        </div>
        <SectionHeader title="Detalhe por disciplina" />
        <div className="space-y-2.5">
          {FREQ.map((f) => {
            const cor = f.pct >= 90 ? GREEN : f.pct >= 75 ? AMBER : RED;
            return (
              <div key={f.mat} className="card p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold" style={{ color: INK }}>{f.mat}</p>
                  <span className="text-[14px] font-extrabold" style={{ color: cor }}>{f.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: cor }} /></div>
                <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{f.faltas} faltas registradas</p>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}
