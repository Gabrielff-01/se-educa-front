import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconAlert, IconBack, IconEdit, IconGrad, IconLayers, IconShield } from "@/components/icons";
import { apiPublica, login } from "@/lib/api";
import { mascaraCpf } from "@/lib/formato";
import type { Identificacao, Usuario } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

/* Login em 2 passos (pedido do mentor: sem a lista de contas com as senhas prontas).
   1. A pessoa digita o CPF, o usuário ou o e-mail e a API diz se já tem cadastro (POST /api/auth/identificar/).
      - tem cadastro (ou um pedido de matrícula pela internet): vai pro passo 2;
      - CPF novo: vai direto pra matrícula, com o CPF já preenchido;
      - aluno da rede sem senha, ou usuário que não existe: mostra o aviso aqui mesmo.
   2. A senha. O Django confere e diz qual é o perfil. Quem tem pedido de matrícula esperando
      recebe da própria API o andamento (em análise pela escola ou recusado com o motivo). */

/* Quando a pessoa vem da matrícula (o CPF dela já tinha cadastro), a tela já abre no passo certo. */
export type Chegada = { usuario: string; identificacao: Identificacao };

const PEDE_SENHA: Identificacao["situacao"][] = ["tem_login", "pedido"];

const caixa = "w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]";

/* Se o que foi digitado é um CPF, mostra com pontos e traço; usuário e e-mail ficam como estão. */
const bonito = (texto: string) => (/^[\d.\-\s]+$/.test(texto) && texto.replace(/\D/g, "").length === 11 ? mascaraCpf(texto) : texto);

export function Login({ onEnter, onVoltar, onMatricula, onTelas, chegada }: {
  onEnter: (u: Usuario) => void;
  onVoltar: () => void;
  onMatricula: (cpf?: string) => void;
  onTelas: () => void;
  chegada?: Chegada | null;
}) {
  const [usuario, setUsuario] = useState(chegada?.usuario ?? "");
  const [senha, setSenha] = useState("");
  const [achado, setAchado] = useState<Identificacao | null>(chegada?.identificacao ?? null);
  const [loading, setLoading] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const [erro, setErro] = useState("");
  const passoSenha = !!achado && PEDE_SENHA.includes(achado.situacao);

  /* No plano grátis do Render a API "dorme": o primeiro acesso pode levar quase 1 minuto. */
  const esperando = async (tarefa: () => Promise<void>) => {
    setErro("");
    setLoading(true);
    const aviso = setTimeout(() => setDemorando(true), 4000);
    try {
      await tarefa();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      clearTimeout(aviso);
      setDemorando(false);
      setLoading(false);
    }
  };

  /* Passo 1: quem é? */
  const continuar = () => {
    if (!usuario.trim()) { setErro("Digite o CPF, o usuário ou o e-mail."); return; }
    esperando(async () => {
      const resposta = await apiPublica<Identificacao>("/api/auth/identificar/", { method: "POST", body: { usuario: usuario.trim() } });
      if (resposta.situacao === "novo") { onMatricula(resposta.cpf); return; }
      setAchado(resposta);
    });
  };

  /* Passo 2: a senha. A API aceita o CPF no lugar do usuário. */
  const entrar = () => {
    if (!senha) { setErro("Digite a senha."); return; }
    esperando(async () => {
      const sessao = await login(usuario.trim(), senha);
      onEnter(sessao.usuario);
    });
  };

  const trocar = () => { setAchado(null); setSenha(""); setErro(""); };

  return (
    <div className="scroll-area flex-1 overflow-y-auto">
      <div className="px-6 pb-8 pt-2">
        <button onClick={passoSenha ? trocar : onVoltar} aria-label="Voltar" className="mt-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm active:scale-95 transition" style={{ color: INK }}><IconBack size={20} /></button>
        <div className="flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={34} strokeWidth={2} /></div>
          <h1 className="mt-3 text-2xl font-extrabold" style={{ color: INK }}><span style={{ color: GREEN }}>SE</span> Educa</h1>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{passoSenha ? "Digite sua senha" : "Acesse sua conta"}</p>
        </div>

        {passoSenha ? (
          <form className="mt-7 space-y-3" onSubmit={(e) => { e.preventDefault(); entrar(); }}>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold" style={{ color: INK_SOFT }}>Entrando como</p>
                <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{bonito(usuario.trim())}</p>
              </div>
              <button type="button" onClick={trocar} className="text-[12.5px] font-semibold" style={{ color: BLUE }}>Trocar</button>
            </div>
            {achado?.mensagem && (
              <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-medium" style={{ background: BLUE + "10", color: INK }}>
                <IconAlert size={16} className="mt-0.5 flex-none" style={{ color: BLUE }} />{achado.mensagem}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>Senha</label>
              <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" autoFocus autoComplete="current-password" placeholder="••••••••" className={caixa} />
            </div>
            {/* campo escondido pro gerenciador de senhas do navegador saber de qual login é a senha */}
            <input type="hidden" autoComplete="username" value={usuario.trim()} readOnly />

            {erro && <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}><IconAlert size={16} className="mt-0.5 flex-none" />{erro}</div>}
            {demorando && <p className="text-center text-[12px]" style={{ color: INK_SOFT }}>Acordando o servidor, só um instante...</p>}

            <div className="pt-2"><PrimaryButton color={BLUE} loading={loading}>{loading ? "Entrando..." : "Entrar"}</PrimaryButton></div>
            <button type="button" className="mx-auto block text-[12.5px] font-semibold" style={{ color: INK_SOFT }}>Esqueci minha senha</button>
          </form>
        ) : (
          <form className="mt-7 space-y-3" onSubmit={(e) => { e.preventDefault(); continuar(); }}>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>CPF, usuário ou e-mail</label>
              <input value={usuario} onChange={(e) => { setUsuario(e.target.value); setAchado(null); setErro(""); }} autoCapitalize="none" autoComplete="username" placeholder="Ex.: 000.000.000-00 ou seu e-mail" className={caixa} />
              <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>O aluno pode entrar com o CPF. Ainda não estuda na rede? Digite o CPF que a gente leva você pra matrícula.</p>
            </div>

            {achado && (
              <div className="space-y-2 rounded-xl px-3 py-2.5 text-[12.5px] font-medium" style={{ background: AMBER + "14", color: INK }}>
                <p className="flex items-start gap-2"><IconAlert size={16} className="mt-0.5 flex-none" style={{ color: AMBER }} />{achado.mensagem}</p>
                {achado.situacao === "nao_encontrado" && (
                  <button type="button" onClick={() => onMatricula()} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold" style={{ color: GREEN }}><IconEdit size={14} />Fazer matrícula</button>
                )}
              </div>
            )}
            {erro && <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}><IconAlert size={16} className="mt-0.5 flex-none" />{erro}</div>}
            {demorando && <p className="text-center text-[12px]" style={{ color: INK_SOFT }}>Acordando o servidor, só um instante...</p>}

            <div className="pt-2"><PrimaryButton color={BLUE} loading={loading}>{loading ? "Conferindo..." : "Continuar"}</PrimaryButton></div>
            <div className="flex items-center justify-between pt-1 text-[12.5px] font-semibold">
              <button type="button" style={{ color: INK_SOFT }}>Esqueci minha senha</button>
              <button type="button" onClick={() => onMatricula()} style={{ color: BLUE }}>Fazer matrícula</button>
            </div>
          </form>
        )}

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
