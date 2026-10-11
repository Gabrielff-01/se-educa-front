import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBell, IconBook, IconBus, IconCalendar, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrid, IconPin, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { ALUNO, COMUNICADOS } from "@/data/aluno";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PINK, RED, TEAL, VIOLET, shade } from "@/theme/colors";

export function ResponsavelHome({ nav }: { nav: (s: ScreenId) => void }) {
  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Tarefas", Icon: IconEdit, cor: VIOLET, s: "tarefas" },
    { label: "Calendário", Icon: IconCalendar, cor: "#0ea5e9", s: "calendario" },
    { label: "Histórico", Icon: IconBook, cor: INDIGO, s: "historico" },
    { label: "Comunicação", Icon: IconChat, cor: PINK, s: "chat" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
  ];
  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${INDIGO}, ${shade(INDIGO)})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name="Regina Nunes" color="#ffffff" size={46} />
          <div className="min-w-0 flex-1"><p className="text-[12px] text-white/80">Olá, Regina 👋</p><h1 className="truncate text-[16px] font-bold">Acompanhamento familiar</h1></div>
          <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: AMBER }} /></button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2.5">
          <Avatar name={ALUNO.nome} color="#ffffff22" size={30} />
          <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold">{ALUNO.nome}</p><p className="truncate text-[11px] text-white/75">{ALUNO.turma} · {ALUNO.escola}</p></div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">Filha</span>
        </div>
      </div>
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => nav("notas")} className="card p-3.5 text-left active:scale-[0.98] transition"><div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Média geral</span><IconStar size={16} style={{ color: BLUE }} /></div><div className="mt-1 text-[26px] font-extrabold" style={{ color: BLUE }}>7,3</div><Pill color={GREEN}>Acima da média</Pill></button>
          <button onClick={() => nav("frequencia")} className="card p-3.5 text-left active:scale-[0.98] transition"><div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Frequência</span><IconCheck size={16} style={{ color: GREEN }} /></div><div className="mt-1 text-[26px] font-extrabold" style={{ color: GREEN }}>89,6%</div><Pill color={AMBER}>Atenção em Inglês</Pill></button>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: RED + "10" }}>
          <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: RED }} />
          <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>1 tarefa <b>atrasada</b> em Ciências e frequência baixa em Inglês. <button onClick={() => nav("tarefas")} className="font-semibold" style={{ color: RED }}>Ver tarefas</button></p>
        </div>

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-[11px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Comunicados recentes" action="Ver tudo" onAction={() => nav("comunicados")} />
        <div className="space-y-2.5">
          {COMUNICADOS.slice(0, 2).map((c) => (
            <button key={c.t} onClick={() => nav("comunicados")} className="card flex w-full items-start gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: c.cor }} />
              <div className="flex-1"><div className="flex items-center gap-2"><p className="text-[13px] font-semibold" style={{ color: INK }}>{c.t}</p>{c.novo && <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} />}</div><p className="line-clamp-1 text-[11.5px]" style={{ color: INK_SOFT }}>{c.d}</p></div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
