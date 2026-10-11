import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconPlus, IconSearch } from "@/components/icons";
import { MATRICULAS_ADM } from "@/data/escola";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function AdmMatriculas({ back }: { back: () => void }) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const list = MATRICULAS_ADM.filter((m) => m.nome.toLowerCase().includes(q.toLowerCase()) && (filtro === "Todas" || m.status === filtro));
  return (
    <>
      <TopBar title="Matrículas" subtitle="E.M.E.F. Poeta João Ribeiro" onBack={back} accent={GREEN} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: GREEN }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="grid grid-cols-3 gap-2.5">
          {[{ n: "842", l: "Confirmadas", c: GREEN }, { n: "36", l: "Em análise", c: AMBER }, { n: "8", l: "Pendentes", c: RED }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[19px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[10px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        <div className="scroll-area mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todas", "Confirmada", "Em análise", "Pendente"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        {list.length === 0 ? <EmptyState title="Nenhum aluno" text="Ajuste a busca ou os filtros." icon={<IconSearch size={26} />} /> : (
          <div className="mt-3 card divide-y divide-[color:var(--color-line)]">
            {list.map((m) => (
              <div key={m.nome} className="flex items-center gap-3 px-3.5 py-3">
                <Avatar name={m.nome} color={m.cor} size={36} />
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{m.nome}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{m.turma}</p></div>
                <Pill color={m.cor}>{m.status}</Pill>
              </div>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
