/* Formatação no jeito brasileiro. */

/* "2026-02-09" -> "09/02/2026" (a API manda as datas no formato ISO) */
export function dataBR(iso: string | null | undefined) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/* 833.333 -> "833,3" */
export function horasBR(horas: number) {
  return horas.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

/* Transforma uma lista da API em opções de <select>: [{ valor: "1", nome: "Atheneu" }] */
export function opcoesDe<T extends { id: number }>(lista: T[] | null, nome: (item: T) => string) {
  return (lista ?? []).map((item) => ({ valor: String(item.id), nome: nome(item) }));
}

export const ANO_ATUAL = new Date().getFullYear();

/* Nota: "7.50" ou 7.5 -> "7,5". Sem nota -> "—" */
export function notaBR(valor: string | number | null | undefined) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/* Porcentagem: 93.66 -> "93,7%". Sem valor -> "—" */
export function porcentoBR(valor: number | null | undefined) {
  if (valor === null || valor === undefined) return "—";
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

/* Hora: "07:00:00" -> "07:00" */
export function horaCurta(hora: string) {
  return hora.slice(0, 5);
}

/* Data e hora: "2026-10-20T10:00:32-03:00" -> "20/10/2026 10:00" */
export function dataHoraBR(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* Hoje no formato da API: "2026-10-20" (no fuso do computador, não em UTC) */
export function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
