/* Peças usadas por todas as telas do professor.

   - useMinhasTurmas(): busca /api/painel/professor/ e guarda qual "turma · matéria" está escolhida.
   - <SeletorTurma>: a fileira de botões para trocar de turma · matéria.
   - <ComTurmas>: mostra "carregando", erro, ou o aviso de quem ainda não tem cadastro/turma;
     só desenha o conteúdo da tela quando há turma para escolher.
   - <Confirmacao>: a faixa verde de "salvo!".
   - <CaixaTexto>: campo de texto de várias linhas no mesmo estilo do <Entrada>. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { IconCheck, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import type { PainelProfessor, TurmaDoProfessor } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

/* Cada lotação é uma turma + uma matéria. A "chave" junta as duas: "3-5" = turma 3, matéria 5. */
export function chaveDe(t: { turma: number; materia: number }) {
  return `${t.turma}-${t.materia}`;
}

export function nomeDe(t: { turma_nome: string; materia_nome: string }) {
  return `${t.turma_nome} · ${t.materia_nome}`;
}

export function useMinhasTurmas() {
  const painel = useApi<PainelProfessor>("/api/painel/professor/");
  const turmas = painel.dados?.turmas ?? [];
  const [chave, setChave] = useState("");
  // Enquanto o professor não escolhe, fica a primeira turma da lista.
  const escolhida: TurmaDoProfessor | null = turmas.find((t) => chaveDe(t) === chave) ?? turmas[0] ?? null;
  // A API responde 403 quando o login não está ligado a um cadastro de professor no RH.
  const semCadastro = painel.erro?.status === 403 || (painel.dados !== null && painel.dados.professor === null);
  return { painel, turmas, escolhida, semCadastro, escolher: (t: TurmaDoProfessor) => setChave(chaveDe(t)) };
}

export function ComTurmas({ minhas, children }: { minhas: ReturnType<typeof useMinhasTurmas>; children: React.ReactNode }) {
  const { painel, turmas, semCadastro } = minhas;
  if (semCadastro) return <SemTurmas semCadastro />;
  return (
    <EstadoApi carregando={painel.carregando} erro={painel.erro} onRetry={painel.recarregar}>
      {turmas.length === 0 ? <SemTurmas semCadastro={false} /> : children}
    </EstadoApi>
  );
}

export function SeletorTurma({ turmas, escolhida, onEscolher, cor }: {
  turmas: TurmaDoProfessor[]; escolhida: TurmaDoProfessor | null; onEscolher: (t: TurmaDoProfessor) => void; cor: string;
}) {
  return (
    <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
      {turmas.map((t) => {
        const ativa = escolhida !== null && chaveDe(t) === chaveDe(escolhida);
        return (
          <button key={chaveDe(t)} onClick={() => onEscolher(t)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={ativa ? { background: cor, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
            {nomeDe(t)}
          </button>
        );
      })}
    </div>
  );
}

/* Mostrada quando não há turma para escolher. */
export function SemTurmas({ semCadastro }: { semCadastro: boolean }) {
  if (semCadastro) {
    return <EmptyState title="Seu login não tem cadastro de professor" text="Peça ao RH da Secretaria para ligar o seu usuário ao seu cadastro de professor." icon={<IconUsers size={26} />} />;
  }
  return <EmptyState title="Nenhuma turma por enquanto" text="Você ainda não tem turma. Quando a escola definir suas turmas e matérias, elas aparecem aqui." icon={<IconUsers size={26} />} />;
}

export function Confirmacao({ texto }: { texto: string }) {
  return <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />{texto}</div>;
}

export function CaixaTexto({ label, value, onChange, erro, placeholder, linhas = 3 }: {
  label: string; value: string; onChange: (v: string) => void; erro?: string; placeholder?: string; linhas?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={linhas} placeholder={placeholder} className="w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[color:var(--color-brand-blue)]" style={{ borderColor: erro ? RED : "#e2e8f0", color: INK }} />
      {erro && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{erro}</span>}
    </label>
  );
}
