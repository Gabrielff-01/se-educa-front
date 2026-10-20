import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconAlert, IconGrad, IconLayers, IconShield } from "@/components/icons";
import { PERFIS } from "@/data/perfis";
import { login } from "@/lib/api";
import type { Usuario } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

/* Contas criadas pelo comando "python manage.py popular_demo" da API. */
const DEMO = [
  { usuario: "aluno1", senha: "aluno", label: "Aluno" },
  { usuario: "responsavel1", senha: "responsavel", label: "Responsável" },
  { usuario: "professor1", senha: "professor", label: "Professor" },
  { usuario: "escola1", senha: "escola", label: "Escola" },
  { usuario: "dies1", senha: "dies", label: "DIES" },
  { usuario: "ded1", senha: "ded", label: "DED" },
  { usuario: "rh1", senha: "rh", label: "RH" },
];

/* Login de verdade: o Django confere a senha e diz qual é o perfil. Não tem mais seletor de perfil. */
export function Login({ onEnter, onCadastro, onTelas }: { onEnter: (u: Usuario) => void; onCadastro: () => void; onTelas: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const [erro, setErro] = useState("");

  const entrar = async () => {
    setErro("");
    if (!usuario || !senha) { setErro("Preencha usuário e senha para continuar."); return; }
    setLoading(true);
    // No plano grátis do Render a API "dorme": o primeiro acesso pode levar quase 1 minuto.
    const aviso = setTimeout(() => setDemorando(true), 4000);
    try {
      const sessao = await login(usuario.trim(), senha);
      onEnter(sessao.usuario);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      clearTimeout(aviso);
      setDemorando(false);
      setLoading(false);
    }
  };

  return (
    <div className="scroll-area flex-1 overflow-y-auto">
      <div className="px-6 pb-8 pt-2">
        <div className="flex flex-col items-center pt-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={34} strokeWidth={2} /></div>
          <h1 className="mt-3 text-2xl font-extrabold" style={{ color: INK }}><span style={{ color: GREEN }}>SE</span> Educa</h1>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Acesse sua conta</p>
        </div>

        <form className="mt-7 space-y-3" onSubmit={(e) => { e.preventDefault(); entrar(); }}>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>Usuário</label>
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoCapitalize="none" autoComplete="username" placeholder="Ex.: aluno1" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" autoComplete="current-password" placeholder="••••••••" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>

          {erro && <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}><IconAlert size={16} />{erro}</div>}
          {demorando && <p className="text-center text-[12px]" style={{ color: INK_SOFT }}>Acordando o servidor, só um instante...</p>}

          <div className="pt-2"><PrimaryButton color={BLUE} loading={loading}>{loading ? "Entrando..." : "Entrar"}</PrimaryButton></div>
        </form>

        <div className="mt-4 flex items-center justify-between text-[12.5px] font-semibold">
          <button style={{ color: INK_SOFT }}>Recuperar senha</button>
          <button onClick={onCadastro} style={{ color: BLUE }}>Primeiro acesso</button>
        </div>

        <div className="card mt-6 p-4">
          <p className="text-[12.5px] font-bold" style={{ color: INK }}>Contas de demonstração</p>
          <p className="mb-2.5 text-[11.5px]" style={{ color: INK_SOFT }}>Toque numa conta para preencher. A senha é o nome do perfil (ex.: aluno1 / aluno).</p>
          <div className="flex flex-wrap gap-1.5">
            {DEMO.map((d) => {
              const cor = PERFIS.find((p) => p.label === d.label)?.cor ?? (["DIES", "DED", "RH"].includes(d.label) ? AMBER : BLUE);
              const on = usuario === d.usuario;
              return (
                <button key={d.usuario} onClick={() => { setUsuario(d.usuario); setSenha(d.senha); setErro(""); }} className="rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition" style={on ? { background: cor, color: "#fff", borderColor: cor } : { background: "#fff", color: cor, borderColor: cor + "55" }}>
                  {d.label}
                </button>
              );
            })}
          </div>
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
