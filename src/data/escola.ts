/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { AMBER, BLUE, GREEN, RED, TEAL, VIOLET } from "@/theme/colors";

export const TURMAS_ADM = [
  { nome: "9º ano A", turno: "Matutino", alunos: 32, cap: 35, sala: "12", regente: "Prof. Carlos Menezes" },
  { nome: "9º ano B", turno: "Matutino", alunos: 34, cap: 35, sala: "09", regente: "Profª. Sandra Alves" },
  { nome: "8º ano A", turno: "Vespertino", alunos: 29, cap: 35, sala: "05", regente: "Prof. Jonas Reis" },
  { nome: "7º ano C", turno: "Vespertino", alunos: 31, cap: 32, sala: "03", regente: "Profª. Lúcia Prado" },
  { nome: "6º ano A", turno: "Matutino", alunos: 28, cap: 30, sala: "01", regente: "Prof. André Lima" },
];

export const CURSOS = [
  { nome: "Ensino Fund. — Anos Iniciais", turmas: 10, alunos: 312, cor: BLUE },
  { nome: "Ensino Fund. — Anos Finais", turmas: 14, alunos: 530, cor: TEAL },
  { nome: "Educação de Jovens e Adultos", turmas: 4, alunos: 120, cor: VIOLET },
];

export const PROFESSORES = [
  { nome: "Carlos Menezes", disc: "Matemática", turmas: 5, carga: 40, status: "Ativo", cor: GREEN },
  { nome: "Sandra Alves", disc: "Português", turmas: 4, carga: 40, status: "Ativo", cor: GREEN },
  { nome: "Jonas Reis", disc: "Ciências", turmas: 3, carga: 30, status: "Ativo", cor: GREEN },
  { nome: "Lúcia Prado", disc: "História", turmas: 4, carga: 36, status: "Ativo", cor: GREEN },
  { nome: "André Lima", disc: "Geografia", turmas: 3, carga: 24, status: "Licença", cor: AMBER },
  { nome: "Marina Costa", disc: "Inglês", turmas: 6, carga: 40, status: "Ativo", cor: GREEN },
];

export const MATRICULAS_ADM = [
  { nome: "Ana Beatriz Nunes", turma: "9º ano B", status: "Confirmada", cor: GREEN },
  { nome: "Bruno Carvalho Lima", turma: "9º ano B", status: "Confirmada", cor: GREEN },
  { nome: "Carla Dias Santos", turma: "8º ano A", status: "Em análise", cor: AMBER },
  { nome: "Diego Farias Melo", turma: "—", status: "Pendente", cor: RED },
  { nome: "Eduarda Gomes Rocha", turma: "7º ano C", status: "Confirmada", cor: GREEN },
  { nome: "Felipe Andrade Souza", turma: "—", status: "Em análise", cor: AMBER },
];

export const DIARIO_SUP = [
  { prof: "Carlos Menezes", turma: "9º ano B", diario: "Em dia", notas: "Em dia", freq: "Em dia", cor: GREEN },
  { prof: "Sandra Alves", turma: "9º ano A", diario: "Pendente", notas: "Em dia", freq: "Em dia", cor: AMBER },
  { prof: "Jonas Reis", turma: "8º ano A", diario: "Atrasado", notas: "Pendente", freq: "Pendente", cor: RED },
  { prof: "Lúcia Prado", turma: "7º ano C", diario: "Em dia", notas: "Em dia", freq: "Pendente", cor: AMBER },
];

export const BOLETINS_ADM = [
  { turma: "9º ano A", status: "Publicado", pct: 100, cor: GREEN },
  { turma: "9º ano B", status: "Em fechamento", pct: 78, cor: AMBER },
  { turma: "8º ano A", status: "Aberto", pct: 35, cor: BLUE },
  { turma: "7º ano C", status: "Aberto", pct: 12, cor: BLUE },
];

export type StatusFreq = "Regular" | "Atenção" | "Risco";

export const BENEFICIARIOS: { nome: string; turma: string; prog: "Bolsa Família" | "Pé-de-Meia"; freq: number; faltas: number }[] = [
  { nome: "Bruno Carvalho Lima", turma: "9º A", prog: "Bolsa Família", freq: 76, faltas: 10 },
  { nome: "Larissa Menezes Prado", turma: "1º EM A", prog: "Pé-de-Meia", freq: 79, faltas: 9 },
  { nome: "Diego Farias Melo", turma: "9º B", prog: "Bolsa Família", freq: 81, faltas: 8 },
  { nome: "Kauã Santana Rocha", turma: "2º EM B", prog: "Pé-de-Meia", freq: 82, faltas: 8 },
  { nome: "Yasmin Oliveira Costa", turma: "8º A", prog: "Bolsa Família", freq: 83, faltas: 7 },
  { nome: "Pedro Henrique Alves", turma: "1º EM A", prog: "Pé-de-Meia", freq: 84, faltas: 7 },
  { nome: "Maria Clara Batista", turma: "7º B", prog: "Bolsa Família", freq: 85, faltas: 6 },
  { nome: "João Victor Nascimento", turma: "9º A", prog: "Bolsa Família", freq: 85, faltas: 6 },
  { nome: "Isabela Ferreira Lima", turma: "2º EM B", prog: "Pé-de-Meia", freq: 86, faltas: 6 },
  { nome: "Arthur Mendonça Silva", turma: "8º A", prog: "Bolsa Família", freq: 86, faltas: 6 },
  { nome: "Sophia Rezende Góis", turma: "7º B", prog: "Bolsa Família", freq: 87, faltas: 5 },
  { nome: "Lucas Gabriel Moura", turma: "1º EM A", prog: "Pé-de-Meia", freq: 87, faltas: 5 },
  { nome: "Eduarda Gomes Rocha", turma: "9º B", prog: "Bolsa Família", freq: 93, faltas: 3 },
  { nome: "Rafael Tavares Cruz", turma: "2º EM B", prog: "Pé-de-Meia", freq: 95, faltas: 2 },
  { nome: "Gabriela Nunes Reis", turma: "8º A", prog: "Bolsa Família", freq: 97, faltas: 1 },
  { nome: "Matheus Lima Dantas", turma: "1º EM A", prog: "Pé-de-Meia", freq: 98, faltas: 1 },
];

// Bolsa Família exige 85% (6–15 anos); Pé-de-Meia exige 80%.
export const statusFreq = (b: (typeof BENEFICIARIOS)[number]): StatusFreq => {
  const min = b.prog === "Bolsa Família" ? 85 : 80;
  return b.freq < min ? "Risco" : b.freq < min + 3 ? "Atenção" : "Regular";
};

export const COR_STATUS: Record<StatusFreq, string> = { Regular: GREEN, Atenção: AMBER, Risco: RED };

export const PENDENCIAS: { id: string; prof: string; turma: string; disc: string; tipo: "Diário" | "Notas"; atraso: number; prazo: string }[] = [
  { id: "p1", prof: "Carlos Menezes", turma: "9º A", disc: "Matemática", tipo: "Diário", atraso: 9, prazo: "26/09" },
  { id: "p2", prof: "Juliana Prado", turma: "8º B", disc: "Inglês", tipo: "Notas", atraso: 6, prazo: "30/09" },
  { id: "p3", prof: "Roberto Andrade", turma: "7º A", disc: "História", tipo: "Diário", atraso: 4, prazo: "30/09" },
  { id: "p4", prof: "Fernanda Lopes", turma: "1º EM A", disc: "Química", tipo: "Notas", atraso: 3, prazo: "30/09" },
  { id: "p5", prof: "Marcos Vieira", turma: "9º B", disc: "Geografia", tipo: "Diário", atraso: 2, prazo: "03/10" },
  { id: "p6", prof: "Patrícia Souza", turma: "6º A", disc: "Ciências", tipo: "Notas", atraso: 1, prazo: "03/10" },
  { id: "p7", prof: "André Carvalho", turma: "2º EM B", disc: "Física", tipo: "Diário", atraso: 0, prazo: "06/10" },
  { id: "p8", prof: "Luciana Ramos", turma: "8º A", disc: "Português", tipo: "Notas", atraso: 0, prazo: "06/10" },
];

export const semaforo = (d: number) => (d >= 5 ? RED : d >= 1 ? AMBER : GREEN);
