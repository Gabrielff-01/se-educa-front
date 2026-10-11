import { Pill } from "@/components/Pill";
import { REGIOES, fmtPct } from "@/data/secretaria";
import { BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function FreqRegioes() {
  const max = Math.max(...REGIOES.map((r) => r.atual));
  const min = Math.min(...REGIOES.map((r) => r.atual));
  const maior = REGIOES.find((r) => r.atual === max)!;
  const menor = REGIOES.find((r) => r.atual === min)!;
  const media = REGIOES.reduce((s, r) => s + r.atual, 0) / REGIOES.length;
  const base = 75;
  const sigla = (r: string) => r.replace("Zona de Expansão", "Exp.").replace("Zona ", "Z. ").replace("N. Sra. do Socorro", "Socorro").replace("São Cristóvão", "S. Crist.").replace("Barra dos Coqueiros", "Barra");
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3.5" style={{ outline: `2px solid ${GREEN}2a` }}><Pill color={GREEN}>Maior frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: GREEN }}>{fmtPct(max)}%</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{maior.r}</p></div>
        <div className="card p-3.5" style={{ outline: `2px solid ${RED}2a` }}><Pill color={RED}>Menor frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: RED }}>{fmtPct(min)}%</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{menor.r}</p></div>
      </div>
      <div className="card mt-3 p-4">
        <div className="mb-3 flex items-center justify-between text-[11px]" style={{ color: INK_SOFT }}>
          <span>Média da rede: <b style={{ color: INK }}>{fmtPct(media)}%</b></span>
          <span className="flex items-center gap-2"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: BLUE }} />Set</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#cbd5e1" }} />Ago</span></span>
        </div>
        <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
          {REGIOES.map((r) => { const c = r.atual === max ? GREEN : r.atual === min ? RED : BLUE; return (
            <div key={r.r} className="flex h-full flex-1 flex-col items-center gap-1">
              <span className="text-[9px] font-bold" style={{ color: c }}>{Math.round(r.atual)}</span>
              <div className="flex w-full flex-1 items-end justify-center gap-[2px]">
                <div className="w-1/3 rounded-t" style={{ height: `${((r.ant - base) / (100 - base)) * 100}%`, background: "#cbd5e1" }} />
                <div className="w-1/2 rounded-t" style={{ height: `${((r.atual - base) / (100 - base)) * 100}%`, background: c }} />
              </div>
              <span className="w-full truncate text-center text-[8.5px]" style={{ color: INK_SOFT }}>{sigla(r.r)}</span>
            </div>
          ); })}
        </div>
        <p className="mt-2 text-[9.5px]" style={{ color: "#94a3b8" }}>Eixo a partir de 75% para destacar as diferenças.</p>
      </div>
      <div className="card mt-3 divide-y">
        {[...REGIOES].sort((a, b) => b.atual - a.atual).map((r) => { const d = r.atual - r.ant; const c = r.atual === max ? GREEN : r.atual === min ? RED : INK; return (
          <div key={r.r} className="flex items-center gap-3 px-4 py-2.5" style={{ borderColor: "#eef2f7" }}>
            <div className="min-w-0 flex-1"><p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.r}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{["Centro", "Zona Sul", "Zona Oeste", "Zona Norte", "Zona de Expansão"].includes(r.r) ? "Aracaju" : "Grande Aracaju"} · ago {fmtPct(r.ant)}%</p></div>
            <span className="text-[13px] font-extrabold" style={{ color: c }}>{fmtPct(r.atual)}%</span>
            <span className="w-14 text-right text-[11px] font-bold" style={{ color: d >= 0 ? GREEN : RED }}>{d >= 0 ? "▲" : "▼"} {fmtPct(Math.abs(d))}</span>
          </div>
        ); })}
      </div>
    </>
  );
}
