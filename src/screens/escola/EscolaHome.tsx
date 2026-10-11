import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBook, IconCheck, IconClock, IconEdit, IconFood, IconGrid, IconPin, IconPlus, IconShield, IconUsers } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, PINK, RED, TEAL, VIOLET } from "@/theme/colors";

export function EscolaHome({ nav }: { nav: (s: ScreenId) => void }) {
  return (
    <>
      <ProfileHeader nome="Diretora Márcia Lopes" sub="E.M.E.F. Poeta João Ribeiro" cor={GREEN} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <SectionHeader title="Indicadores" />
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "842", l: "Alunos matriculados", c: BLUE, sub: "+18 este mês" }, { n: "48", l: "Professores", c: TEAL, sub: "3 novos" }, { n: "24", l: "Turmas ativas", c: GREEN, sub: "6 turnos" }, { n: "92%", l: "Frequência média", c: AMBER, sub: "meta 90%" }].map((k) => (
            <div key={k.l} className="card p-4"><div className="text-[24px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[12px] font-medium" style={{ color: INK }}>{k.l}</div><div className="text-[11px]" style={{ color: GREEN }}>{k.sub}</div></div>
          ))}
        </div>
        <SectionHeader title="Matrículas por status" />
        <div className="card p-4">
          {[{ l: "Confirmadas", v: 842, max: 900, c: GREEN }, { l: "Em análise", v: 36, max: 900, c: AMBER }, { l: "Vagas restantes", v: 58, max: 900, c: BLUE }].map((b) => (
            <div key={b.l} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: INK }}>{b.l}</span><span className="font-bold" style={{ color: b.c }}>{b.v}</span></div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${(b.v / b.max) * 100}%`, background: b.c }} /></div>
            </div>
          ))}
        </div>
        <SectionHeader title="Gestão" />
        <div className="grid grid-cols-3 gap-3">
          {[{ t: "Matrículas", Icon: IconEdit, c: AMBER, s: "admMatriculas" as ScreenId }, { t: "Professores", Icon: IconUsers, c: TEAL, s: "admProfessores" as ScreenId }, { t: "Turmas", Icon: IconGrid, c: GREEN, s: "admTurmas" as ScreenId }, { t: "Horários", Icon: IconClock, c: BLUE, s: "admHorarios" as ScreenId }, { t: "Diário", Icon: IconCheck, c: VIOLET, s: "admDiario" as ScreenId }, { t: "Boletins", Icon: IconBook, c: PINK, s: "admBoletins" as ScreenId }, { t: "Add. turmas", Icon: IconPlus, c: TEAL, s: "admTurmas" as ScreenId }, { t: "Escolas", Icon: IconPin, c: RED, s: "escolas" as ScreenId }, { t: "Merenda", Icon: IconFood, c: AMBER, s: "merenda" as ScreenId }, { t: "Freq. programas", Icon: IconShield, c: GREEN, s: "gestorFreqSocial" as ScreenId }, { t: "Pendências", Icon: IconAlert, c: RED, s: "gestorPendencias" as ScreenId }].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
              <span className="text-[11px] font-semibold" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
