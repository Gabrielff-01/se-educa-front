import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { SectionHeader } from "@/components/SectionHeader";
import { IconBell, IconBook, IconBus, IconCalendar, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrad, IconGrid, IconPin, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { ALUNO } from "@/data/aluno";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, BLUE_DARK, GREEN, INDIGO, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

export function AlunoHome({ nav }: { nav: (s: ScreenId) => void }) {
  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Calendário", Icon: IconCalendar, cor: "#8b5cf6", s: "calendario" },
    { label: "Chat", Icon: IconChat, cor: "#ec4899", s: "chat" },
    { label: "Tarefas", Icon: IconEdit, cor: INDIGO, s: "tarefas" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
    { label: "Escolas", Icon: IconGrad, cor: TEAL, s: "escolas" },
    { label: "Biblioteca Virtual", Icon: IconBook, cor: INDIGO, s: "biblioteca" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
  ];
  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${BLUE}, ${BLUE_DARK})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name={ALUNO.nome} color="#ffffff" size={46} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-white/75">Olá, bom dia 👋</p>
            <h1 className="truncate text-[17px] font-bold">{ALUNO.nome}</h1>
          </div>
          <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: AMBER }} /></button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2.5 text-[12px]">
          <IconGrad size={16} /><span className="font-semibold">{ALUNO.turma}</span><span className="text-white/60">·</span><span className="truncate text-white/80">{ALUNO.escola}</span>
        </div>
      </div>

      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => nav("notas")} className="card p-3.5 text-left active:scale-[0.98] transition">
            <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Média geral</span><IconStar size={16} className="" /></div>
            <div className="mt-1 text-[26px] font-extrabold" style={{ color: BLUE }}>7,3</div>
            <Pill color={GREEN}>Acima da média</Pill>
          </button>
          <button onClick={() => nav("frequencia")} className="card p-3.5 text-left active:scale-[0.98] transition">
            <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Frequência</span><IconCheck size={16} /></div>
            <div className="mt-1 text-[26px] font-extrabold" style={{ color: GREEN }}>89,6%</div>
            <Pill color={AMBER}>Atenção em Inglês</Pill>
          </button>
        </div>

        <SectionHeader title="Avisos da escola" />
        <div className="card space-y-3 p-4">
          {[{ t: "Semana da Ciência", d: "Inscrições abertas até 10/09.", c: TEAL }, { t: "Merenda escolar", d: "Hoje: carne de panela com macaxeira.", c: GREEN }].map((a) => (
            <div key={a.t} className="flex gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: a.c }} />
              <div><p className="text-[13px] font-semibold" style={{ color: INK }}>{a.t}</p><p className="text-[12px]" style={{ color: INK_SOFT }}>{a.d}</p></div>
            </div>
          ))}
        </div>

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-[11.5px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Próximos eventos" action="Ver tudo" onAction={() => nav("calendario")} />
        <div className="space-y-2.5">
          {[{ d: "08", m: "SET", t: "Prova de Matemática", h: "2ª unidade · 07:00", c: BLUE }, { d: "12", m: "SET", t: "Entrega do trabalho de Ciências", h: "Até 23:59", c: GREEN }, { d: "15", m: "SET", t: "Reunião de pais e mestres", h: "18:30 · Auditório", c: AMBER }].map((e) => (
            <div key={e.t} className="card flex items-center gap-3 p-3">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-center" style={{ background: e.c + "14", color: e.c }}><div><div className="text-[16px] font-extrabold leading-none">{e.d}</div><div className="text-[8px] font-bold">{e.m}</div></div></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold" style={{ color: INK }}>{e.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.h}</p></div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
