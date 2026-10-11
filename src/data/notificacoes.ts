/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { IconAlert, IconBus, IconCalendar, IconChart, IconChat, IconClock, IconEdit, IconFood, IconTrend, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INDIGO, RED, TEAL, VIOLET } from "@/theme/colors";

export type NotiSec = { id: string; t: string; d: string; h: string; Icon: (p: IconProps) => React.ReactElement; cor: string; cat: "urgente" | "demanda" | "rede" | "prazos"; dia: "Hoje" | "Ontem" | "Esta semana"; acao?: { label: string; s: ScreenId } };

export const NOTIS_SEC: NotiSec[] = [
  { id: "n1", t: "Alta demanda: vagas especiais", d: "Buscas por vagas para alunos com necessidades especiais subiram 62% na semana. Zona Norte concentra 412 buscas.", h: "08:12", Icon: IconTrend, cor: RED, cat: "urgente", dia: "Hoje", acao: { label: "Ver análise", s: "secPesquisas" } },
  { id: "n2", t: "Escola sem vagas AEE", d: "E.M.E.F. Santa Maria zerou as vagas de atendimento especializado. 176 famílias procuraram a unidade.", h: "07:45", Icon: IconAlert, cor: RED, cat: "urgente", dia: "Hoje", acao: { label: "Ver no mapa", s: "mapaEscolas" } },
  { id: "n3", t: "Fila de enturmação", d: "38 alunos aguardam enturmação há mais de 5 dias na Regional Centro.", h: "07:30", Icon: IconUsers, cor: AMBER, cat: "demanda", dia: "Hoje", acao: { label: "Enturmar", s: "secEnturmacao" } },
  { id: "n4", t: "Carga horária abaixo do mínimo", d: "4 escolas estão abaixo das 800h anuais previstas na LDB. Prazo de ajuste: 15/10.", h: "06:58", Icon: IconClock, cor: AMBER, cat: "prazos", dia: "Hoje", acao: { label: "Ver escolas", s: "secCargaHoraria" } },
  { id: "n5", t: "Ofício respondido", d: "Diretoria Regional 08 respondeu sobre a contratação de 6 intérpretes de Libras.", h: "18:20", Icon: IconChat, cor: INDIGO, cat: "rede", dia: "Ontem", acao: { label: "Abrir conversa", s: "secRegional" } },
  { id: "n6", t: "Matrículas 2027 · balanço", d: "1.284 vagas abertas na rede; 412 pré-matrículas recebidas nas primeiras 48h.", h: "16:05", Icon: IconEdit, cor: BLUE, cat: "rede", dia: "Ontem", acao: { label: "Ver matrículas", s: "secMatriculas" } },
  { id: "n7", t: "Censo Escolar — prazo", d: "Envio da 2ª etapa (situação do aluno) ao INEP encerra em 12 dias. 9 escolas pendentes.", h: "14:40", Icon: IconCalendar, cor: VIOLET, cat: "prazos", dia: "Ontem" },
  { id: "n8", t: "Transporte escolar sem rastreio", d: "Linha L-022 (Santa Maria) segue sem GPS. Licitação do rastreamento em análise.", h: "Seg", Icon: IconBus, cor: TEAL, cat: "rede", dia: "Esta semana" },
  { id: "n9", t: "IDEB parcial atualizado", d: "Rede atingiu 5,8 (meta 6,0). 12 escolas abaixo da meta individual.", h: "Seg", Icon: IconChart, cor: GREEN, cat: "rede", dia: "Esta semana", acao: { label: "Gestão pedagógica", s: "secPedagogico" } },
  { id: "n10", t: "Merenda — prestação PNAE", d: "Prestação de contas do 3º bimestre aprovada pelo FNDE.", h: "Dom", Icon: IconFood, cor: GREEN, cat: "prazos", dia: "Esta semana" },
];
