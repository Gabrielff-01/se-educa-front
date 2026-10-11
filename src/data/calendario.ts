/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { AMBER, BLUE, GREEN, INDIGO, PINK, TEAL, VIOLET } from "@/theme/colors";

export type EvTipo = "prova" | "trabalho" | "evento" | "olimpiada";
export type EvCal = { id: string; m: number; d: number; t: string; tipo: EvTipo; c: string; sigla?: string; nome?: string; fase?: string; nivel?: string };

export const OLIMPIADAS: { sigla: string; nome: string; c: string }[] = [
  { sigla: "OBMEP", nome: "Olimpíada Brasileira de Matemática das Escolas Públicas", c: BLUE },
  { sigla: "OBA", nome: "Olimpíada Brasileira de Astronomia e Astronáutica", c: INDIGO },
  { sigla: "OBF", nome: "Olimpíada Brasileira de Física", c: TEAL },
  { sigla: "OBQ", nome: "Olimpíada Brasileira de Química", c: PINK },
  { sigla: "OBB", nome: "Olimpíada Brasileira de Biologia", c: GREEN },
  { sigla: "ONHB", nome: "Olimpíada Nacional em História do Brasil", c: "#b45309" },
  { sigla: "OLP", nome: "Olimpíada de Língua Portuguesa", c: VIOLET },
];

export const olimp = (s: string) => OLIMPIADAS.find((o) => o.sigla === s)!;

export const EVENTOS_CAL: EvCal[] = ([
  { id: "e1", m: 8, d: 5, t: "Prova de Matemática", tipo: "prova", c: BLUE },
  { id: "e2", m: 8, d: 12, t: "Entrega do trabalho de Ciências", tipo: "trabalho", c: GREEN },
  { id: "e3", m: 8, d: 15, t: "Reunião de pais e mestres", tipo: "evento", c: AMBER },
  { id: "e4", m: 8, d: 19, t: "Prova de Português", tipo: "prova", c: BLUE },
  { id: "e5", m: 8, d: 26, t: "Feira de Ciências", tipo: "evento", c: AMBER },
  { id: "e6", m: 9, d: 3, t: "Seminário de História", tipo: "trabalho", c: GREEN },
  { id: "e7", m: 9, d: 15, t: "Dia do Professor", tipo: "evento", c: AMBER },
  { id: "e8", m: 9, d: 24, t: "Prova de Geografia", tipo: "prova", c: BLUE },
  { id: "e9", m: 10, d: 7, t: "Trabalho de Artes", tipo: "trabalho", c: GREEN },
  { id: "e10", m: 10, d: 20, t: "Consciência Negra · Mostra cultural", tipo: "evento", c: AMBER },
  { id: "o1", m: 8, d: 9, t: "ONHB · 5ª fase", tipo: "olimpiada", sigla: "ONHB", fase: "5ª fase online", nivel: "8º e 9º ano / Ensino Médio", c: "" },
  { id: "o2", m: 8, d: 17, t: "OBQ · Fase II", tipo: "olimpiada", sigla: "OBQ", fase: "Fase II · prova escrita", nivel: "Ensino Médio", c: "" },
  { id: "o3", m: 8, d: 23, t: "OBF · 2ª fase", tipo: "olimpiada", sigla: "OBF", fase: "2ª fase", nivel: "Níveis 1 a 3 (9º ano ao EM)", c: "" },
  { id: "o4", m: 9, d: 2, t: "OLP · Semifinal", tipo: "olimpiada", sigla: "OLP", fase: "Semifinal regional", nivel: "5º ano ao Ensino Médio", c: "" },
  { id: "o5", m: 9, d: 11, t: "OBMEP · 2ª fase", tipo: "olimpiada", sigla: "OBMEP", fase: "2ª fase · prova discursiva", nivel: "Nível 2 (8º e 9º ano)", c: "" },
  { id: "o6", m: 9, d: 21, t: "OBB · Inscrições 2026", tipo: "olimpiada", sigla: "OBB", fase: "Abertura de inscrições", nivel: "Ensino Médio", c: "" },
  { id: "o7", m: 10, d: 14, t: "OBA · Resultados", tipo: "olimpiada", sigla: "OBA", fase: "Divulgação de resultados e medalhas", nivel: "Níveis 1 a 4", c: "" },
] as EvCal[]).map((e) => (e.sigla ? { ...e, c: olimp(e.sigla).c, nome: olimp(e.sigla).nome } : e));

export const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
export const TIPO_CAL: Record<EvTipo, string> = { prova: "Prova", trabalho: "Trabalho", evento: "Evento", olimpiada: "Olimpíada" };
