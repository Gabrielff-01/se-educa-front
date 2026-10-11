import { IconBell, IconBook, IconGrad, IconGrid, IconHome, IconUser } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";
import type { TabId } from "@/types";

/* Navegação principal (responsiva): no celular é uma barra fixa embaixo; no tablet vira uma coluna
   de ícones à esquerda; no desktop (lg) vira um menu lateral com os nomes. */
export function BottomNav({ active, onChange, badge = 3 }: { active: TabId; onChange: (t: TabId) => void; badge?: number }) {
  const items: { id: TabId; label: string; Icon: (p: IconProps) => React.ReactElement }[] = [
    { id: "inicio", label: "Início", Icon: IconHome },
    { id: "academico", label: "Acadêmico", Icon: IconBook },
    { id: "servicos", label: "Serviços", Icon: IconGrid },
    { id: "notificacoes", label: "Notificações", Icon: IconBell },
    { id: "perfil", label: "Perfil", Icon: IconUser },
  ];
  return (
    <nav className="border-t border-[color:var(--color-line)] bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:order-first md:w-24 md:flex-none md:border-t-0 md:border-r md:px-3 md:py-6 lg:w-60">
      <div className="mb-8 hidden items-center justify-center gap-2 md:flex lg:justify-start lg:px-2">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={22} strokeWidth={2} /></div>
        <p className="hidden text-[17px] font-extrabold lg:block" style={{ color: INK }}><span style={{ color: GREEN }}>SE</span> Educa</p>
      </div>
      <div className="flex items-stretch justify-between md:flex-col md:justify-start md:gap-1">
        {items.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => onChange(id)} className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition active:scale-95 md:flex-none md:py-3 lg:flex-row lg:gap-3 lg:px-3 ${on ? "md:bg-[#1a6fd414]" : ""}`} style={{ color: on ? BLUE : INK_SOFT }}>
              <div className="relative">
                <Icon size={23} strokeWidth={on ? 2.2 : 1.7} />
                {id === "notificacoes" && badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: RED }}>{badge}</span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none lg:text-[14px] lg:font-semibold">{label}</span>
              {on && <span className="absolute -top-2 h-1 w-8 rounded-full md:hidden" style={{ background: BLUE }} />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
