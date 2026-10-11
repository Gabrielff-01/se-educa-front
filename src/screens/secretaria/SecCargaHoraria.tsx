import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { CARGA_HOR } from "@/data/secretaria";
import { INK, INK_SOFT, TEAL } from "@/theme/colors";

/* Secretaria — Controle de Carga Horária */
export function SecCargaHoraria({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Carga horária" subtitle="Contratada × cumprida" onBack={back} accent={TEAL} />
      <Screen>
        <div className="space-y-2.5">
          {CARGA_HOR.map((c) => {
            const pct = Math.round((c.cumprida / c.contratada) * 100);
            const label = pct > 100 ? "Excedente" : pct >= 95 ? "Regular" : "Déficit";
            return (
              <div key={c.esc} className="card p-4">
                <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.esc}</p><Pill color={c.cor}>{label}</Pill></div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: c.cor }} /></div>
                  <span className="text-[11.5px] font-bold" style={{ color: c.cor }}>{pct}%</span>
                </div>
                <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{c.cumprida}h cumpridas de {c.contratada}h contratadas</p>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}
