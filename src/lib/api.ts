/* Conversa com a API Django (se-educa-api).

   - API_URL: endereço da API. No seu PC é o runserver; na Vercel vem da variável VITE_API_URL.
   - login(): manda usuário e senha e guarda o "crachá" (token JWT) no navegador.
   - api(): faz qualquer pedido já mostrando o crachá. Se ele venceu, tenta renovar uma vez. */

import type { Usuario } from "@/lib/tipos";

export const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const CHAVE = "se-educa-sessao";

export type Sessao = { access: string; refresh: string; usuario: Usuario };

/* Erro que a API devolveu, já com a mensagem pronta pra mostrar na tela.
   - message: a primeira mensagem (serve pra mostrar num aviso só)
   - geral: erros que não são de um campo (ex.: "A matriz soma 733 horas...")
   - campos: o erro de cada campo do formulário: { letra: "Use 1 ou 2 letras..." }
   - dados: a resposta inteira, do jeito que veio (ex.: o erro de cada aluno ao lançar notas) */
export class ErroApi extends Error {
  status: number;
  geral: string;
  campos: Record<string, string>;
  dados: unknown;
  constructor(mensagem: string, status: number, campos: Record<string, string> = {}, geral = mensagem, dados: unknown = null) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
    this.geral = geral;
    this.dados = dados;
  }
}

export function sessaoAtual(): Sessao | null {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? (JSON.parse(salvo) as Sessao) : null;
  } catch {
    return null; // modo anônimo ou dado estragado: trata como deslogado
  }
}

function salvarSessao(sessao: Sessao | null) {
  try {
    if (sessao) localStorage.setItem(CHAVE, JSON.stringify(sessao));
    else localStorage.removeItem(CHAVE);
  } catch {
    /* sem localStorage: a sessão só dura até recarregar a página */
  }
}

/* Junta mensagens que vêm em listas ou dentro de objetos (ex.: erro de um item da matriz). */
function textoDe(valor: unknown): string {
  if (Array.isArray(valor)) return valor.map(textoDe).filter(Boolean).join(" ");
  if (valor && typeof valor === "object") return Object.values(valor).map(textoDe).filter(Boolean).join(" ");
  return valor == null ? "" : String(valor);
}

/* Transforma a resposta de erro do Django REST Framework numa mensagem só.
   Ex.: { serie: ["Essa escola não oferece..."] } -> "Essa escola não oferece..." */
function lerErro(dados: unknown, status: number): ErroApi {
  if (status === 0) return new ErroApi("Não consegui falar com o servidor. Ele está ligado?", 0);
  if (!dados || typeof dados !== "object") return new ErroApi(`Erro ${status} no servidor.`, status);
  const campos: Record<string, string> = {};
  const mensagens: string[] = [];
  for (const [campo, valor] of Object.entries(dados as Record<string, unknown>)) {
    const texto = textoDe(valor);
    if (campo === "detail" || campo === "non_field_errors") mensagens.push(texto);
    else campos[campo] = texto;
  }
  const primeira = mensagens[0] ?? Object.values(campos)[0] ?? `Erro ${status} no servidor.`;
  return new ErroApi(primeira, status, campos, mensagens.join(" "), dados);
}

async function pedir(caminho: string, opcoes: RequestInit, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    return await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });
  } catch {
    throw new ErroApi("Não consegui falar com o servidor. Ele está ligado?", 0);
  }
}

export async function login(username: string, password: string): Promise<Sessao> {
  const resposta = await pedir("/api/auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw lerErro(dados, resposta.status);
  salvarSessao(dados as Sessao);
  return dados as Sessao;
}

export function logout() {
  salvarSessao(null);
}

/* Pede um novo crachá de acesso usando o de renovação (vale 7 dias). */
async function renovar(sessao: Sessao): Promise<Sessao | null> {
  const resposta = await pedir("/api/auth/refresh/", { method: "POST", body: JSON.stringify({ refresh: sessao.refresh }) });
  if (!resposta.ok) return null;
  const { access } = await resposta.json();
  const nova = { ...sessao, access };
  salvarSessao(nova);
  return nova;
}

/* Pedido genérico. Ex.: api<Escola[]>("/api/escolas/")
   ou api("/api/turmas/", { method: "POST", body: { escola: 1, ... } }) */
export async function api<T>(caminho: string, { method = "GET", body }: { method?: string; body?: unknown } = {}): Promise<T> {
  let sessao = sessaoAtual();
  if (!sessao) throw new ErroApi("Faça login para ver estes dados.", 401);
  const opcoes: RequestInit = { method, body: body === undefined ? undefined : JSON.stringify(body) };

  let resposta = await pedir(caminho, opcoes, sessao.access);
  if (resposta.status === 401) {
    sessao = await renovar(sessao);
    if (!sessao) {
      logout();
      throw new ErroApi("Sua sessão expirou. Entre de novo.", 401);
    }
    resposta = await pedir(caminho, opcoes, sessao.access);
  }

  if (resposta.status === 204) return undefined as T; // DELETE não devolve nada
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw lerErro(dados, resposta.status);
  return dados as T;
}
