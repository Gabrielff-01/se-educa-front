/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { AMBER, BLUE, GREEN, RED, TEAL, VIOLET } from "@/theme/colors";

export const REDE_MATR = [
  { reg: "Aracaju", conf: "18.420", vagas: 640, fila: 210 },
  { reg: "N. Sra. do Socorro", conf: "9.210", vagas: 180, fila: 95 },
  { reg: "Lagarto", conf: "7.650", vagas: 220, fila: 40 },
  { reg: "Itabaiana", conf: "6.120", vagas: 150, fila: 28 },
];

export const FILA_ENT = [
  { nome: "Miguel Santos Rocha", serie: "6º ano", escola: "E.M. João Ribeiro", sugestao: "6º ano A" },
  { nome: "Laura Fontes Dias", serie: "1ª série", escola: "E.M. Tobias Barreto", sugestao: "1ª série B" },
  { nome: "Davi Oliveira Melo", serie: "8º ano", escola: "E.M. José Conrado", sugestao: "8º ano A" },
  { nome: "Sofia Andrade Reis", serie: "7º ano", escola: "E.M. Manoel Bomfim", sugestao: "7º ano C" },
];

export const IDEB_ESCOLAS = [
  { esc: "E.M. Tobias Barreto", ideb: "6,2", meta: "6,0", cor: GREEN },
  { esc: "E.M. João Ribeiro", ideb: "5,9", meta: "6,0", cor: AMBER },
  { esc: "E.M. José Conrado", ideb: "5,1", meta: "5,8", cor: RED },
];

export const CONTRATACOES = [
  { cargo: "Professor de Matemática", vagas: 6, status: "Edital aberto", cor: GREEN },
  { cargo: "Professor de Inglês", vagas: 3, status: "Em análise", cor: AMBER },
  { cargo: "Coordenador Pedagógico", vagas: 2, status: "Concluído", cor: BLUE },
];

export const CARGA_HOR = [
  { esc: "E.M. João Ribeiro", contratada: 1840, cumprida: 1790, cor: GREEN },
  { esc: "E.M. Tobias Barreto", contratada: 1520, cumprida: 1610, cor: AMBER },
  { esc: "E.M. José Conrado", contratada: 1280, cumprida: 1120, cor: RED },
];

export const OFICIOS = [
  { num: "OF. 2025/214", assunto: "Solicitação de merenda adicional", status: "Respondido", cor: GREEN, data: "12/09" },
  { num: "OF. 2025/219", assunto: "Repasse de material didático", status: "Em análise", cor: AMBER, data: "15/09" },
  { num: "OF. 2025/223", assunto: "Reforma da quadra — E.M. Atalaia", status: "Enviado", cor: BLUE, data: "16/09" },
];

export const PESQUISAS = [
  { id: "p1", termo: "Vagas para alunos com necessidades especiais", volume: 1284, var: 62, cor: RED, destaque: true },
  { id: "p2", termo: "Matrícula EJA noturno", volume: 742, var: 18, cor: AMBER },
  { id: "p3", termo: "Escola com tempo integral", volume: 615, var: 9, cor: BLUE },
  { id: "p4", termo: "Transporte escolar zona rural", volume: 388, var: -4, cor: TEAL },
  { id: "p5", termo: "Creche em período integral", volume: 352, var: 12, cor: VIOLET },
];

export const SERIE_SEM = [310, 335, 360, 420, 505, 610, 790, 1284];

export const REGIOES = [
  { r: "Centro", atual: 93.4, ant: 92.1 },
  { r: "Zona Sul", atual: 91.2, ant: 91.8 },
  { r: "Zona Oeste", atual: 88.6, ant: 87.0 },
  { r: "Zona Norte", atual: 84.7, ant: 86.3 },
  { r: "Zona de Expansão", atual: 82.1, ant: 83.5 },
  { r: "N. Sra. do Socorro", atual: 86.9, ant: 85.4 },
  { r: "São Cristóvão", atual: 89.3, ant: 88.8 },
  { r: "Barra dos Coqueiros", atual: 90.5, ant: 89.1 },
];

export const fmtPct = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
