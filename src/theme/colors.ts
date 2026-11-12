/* Paleta de cores do SE Educa. */

export const BLUE = "#1a6fd4";
export const GREEN = "#10b981";
export const TEAL = "#0891b2";
export const AMBER = "#f59e0b";
export const RED = "#ef4444";
export const INDIGO = "#6366f1";
export const VIOLET = "#8b5cf6";
export const PINK = "#ec4899";
export const INK = "#0f2135";
export const INK_SOFT = "#47586b";
export const BLUE_DARK = "#0f4c96";

/* Tons claros para os cartões coloridos do Início (fundo) */
export const TINT_BLUE = "#dbe8fa";
export const TINT_TEAL = "#d3eef3";
export const TINT_GREEN = "#d9f3e7";
export const TINT_LILAC = "#e7e4fb";
export const SURFACE = "#eef3f9";

/* Cor de cada tipo de login (como era no começo do SE Educa):
   aluno = azul, responsável = índigo, professor = azul-petróleo, escola = verde, secretaria = laranja.
   O App coloca a cor do perfil logado nas variáveis CSS --perfil...; as telas usam PERFIL, PERFIL_ESCURA etc.
   Sem login (tela de entrada), fica o azul. */
export type TemaPerfil = { cor: string; escura: string; luz: string; clara: string };
export const TEMA_PERFIL: Record<"aluno" | "responsavel" | "professor" | "escola" | "secretaria", TemaPerfil> = {
  aluno: { cor: BLUE, escura: BLUE_DARK, luz: "#2a8be0", clara: "#dbe8fa" },
  responsavel: { cor: "#5b5ce6", escura: "#3730a3", luz: "#7c83f5", clara: "#e4e4fb" },
  professor: { cor: TEAL, escura: "#065f73", luz: "#22a9c9", clara: "#d3eef3" },
  escola: { cor: "#0d9668", escura: "#065f46", luz: "#23b984", clara: "#d9f3e7" },
  secretaria: { cor: "#e07408", escura: "#9a3f07", luz: "#f59e0b", clara: "#fdebd3" },
};
export const PERFIL = "var(--perfil)";
export const PERFIL_ESCURA = "var(--perfil-escura)";
export const PERFIL_LUZ = "var(--perfil-luz)";
export const PERFIL_CLARA = "var(--perfil-clara)";

export function shade(hex: string) {
  const map: Record<string, string> = { [TEAL]: "#065f73", [GREEN]: "#0a7d5a", [AMBER]: "#b45309", [BLUE]: BLUE_DARK, [INDIGO]: "#4338ca" };
  return map[hex] ?? BLUE_DARK;
}
