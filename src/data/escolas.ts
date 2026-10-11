/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import type { EscCtx } from "@/types";

export type FiltroEsc = "especializado" | "surdos" | "autismo" | "acessibilidade" | "eja";
export const INFRA_LABEL = { quadra: "Quadra", informatica: "Sala de informática", biblioteca: "Biblioteca", refeitorio: "Refeitório", acessivel: "Acessibilidade", internet: "Internet", ar: "Ar-condicionado" } as const;
export type Infra = keyof typeof INFRA_LABEL;
export type VagaEt = { etapa: string; turno: "Matutino" | "Vespertino" | "Noturno" | "Integral"; n: number };
export type EscolaRede = { id: string; nome: string; bairro: string; cidade: string; dist: string; alunos: number; servidores: number; vagasDet: VagaEt[]; infra: Infra[]; filtros: FiltroEsc[]; x: number; y: number; lat: number; lng: number };

export const ESCOLAS_MAPA: EscolaRede[] = [
  { id: "e1", nome: "E.M.E.F. Poeta João Ribeiro", bairro: "Centro", cidade: "Aracaju", dist: "1,1 km", alunos: 842, servidores: 64, vagasDet: [{ etapa: "Anos iniciais", turno: "Matutino", n: 18 }, { etapa: "Anos finais", turno: "Vespertino", n: 26 }, { etapa: "EJA", turno: "Noturno", n: 14 }], infra: ["quadra", "informatica", "biblioteca", "refeitorio", "acessivel", "internet"], filtros: ["especializado", "acessibilidade", "autismo", "eja"], x: 245, y: 125, lat: -10.912, lng: -37.051 },
  { id: "e2", nome: "E.M. Profª Laudelina Gonçalves", bairro: "Luzia", cidade: "Aracaju", dist: "0,9 km", alunos: 615, servidores: 41, vagasDet: [{ etapa: "Educação infantil", turno: "Matutino", n: 8 }, { etapa: "EJA", turno: "Noturno", n: 14 }], infra: ["quadra", "refeitorio", "internet", "ar"], filtros: ["eja"], x: 95, y: 228, lat: -10.938, lng: -37.063 },
  { id: "e3", nome: "Centro de Ensino Bilíngue para Surdos", bairro: "São José", cidade: "Aracaju", dist: "1,6 km", alunos: 210, servidores: 38, vagasDet: [{ etapa: "Anos iniciais", turno: "Integral", n: 5 }, { etapa: "Anos finais", turno: "Vespertino", n: 4 }], infra: ["informatica", "biblioteca", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "surdos", "acessibilidade"], x: 185, y: 160, lat: -10.92, lng: -37.057 },
  { id: "e4", nome: "E.M.E.F. Santa Maria", bairro: "Santa Maria", cidade: "Aracaju", dist: "6,3 km", alunos: 1104, servidores: 72, vagasDet: [{ etapa: "Anos finais", turno: "Matutino", n: 0 }, { etapa: "EJA", turno: "Noturno", n: 3 }], infra: ["quadra", "refeitorio"], filtros: ["eja"], x: 40, y: 310, lat: -10.98, lng: -37.08 },
  { id: "e5", nome: "Escola Inclusiva Jardins", bairro: "Jardins", cidade: "Aracaju", dist: "2,0 km", alunos: 480, servidores: 45, vagasDet: [{ etapa: "Educação infantil", turno: "Integral", n: 9 }, { etapa: "Anos iniciais", turno: "Matutino", n: 12 }, { etapa: "Anos finais", turno: "Vespertino", n: 10 }], infra: ["quadra", "informatica", "biblioteca", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "autismo", "acessibilidade", "surdos"], x: 135, y: 180, lat: -10.945, lng: -37.055 },
  { id: "e6", nome: "E.M. Atalaia Nova", bairro: "Atalaia", cidade: "Aracaju", dist: "4,5 km", alunos: 530, servidores: 36, vagasDet: [{ etapa: "Anos iniciais", turno: "Vespertino", n: 6 }, { etapa: "EJA", turno: "Noturno", n: 8 }], infra: ["quadra", "biblioteca", "refeitorio", "internet"], filtros: ["acessibilidade", "eja"], x: 280, y: 255, lat: -10.985, lng: -37.047 },
  { id: "e7", nome: "E.M.E.F. Tobias Barreto", bairro: "Siqueira Campos", cidade: "Aracaju", dist: "2,7 km", alunos: 728, servidores: 52, vagasDet: [{ etapa: "Anos iniciais", turno: "Matutino", n: 0 }, { etapa: "Anos finais", turno: "Vespertino", n: 0 }], infra: ["quadra", "biblioteca", "refeitorio", "internet"], filtros: [], x: 70, y: 140, lat: -10.925, lng: -37.072 },
  { id: "e8", nome: "E.M. Prof. José Conrado de Araújo", bairro: "Farolândia", cidade: "Aracaju", dist: "3,5 km", alunos: 905, servidores: 61, vagasDet: [{ etapa: "Anos finais", turno: "Integral", n: 12 }, { etapa: "EJA", turno: "Noturno", n: 20 }], infra: ["quadra", "informatica", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "acessibilidade", "eja", "autismo"], x: 210, y: 220, lat: -10.966, lng: -37.058 },
  { id: "e9", nome: "E.M.E.F. Manoel Bomfim", bairro: "Jardim Rosa Elze", cidade: "São Cristóvão", dist: "11,8 km", alunos: 670, servidores: 44, vagasDet: [{ etapa: "Anos iniciais", turno: "Vespertino", n: 15 }], infra: ["quadra", "refeitorio", "acessivel"], filtros: ["acessibilidade"], x: 20, y: 260, lat: -10.925, lng: -37.104 },
  { id: "e10", nome: "E.M. Maria do Carmo Alves", bairro: "Conjunto Marcos Freire", cidade: "N. Sra. do Socorro", dist: "9,4 km", alunos: 1012, servidores: 70, vagasDet: [{ etapa: "Educação infantil", turno: "Matutino", n: 10 }, { etapa: "EJA", turno: "Noturno", n: 16 }], infra: ["quadra", "informatica", "refeitorio", "internet"], filtros: ["eja", "surdos", "especializado"], x: 60, y: 45, lat: -10.853, lng: -37.12 },
];

export const vagasTot = (e: EscolaRede) => e.vagasDet.reduce((s, v) => s + v.n, 0);
export const FILTRO_ITENS: { id: FiltroEsc; label: string }[] = [{ id: "especializado", label: "Atendimento especializado" }, { id: "surdos", label: "Alunos surdos" }, { id: "autismo", label: "Autismo" }, { id: "acessibilidade", label: "Acessibilidade" }, { id: "eja", label: "EJA" }];
export const FILTRO_TAG: Record<FiltroEsc, string> = { especializado: "AEE", surdos: "Libras", autismo: "TEA", acessibilidade: "Acessível", eja: "EJA" };

export const CTX_INFO: Record<EscCtx, { t: string; s: string }> = {
  todas: { t: "Escolas da rede", s: "Lista completa · Aracaju e região" },
  vagas: { t: "Escolas com vagas", s: "Vagas abertas por etapa e turno" },
  alunos: { t: "Alunos por escola", s: "Matrículas ativas na rede" },
  servidores: { t: "Servidores por escola", s: "Quadro de pessoal da rede" },
};
