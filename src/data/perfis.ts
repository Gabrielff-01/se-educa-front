/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

import { IconBook, IconGrad, IconGrid, IconShield, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { TEMA_PERFIL } from "@/theme/colors";
import type { Perfil } from "@/types";

export const PERFIS: { id: Perfil; label: string; Icon: (p: IconProps) => React.ReactElement; cor: string }[] = [
  { id: "aluno", label: "Aluno", Icon: IconGrad, cor: TEMA_PERFIL.aluno.cor },
  { id: "responsavel", label: "Responsável", Icon: IconUsers, cor: TEMA_PERFIL.responsavel.cor },
  { id: "professor", label: "Professor", Icon: IconBook, cor: TEMA_PERFIL.professor.cor },
  { id: "escola", label: "Escola", Icon: IconGrid, cor: TEMA_PERFIL.escola.cor },
  { id: "secretaria", label: "Secretaria", Icon: IconShield, cor: TEMA_PERFIL.secretaria.cor },
];
