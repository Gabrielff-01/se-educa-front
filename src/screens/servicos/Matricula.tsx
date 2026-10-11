import { useState } from "react";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconUsers } from "@/components/icons";
import { BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

export function Matricula({ back }: { back: () => void }) {
  const [step, setStep] = useState(1);
  const [cidade, setCidade] = useState("Aracaju");
  const [escola, setEscola] = useState("");
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("");
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [enviado, setEnviado] = useState(false);
  const escolas = ["E.M.E.F. Poeta João Ribeiro", "E.M.E.F. Tobias Barreto", "E.M. Prof. José Conrado"];
  const documentos = ["RG / Certidão de nascimento", "CPF do responsável", "Comprovante de residência", "Histórico escolar", "Foto 3x4"];

  if (enviado) {
    return (
      <>
        <TopBar title="Matrícula" onBack={back} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={40} strokeWidth={2.4} /></div>
          <h2 className="mt-5 text-[19px] font-extrabold" style={{ color: INK }}>Solicitação enviada!</h2>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>Protocolo <b style={{ color: INK }}>2025-MAT-48210</b>. Acompanhe o andamento na tela de Acompanhamento.</p>
          <div className="mt-6 w-full"><PrimaryButton onClick={back} color={GREEN}>Concluir</PrimaryButton></div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Matrícula" subtitle={`Etapa ${step} de 3`} onBack={step === 1 ? back : () => setStep(step - 1)} />
      <Screen>
        <div className="mb-4 flex gap-1.5">
          {[1, 2, 3].map((s) => <div key={s} className="h-1.5 flex-1 rounded-full transition" style={{ background: s <= step ? BLUE : "#e2e8f0" }} />)}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Município">
              <div className="flex gap-2">{["Aracaju", "Nossa Sra. do Socorro", "Lagarto"].map((c) => (
                <button key={c} onClick={() => setCidade(c)} className="flex-1 rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition" style={{ borderColor: cidade === c ? BLUE : "#e2e8f0", background: cidade === c ? BLUE + "12" : "#fff", color: cidade === c ? BLUE : INK_SOFT }}>{c}</button>
              ))}</div>
            </Field>
            <Field label="Escola">
              <div className="space-y-2">{escolas.map((e) => (
                <button key={e} onClick={() => setEscola(e)} className="flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition" style={{ borderColor: escola === e ? BLUE : "#e2e8f0", background: escola === e ? BLUE + "0a" : "#fff" }}>
                  <div><p className="text-[13px] font-semibold" style={{ color: INK }}>{e}</p><p className="text-[11px]" style={{ color: GREEN }}>Vagas disponíveis</p></div>
                  {escola === e && <IconCheck size={18} className="" style={{ color: BLUE } as any} />}
                </button>
              ))}</div>
            </Field>
            <PrimaryButton onClick={() => escola && setStep(2)}>Continuar</PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Série / Ano">
              <div className="grid grid-cols-3 gap-2">{["6º ano", "7º ano", "8º ano", "9º ano", "1ª série", "2ª série"].map((s) => (
                <button key={s} onClick={() => setSerie(s)} className="rounded-xl border py-2.5 text-[12px] font-semibold transition" style={{ borderColor: serie === s ? BLUE : "#e2e8f0", background: serie === s ? BLUE + "12" : "#fff", color: serie === s ? BLUE : INK_SOFT }}>{s}</button>
              ))}</div>
            </Field>
            <Field label="Turno">
              <div className="flex gap-2">{["Matutino", "Vespertino", "Integral"].map((t) => (
                <button key={t} onClick={() => setTurno(t)} className="flex-1 rounded-xl border py-2.5 text-[12px] font-semibold transition" style={{ borderColor: turno === t ? BLUE : "#e2e8f0", background: turno === t ? BLUE + "12" : "#fff", color: turno === t ? BLUE : INK_SOFT }}>{t}</button>
              ))}</div>
            </Field>
            <div className="card flex items-center gap-3 p-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: GREEN + "16", color: GREEN }}><IconUsers size={22} /></div>
              <div><p className="text-[13px] font-bold" style={{ color: INK }}>28 vagas disponíveis</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{serie || "Selecione a série"} · {turno || "turno"}</p></div>
            </div>
            <PrimaryButton onClick={() => serie && turno && setStep(3)}>Continuar</PrimaryButton>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-[13px] font-bold" style={{ color: INK }}>Documentos necessários</p>
              <p className="mb-3 text-[12px]" style={{ color: INK_SOFT }}>Marque os documentos que você já possui em mãos.</p>
              <div className="space-y-2">{documentos.map((d) => {
                const on = docs[d];
                return (
                  <button key={d} onClick={() => setDocs({ ...docs, [d]: !on })} className="flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition" style={{ borderColor: on ? GREEN : "#e2e8f0", background: on ? GREEN + "0d" : "#fff" }}>
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-lg border-2" style={{ borderColor: on ? GREEN : "#cbd5e1", background: on ? GREEN : "transparent" }}>{on && <IconCheck size={14} strokeWidth={3} className="text-white" />}</span>
                    <span className="text-[13px] font-medium" style={{ color: INK }}>{d}</span>
                  </button>
                );
              })}</div>
            </div>
            <div className="card space-y-1 p-3.5 text-[12px]" style={{ color: INK_SOFT }}>
              <p><b style={{ color: INK }}>Resumo:</b></p>
              <p>{cidade} · {escola}</p>
              <p>{serie} · {turno}</p>
            </div>
            <PrimaryButton onClick={() => setEnviado(true)} color={GREEN}>Enviar solicitação</PrimaryButton>
          </div>
        )}
      </Screen>
    </>
  );
}
