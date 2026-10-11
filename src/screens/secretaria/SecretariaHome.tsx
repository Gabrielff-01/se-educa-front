import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { IconChart, IconChat, IconChevron, IconClock, IconEdit, IconGrad, IconGrid, IconTrend, IconUsers } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { FreqRegioes } from "@/screens/secretaria/FreqRegioes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";
import type { EscCtx } from "@/types";

export function SecretariaHome({ nav, abrirEscolas }: { nav: (s: ScreenId) => void; abrirEscolas: (c: EscCtx) => void }) {
  return (
    <>
      <ProfileHeader nome="Gestor Rafael Andrade" sub="Secretaria Municipal de Educação" cor={AMBER} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <SectionHeader title="Panorama da rede" />
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "127", l: "Escolas", c: BLUE, x: "todas" as EscCtx }, { n: "48.320", l: "Alunos", c: TEAL, x: "alunos" as EscCtx }, { n: "3.140", l: "Servidores", c: GREEN, x: "servidores" as EscCtx }, { n: "1.284", l: "Vagas abertas", c: AMBER, x: "vagas" as EscCtx }].map((k) => (
            <button key={k.l} onClick={() => abrirEscolas(k.x)} className="card p-4 text-left active:scale-[0.98] transition"><div className="flex items-start justify-between"><div className="text-[23px] font-extrabold" style={{ color: k.c }}>{k.n}</div><IconChevron size={16} style={{ color: "#cbd5e1" }} /></div><div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div></button>
          ))}
        </div>
        <button onClick={() => nav("secPesquisas")} className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left" style={{ outline: `2px solid ${RED}2a` }}>
          <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: RED + "14", color: RED }}><IconTrend size={21} /></div>
          <div className="flex-1"><p className="text-[13px] font-bold" style={{ color: INK }}>+62% em buscas por vagas especiais</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Pesquisas recentes · ver análise</p></div>
          <IconChevron size={18} style={{ color: "#cbd5e1" }} />
        </button>
        <SectionHeader title="Frequência por região" action="Setembro/2025" />
        <FreqRegioes />
        <SectionHeader title="Gestão pedagógica" />
        <div className="space-y-2.5">
          {[{ t: "IDEB da rede", v: "5,8", d: "Meta 6,0 · +0,3 no ano", c: GREEN }, { t: "Alfabetização (2º ano)", v: "81%", d: "no nível adequado", c: BLUE }, { t: "Distorção idade-série", v: "9,4%", d: "-1,2 p.p.", c: AMBER }].map((i) => (
            <div key={i.t} className="card flex items-center gap-3 p-3.5">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-[15px] font-extrabold" style={{ background: i.c + "16", color: i.c }}>{i.v}</div>
              <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{i.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{i.d}</p></div>
              <IconChart size={20} className="" style={{ color: i.c } as any} />
            </div>
          ))}
        </div>
        <SectionHeader title="Módulos" />
        <div className="grid grid-cols-3 gap-3">
          {[{ t: "Matrículas", Icon: IconEdit, s: "secMatriculas" as ScreenId }, { t: "Enturmação", Icon: IconUsers, s: "secEnturmacao" as ScreenId }, { t: "Pedagógico", Icon: IconGrad, s: "secPedagogico" as ScreenId }, { t: "Carga horária", Icon: IconClock, s: "secCargaHoraria" as ScreenId }, { t: "Escolas", Icon: IconGrid, s: "escolas" as ScreenId }, { t: "Regional", Icon: IconChat, s: "secRegional" as ScreenId }, { t: "Pesquisas", Icon: IconTrend, s: "secPesquisas" as ScreenId }].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: AMBER + "16", color: AMBER }}><a.Icon size={20} /></div>
              <span className="text-[10.5px] font-semibold" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
