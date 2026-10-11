import { Avatar } from "@/components/Avatar";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconDoc } from "@/components/icons";
import { ALUNO, NOTAS } from "@/data/aluno";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function Boletim({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Boletim" subtitle="2025 · Emitido em 04/09/2025" onBack={back} accent={AMBER} right={<button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconDoc size={18} /></button>} />
      <Screen>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Avatar name={ALUNO.nome} size={44} />
            <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-bold" style={{ color: INK }}>{ALUNO.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{ALUNO.turma} · Mat. {ALUNO.matricula}</p></div>
          </div>
          <div className="mt-3 border-t border-[color:var(--color-line)] pt-3 text-[11.5px]" style={{ color: INK_SOFT }}>
            <p>{ALUNO.escola}</p><p>{ALUNO.cidade}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Média final</p><p className="text-[24px] font-extrabold" style={{ color: BLUE }}>7,3</p></div>
          <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Frequência</p><p className="text-[24px] font-extrabold" style={{ color: GREEN }}>89,6%</p></div>
        </div>
        <SectionHeader title="Quadro de notas" />
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 text-[10.5px] font-bold uppercase" style={{ background: "#f4f7fb", color: INK_SOFT }}>
            <span>Disciplina</span><span className="w-12 text-center">Média</span><span className="w-16 text-center">Situação</span>
          </div>
          {NOTAS.map((n) => (
            <div key={n.mat} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-[color:var(--color-line)] px-4 py-3">
              <span className="text-[13px] font-medium" style={{ color: INK }}>{n.mat}</span>
              <span className="w-12 text-center text-[14px] font-bold" style={{ color: n.cor }}>{n.media.toFixed(1)}</span>
              <span className="w-16 text-center"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: n.cor }} /></span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px]" style={{ color: INK_SOFT }}>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />Aprovado</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: AMBER }} />Recuperação</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RED }} />Reprovado</span>
        </div>
      </Screen>
    </>
  );
}
