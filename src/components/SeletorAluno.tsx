/* Botões pra o responsável trocar de filho. Com um aluno só, mostra só o nome dele. */

import type { MeuAluno } from "@/lib/tipos";
import { BLUE, INK_SOFT } from "@/theme/colors";

export function SeletorAluno({ alunos, atual, escolher, cor = BLUE }: {
  alunos: MeuAluno[]; atual: MeuAluno | null; escolher: (id: number) => void; cor?: string;
}) {
  if (alunos.length < 2) return null;
  return (
    <div className="scroll-area mb-3 flex gap-2 overflow-x-auto pb-1">
      {alunos.map((a) => (
        <button key={a.id} onClick={() => escolher(a.id)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={atual?.id === a.id ? { background: cor, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
          {a.nome.split(" ")[0]} · {a.turma_nome ?? "sem turma"}
        </button>
      ))}
    </div>
  );
}
