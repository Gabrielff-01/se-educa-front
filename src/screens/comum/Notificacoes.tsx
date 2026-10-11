import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconCalendar, IconChat, IconCheck, IconStar } from "@/components/icons";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

export function Notificacoes({ back }: { back: () => void }) {
  const notis = [
    { t: "Nova nota lançada", d: "Matemática · 2ª unidade: 8,5", h: "Há 10 min", Icon: IconStar, cor: BLUE, novo: true },
    { t: "Falta registrada", d: "Inglês · 03/09", h: "Há 2 h", Icon: IconAlert, cor: AMBER, novo: true },
    { t: "Mensagem da escola", d: "Reunião de pais confirmada para 15/09", h: "Ontem", Icon: IconChat, cor: TEAL, novo: true },
    { t: "Documento aprovado", d: "Comprovante de residência validado", h: "2 dias", Icon: IconCheck, cor: GREEN, novo: false },
    { t: "Calendário atualizado", d: "Feriado municipal em 08/09", h: "3 dias", Icon: IconCalendar, cor: "#8b5cf6", novo: false },
  ];
  return (
    <>
      <TopBar title="Notificações" subtitle="3 não lidas" onBack={back} accent={RED} right={<button className="text-[12px] font-semibold" style={{ color: BLUE }}>Marcar lidas</button>} />
      <Screen>
        <SectionHeader title="Hoje" />
        <div className="space-y-2.5">
          {notis.map((n) => (
            <div key={n.t} className="card flex items-start gap-3 p-3.5" style={{ borderLeft: n.novo ? `3px solid ${n.cor}` : "3px solid transparent" }}>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: n.cor + "16", color: n.cor }}><n.Icon size={20} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{n.t}</p>{n.novo && <span className="h-2 w-2 rounded-full" style={{ background: RED }} />}</div>
                <p className="text-[12px]" style={{ color: INK_SOFT }}>{n.d}</p>
                <p className="mt-1 text-[11px]" style={{ color: "#94a3b8" }}>{n.h}</p>
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
