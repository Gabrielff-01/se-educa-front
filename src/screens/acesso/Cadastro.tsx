import { useState } from "react";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck } from "@/components/icons";
import { PERFIS } from "@/data/perfis";
import { GREEN, INK, INK_SOFT } from "@/theme/colors";
import type { Perfil } from "@/types";

export function Cadastro({ back }: { back: () => void }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<Perfil>("aluno");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const cor = PERFIS.find((p) => p.id === tipo)!.cor;

  if (ok) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={40} strokeWidth={2.4} /></div>
        <h2 className="mt-5 text-[19px] font-extrabold" style={{ color: INK }}>Cadastro concluído!</h2>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>Enviamos um link de confirmação para o seu e-mail. Você já pode acessar sua conta.</p>
        <div className="mt-6 w-full"><PrimaryButton onClick={back} color={GREEN}>Ir para o login</PrimaryButton></div>
      </div>
    );
  }
  return (
    <>
      <TopBar title="Primeiro acesso" subtitle={`Etapa ${step} de 3`} onBack={step === 1 ? back : () => setStep(step - 1)} accent={cor} />
      <Screen>
        <div className="mb-4 flex gap-1.5">{[1, 2, 3].map((s) => <div key={s} className="h-1.5 flex-1 rounded-full transition" style={{ background: s <= step ? cor : "#e2e8f0" }} />)}</div>

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Tipo de perfil">
              <div className="grid grid-cols-2 gap-2">
                {PERFIS.map(({ id, label, Icon, cor: c }) => (
                  <button key={id} onClick={() => setTipo(id)} className="flex items-center gap-2 rounded-xl border px-3 py-3 transition" style={{ borderColor: tipo === id ? c : "#e2e8f0", background: tipo === id ? c + "10" : "#fff", color: tipo === id ? c : INK_SOFT }}>
                    <Icon size={20} /><span className="text-[12px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Nome completo"><input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="CPF"><input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="000.000.000-00" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <PrimaryButton onClick={() => nome && cpf && setStep(2)} color={cor}>Continuar</PrimaryButton>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="E-mail"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@email.com" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="Telefone"><input inputMode="tel" placeholder="(79) 9 0000-0000" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="Crie uma senha"><input type="password" placeholder="Mínimo de 8 caracteres" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <PrimaryButton onClick={() => email && setStep(3)} color={cor}>Continuar</PrimaryButton>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="card space-y-1.5 p-4 text-[12.5px]" style={{ color: INK_SOFT }}>
              <p className="text-[13px] font-bold" style={{ color: INK }}>Confira seus dados</p>
              <p>Perfil: <b style={{ color: INK }}>{PERFIS.find((p) => p.id === tipo)!.label}</b></p>
              <p>Nome: <b style={{ color: INK }}>{nome || "—"}</b></p>
              <p>CPF: <b style={{ color: INK }}>{cpf || "—"}</b></p>
              <p>E-mail: <b style={{ color: INK }}>{email || "—"}</b></p>
            </div>
            <button onClick={() => setAceite(!aceite)} className="flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition" style={{ borderColor: aceite ? GREEN : "#e2e8f0", background: aceite ? GREEN + "0a" : "#fff" }}>
              <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg border-2" style={{ borderColor: aceite ? GREEN : "#cbd5e1", background: aceite ? GREEN : "transparent" }}>{aceite && <IconCheck size={14} strokeWidth={3} className="text-white" />}</span>
              <span className="text-[12px] leading-relaxed" style={{ color: INK }}>Li e concordo com os <b>Termos de Uso</b> e a <b>Política de Privacidade (LGPD)</b>.</span>
            </button>
            <PrimaryButton onClick={() => { if (!aceite) return; setLoading(true); setTimeout(() => { setLoading(false); setOk(true); }, 1200); }} color={cor} loading={loading}>{loading ? "Criando conta..." : "Criar conta"}</PrimaryButton>
          </div>
        )}
      </Screen>
    </>
  );
}
