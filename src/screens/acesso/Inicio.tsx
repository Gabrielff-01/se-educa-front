/* Tela de entrada (antes do login): a família escolhe entre fazer a matrícula pela internet
   ou entrar com a conta que já tem. O visual segue a página de cadastro que a equipe fez em HTML/CSS. */

import { IconChevron, IconEdit, IconLayers, IconShield, IconUser } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { Logo } from "@/screens/acesso/Logo";
import { ANO_ATUAL } from "@/lib/formato";

const AZUL = "#1a6ce5";
const VERDE = "#00a65a";

function Opcao({ titulo, texto, Icon, cor, onClick }: { titulo: string; texto: string; Icon: (p: IconProps) => React.ReactElement; cor: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]" style={{ borderColor: "#e2e8f0" }}>
      <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl" style={{ background: cor + "14", color: cor }}><Icon size={24} /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-bold" style={{ color: "#1e293b" }}>{titulo}</p>
        <p className="text-[13px] leading-snug" style={{ color: "#64748b" }}>{texto}</p>
      </div>
      <IconChevron size={20} style={{ color: "#cbd5e1" }} />
    </button>
  );
}

export function Inicio({ onMatricula, onLogin, onTelas }: { onMatricula: () => void; onLogin: () => void; onTelas: () => void }) {
  return (
    <div className="scroll-area flex-1 overflow-y-auto" style={{ background: "#f0f2f5" }}>
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-10">
        <Logo subtitulo="Secretaria de Estado da Educação de Sergipe" />

        <div className="space-y-3">
          <Opcao titulo="Fazer matrícula" texto={`Ainda não estuda na rede? Peça a vaga para ${ANO_ATUAL} pela internet.`} Icon={IconEdit} cor={VERDE} onClick={onMatricula} />
          <Opcao titulo="Já tenho cadastro" texto="Entrar com usuário ou e-mail e senha." Icon={IconUser} cor={AZUL} onClick={onLogin} />
        </div>

        <p className="mt-5 rounded-xl px-4 py-3 text-[12.5px] leading-relaxed" style={{ background: AZUL + "0f", color: "#334155" }}>
          Já fez a matrícula pela internet? Toque em <b>Já tenho cadastro</b> e entre com o e-mail e a senha que você escolheu para ver o andamento.
        </p>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[12.5px]" style={{ color: "#64748b" }}>
          <IconShield size={14} /> Ambiente seguro · Governo de Sergipe
        </div>
        <button onClick={onTelas} className="mx-auto mt-3 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: AZUL }}>
          <IconLayers size={15} /> Ver todas as telas do protótipo
        </button>
      </div>
    </div>
  );
}
