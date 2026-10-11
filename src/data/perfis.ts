/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { IconBook, IconGrad, IconGrid, IconShield, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { AMBER, BLUE, GREEN, INDIGO, TEAL } from "@/theme/colors";
import type { Perfil } from "@/types";

export const PERFIS: { id: Perfil; label: string; Icon: (p: IconProps) => React.ReactElement; cor: string }[] = [
  { id: "aluno", label: "Aluno", Icon: IconGrad, cor: BLUE },
  { id: "responsavel", label: "Responsável", Icon: IconUsers, cor: INDIGO },
  { id: "professor", label: "Professor", Icon: IconBook, cor: TEAL },
  { id: "escola", label: "Escola", Icon: IconGrid, cor: GREEN },
  { id: "secretaria", label: "Secretaria", Icon: IconShield, cor: AMBER },
];
