import { useState } from "react";
import { Pill } from "@/components/Pill";
import { Ring } from "@/components/Ring";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconPlus, IconUsers } from "@/components/icons";
import { CONTRATACOES, IDEB_ESCOLAS } from "@/data/secretaria";
import { AMBER, GREEN, INK, INK_SOFT } from "@/theme/colors";

/* Secretaria — Gestão Pedagógica (acompanhamento + contratações) */
export function SecPedagogico({ back }: { back: () => void }) {
  const [aba, setAba] = useState<"acomp" | "contrat">("acomp");
  return (
    <>
      <TopBar title="Gestão pedagógica" subtitle="Acompanhamento e contratações" onBack={back} accent={GREEN} />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          <button onClick={() => setAba("acomp")} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={aba === "acomp" ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>Acompanhamento</button>
          <button onClick={() => setAba("contrat")} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={aba === "contrat" ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>Contratações</button>
        </div>
      </div>
      <Screen className="pt-3">
        {aba === "acomp" ? (
          <>
            <div className="card flex items-center justify-between p-4">
              <div><p className="text-[12px]" style={{ color: INK_SOFT }}>IDEB médio da rede</p><p className="text-[26px] font-extrabold" style={{ color: GREEN }}>5,8</p></div>
              <Ring value={97} size={64} color={GREEN} label="da meta" />
            </div>
            <SectionHeader title="IDEB por escola" />
            <div className="space-y-2.5">
              {IDEB_ESCOLAS.map((e) => (
                <div key={e.esc} className="card flex items-center gap-3 p-3.5">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-[15px] font-extrabold" style={{ background: e.cor + "16", color: e.cor }}>{e.ideb}</div>
                  <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{e.esc}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Meta: {e.meta}</p></div>
                  <Pill color={e.cor}>{e.cor === GREEN ? "Atingiu" : e.cor === AMBER ? "Próximo" : "Abaixo"}</Pill>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            {CONTRATACOES.map((c) => (
              <div key={c.cargo} className="card p-3.5">
                <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.cargo}</p><Pill color={c.cor}>{c.status}</Pill></div>
                <p className="mt-1 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconUsers size={13} />{c.vagas} vagas de contratação</p>
              </div>
            ))}
            <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: GREEN + "55", color: GREEN }}><IconPlus size={18} />Abrir novo edital</button>
          </div>
        )}
      </Screen>
    </>
  );
}
