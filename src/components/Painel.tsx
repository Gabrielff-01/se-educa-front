/* Peças do visual novo das telas de Início (modelo "A com as cores do SE Educa"):
   cartões coloridos com mini gráfico, calendário do mês, faixa da semana, linha do tempo do dia,
   cartão "Aula agora" e os botões redondos do topo (sino, perfil, configurações).

   Elas só desenham: quem busca os dados na API é a tela (AlunoHome, SecretariaHome...). */

import { createContext, useContext, useState } from "react";
import { IconBell, IconChevron, IconGear, IconGrad, IconUser } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import type { EventoAgenda } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PERFIL, PERFIL_CLARA, PERFIL_ESCURA, PERFIL_LUZ, RED, TEAL, TINT_BLUE, TINT_GREEN, TINT_LILAC, TINT_TEAL, VIOLET } from "@/theme/colors";

/* Quantas notificações novas a pessoa tem (o App coloca o número aqui; o sino do Início lê). */
export const NaoLidasContext = createContext(0);

export const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const MESES_CURTOS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
export const DIAS_LONGOS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

/* Cor da bolinha de cada tipo de evento do calendário */
export const COR_EVENTO: Record<string, string> = { prova: BLUE, tarefa: VIOLET, feriado: RED, recesso: AMBER, ferias: TEAL, planejamento: INDIGO, aula: GREEN };

export function saudacao() {
  const hora = new Date().getHours();
  return hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
}

const dois = (n: number) => String(n).padStart(2, "0");
export const isoDe = (d: Date) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
/* O evento cobre o dia? (eventos de vários dias têm "fim"). Comparar texto ISO funciona pra datas. */
const cobre = (e: EventoAgenda, dia: string) => e.data <= dia && (e.fim ?? e.data) >= dia;

/* ---------- Cabeçalho ---------- */

/* Topo do Início no celular: logo + sino + perfil. No computador quem faz isso é o menu lateral. */
export function TopoCelular({ nav, iniciais }: { nav: (s: ScreenId) => void; iniciais: string }) {
  const naoLidas = useContext(NaoLidasContext);
  return (
    <div className="flex items-center gap-2.5 pb-1 pt-3 lg:hidden">
      <div className="grid h-9 w-9 flex-none place-items-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={20} strokeWidth={2} /></div>
      <p className="flex-1 text-[18px] font-extrabold tracking-tight" style={{ color: INK }}>SE Educa</p>
      <BotaoRedondo titulo="Notificações" onClick={() => nav("notificacoes")} ponto={naoLidas > 0}><IconBell size={19} /></BotaoRedondo>
      <button onClick={() => nav("perfil")} aria-label="Meu perfil" className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${PERFIL_LUZ}, ${PERFIL_ESCURA})` }}>{iniciais}</button>
    </div>
  );
}

/* Botões redondos do topo da coluna da direita (computador). */
export function BotoesTopo({ nav }: { nav: (s: ScreenId) => void }) {
  const naoLidas = useContext(NaoLidasContext);
  return (
    <div className="flex justify-end gap-2">
      <BotaoRedondo titulo="Notificações" onClick={() => nav("notificacoes")} ponto={naoLidas > 0}><IconBell size={19} /></BotaoRedondo>
      <BotaoRedondo titulo="Meu perfil" onClick={() => nav("perfil")}><IconUser size={19} /></BotaoRedondo>
      <BotaoRedondo titulo="Configurações" onClick={() => nav("configuracoes")}><IconGear size={19} /></BotaoRedondo>
    </div>
  );
}

function BotaoRedondo({ titulo, onClick, ponto = false, children }: { titulo: string; onClick: () => void; ponto?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={titulo} aria-label={titulo} className="relative grid h-10 w-10 place-items-center rounded-full border bg-white transition hover:border-[color:var(--perfil)]" style={{ borderColor: "#d6dee8", color: INK_SOFT }}>
      {children}
      {ponto && <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white" style={{ background: RED }} />}
    </button>
  );
}

/* "Bom dia, Pedro!" + uma frase com o resumo do dia. */
export function Saudacao({ nome, resumo }: { nome: string; resumo: React.ReactNode }) {
  return (
    <div className="pt-2 lg:pt-1">
      <h1 className="text-[27px] font-extrabold leading-tight tracking-tight lg:text-[34px]" style={{ color: INK }}>{saudacao()}, {nome}!</h1>
      <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed lg:text-[14.5px]" style={{ color: INK_SOFT }}>{resumo}</p>
    </div>
  );
}

/* ---------- Cartões coloridos ---------- */

export type CorCartao = "azul" | "agua" | "verde" | "lilas";
const FUNDO: Record<CorCartao, string> = { azul: TINT_BLUE, agua: TINT_TEAL, verde: TINT_GREEN, lilas: TINT_LILAC };
const DESENHO: Record<CorCartao, string> = { azul: BLUE, agua: TEAL, verde: GREEN, lilas: VIOLET };
export type Enfeite = "losango" | "coracao" | "estrela" | "circulo";

/* Formas de enfeite no canto do cartão (só decoração, bem clarinhas). */
function FormaEnfeite({ forma, cor }: { forma: Enfeite; cor: string }) {
  const d = {
    losango: "M10 40 L60 0 L100 50 L40 100Z",
    coracao: "M50 92 C10 62 0 32 24 16 C40 6 50 20 50 26 C50 20 60 6 76 16 C100 32 90 62 50 92Z",
    estrela: "M50 0 L61 35 L98 35 L68 57 L79 92 L50 70 L21 92 L32 57 L2 35 L39 35Z",
    circulo: "M50 0 A50 50 0 1 1 49.9 0Z",
  }[forma];
  return <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 lg:h-28 lg:w-28" style={{ opacity: 0.16 }}><path d={d} fill={cor} /></svg>;
}

/* Cartão grande e colorido do Início. Clicar leva pra tela do assunto. */
export function CartaoCor({ cor, titulo, enfeite, onClick, className = "", children }: {
  cor: CorCartao; titulo: string; enfeite?: Enfeite; onClick?: () => void; className?: string; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} disabled={!onClick} className={`lift relative overflow-hidden rounded-[22px] p-4 text-left disabled:cursor-default lg:p-5 ${className}`} style={{ background: FUNDO[cor] }}>
      {enfeite && <FormaEnfeite forma={enfeite} cor={DESENHO[cor]} />}
      <h3 className="relative text-[15px] font-extrabold lg:text-[17px]" style={{ color: INK }}>{titulo}</h3>
      <div className="relative">{children}</div>
    </button>
  );
}

/* Linha de números dentro do cartão: [{ v: "7,1", l: "média geral" }, ...] */
export function Numeros({ itens }: { itens: { v: string; l: string; cor?: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
      {itens.map((i) => (
        <div key={i.l} className="min-w-0">
          <p className="text-[19px] font-extrabold leading-tight tabular-nums lg:text-[21px]" style={{ color: i.cor ?? INK }}>{i.v}</p>
          <p className="text-[11.5px] font-medium leading-tight" style={{ color: INK_SOFT }}>{i.l}</p>
        </div>
      ))}
    </div>
  );
}

/* Barrinhas verticais (ex.: média de cada matéria). "linha" desenha o traço da média/mínimo. */
export function MiniBarras({ dados, min = 0, max, linha, rotuloLinha, cor = BLUE, corBaixa = RED, altura = 74 }: {
  dados: { rotulo: string; valor: number }[]; min?: number; max: number; linha?: number; rotuloLinha?: string; cor?: string; corBaixa?: string; altura?: number;
}) {
  if (dados.length === 0) return null;
  // Com poucas barras, cada uma ocupa no máximo 1/5 da largura (senão ficam gordas demais) e o grupo fica no centro
  const w = 100 / Math.max(dados.length, 5);
  const x0 = (100 - w * dados.length) / 2;
  // min > 0 faz o eixo começar mais alto, pra diferenças pequenas (ex.: 93% x 97%) aparecerem
  const y = (v: number) => altura - Math.max(0.04, (Math.min(Math.max(v, min), max) - min) / (max - min)) * altura;
  return (
    <div className="mt-3">
      <svg viewBox={`0 0 100 ${altura}`} preserveAspectRatio="none" className="block w-full" style={{ height: altura }} aria-hidden>
        {dados.map((d, i) => (
          <rect key={d.rotulo + i} x={x0 + i * w + w * 0.34} y={y(d.valor)} width={w * 0.32} height={altura - y(d.valor)} rx={1.6} fill={linha !== undefined && d.valor < linha ? corBaixa : cor} />
        ))}
        {linha !== undefined && <line x1={0} x2={100} y1={y(linha)} y2={y(linha)} stroke={INK} strokeOpacity={0.35} strokeDasharray="2 2" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className="mt-1 flex justify-center">
        {dados.map((d, i) => <span key={d.rotulo + i} className="truncate text-center text-[10px] font-semibold" style={{ width: `${w}%`, color: INK_SOFT }} title={d.rotulo}>{d.rotulo}</span>)}
      </div>
      {rotuloLinha && <p className="mt-0.5 text-[10.5px]" style={{ color: INK_SOFT }}>- - - {rotuloLinha}</p>}
    </div>
  );
}

/* Rosquinha de porcentagem (ex.: frequência média). */
export function Rosca({ valor, cor = GREEN, tamanho = 76 }: { valor: number | null; cor?: string; tamanho?: number }) {
  const r = tamanho / 2 - 7;
  const c = 2 * Math.PI * r;
  const p = valor === null ? 0 : Math.max(0, Math.min(100, valor));
  return (
    <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`} className="flex-none" aria-hidden>
      <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke="#ffffff" strokeOpacity={0.8} strokeWidth={9} />
      <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={cor} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${(c * p) / 100} ${c}`} transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={tamanho * 0.22} fontWeight={800} fill={INK}>{valor === null ? "–" : `${Math.round(valor)}%`}</text>
    </svg>
  );
}

/* Barra horizontal listrada (ex.: frequência de cada regional), com o traço do mínimo. */
export function BarraHorizontal({ rotulo, valor, texto, min = 0, max = 100, limite, cor = BLUE, corBaixa = RED }: {
  rotulo: string; valor: number | null; texto: string; min?: number; max?: number; limite?: number; cor?: string; corBaixa?: string;
}) {
  const pos = (v: number) => `${Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))}%`;
  const baixa = valor !== null && limite !== undefined && valor < limite;
  return (
    <div className="grid grid-cols-[minmax(0,110px)_1fr_44px] items-center gap-2.5 text-[12.5px] lg:grid-cols-[minmax(0,140px)_1fr_48px]">
      <span className="truncate font-medium" style={{ color: INK }} title={rotulo}>{rotulo}</span>
      <div className="relative h-[18px] rounded-lg" style={{ background: "#eef3f9" }}>
        {valor !== null && <div className="listrado absolute inset-y-0 left-0 rounded-lg" style={{ width: pos(valor), backgroundColor: baixa ? corBaixa : cor }} />}
        {limite !== undefined && <span className="absolute -inset-y-1 w-0.5 rounded" style={{ left: pos(limite), background: INK, opacity: 0.45 }} />}
      </div>
      <b className="text-right tabular-nums" style={{ color: baixa ? corBaixa : INK }}>{texto}</b>
    </div>
  );
}

/* ---------- Aula agora ---------- */

export function AulaAgora({ rotulo, titulo, detalhe, progresso, depois, Icon }: {
  rotulo: string; titulo: string; detalhe: string; progresso: number | null; depois?: { titulo: string; detalhe: string } | null; Icon: (p: IconProps) => React.ReactElement;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] p-4 text-white sm:flex-row sm:items-center lg:p-5" style={{ background: `linear-gradient(110deg, ${PERFIL_ESCURA}, ${PERFIL} 65%, ${PERFIL_LUZ})` }}>
      <div className="hidden h-14 w-14 flex-none place-items-center rounded-2xl bg-white/15 sm:grid"><Icon size={28} /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/80">{rotulo}</p>
        <p className="truncate text-[20px] font-extrabold leading-tight lg:text-[22px]">{titulo}</p>
        <p className="truncate text-[12.5px] text-white/85">{detalhe}</p>
        {progresso !== null && <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: `${Math.round(progresso * 100)}%` }} /></div>}
      </div>
      {depois && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/12 px-3.5 py-2.5 text-[12.5px] sm:block sm:min-w-[150px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">Depois</p>
          <p className="font-bold">{depois.titulo}</p>
          <p className="text-white/80">{depois.detalhe}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Calendário ---------- */

/* Calendário do mês com bolinhas nos dias com evento. As setas trocam de mês. */
export function CalendarioMini({ eventos }: { eventos: EventoAgenda[] }) {
  const hoje = new Date();
  const [mes, setMes] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const hojeISO = isoDe(hoje);
  const primeiro = (mes.getDay() + 6) % 7; // semana começando na segunda
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celulas: (Date | null)[] = [...Array(primeiro).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1))];
  while (celulas.length % 7) celulas.push(null);
  const trocar = (n: number) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => trocar(-1)} aria-label="Mês anterior" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" style={{ color: INK }}><IconChevron size={18} style={{ transform: "rotate(180deg)" }} /></button>
        <span className="rounded-full px-3.5 py-1 text-[13px] font-bold capitalize" style={{ background: PERFIL_CLARA, color: PERFIL_ESCURA }}>{MESES[mes.getMonth()]} {mes.getFullYear()}</span>
        <button onClick={() => trocar(1)} aria-label="Próximo mês" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" style={{ color: INK }}><IconChevron size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].map((d) => <span key={d} className="py-1 text-[10.5px] font-semibold" style={{ color: INK_SOFT }}>{d}</span>)}
        {celulas.map((d, i) => {
          if (!d) return <span key={i} />;
          const iso = isoDe(d);
          const doDia = eventos.filter((e) => cobre(e, iso) && e.tipo !== "aula");
          const eHoje = iso === hojeISO;
          return (
            <span key={i} title={doDia.map((e) => e.titulo).join(" · ") || undefined} className="relative mx-auto grid h-8 w-8 place-items-center rounded-full text-[12.5px] font-semibold tabular-nums" style={eHoje ? { background: PERFIL, color: "#fff" } : { color: INK }}>
              {d.getDate()}
              {doDia.length > 0 && !eHoje && <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full" style={{ background: COR_EVENTO[doDia[0].tipo] ?? VIOLET }} />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* Faixa com os 7 dias da semana atual (usada no celular no lugar do calendário do mês). */
export function FaixaSemana({ eventos }: { eventos: EventoAgenda[] }) {
  const hoje = new Date();
  const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - ((hoje.getDay() + 6) % 7));
  const dias = Array.from({ length: 7 }, (_, i) => new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + i));
  return (
    <div className="grid grid-cols-7 gap-1 rounded-[18px] bg-white p-2 shadow-[0_6px_20px_-14px_rgba(15,33,53,0.25)]">
      {dias.map((d) => {
        const iso = isoDe(d);
        const eHoje = iso === isoDe(hoje);
        const ev = eventos.find((e) => cobre(e, iso) && e.tipo !== "aula");
        return (
          <div key={iso} title={ev?.titulo} className="relative rounded-xl py-1.5 text-center" style={eHoje ? { background: PERFIL } : undefined}>
            <p className="text-[10.5px] font-semibold" style={{ color: eHoje ? "#ffffffcc" : INK_SOFT }}>{DIAS_SEMANA[d.getDay()]}</p>
            <p className="text-[16px] font-extrabold tabular-nums" style={{ color: eHoje ? "#fff" : INK }}>{d.getDate()}</p>
            {ev && !eHoje && <span className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ background: COR_EVENTO[ev.tipo] ?? VIOLET }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Linha do tempo do dia ---------- */

export type ItemLinha = { hora: string; titulo: string; detalhe: string; estado: "passou" | "agora" | "depois"; onClick?: () => void };

/* Itens em ordem; o traço vermelho "agora" entra antes do primeiro item que ainda não passou. */
export function LinhaDoTempo({ itens, agora, vazio }: { itens: ItemLinha[]; agora?: string; vazio: string }) {
  if (itens.length === 0) return <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>{vazio}</p>;
  const posAgora = agora ? itens.findIndex((i) => i.estado !== "passou") : -1;
  return (
    <div className="space-y-2">
      {itens.map((i, n) => (
        <div key={n}>
          {n === posAgora && agora && (
            <div className="mb-2 flex items-center gap-2 text-[12px] font-bold" style={{ color: RED }}><span className="tabular-nums">{agora}</span><span className="flex-1 border-t-[1.5px] border-dashed" style={{ borderColor: RED }} /></div>
          )}
          <div className="grid grid-cols-[46px_1fr] items-start gap-2">
            <span className="pt-2.5 text-[12px] font-medium tabular-nums" style={{ color: INK_SOFT }}>{i.hora}</span>
            <button onClick={i.onClick} disabled={!i.onClick} className="rounded-2xl px-3 py-2 text-left text-[12.5px] leading-snug transition disabled:cursor-default" style={i.estado === "agora" ? { background: PERFIL, color: "#fff" } : { background: "#fff", color: INK, opacity: i.estado === "passou" ? 0.55 : 1 }}>
              <span className="block text-[13.5px] font-bold">{i.titulo}</span>
              <span style={{ color: i.estado === "agora" ? "#ffffffd9" : INK_SOFT }}>{i.detalhe}</span>
            </button>
          </div>
        </div>
      ))}
      {posAgora === -1 && agora && (
        <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: RED }}><span className="tabular-nums">{agora}</span><span className="flex-1 border-t-[1.5px] border-dashed" style={{ borderColor: RED }} /></div>
      )}
    </div>
  );
}

/* ---------- Títulos de seção e listas ---------- */

export function TituloSecao({ titulo, acao, onAcao }: { titulo: string; acao?: string; onAcao?: () => void }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-2">
      <h2 className="text-[16.5px] font-extrabold lg:text-[18px]" style={{ color: INK }}>{titulo}</h2>
      {acao && <button onClick={onAcao} className="text-[12.5px] font-bold hover:underline" style={{ color: PERFIL_ESCURA }}>{acao}</button>}
    </div>
  );
}

/* Linha de lista com ícone, título, detalhe e etiqueta à direita (ex.: um pedido, uma tarefa). */
export function LinhaLista({ Icon, titulo, detalhe, etiqueta, destaque = false, corIcone = BLUE, onClick }: {
  Icon: (p: IconProps) => React.ReactElement; titulo: string; detalhe: string; etiqueta?: string; destaque?: boolean; corIcone?: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="lift flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left" style={destaque ? { background: PERFIL, color: "#fff" } : { background: "#fff", color: INK }}>
      <span className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={destaque ? { background: "#ffffff2e" } : { background: "#eef3f9", color: corIcone }}><Icon size={18} /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold">{titulo}</span>
        <span className="block truncate text-[11.5px]" style={{ color: destaque ? "#ffffffd0" : INK_SOFT }}>{detalhe}</span>
      </span>
      {etiqueta && <span className="flex-none rounded-full px-2.5 py-1 text-[11px] font-bold" style={destaque ? { background: "#fff", color: PERFIL_ESCURA } : { background: "#eef3f9", color: INK }}>{etiqueta}</span>}
    </button>
  );
}

/* Etiqueta de pendência logo abaixo do "Bom dia" (ex.: "Pedidos 4"). Some quando é zero. */
export function Pendencia({ texto, n, cor, ir }: { texto: string; n: number; cor: string; ir: () => void }) {
  if (n <= 0) return null;
  return (
    <button onClick={ir} className="lift flex items-center gap-2 rounded-full bg-white py-1.5 pl-3.5 pr-2 text-[12.5px] font-bold" style={{ color: INK }}>
      {texto}<span className="rounded-full px-2 py-0.5 text-[11px] text-white tabular-nums" style={{ background: cor }}>{n.toLocaleString("pt-BR")}</span>
    </button>
  );
}

/* Próximas datas do calendário (de hoje em diante), no formato da linha do tempo. */
const NOME_TIPO: Record<string, string> = { feriado: "Feriado", recesso: "Recesso", ferias: "Férias", prova: "Avaliação", planejamento: "Planejamento", tarefa: "Tarefa" };
export function proximasDatas(eventos: EventoAgenda[], ir: () => void, quantas = 5): ItemLinha[] {
  const hoje = isoDe(new Date());
  const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
  return eventos.filter((e) => (e.fim ?? e.data) >= hoje && e.tipo !== "aula").slice(0, quantas).map((e) => ({
    hora: e.data <= hoje ? "hoje" : ddmm(e.data),
    titulo: e.titulo,
    detalhe: e.fim ? `até ${ddmm(e.fim)}` : NOME_TIPO[e.tipo] ?? "Calendário",
    estado: e.data <= hoje ? "agora" : "depois",
    onClick: ir,
  }));
}

/* Esqueleto (cinza piscando) enquanto os dados chegam: mostra o formato da tela em vez de uma rodinha. */
export function Esqueleto({ altura = 120, className = "" }: { altura?: number; className?: string }) {
  return <div className={`skeleton rounded-[22px] ${className}`} style={{ height: altura }} />;
}
