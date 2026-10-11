import { useState } from "react";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconEdit } from "@/components/icons";
import { DIAS, HORARIOS } from "@/data/aluno";
import { TURMAS_ADM } from "@/data/escola";
import { GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function AdmHorarios({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const horas = ["07:00", "07:50", "08:40"];
  return (
    <>
      <TopBar title="Gestão de horários" subtitle="Grade por turma" onBack={back} accent={TEAL} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {TURMAS_ADM.map((t) => (
            <button key={t.nome} onClick={() => setTurma(t.nome)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t.nome ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t.nome}</button>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3 text-[12px]" style={{ background: GREEN + "10", color: INK }}>
          <IconCheck size={16} className="mt-0.5 flex-none" style={{ color: GREEN }} />Sem conflitos de horário nesta turma.
        </div>
        <div className="scroll-area mt-3 overflow-x-auto">
          <div className="card min-w-[520px] overflow-hidden">
            <div className="grid grid-cols-[56px_repeat(5,1fr)] bg-[color:var(--color-surface)] text-[10px] font-bold uppercase" style={{ color: INK_SOFT }}>
              <span className="px-2 py-2.5">Hora</span>
              {DIAS.map((d) => <span key={d} className="px-2 py-2.5 text-center">{d}</span>)}
            </div>
            {horas.map((h, ri) => (
              <div key={h} className="grid grid-cols-[56px_repeat(5,1fr)] border-t border-[color:var(--color-line)]">
                <span className="px-2 py-2.5 text-[11px] font-bold" style={{ color: INK }}>{h}</span>
                {DIAS.map((d) => {
                  const aula = HORARIOS[d][ri];
                  return <div key={d} className="border-l border-[color:var(--color-line)] px-1.5 py-2 text-center"><span className="inline-block rounded-md px-1.5 py-1 text-[9.5px] font-semibold leading-tight" style={{ background: aula.cor + "18", color: aula.cor }}>{aula.m}</span></div>;
                })}
              </div>
            ))}
          </div>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconEdit size={18} />Editar grade</button>
      </Screen>
    </>
  );
}
