import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconUsers } from "@/components/icons";
import { FILA_ENT } from "@/data/secretaria";
import { BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

/* Secretaria — Enturmação */
export function SecEnturmacao({ back }: { back: () => void }) {
  const [feitos, setFeitos] = useState<Record<string, boolean>>({});
  return (
    <>
      <TopBar title="Enturmação" subtitle="Alunos aguardando turma" onBack={back} accent={BLUE} />
      <Screen>
        <div className="flex items-start gap-2 rounded-2xl p-3.5 text-[12.5px]" style={{ background: BLUE + "0d", color: INK }}>
          <IconUsers size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />{FILA_ENT.filter((f) => !feitos[f.nome]).length} alunos na fila de enturmação. Confirme a turma sugerida ou ajuste.
        </div>
        <div className="mt-3 space-y-2.5">
          {FILA_ENT.map((f) => {
            const ok = feitos[f.nome];
            return (
              <div key={f.nome} className="card p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={f.nome} color={ok ? GREEN : BLUE} size={38} />
                  <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{f.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{f.serie} · {f.escola}</p></div>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 rounded-xl px-3 py-2 text-[12px]" style={{ background: "#f4f7fb", color: INK }}>Sugestão: <b>{f.sugestao}</b></div>
                  {ok ? <Pill color={GREEN}>Enturmado</Pill> : <button onClick={() => setFeitos({ ...feitos, [f.nome]: true })} className="rounded-xl px-3.5 py-2 text-[12px] font-semibold text-white" style={{ background: BLUE }}>Enturmar</button>}
                </div>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}
