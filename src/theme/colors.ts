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

export function shade(hex: string) {
  const map: Record<string, string> = { [TEAL]: "#065f73", [GREEN]: "#0a7d5a", [AMBER]: "#b45309", [BLUE]: BLUE_DARK, [INDIGO]: "#4338ca" };
  return map[hex] ?? BLUE_DARK;
}
