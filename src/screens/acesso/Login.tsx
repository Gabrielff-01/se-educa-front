import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconAlert, IconGrad, IconLayers, IconShield } from "@/components/icons";
import { PERFIS } from "@/data/perfis";
import { BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";
import type { Perfil } from "@/types";

export function Login({ onEnter, onCadastro, onTelas }: { onEnter: (p: Perfil) => void; onCadastro: () => void; onTelas: () => void }) {
  const [perfil, setPerfil] = useState<Perfil>("aluno");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const cor = PERFIS.find((p) => p.id === perfil)!.cor;

  const entrar = () => {
    setErro("");
    if (!cpf || !senha) { setErro("Preencha CPF/matrícula e senha para continuar."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(perfil); }, 1100);
  };

  return (
    <div className="scroll-area flex-1 overflow-y-auto">
      <div className="px-6 pb-8 pt-2">
        <div className="flex flex-col items-center pt-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={34} strokeWidth={2} /></div>
          <h1 className="mt-3 text-2xl font-extrabold" style={{ color: INK }}><span style={{ color: GREEN }}>SE</span> Educa</h1>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Acesse sua conta</p>
        </div>

        <p className="mb-2 mt-7 text-[13px] font-semibold" style={{ color: INK }}>Selecione seu perfil</p>
        <div className="grid grid-cols-5 gap-1.5">
          {PERFIS.map(({ id, label, Icon, cor: c }) => {
            const on = perfil === id;
            return (
              <button key={id} onClick={() => setPerfil(id)} className="flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition active:scale-95" style={{ borderColor: on ? c : "#e2e8f0", background: on ? c + "12" : "#fff", color: on ? c : INK_SOFT }}>
                <Icon size={20} strokeWidth={1.9} />
                <span className="text-[8.5px] font-semibold leading-tight text-center">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>CPF ou matrícula</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="000.000.000-00" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="••••••••" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>
        </div>

        {erro && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}><IconAlert size={16} />{erro}</div>}

        <div className="mt-5"><PrimaryButton onClick={entrar} color={cor} loading={loading}>{loading ? "Entrando..." : "Entrar"}</PrimaryButton></div>

        <div className="mt-4 flex items-center justify-between text-[12.5px] font-semibold">
          <button style={{ color: INK_SOFT }}>Recuperar senha</button>
          <button onClick={onCadastro} style={{ color: cor }}>Primeiro acesso</button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px]" style={{ color: INK_SOFT }}>
          <IconShield size={14} /> Ambiente seguro · Governo de Sergipe
        </div>
        <button onClick={onTelas} className="mx-auto mt-3 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: BLUE }}>
          <IconLayers size={15} /> Ver todas as telas do protótipo
        </button>
      </div>
    </div>
  );
}
