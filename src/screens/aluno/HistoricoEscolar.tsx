import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconDoc, IconShield } from "@/components/icons";
import { ALUNO, HISTORICO } from "@/data/aluno";
import { INDIGO, INK, INK_SOFT } from "@/theme/colors";

export function HistoricoEscolar({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Histórico escolar" subtitle={ALUNO.nome} onBack={back} accent={INDIGO} right={<button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: INDIGO }}><IconDoc size={18} /></button>} />
      <Screen>
        <div className="card flex items-center gap-3 p-4">
          <Avatar name={ALUNO.nome} color={INDIGO} size={44} />
          <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-bold" style={{ color: INK }}>{ALUNO.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Mat. {ALUNO.matricula} · {ALUNO.cidade}</p></div>
        </div>
        <SectionHeader title="Trajetória acadêmica" />
        <div className="relative space-y-3 pl-5">
          <span className="absolute bottom-3 left-[5px] top-3 w-0.5" style={{ background: "#e2e8f0" }} />
          {HISTORICO.map((h) => (
            <div key={h.ano} className="relative card p-3.5">
              <span className="absolute -left-[17px] top-5 h-3 w-3 rounded-full border-2 border-white" style={{ background: h.cor }} />
              <div className="flex items-center justify-between">
                <div><p className="text-[14px] font-bold" style={{ color: INK }}>{h.serie} · {h.ano}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{h.escola}</p></div>
                <div className="text-right"><p className="text-[18px] font-extrabold" style={{ color: h.cor }}>{h.media}</p><Pill color={h.cor}>{h.situacao}</Pill></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: INDIGO + "0d" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: INDIGO }} />
          <p className="text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Documento oficial com validade jurídica. A 2ª via também pode ser solicitada na Secretaria Virtual.</p>
        </div>
      </Screen>
    </>
  );
}
