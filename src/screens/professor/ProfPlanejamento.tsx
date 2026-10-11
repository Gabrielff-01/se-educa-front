import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconPlus } from "@/components/icons";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function ProfPlanejamento({ back }: { back: () => void }) {
  const planos = [
    { tema: "Equações do 2º grau", turma: "9º ano B", periodo: "2ª unidade", status: "Em andamento", cor: BLUE },
    { tema: "Funções e gráficos", turma: "8º ano A", periodo: "2ª unidade", status: "Planejado", cor: AMBER },
    { tema: "Números racionais", turma: "7º ano C", periodo: "2ª unidade", status: "Concluído", cor: GREEN },
    { tema: "Geometria plana", turma: "9º ano B", periodo: "3ª unidade", status: "Planejado", cor: AMBER },
  ];
  return (
    <>
      <TopBar title="Planejamento" subtitle="Planos de aula" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="space-y-2.5">
          {planos.map((p) => (
            <div key={p.tema} className="card p-4">
              <div className="flex items-center justify-between"><Pill color={BLUE}>{p.turma}</Pill><Pill color={p.cor}>{p.status}</Pill></div>
              <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{p.tema}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconBook size={13} />{p.periodo}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Novo plano de aula</button>
      </Screen>
    </>
  );
}
