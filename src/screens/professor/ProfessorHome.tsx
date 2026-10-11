import { Pill } from "@/components/Pill";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { IconBell, IconBook, IconCheck, IconDoc, IconEdit, IconStar } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, TEAL, VIOLET } from "@/theme/colors";

export function ProfessorHome({ nav }: { nav: (s: ScreenId) => void }) {
  return (
    <>
      <ProfileHeader nome="Prof. Carlos Menezes" sub="Matemática · 5 turmas" cor={TEAL} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[{ n: "142", l: "Alunos", c: TEAL }, { n: "5", l: "Turmas", c: BLUE }, { n: "8", l: "Pendências", c: AMBER }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <SectionHeader title="Ações do dia" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "Registrar frequência", Icon: IconCheck, c: GREEN, s: "profFrequencia" as ScreenId },
            { t: "Lançar notas", Icon: IconStar, c: BLUE, s: "profNotas" as ScreenId },
            { t: "Plano de aula", Icon: IconBook, c: TEAL, s: "profPlanejamento" as ScreenId },
            { t: "Diário de classe", Icon: IconEdit, c: VIOLET, s: "profDiario" as ScreenId },
            { t: "Tarefas", Icon: IconDoc, c: AMBER, s: "tarefas" as ScreenId },
            { t: "Comunicados", Icon: IconBell, c: PINK, s: "comunicados" as ScreenId },
          ].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex items-center gap-2.5 p-3.5 text-left active:scale-[0.98] transition">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
              <span className="text-[12.5px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
        <SectionHeader title="Minhas turmas" />
        <div className="space-y-2.5">
          {[{ t: "9º ano B", a: 32, freq: "presente", h: "07:00 · Sala 12" }, { t: "8º ano A", a: 29, freq: "pendente", h: "08:40 · Sala 09" }, { t: "7º ano C", a: 31, freq: "pendente", h: "10:20 · Sala 05" }].map((t) => (
            <button key={t.t} onClick={() => nav("profFrequencia")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.98] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-[13px] font-extrabold" style={{ background: TEAL + "16", color: TEAL }}>{t.t.split(" ")[0]}</div>
              <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{t.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{t.a} alunos · {t.h}</p></div>
              {t.freq === "pendente" ? <Pill color={AMBER}>Frequência</Pill> : <Pill color={GREEN}>Registrada</Pill>}
            </button>
          ))}
        </div>
        <SectionHeader title="Avisos e planejamento" />
        <div className="card space-y-3 p-4">
          {[{ t: "Prova da 2ª unidade", d: "Aplicar até 12/09 nas turmas do 9º ano", c: BLUE }, { t: "Conselho de classe", d: "18/09 · 14h · Sala dos professores", c: TEAL }].map((a) => (
            <div key={a.t} className="flex gap-3"><span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: a.c }} /><div><p className="text-[13px] font-semibold" style={{ color: INK }}>{a.t}</p><p className="text-[12px]" style={{ color: INK_SOFT }}>{a.d}</p></div></div>
          ))}
        </div>
      </div>
    </>
  );
}
