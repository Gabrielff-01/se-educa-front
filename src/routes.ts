/* Rotas: lista de telas e qual tela abre pra cada perfil. */

import type { Perfil } from "@/types";

export const SCREENS = [
  "splash", "login", "cadastro", "alunoHome", "responsavelHome", "notas", "frequencia", "horarios", "boletim",
  "matricula", "escolas", "acompanhamento", "secretariaVirtual", "notificacoes",
  "perfil", "configuracoes", "professorHome", "escolaHome", "secretariaHome", "calendario", "chat",
  "tarefas", "comunicados", "historico", "profNotas", "profFrequencia", "profDiario", "profPlanejamento",
  "admMatriculas", "admTurmas", "admProfessores", "admHorarios", "admDiario", "admBoletins",
  "secMatriculas", "secEnturmacao", "secPedagogico", "secCargaHoraria", "secRegional",
  "mapaEstudos", "transporte", "merenda", "mapaEscolas", "secPesquisas", "biblioteca", "gestorFreqSocial", "gestorPendencias",
  "diesEscolas", "diesTurmas", "diesCursos", "diesCalendario", "dedAtos", "dedOfertas", "dedMatrizes", "rhProfessores", "rhLotacoes",
  "rhPainel", "rhCarencias", "rhAfastamentos", "admAlunos", "historicoAlteracoes", "escPedidos", "diesPedidos",
  "documentos", "escDocumentos", "fichaEscola",
  "telas",
] as const;

export type ScreenId = (typeof SCREENS)[number];

/* Lê a tela do endereço do navegador. Ex.: "site.com/#/notas" -> "notas" */
export function screenFromHash(): ScreenId | null {
  const h = window.location.hash.replace(/^#\/?/, "");
  return (SCREENS as readonly string[]).includes(h) ? (h as ScreenId) : null;
}

export const HOME_BY_PERFIL: Record<Perfil, ScreenId> = { aluno: "alunoHome", responsavel: "responsavelHome", professor: "professorHome", escola: "escolaHome", secretaria: "secretariaHome" };

export const PERFIL_BY_SCREEN: Partial<Record<ScreenId, Perfil>> = {
  alunoHome: "aluno", responsavelHome: "responsavel",
  professorHome: "professor", profNotas: "professor", profFrequencia: "professor", profDiario: "professor", profPlanejamento: "professor",
  escolaHome: "escola", admMatriculas: "escola", admTurmas: "escola", admProfessores: "escola", admHorarios: "escola", admDiario: "escola", admBoletins: "escola", gestorFreqSocial: "escola", gestorPendencias: "escola", biblioteca: "aluno",
  secretariaHome: "secretaria", secMatriculas: "secretaria", secEnturmacao: "secretaria", secPedagogico: "secretaria", secCargaHoraria: "secretaria", secRegional: "secretaria", secPesquisas: "secretaria",
  diesEscolas: "secretaria", diesTurmas: "secretaria", diesCursos: "secretaria", diesCalendario: "secretaria",
  dedAtos: "secretaria", dedOfertas: "secretaria", dedMatrizes: "secretaria", rhProfessores: "secretaria", rhLotacoes: "secretaria",
  rhPainel: "secretaria", rhCarencias: "secretaria", rhAfastamentos: "secretaria", admAlunos: "escola", escPedidos: "escola", diesPedidos: "secretaria", escDocumentos: "escola",
};
