import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { AMBER, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function Acompanhamento({ back }: { back: () => void }) {
  const etapas = [
    { t: "Solicitação enviada", d: "01/09 · 09:14", done: true },
    { t: "Em análise", d: "02/09 · 14:30", done: true },
    { t: "Documentação", d: "Aguardando envio de 1 documento", done: false, atual: true },
    { t: "Matrícula confirmada", d: "Pendente", done: false },
  ];
  return (
    <>
      <TopBar title="Acompanhamento" subtitle="Protocolo 2025-MAT-48210" onBack={back} accent={TEAL} />
      <Screen>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Status atual</p><p className="text-[16px] font-bold" style={{ color: AMBER }}>Documentação pendente</p></div>
            <Pill color={AMBER}>Em andamento</Pill>
          </div>
          <p className="mt-2 text-[12px]" style={{ color: INK_SOFT }}>E.M.E.F. Poeta João Ribeiro · 9º ano · Matutino</p>
        </div>
        <SectionHeader title="Linha do tempo" />
        <div className="relative pl-8">
          <span className="absolute bottom-4 left-[11px] top-2 w-0.5" style={{ background: "#e2e8f0" }} />
          <div className="space-y-5">
            {etapas.map((e, i) => (
              <div key={e.t} className="relative">
                <span className="absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full border-2 border-white" style={{ background: e.done ? GREEN : e.atual ? AMBER : "#cbd5e1" }}>
                  {e.done ? <IconCheck size={13} strokeWidth={3} className="text-white" /> : <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <p className="text-[14px] font-bold" style={{ color: e.done || e.atual ? INK : INK_SOFT }}>{e.t}</p>
                <p className="text-[12px]" style={{ color: INK_SOFT }}>{e.d}</p>
                {e.atual && <button className="mt-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: AMBER }}>Enviar documento</button>}
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </>
  );
}
