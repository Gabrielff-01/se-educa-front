import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { INK, INK_SOFT, VIOLET } from "@/theme/colors";

export function ProfDiario({ back }: { back: () => void }) {
  const [conteudo, setConteudo] = useState("");
  const [entradas, setEntradas] = useState([
    { data: "16/09", turma: "9º ano B", txt: "Equações do 2º grau: fórmula de Bhaskara e exercícios." },
    { data: "13/09", turma: "9º ano B", txt: "Introdução a equações quadráticas; resolução por fatoração." },
    { data: "11/09", turma: "9º ano B", txt: "Revisão de expressões algébricas e correção da lista." },
  ]);
  const registrar = () => { if (!conteudo.trim()) return; setEntradas([{ data: "17/09", turma: "9º ano B", txt: conteudo }, ...entradas]); setConteudo(""); };
  return (
    <>
      <TopBar title="Diário de classe" subtitle="9º ano B · Matemática" onBack={back} accent={VIOLET} />
      <Screen>
        <div className="card p-4">
          <p className="mb-2 text-[13px] font-semibold" style={{ color: INK }}>Registrar aula de hoje</p>
          <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={3} placeholder="Conteúdo lecionado, observações..." className="w-full resize-none rounded-xl border border-[color:var(--color-line)] p-3 text-[13px] outline-none focus:border-[color:var(--color-brand-blue)]" style={{ color: INK }} />
          <div className="mt-2"><PrimaryButton onClick={registrar} color={VIOLET}>Registrar no diário</PrimaryButton></div>
        </div>
        <SectionHeader title="Registros anteriores" />
        <div className="space-y-2.5">
          {entradas.map((e, i) => (
            <div key={i} className="card flex gap-3 p-3.5">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-center" style={{ background: VIOLET + "14", color: VIOLET }}><span className="text-[12px] font-extrabold leading-tight">{e.data}</span></div>
              <div className="flex-1"><p className="text-[13px] leading-snug" style={{ color: INK }}>{e.txt}</p><p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{e.turma}</p></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}
