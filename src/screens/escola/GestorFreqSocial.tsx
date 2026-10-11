import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { Select } from "@/components/Select";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconDoc, IconGrid, IconUsers } from "@/components/icons";
import { BENEFICIARIOS, COR_STATUS, statusFreq } from "@/data/escola";
import type { StatusFreq } from "@/data/escola";
import { useToast } from "@/hooks/useToast";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function GestorFreqSocial({ back }: { back: () => void }) {
  const [prog, setProg] = useState("Todos");
  const [turma, setTurma] = useState("Todas");
  const [mes, setMes] = useState("Setembro/2025");
  const [verLista, setVerLista] = useState(false);
  const [exp, setExp] = useState<string | null>(null);
  const { show, node } = useToast();
  const turmas = ["Todas", ...Array.from(new Set(BENEFICIARIOS.map((b) => b.turma)))];
  const dados = BENEFICIARIOS.filter((b) => (prog === "Todos" || b.prog === prog) && (turma === "Todas" || b.turma === turma));
  const alerta = BENEFICIARIOS.filter((b) => statusFreq(b) !== "Regular");
  const exportar = (t: string) => { setExp(t); setTimeout(() => { setExp(null); show(`Relatório exportado em ${t}`); }, 900); };
  const cont = (s: StatusFreq) => dados.filter((b) => statusFreq(b) === s).length;
  return (
    <>
      <TopBar title="Frequência · Programas sociais" subtitle="Alunos beneficiários" onBack={back} accent={GREEN} />
      <Screen>
        <div className="card p-3.5">
          <div className="flex gap-2">
            <Select label="Programa" value={prog} onChange={setProg} options={["Todos", "Bolsa Família", "Pé-de-Meia"]} />
            <Select label="Turma" value={turma} onChange={setTurma} options={turmas} />
          </div>
          <div className="mt-2"><Select label="Mês" value={mes} onChange={setMes} options={["Setembro/2025", "Agosto/2025", "Julho/2025"]} /></div>
        </div>

        <div className="mt-3 rounded-2xl p-3.5" style={{ background: "#fef3c7", border: `1px solid ${AMBER}55` }}>
          <div className="flex gap-2.5">
            <span className="mt-0.5" style={{ color: "#b45309" }}><IconAlert size={19} /></span>
            <div className="flex-1">
              <p className="text-[13.5px] font-bold" style={{ color: "#78350f" }}>{alerta.length} alunos estão perto do limite de frequência</p>
              <p className="text-[11.5px]" style={{ color: "#92400e" }}>Fechamento do mês em 4 dias · 30/09. Contate as famílias.</p>
              <button onClick={() => setVerLista(!verLista)} className="mt-2 text-[12px] font-bold underline" style={{ color: "#b45309" }}>{verLista ? "Ocultar lista" : "Ver alunos"}</button>
            </div>
          </div>
          {verLista && (
            <div className="mt-3 space-y-1.5">
              {alerta.map((b) => { const s = statusFreq(b); return (
                <div key={b.nome} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2" style={{ borderLeft: `4px solid ${COR_STATUS[s]}` }}>
                  <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold" style={{ color: INK }}>{b.nome}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{b.turma} · {b.prog}</p></div>
                  <span className="text-[13px] font-extrabold" style={{ color: COR_STATUS[s] }}>{b.freq}%</span>
                </div>
              ); })}
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {(["Regular", "Atenção", "Risco"] as StatusFreq[]).map((s) => (
            <div key={s} className="card p-3 text-center"><div className="text-[20px] font-extrabold" style={{ color: COR_STATUS[s] }}>{cont(s)}</div><div className="text-[10.5px]" style={{ color: INK_SOFT }}>{s}</div></div>
          ))}
        </div>

        <SectionHeader title={`Relatório · ${mes}`} />
        {dados.length === 0 ? <EmptyState title="Sem beneficiários" text="Nenhum aluno beneficiário para estes filtros." icon={<IconUsers size={26} />} /> : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-[11.5px]">
              <thead><tr style={{ color: INK_SOFT, background: "#f8fafc" }}>{["Aluno", "Turma", "Programa", "Freq.", "Faltas", "Status"].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {dados.map((b) => { const s = statusFreq(b); return (
                  <tr key={b.nome} className="border-t" style={{ borderColor: "#eef2f7", background: s === "Risco" ? RED + "08" : s === "Atenção" ? AMBER + "0a" : undefined }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: INK }}>{b.nome}</td>
                    <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{b.turma}</td>
                    <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{b.prog}</td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: COR_STATUS[s] }}>{b.freq}%</td>
                    <td className="px-3 py-2.5" style={{ color: INK }}>{b.faltas}</td>
                    <td className="px-3 py-2.5"><Pill color={COR_STATUS[s]}>{s}</Pill></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Mínimo exigido: Bolsa Família 85% · Pé-de-Meia 80%.</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <PrimaryButton color={RED} loading={exp === "PDF"} onClick={() => exportar("PDF")}><IconDoc size={17} />Exportar PDF</PrimaryButton>
          <PrimaryButton color={GREEN} loading={exp === "Excel"} onClick={() => exportar("Excel")}><IconGrid size={17} />Exportar Excel</PrimaryButton>
        </div>
      </Screen>
      {node}
    </>
  );
}
