import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { BOLETINS_ADM } from "@/data/escola";
import { AMBER, INK, INK_SOFT } from "@/theme/colors";

export function AdmBoletins({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Boletins" subtitle="Fechamento da 2ª unidade" onBack={back} accent={AMBER} />
      <Screen>
        <div className="space-y-2.5">
          {BOLETINS_ADM.map((b) => (
            <div key={b.turma} className="card p-4">
              <div className="flex items-center justify-between"><p className="text-[14px] font-bold" style={{ color: INK }}>{b.turma}</p><Pill color={b.cor}>{b.status}</Pill></div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.cor }} /></div>
                <span className="text-[11.5px] font-bold" style={{ color: b.cor }}>{b.pct}%</span>
              </div>
              <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>{b.pct === 100 ? "Todas as notas lançadas" : "Notas lançadas"}</p>
              {b.status !== "Publicado" && <button className="mt-2.5 w-full rounded-xl py-2.5 text-[12.5px] font-semibold text-white" style={{ background: b.cor }}>{b.status === "Em fechamento" ? "Publicar boletim" : "Fechar unidade"}</button>}
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
