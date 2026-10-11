import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { REDE_MATR } from "@/data/secretaria";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

/* Secretaria — Matrículas da rede */
export function SecMatriculas({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Matrículas da rede" subtitle="Rede municipal · 2025" onBack={back} accent={AMBER} />
      <Screen>
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "48.320", l: "Confirmadas", c: GREEN }, { n: "1.284", l: "Vagas abertas", c: BLUE }, { n: "373", l: "Em fila de espera", c: AMBER }, { n: "127", l: "Escolas", c: TEAL }].map((k) => (
            <div key={k.l} className="card p-4"><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <SectionHeader title="Por município" />
        <div className="space-y-2.5">
          {REDE_MATR.map((r) => (
            <div key={r.reg} className="card p-3.5">
              <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{r.reg}</p><span className="text-[12px] font-semibold" style={{ color: GREEN }}>{r.conf}</span></div>
              <div className="mt-1.5 flex items-center gap-3 text-[11.5px]" style={{ color: INK_SOFT }}>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />{r.vagas} vagas</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: AMBER }} />{r.fila} na fila</span>
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
