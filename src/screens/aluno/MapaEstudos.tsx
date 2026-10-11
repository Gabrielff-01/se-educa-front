import { useState } from "react";
import { Chips } from "@/components/Chips";
import { MapCanvas } from "@/components/MapCanvas";
import { MapSearch } from "@/components/MapSearch";
import { Pill } from "@/components/Pill";
import { RouteButton } from "@/components/RouteButton";
import { SectionHeader } from "@/components/SectionHeader";
import { IconClock, IconPin, IconRoute, IconStar } from "@/components/icons";
import { LOCAIS, TIPO_LABEL } from "@/data/mapas";
import type { LocalTipo } from "@/data/mapas";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

export function MapaEstudos({ back }: { back: () => void }) {
  const [filtro, setFiltro] = useState<("todos" | LocalTipo)[]>(["todos"]);
  const [sel, setSel] = useState("l1");
  const lista = LOCAIS.filter((l) => filtro[0] === "todos" || l.tipo === filtro[0]);
  const local = LOCAIS.find((l) => l.id === sel) ?? LOCAIS[0];
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MapCanvas pins={lista.map((l) => ({ id: l.id, x: l.x, y: l.y, label: l.nome.split(" ").slice(0, 2).join(" ") }))} selected={sel} onSelect={setSel} height={330}>
        <MapSearch placeholder="Buscar locais de estudo" onBack={back} />
        <div className="absolute left-3 right-3 top-[60px]">
          <Chips items={[{ id: "todos", label: "Todos" }, { id: "biblioteca", label: "Bibliotecas" }, { id: "coworking", label: "Coworkings" }, { id: "cultural", label: "Cultural" }, { id: "praca", label: "Ao ar livre" }]} value={filtro} onChange={setFiltro} />
        </div>
      </MapCanvas>
      <div className="scroll-area animate-in -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-2 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RED }}>{TIPO_LABEL[local.tipo]}</p>
          <h2 className="mt-0.5 text-[17px] font-bold leading-snug" style={{ color: INK }}>{local.nome}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: INK_SOFT }}>
            <span className="font-bold" style={{ color: INK }}>{local.nota.toLocaleString("pt-BR")}</span><IconStar size={13} style={{ color: AMBER }} /><span>·</span><span>{local.dist}</span><span>·</span>
            <span className="font-semibold" style={{ color: local.aberto ? GREEN : RED }}>{local.aberto ? "Aberto agora" : "Fechado"}</span>
          </div>
          <div className="mt-3 space-y-1.5 text-[12.5px]" style={{ color: INK }}>
            <p className="flex items-center gap-2"><IconPin size={15} style={{ color: INK_SOFT }} />{local.end}</p>
            <p className="flex items-center gap-2"><IconClock size={15} style={{ color: INK_SOFT }} />{local.horario} · seg a sáb</p>
            <p className="flex items-center gap-2"><IconRoute size={15} style={{ color: INK_SOFT }} />{local.min}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{local.wifi && <Pill color={TEAL}>Wi-Fi gratuito</Pill>}<Pill color={VIOLET}>Silencioso</Pill><Pill color={GREEN}>Acessível</Pill></div>
          <div className="mt-4 flex gap-2">
            <RouteButton lat={local.lat} lng={local.lng} />
            <button className="rounded-full border px-4 text-[13px] font-semibold" style={{ borderColor: "#cbd5e1", color: BLUE }}>Salvar</button>
          </div>
        </div>
        <SectionHeader title={`${lista.length} locais próximos`} />
        <div className="space-y-2">
          {lista.map((l) => (
            <button key={l.id} onClick={() => setSel(l.id)} className="card flex w-full items-center gap-3 p-3 text-left transition" style={l.id === sel ? { outline: `2px solid ${RED}40` } : undefined}>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: RED + "14", color: RED }}><IconPin size={20} /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{l.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{l.dist} · {l.horario}</p></div>
              <span className="text-[11px] font-semibold" style={{ color: l.aberto ? GREEN : RED }}>{l.aberto ? "Aberto" : "Fechado"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
