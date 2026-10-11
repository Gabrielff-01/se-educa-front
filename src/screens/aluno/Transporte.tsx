import { useState } from "react";
import { Chips } from "@/components/Chips";
import { MapCanvas } from "@/components/MapCanvas";
import { MapSearch } from "@/components/MapSearch";
import { RouteButton } from "@/components/RouteButton";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBus } from "@/components/icons";
import { PARADAS, ROTA_BUS } from "@/data/mapas";
import { AMBER, BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

export function Transporte({ back }: { back: () => void }) {
  const [linha, setLinha] = useState<("L014" | "L022")[]>(["L014"]);
  const rastreio = linha[0] === "L014";
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MapCanvas pins={[{ id: "esc", x: 245, y: 125, label: "Sua escola" }]} selected="esc" route={ROTA_BUS} stops={PARADAS.slice(0, -1).map((p) => ({ x: p.x, y: p.y, on: p.passou }))} bus={rastreio ? { x: 140, y: 198 } : undefined} height={310}>
        <MapSearch placeholder="Transporte escolar · Linha" onBack={back} />
        <div className="absolute left-3 right-3 top-[60px]">
          <Chips items={[{ id: "L014", label: "L-014 · Zona Sul ↔ Escola" }, { id: "L022", label: "L-022 · Santa Maria" }]} value={linha} onChange={setLinha} cor={GREEN} />
        </div>
      </MapCanvas>
      <div className="scroll-area animate-in -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-2 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
        {rastreio ? (
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: GREEN }}><IconBus size={24} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 animate-pulse rounded-full" style={{ background: GREEN }} /><span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>Ao vivo</span></div>
                <p className="text-[15px] font-bold" style={{ color: INK }}>Ônibus chega em 7 min</p>
                <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Próxima parada: Av. Beira Mar · Jardins</p>
              </div>
              <div className="text-right"><p className="text-[22px] font-extrabold leading-none" style={{ color: GREEN }}>06:31</p><p className="text-[10px]" style={{ color: INK_SOFT }}>previsão</p></div>
            </div>
            <div className="grid grid-cols-3 border-t text-center text-[11px]" style={{ borderColor: "#eef2f7", color: INK_SOFT }}>
              <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>QPA-4E21</p>Placa</div>
              <div className="border-x py-2.5" style={{ borderColor: "#eef2f7" }}><p className="text-[13px] font-bold" style={{ color: INK }}>Seu José</p>Motorista</div>
              <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>28/40</p>Lotação</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl p-3.5" style={{ background: AMBER + "14" }}>
            <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: AMBER }} />
            <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Esta linha ainda <b>não possui rastreamento</b> em tempo real. Confira abaixo os horários programados.</p>
          </div>
        )}
        <SectionHeader title={rastreio ? "Pontos de parada" : "Horários da linha"} />
        {rastreio ? (
          <div className="card p-4">
            {PARADAS.map((p, i) => (
              <div key={p.nome} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 rounded-full border-[3px]" style={{ borderColor: p.passou ? GREEN : BLUE, background: i === PARADAS.length - 1 ? BLUE : "#fff" }} />
                  {i < PARADAS.length - 1 && <span className="w-0.5 flex-1" style={{ background: p.passou ? GREEN : "#dbe3ee", minHeight: 26 }} />}
                </div>
                <div className="flex flex-1 justify-between pb-3">
                  <p className="text-[12.5px]" style={{ color: p.passou ? INK_SOFT : INK, fontWeight: i === 3 ? 700 : 500 }}>{p.nome}</p>
                  <span className="text-[12px] font-semibold" style={{ color: p.passou ? "#94a3b8" : INK }}>{p.h}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card divide-y" style={{ borderColor: "#eef2f7" }}>
            {[{ t: "Ida · manhã", h: ["05:50", "06:20", "06:50"] }, { t: "Volta · meio-dia", h: ["11:40", "12:10"] }, { t: "Ida · tarde", h: ["12:20", "12:50"] }, { t: "Volta · fim da tarde", h: ["17:30", "18:00"] }].map((r) => (
              <div key={r.t} className="flex items-center justify-between p-3.5">
                <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.t}</p>
                <div className="flex gap-1.5">{r.h.map((h) => <span key={h} className="rounded-lg px-2 py-1 text-[11.5px] font-bold" style={{ background: GREEN + "14", color: GREEN }}>{h}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2"><RouteButton lat={-10.9112} lng={-37.0510} label="Rota até a parada" /></div>
      </div>
    </div>
  );
}
