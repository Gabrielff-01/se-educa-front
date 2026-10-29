/* O que as duas telas de documentos (da família e da escola) usam em comum. */

import type { Documento } from "@/lib/tipos";
import { AMBER, GREEN, RED } from "@/theme/colors";

/* Os tipos que a API aceita, em grupos (o mesmo "valor" do models.py da API). */
export const GRUPOS_DE_TIPOS: { grupo: string; tipos: { valor: string; nome: string }[] }[] = [
  {
    grupo: "Saúde e faltas",
    tipos: [
      { valor: "atestado", nome: "Atestado médico" },
      { valor: "justificativa", nome: "Justificativa de falta" },
      { valor: "laudo", nome: "Laudo ou relatório médico (AEE)" },
      { valor: "vacina", nome: "Cartão de vacinação" },
      { valor: "sus", nome: "Cartão do SUS" },
    ],
  },
  {
    grupo: "Matrícula e cadastro",
    tipos: [
      { valor: "certidao", nome: "Certidão de nascimento" },
      { valor: "rg_cpf", nome: "RG ou CPF do aluno" },
      { valor: "doc_responsavel", nome: "Documento do responsável" },
      { valor: "residencia", nome: "Comprovante de residência" },
      { valor: "foto", nome: "Foto 3x4" },
      { valor: "historico", nome: "Histórico ou declaração da escola anterior" },
      { valor: "nis", nome: "Comprovante do NIS / Bolsa Família" },
    ],
  },
  {
    grupo: "Outros",
    tipos: [
      { valor: "autorizacao", nome: "Autorização assinada (passeio, saída)" },
      { valor: "outro", nome: "Outro documento" },
    ],
  },
];

/* Atestado e justificativa cobrem dias de aula: pedem "de" e "até". */
export const TIPOS_COM_PERIODO = ["atestado", "justificativa"];

export const COR_DO_STATUS: Record<Documento["status"], string> = { aguardando: AMBER, aceito: GREEN, recusado: RED };

export const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB, igual à API
export const FORMATOS_ACEITOS = "application/pdf,image/jpeg,image/png";

/* 348123 -> "340 KB"; 2400000 -> "2,3 MB" */
export function tamanhoBR(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}
