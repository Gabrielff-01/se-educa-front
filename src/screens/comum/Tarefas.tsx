/* Tarefas: o professor passa e acompanha as entregas; o aluno (e o responsável) vê o que tem pra fazer. */

import { TarefasAluno } from "@/screens/aluno/TarefasAluno";
import { TarefasProfessor } from "@/screens/professor/TarefasProfessor";

export function Tarefas({ back, role }: { back: () => void; role: "aluno" | "professor" }) {
  return role === "professor" ? <TarefasProfessor back={back} /> : <TarefasAluno back={back} />;
}
