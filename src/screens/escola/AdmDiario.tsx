import { Avatar } from "@/components/Avatar";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { DIARIO_SUP } from "@/data/escola";
import { AMBER, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

export function AdmDiario({ back }: { back: () => void }) {
  const st = (v: string) => (v === "Em dia" ? GREEN : v === "Pendente" ? AMBER : RED);
  return (
    <>
      <TopBar title="Supervisão do diário" subtitle="Lançamentos dos professores" onBack={back} accent={VIOLET} />
      <Screen>
        <div className="grid grid-cols-3 gap-2.5">
          {[{ n: "2", l: "Em dia", c: GREEN }, { n: "1", l: "Pendentes", c: AMBER }, { n: "1", l: "Atrasados", c: RED }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[19px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[10px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <div className="mt-3 space-y-2.5">
          {DIARIO_SUP.map((d) => (
            <div key={d.prof} className="card p-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={d.prof} color={VIOLET} size={36} />
                <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{d.prof}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{d.turma}</p></div>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[["Diário", d.diario], ["Notas", d.notas], ["Frequência", d.freq]].map(([l, v]) => (
                  <div key={l} className="rounded-xl px-2 py-1.5 text-center" style={{ background: st(v) + "14" }}>
                    <div className="text-[9.5px] font-medium" style={{ color: INK_SOFT }}>{l}</div>
                    <div className="text-[10.5px] font-bold" style={{ color: st(v) }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
