import { useState } from "react";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconFood, IconShield } from "@/components/icons";
import { ALUNO, CARDAPIO, DIAS } from "@/data/aluno";
import { AMBER, BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

export function Merenda({ back }: { back: () => void }) {
  const [dia, setDia] = useState("SEG");
  const c = CARDAPIO[dia];
  const Bloco = ({ titulo, h, itens, cor }: { titulo: string; h: string; itens: string[]; cor: string }) => (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4" style={{ background: cor + "10" }}>
        <div className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: cor }}><IconFood size={21} /></div>
        <div className="flex-1"><p className="text-[15px] font-bold" style={{ color: INK }}>{titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{h}</p></div>
      </div>
      <ul className="divide-y px-4" style={{ borderColor: "#eef2f7" }}>
        {itens.map((i) => <li key={i} className="flex items-center gap-2.5 py-2.5 text-[13px]" style={{ color: INK }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: cor }} />{i}</li>)}
      </ul>
    </div>
  );
  return (
    <>
      <TopBar title="Merenda escolar" subtitle={`Cardápio · ${ALUNO.escola}`} onBack={back} accent={GREEN} />
      <Screen>
        <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {DIAS.map((d, i) => (
            <button key={d} onClick={() => setDia(d)} className="rounded-xl py-2 text-center transition" style={dia === d ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>
              <p className="text-[10px] font-bold">{d}</p><p className="text-[15px] font-extrabold">{8 + i}</p>
            </button>
          ))}
        </div>
        {dia === "SEG" && <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold" style={{ color: GREEN }}><span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />Cardápio de hoje</div>}
        <div className="mt-3 space-y-3">
          <Bloco titulo="Lanche da manhã" h="09:20 · Pátio" itens={c.lanche} cor={AMBER} />
          <Bloco titulo="Almoço" h="11:30 · Refeitório" itens={c.almoco} cor={GREEN} />
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: BLUE + "0e" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />
          <p className="text-[12px] leading-relaxed" style={{ color: INK }}>Cardápio elaborado por nutricionista da rede (PNAE). Alunos com restrição alimentar recebem refeição adaptada — informe na secretaria.</p>
        </div>
      </Screen>
    </>
  );
}
