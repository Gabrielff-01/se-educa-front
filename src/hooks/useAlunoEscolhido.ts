/* De qual aluno a tela mostra os dados (boletim, frequência, horários...).

   - Aluno: sempre ele mesmo (a API já sabe quem é).
   - Responsável: um dos filhos. A escolha fica guardada no navegador, então
     se a mãe escolheu o Pedro no boletim, a frequência também abre no Pedro.

   const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
   const boletim = useApi<Boletim>(comAluno("/api/boletim/"));   // -> "/api/boletim/?aluno=2" */

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import type { MeuAluno } from "@/lib/tipos";

const CHAVE = "se-educa-aluno-escolhido";

function lerSalvo(): number | null {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? Number(salvo) : null;
  } catch {
    return null;
  }
}

export function useAlunoEscolhido() {
  const filhos = useApi<MeuAluno[]>("/api/meus-alunos/");
  const [escolhido, setEscolhido] = useState<number | null>(lerSalvo);
  const lista = filhos.dados ?? [];
  const atual = lista.find((a) => a.id === escolhido) ?? lista[0] ?? null;

  const escolher = (id: number) => {
    setEscolhido(id);
    try { localStorage.setItem(CHAVE, String(id)); } catch { /* sem localStorage: vale só nesta tela */ }
  };

  /* Junta ?aluno=ID no endereço. Enquanto a lista não chegou, devolve null (o useApi espera). */
  const comAluno = (caminho: string) => {
    if (!atual) return null;
    return `${caminho}${caminho.includes("?") ? "&" : "?"}aluno=${atual.id}`;
  };

  return { filhos, atual, escolher, comAluno };
}
