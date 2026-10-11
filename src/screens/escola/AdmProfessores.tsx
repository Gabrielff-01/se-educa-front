import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconPlus, IconSearch } from "@/components/icons";
import { PROFESSORES } from "@/data/escola";
import { INK, INK_SOFT, TEAL } from "@/theme/colors";

export function AdmProfessores({ back }: { back: () => void }) {
  const [q, setQ] = useState("");
  const list = PROFESSORES.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()) || p.disc.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <TopBar title="Professores" subtitle="Quadro docente · 48 no total" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou disciplina" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        <div className="mt-3 space-y-2.5">
          {list.map((p) => (
            <div key={p.nome} className="card flex items-center gap-3 p-3.5">
              <Avatar name={p.nome} color={TEAL} size={40} />
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{p.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.disc} · {p.turmas} turmas · {p.carga}h/sem</p></div>
              <Pill color={p.cor}>{p.status}</Pill>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
