/* Peças de formulário e de "estado da API" usadas nas telas dos setores (DIES, DED, RH). */

import { useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { IconAlert, IconPlus, IconX } from "@/components/icons";
import type { ErroApi } from "@/lib/api";
import type { Opcao } from "@/lib/tipos";
import { BLUE, INK, INK_SOFT, RED } from "@/theme/colors";

const caixa = "w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[color:var(--color-brand-blue)]";

export function Entrada({ label, value, onChange, erro, type = "text", placeholder, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; erro?: string;
  type?: string; placeholder?: string; inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} inputMode={inputMode} className={caixa} style={{ borderColor: erro ? RED : "#e2e8f0", color: INK }} />
      {erro && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{erro}</span>}
    </label>
  );
}

export function Escolha({ label, value, onChange, opcoes, erro, vazio }: {
  label: string; value: string; onChange: (v: string) => void; opcoes: Opcao[]; erro?: string; vazio?: string;
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={caixa} style={{ borderColor: erro ? RED : "#e2e8f0", color: INK }}>
        {vazio !== undefined && <option value="">{vazio}</option>}
        {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.nome}</option>)}
      </select>
      {erro && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{erro}</span>}
    </label>
  );
}

export function AvisoErro({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}>
      <IconAlert size={16} className="mt-0.5 flex-none" />{texto}
    </div>
  );
}

/* Cartão com o formulário de cadastro/edição, com os botões Salvar e Cancelar. */
export function CartaoForm({ titulo, children, onSalvar, onCancelar, salvando, erro, cor = BLUE }: {
  titulo: string; children: React.ReactNode; onSalvar: () => void; onCancelar: () => void;
  salvando: boolean; erro?: string; cor?: string;
}) {
  return (
    <div className="card mb-3 space-y-3 p-4" style={{ outline: `2px solid ${cor}33` }}>
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold" style={{ color: INK }}>{titulo}</p>
        <button onClick={onCancelar} aria-label="Fechar" style={{ color: INK_SOFT }}><IconX size={18} /></button>
      </div>
      {children}
      {erro && <AvisoErro texto={erro} />}
      <div className="flex gap-2">
        <button onClick={onCancelar} className="flex-1 rounded-xl border py-2.5 text-[13px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Cancelar</button>
        <button onClick={onSalvar} disabled={salvando} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-70" style={{ background: cor }}>
          {salvando && <span className="spinner h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white" />}
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

export function BotaoNovo({ onClick, cor = BLUE, label }: { onClick: () => void; cor?: string; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: cor }}>
      <IconPlus size={18} />
    </button>
  );
}

/* Mostra "Carregando...", o erro da API ou o conteúdo da tela. */
export function EstadoApi({ carregando, erro, onRetry, children }: {
  carregando: boolean; erro: ErroApi | null; onRetry?: () => void; children: React.ReactNode;
}) {
  if (carregando) return <LoadingState text="Buscando no servidor... (se ele estava dormindo, pode levar até 1 minuto)" />;
  if (erro && erro.status === 0) return <ErrorState onRetry={onRetry} />;
  if (erro) return <div className="mt-6"><AvisoErro texto={erro.status === 401 ? `${erro.message} Use, por exemplo, o usuário dies1, ded1 ou rh1.` : erro.message} /></div>;
  return <>{children}</>;
}

/* Guarda o estado de um envio (salvar/apagar): enviando, mensagem de erro e erro de cada campo.

   const envio = useEnvio(["nome", "letra"]);   // os campos que aparecem no formulário
   envio.enviar(async () => { await api(...); fechar(); });

   Erro de um campo do formulário aparece embaixo do campo (envio.campos.nome).
   O resto (regra geral ou campo que não está na tela) vai pro aviso vermelho (envio.erro). */
export function useEnvio(camposDoForm: string[] = []) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [campos, setCampos] = useState<Record<string, string>>({});
  const limpar = () => { setErro(""); setCampos({}); };
  const enviar = async (acao: () => Promise<void>) => {
    limpar();
    setEnviando(true);
    try {
      await acao();
    } catch (e) {
      const falha = e as ErroApi;
      const porCampo = falha.campos ?? {};
      const deFora = Object.entries(porCampo).filter(([campo]) => !camposDoForm.includes(campo)).map(([, msg]) => msg);
      const aviso = [falha.geral, ...deFora].filter(Boolean).join(" ");
      setCampos(porCampo);
      setErro(aviso || (Object.keys(porCampo).length ? "Confira os campos em vermelho." : falha.message));
    } finally {
      setEnviando(false);
    }
  };
  return { enviando, erro, campos, enviar, limpar };
}
