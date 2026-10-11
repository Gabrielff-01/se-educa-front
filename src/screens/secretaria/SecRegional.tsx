import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconPlus } from "@/components/icons";
import { OFICIOS } from "@/data/secretaria";
import { INDIGO, INK, INK_SOFT, shade } from "@/theme/colors";

/* Secretaria — Contato com o Regional */
export function SecRegional({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Contato com o Regional" subtitle="Diretoria Regional de Educação" onBack={back} accent={INDIGO} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: INDIGO }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${INDIGO}, ${shade(INDIGO)})` }}>
          <p className="text-[13px] font-semibold">Canal oficial com o órgão superior</p>
          <p className="mt-1 text-[12px] text-white/85">Envie ofícios e acompanhe as respostas da Diretoria Regional.</p>
        </div>
        <SectionHeader title="Ofícios e solicitações" />
        <div className="space-y-2.5">
          {OFICIOS.map((o) => (
            <div key={o.num} className="card p-3.5">
              <div className="flex items-center justify-between"><span className="text-[12px] font-bold" style={{ color: INDIGO }}>{o.num}</span><span className="text-[11px]" style={{ color: INK_SOFT }}>{o.data}</span></div>
              <p className="mt-1 text-[13.5px] font-semibold" style={{ color: INK }}>{o.assunto}</p>
              <div className="mt-2"><Pill color={o.cor}>{o.status}</Pill></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
