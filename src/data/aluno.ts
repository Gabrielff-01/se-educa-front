/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { AMBER, BLUE, GREEN, RED, TEAL } from "@/theme/colors";

export const ALUNO = { nome: "Ana Beatriz Nunes", turma: "9º ano B", escola: "E.M.E.F. Poeta João Ribeiro", cidade: "Aracaju - SE", matricula: "2025.09384-7" };

export const NOTAS = [
  { mat: "Matemática", n1: 8.5, n2: 7.0, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Português", n1: 9.0, n2: 8.5, media: 8.8, status: "Aprovado", cor: GREEN },
  { mat: "Ciências", n1: 6.0, n2: 5.5, media: 5.8, status: "Recuperação", cor: AMBER },
  { mat: "História", n1: 7.5, n2: 8.0, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Geografia", n1: 8.0, n2: 7.5, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Inglês", n1: 4.5, n2: 5.0, media: 4.8, status: "Reprovado", cor: RED },
];

export const FREQ = [
  { mat: "Matemática", pct: 96, faltas: 3 },
  { mat: "Português", pct: 92, faltas: 6 },
  { mat: "Ciências", pct: 88, faltas: 9 },
  { mat: "História", pct: 98, faltas: 1 },
  { mat: "Inglês", pct: 74, faltas: 18 },
];

export const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX"];

export const HORARIOS: Record<string, { h: string; m: string; sala: string; cor: string }[]> = {
  SEG: [{ h: "07:00", m: "Matemática", sala: "Sala 12", cor: BLUE }, { h: "07:50", m: "Português", sala: "Sala 12", cor: TEAL }, { h: "08:40", m: "Ciências", sala: "Lab. 2", cor: GREEN }],
  TER: [{ h: "07:00", m: "História", sala: "Sala 12", cor: AMBER }, { h: "07:50", m: "Inglês", sala: "Sala 09", cor: "#8b5cf6" }, { h: "08:40", m: "Ed. Física", sala: "Quadra", cor: GREEN }],
  QUA: [{ h: "07:00", m: "Geografia", sala: "Sala 12", cor: "#ec4899" }, { h: "07:50", m: "Matemática", sala: "Sala 12", cor: BLUE }, { h: "08:40", m: "Artes", sala: "Sala 05", cor: TEAL }],
  QUI: [{ h: "07:00", m: "Português", sala: "Sala 12", cor: TEAL }, { h: "07:50", m: "Ciências", sala: "Lab. 2", cor: GREEN }, { h: "08:40", m: "História", sala: "Sala 12", cor: AMBER }],
  SEX: [{ h: "07:00", m: "Inglês", sala: "Sala 09", cor: "#8b5cf6" }, { h: "07:50", m: "Geografia", sala: "Sala 12", cor: "#ec4899" }, { h: "08:40", m: "Matemática", sala: "Sala 12", cor: BLUE }],
};

export const TAREFAS = [
  { mat: "Matemática", t: "Lista de equações do 2º grau", prazo: "08/09", status: "Pendente", cor: AMBER },
  { mat: "Português", t: "Resenha do livro Vidas Secas", prazo: "12/09", status: "Pendente", cor: AMBER },
  { mat: "Ciências", t: "Relatório da aula prática", prazo: "03/09", status: "Atrasada", cor: RED },
  { mat: "História", t: "Linha do tempo — Brasil Colônia", prazo: "28/08", status: "Entregue", cor: GREEN },
  { mat: "Geografia", t: "Mapa climático do Nordeste", prazo: "25/08", status: "Entregue", cor: GREEN },
];

export const COMUNICADOS = [
  { cat: "Secretaria", t: "Calendário de matrículas 2026", d: "As matrículas da rede municipal abrem em 06/10. Consulte escolas e vagas pelo app.", data: "Hoje", cor: AMBER, novo: true },
  { cat: "Escola", t: "Reunião de pais e mestres", d: "Dia 15/09, às 18h30, no auditório. Presença dos responsáveis é muito importante.", data: "Ontem", cor: GREEN, novo: true },
  { cat: "Turma", t: "Alteração de horário — Inglês", d: "A aula de Inglês de sexta passa a ser no 1º horário a partir da próxima semana.", data: "2 dias", cor: BLUE, novo: false },
  { cat: "Escola", t: "Campanha do agasalho", d: "Traga peças em bom estado até 20/09. Pontos de coleta na entrada.", data: "5 dias", cor: TEAL, novo: false },
];

export const HISTORICO = [
  { ano: "2025", serie: "9º ano", escola: ALUNO.escola, media: "7,3", situacao: "Cursando", cor: BLUE },
  { ano: "2024", serie: "8º ano", escola: ALUNO.escola, media: "8,1", situacao: "Aprovado", cor: GREEN },
  { ano: "2023", serie: "7º ano", escola: "E.M.E.F. Tobias Barreto", media: "7,9", situacao: "Aprovado", cor: GREEN },
  { ano: "2022", serie: "6º ano", escola: "E.M.E.F. Tobias Barreto", media: "8,4", situacao: "Aprovado", cor: GREEN },
];

export const CARDAPIO: Record<string, { almoco: string[]; lanche: string[] }> = {
  SEG: { almoco: ["Arroz branco", "Feijão carioca", "Carne de panela", "Macaxeira cozida", "Salada de tomate"], lanche: ["Suco de caju", "Biscoito de polvilho", "Banana"] },
  TER: { almoco: ["Cuscuz de milho", "Galinha guisada", "Feijão de corda", "Vinagrete"], lanche: ["Iogurte natural", "Pão com manteiga"] },
  QUA: { almoco: ["Arroz com cenoura", "Feijão preto", "Peixe ao molho", "Abóbora refogada"], lanche: ["Suco de acerola", "Bolo de macaxeira"] },
  QUI: { almoco: ["Baião de dois", "Carne de sol desfiada", "Macaxeira frita no forno", "Salada verde"], lanche: ["Mamão", "Biscoito integral", "Suco de goiaba"] },
  SEX: { almoco: ["Arroz branco", "Feijão carioca", "Frango assado", "Purê de inhame"], lanche: ["Pão de queijo", "Iogurte de morango", "Laranja"] },
};
