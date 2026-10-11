import { useState } from "react";
import { Chips } from "@/components/Chips";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBell, IconChevron } from "@/components/icons";
import { NOTIS_SEC } from "@/data/notificacoes";
import type { NotiSec } from "@/data/notificacoes";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

export function NotificacoesSecretaria({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const [cat, setCat] = useState<("todas" | NotiSec["cat"])[]>(["todas"]);
  const [lidas, setLidas] = useState<string[]>(["n8", "n9", "n10"]);
  const lista = NOTIS_SEC.filter((n) => cat[0] === "todas" || n.cat === cat[0]);
  const naoLidas = NOTIS_SEC.filter((n) => !lidas.includes(n.id)).length;
  const urgentes = NOTIS_SEC.filter((n) => n.cat === "urgente").length;
  return (
    <>
      <TopBar title="Notificações" subtitle={naoLidas ? `${naoLidas} não lidas · Secretaria` : "Tudo em dia"} onBack={back} accent={AMBER} right={<button onClick={() => setLidas(NOTIS_SEC.map((n) => n.id))} className="text-[12px] font-semibold" style={{ color: BLUE }}>Marcar lidas</button>} />
      <Screen>
        <div className="grid grid-cols-3 gap-2">
          {[{ n: urgentes, l: "Urgentes", c: RED }, { n: NOTIS_SEC.filter((x) => x.cat === "prazos").length, l: "Prazos", c: VIOLET }, { n: naoLidas, l: "Não lidas", c: BLUE }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><p className="text-[20px] font-extrabold" style={{ color: k.c }}>{k.n}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</p></div>
          ))}
        </div>
        <div className="mt-3"><Chips items={[{ id: "todas", label: "Todas" }, { id: "urgente", label: "Urgentes" }, { id: "demanda", label: "Demandas" }, { id: "prazos", label: "Prazos" }, { id: "rede", label: "Rede" }]} value={cat} onChange={setCat} cor={AMBER} /></div>
        {lista.length === 0 && <EmptyState title="Nada por aqui" text="Nenhuma notificação nesta categoria." icon={<IconBell size={26} />} />}
        {(["Hoje", "Ontem", "Esta semana"] as const).map((dia) => {
          const grupo = lista.filter((n) => n.dia === dia);
          if (!grupo.length) return null;
          return (
            <div key={dia}>
              <SectionHeader title={dia} />
              <div className="space-y-2.5">
                {grupo.map((n) => {
                  const novo = !lidas.includes(n.id);
                  return (
                    <div key={n.id} onClick={() => setLidas((l) => (l.includes(n.id) ? l : [...l, n.id]))} className="card flex items-start gap-3 p-3.5" style={{ borderLeft: novo ? `3px solid ${n.cor}` : "3px solid transparent" }}>
                      <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: n.cor + "16", color: n.cor }}><n.Icon size={20} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{n.t}</p>{novo && <span className="h-2 w-2 flex-none rounded-full" style={{ background: RED }} />}<span className="ml-auto flex-none text-[11px]" style={{ color: "#94a3b8" }}>{n.h}</span></div>
                        <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>{n.d}</p>
                        {n.acao && <button onClick={(e) => { e.stopPropagation(); nav(n.acao!.s); }} className="mt-2 flex items-center gap-1 text-[12px] font-bold" style={{ color: n.cor }}>{n.acao.label}<IconChevron size={14} /></button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Screen>
    </>
  );
}
