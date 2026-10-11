import { useEffect } from "react";
import { IconGrad } from "@/components/icons";
import { BLUE, BLUE_DARK, TEAL } from "@/theme/colors";

export function Splash({ go }: { go: () => void }) {
  useEffect(() => { const t = setTimeout(go, 2200); return () => clearTimeout(t); }, [go]);
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden text-white" style={{ background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE_DARK} 55%, ${TEAL} 130%)` }}>
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full" style={{ background: "#ffffff18" }} />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-72 w-72 rounded-full" style={{ background: "#ffffff10" }} />
      <div className="animate-in flex flex-col items-center">
        <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-white shadow-2xl">
          <IconGrad size={54} className="" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight"><span style={{ color: "#9ae6c4" }}>SE</span> Educa</h1>
        <p className="mt-3 max-w-[240px] text-center text-[14px] font-medium leading-relaxed text-white/85">Educação conectada, simples e acessível.</p>
      </div>
      <div className="absolute bottom-14 flex flex-col items-center gap-3">
        <div className="spinner h-6 w-6 rounded-full border-2 border-white/30 border-t-white" />
        <p className="text-[11px] text-white/70">Secretaria de Educação · Sergipe</p>
      </div>
    </div>
  );
}
