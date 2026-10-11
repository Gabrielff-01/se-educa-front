import { IconLayers, IconTarget } from "@/components/icons";
import { BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

export type MapPin = { id: string; x: number; y: number; cor?: string; label?: string };

export function MapCanvas({ pins, selected, onSelect, route, stops, bus, height = 300, children }: { pins: MapPin[]; selected?: string; onSelect?: (id: string) => void; route?: string; stops?: { x: number; y: number; on?: boolean }[]; bus?: { x: number; y: number }; height?: number; children?: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height, background: "#eef0e6" }}>
      <svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* oceano e Rio Sergipe */}
        <path d="M330 0h70v360h-110c20-60 10-120 30-180S320 40 330 0Z" fill="#aadaff" />
        <path d="M0 40c60 10 110-5 160 10s90 20 175-5l-5 25c-80 25-120 15-170 5S50 70 0 66Z" fill="#aadaff" />
        {/* parques */}
        <rect x="40" y="150" width="70" height="50" rx="10" fill="#c8e6c0" />
        <path d="M200 250c30-10 60 0 70 25s-30 40-60 30-40-45-10-55Z" fill="#c8e6c0" />
        <rect x="250" y="95" width="40" height="34" rx="8" fill="#d7ecd0" />
        {/* quadras */}
        <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
          {[100, 140, 190, 230, 280, 320].map((y) => <path key={y} d={`M0 ${y} L320 ${y - 8}`} />)}
          {[30, 80, 130, 180, 230, 275].map((x) => <path key={x} d={`M${x} 70 L${x + 12} 360`} />)}
        </g>
        {/* avenidas */}
        <path d="M0 210 C90 200 180 180 300 140" stroke="#f9d977" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M0 210 C90 200 180 180 300 140" stroke="#fde9a8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M160 70 C150 160 170 260 150 360" stroke="#f9d977" strokeWidth="10" fill="none" />
        <path d="M160 70 C150 160 170 260 150 360" stroke="#fde9a8" strokeWidth="6" fill="none" />
        <path d="M305 40 C290 140 300 240 285 360" stroke="#ffffff" strokeWidth="9" fill="none" />
        <g fontSize="8" fill="#7b8794" fontFamily="Inter" fontWeight="600">
          <text x="20" y="200" transform="rotate(-6 20 200)">Av. Hermes Fontes</text>
          <text x="166" y="300" transform="rotate(-82 166 300)">Av. Beira Mar</text>
          <text x="200" y="35" fill="#4f86c6" fontStyle="italic">Rio Sergipe</text>
          <text x="345" y="200" fill="#4f86c6" fontStyle="italic" transform="rotate(90 345 200)">Oceano Atlântico</text>
          <text x="52" y="180" fill="#5f8f55">Parque da Sementeira</text>
        </g>
        {route && (<><path d={route} stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={route} stroke={BLUE} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>)}
        {stops?.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="5" fill="#fff" stroke={s.on ? GREEN : BLUE} strokeWidth="3" />)}
        {bus && (
          <g transform={`translate(${bus.x} ${bus.y})`}>
            <circle r="16" fill={GREEN} opacity=".18"><animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" /></circle>
            <circle r="10" fill={GREEN} stroke="#fff" strokeWidth="2.5" />
            <rect x="-4.5" y="-5" width="9" height="8" rx="1.5" fill="#fff" /><rect x="-3" y="-3.5" width="6" height="2.5" fill={GREEN} />
          </g>
        )}
        {/* você está aqui */}
        <circle cx="120" cy="245" r="14" fill={BLUE} opacity=".15" />
        <circle cx="120" cy="245" r="6" fill={BLUE} stroke="#fff" strokeWidth="2.5" />
        {pins.map((p) => {
          const on = selected === p.id;
          const s = on ? 1.35 : 1;
          return (
            <g key={p.id} transform={`translate(${p.x} ${p.y}) scale(${s})`} onClick={() => onSelect?.(p.id)} style={{ cursor: "pointer", transition: "transform .2s" }}>
              <ellipse cx="0" cy="1" rx="5" ry="2" fill="#000" opacity=".18" />
              <path d="M0 0C-3-6-10-10-10-17a10 10 0 0 1 20 0c0 7-7 11-10 17Z" fill={p.cor ?? "#ea4335"} stroke="#a52714" strokeWidth=".8" />
              <circle cx="0" cy="-17" r="3.6" fill={on ? "#fff" : "#7c1a10"} />
              {on && p.label && (
                <g transform="translate(0 -36) scale(0.74)">
                  <rect x={-p.label.length * 3.1 - 8} y="-11" width={p.label.length * 6.2 + 16} height="18" rx="9" fill="#fff" stroke="#e2e8f0" />
                  <text textAnchor="middle" y="2" fontSize="10" fontWeight="700" fill={INK} fontFamily="Inter">{p.label}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-md" style={{ color: INK_SOFT }} aria-label="Camadas"><IconLayers size={18} /></button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-md" style={{ color: BLUE }} aria-label="Minha localização"><IconTarget size={18} /></button>
      </div>
      {children}
    </div>
  );
}
