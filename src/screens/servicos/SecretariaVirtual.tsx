import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconChevron, IconClock, IconDoc, IconEdit, IconGrid, IconSend, IconStar } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function SecretariaVirtual({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const servicos = [
    { t: "Declaração de matrícula", d: "Emissão imediata", Icon: IconDoc, cor: BLUE },
    { t: "Histórico escolar", d: "Prazo de 5 dias úteis", Icon: IconBook, cor: TEAL },
    { t: "Transferência", d: "Solicitar mudança de escola", Icon: IconGrid, cor: GREEN },
    { t: "Atualização cadastral", d: "Dados pessoais e contato", Icon: IconEdit, cor: AMBER },
    { t: "Segunda via de boletim", d: "Ano letivo atual", Icon: IconStar, cor: "#8b5cf6" },
    { t: "Requerimentos", d: "Outras solicitações", Icon: IconSend, cor: "#ec4899" },
  ];
  return (
    <>
      <TopBar title="Secretaria Virtual" subtitle="Serviços online" onBack={back} accent={BLUE} />
      <Screen>
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
          <p className="text-[13px] font-semibold">Resolva sem sair de casa 🏠</p>
          <p className="mt-1 text-[12px] text-white/85">Solicite documentos e serviços da rede municipal em poucos toques.</p>
        </div>
        <SectionHeader title="Serviços disponíveis" />
        <div className="space-y-2.5">
          {servicos.map((s) => (
            <button key={s.t} onClick={() => nav("acompanhamento")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: s.cor + "16", color: s.cor }}><s.Icon size={22} /></div>
              <div className="flex-1"><p className="text-[13.5px] font-semibold" style={{ color: INK }}>{s.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{s.d}</p></div>
              <IconChevron size={18} className="" style={{ color: "#cbd5e1" } as any} />
            </button>
          ))}
        </div>
        <SectionHeader title="Meus protocolos" action="Acompanhar" onAction={() => nav("acompanhamento")} />
        <div className="card flex items-center gap-3 p-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: AMBER + "16", color: AMBER }}><IconClock size={19} /></div>
          <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>2025-MAT-48210</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Matrícula · Documentação pendente</p></div>
          <Pill color={AMBER}>Em análise</Pill>
        </div>
      </Screen>
    </>
  );
}
