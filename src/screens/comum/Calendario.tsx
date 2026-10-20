/* Calendário escolar: mês navegável com os eventos reais do ano letivo + a lista do mês.
   Dados: /api/agenda/?ano=AAAA — feriados, férias, recessos, planejamento, provas, sábados letivos,
   início/fim das aulas e prazos de tarefas (para aluno/responsável, os da turma do aluno escolhido).
   A parte de olimpíadas continua com dados fixos (src/data/calendario.ts), só como informação. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconBack, IconBell, IconCalendar, IconCheck, IconChevron, IconGrad, IconX } from "@/components/icons";
import { EVENTOS_CAL, MESES } from "@/data/calendario";
import type { EvCal } from "@/data/calendario";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import type { ErroApi } from "@/lib/api";
import { dataBR, hojeISO } from "@/lib/formato";
import type { EventoAgenda } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

/* Nome e cor de cada tipo de evento que a API manda */
const TIPOS: Record<string, { nome: string; cor: string }> = {
  prova: { nome: "Prova", cor: BLUE },
  tarefa: { nome: "Tarefa", cor: VIOLET },
  feriado: { nome: "Feriado", cor: RED },
  recesso: { nome: "Recesso", cor: AMBER },
  ferias: { nome: "Férias", cor: TEAL },
  planejamento: { nome: "Planejamento", cor: INDIGO },
  aula: { nome: "Dia letivo", cor: GREEN },
};
const tipoDe = (t: string) => TIPOS[t] ?? { nome: t, cor: INK_SOFT };

const FILTROS: { id: string; label: string; tipos: string[] | null }[] = [
  { id: "todos", label: "Todos", tipos: null },
  { id: "provas", label: "Provas", tipos: ["prova"] },
  { id: "tarefas", label: "Tarefas", tipos: ["tarefa"] },
  { id: "folgas", label: "Feriados e férias", tipos: ["feriado", "recesso", "ferias", "planejamento"] },
  { id: "aulas", label: "Dias letivos", tipos: ["aula"] },
];

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const isoDe = (ano: number, mes: number, dia: number) => `${ano}-${doisDigitos(mes + 1)}-${doisDigitos(dia)}`;
/* O evento cobre o dia? (eventos de vários dias têm "fim") — comparar texto ISO funciona pra datas */
const cobre = (e: EventoAgenda, dia: string) => e.data <= dia && (e.fim ?? e.data) >= dia;

export function Calendario({ back }: { back: () => void }) {
  const usuario = useUsuario();
  // Aluno e responsável veem o calendário da escola do aluno (e as tarefas da turma dele)
  if (usuario?.perfil === "aluno" || usuario?.perfil === "responsavel") return <CalendarioDoAluno back={back} />;
  return <CalendarioMes back={back} caminho={(ano) => `/api/agenda/?ano=${ano}`} />;
}

function CalendarioDoAluno({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  return (
    <CalendarioMes back={back} caminho={(ano) => comAluno(`/api/agenda/?ano=${ano}`)} esperando={filhos.carregando} erroExtra={filhos.erro}
      topo={<SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={VIOLET} />} />
  );
}

function CalendarioMes({ back, caminho, topo, esperando = false, erroExtra = null }: {
  back: () => void; caminho: (ano: number) => string | null; topo?: React.ReactNode; esperando?: boolean; erroExtra?: ErroApi | null;
}) {
  const agora = new Date();
  const [ano, setAno] = useState(agora.getFullYear());
  const [mes, setMes] = useState(agora.getMonth()); // 0 = janeiro
  const [filtro, setFiltro] = useState("todos");
  const [sel, setSel] = useState<number | null>(null);
  const agenda = useApi<EventoAgenda[]>(caminho(ano));

  const hoje = hojeISO();
  const inicioSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const primeiro = isoDe(ano, mes, 1);
  const ultimo = isoDe(ano, mes, totalDias);
  const tipos = FILTROS.find((f) => f.id === filtro)?.tipos ?? null;
  // Eventos que tocam este mês (inclusive os que começaram no mês anterior)
  const doMes = (agenda.dados ?? []).filter((e) => e.data <= ultimo && (e.fim ?? e.data) >= primeiro && (!tipos || tipos.includes(e.tipo)));
  const lista = sel ? doMes.filter((e) => cobre(e, isoDe(ano, mes, sel))) : doMes;

  const mudarMes = (passo: number) => {
    const novo = mes + passo;
    setSel(null);
    if (novo < 0) { setMes(11); setAno(ano - 1); }
    else if (novo > 11) { setMes(0); setAno(ano + 1); }
    else setMes(novo);
  };

  return (
    <>
      <TopBar title="Calendário escolar" subtitle={`${MESES[mes]} · ${ano}`} onBack={back} accent={VIOLET} />
      <Screen>
        {topo}
        <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {FILTROS.map((f) => (
            <button key={f.id} onClick={() => { setFiltro(f.id); setSel(null); }} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f.id ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{f.label}</button>
          ))}
        </div>
        <EstadoApi carregando={esperando || agenda.carregando} erro={erroExtra ?? agenda.erro} onRetry={agenda.recarregar}>
          <div className="md:grid md:grid-cols-2 md:gap-4 [&>*]:min-w-0">
            <div>
              <div className="card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <button aria-label="Mês anterior" onClick={() => mudarMes(-1)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#f1f5f9", color: INK }}><IconBack size={16} /></button>
                  <p className="text-[14px] font-bold" style={{ color: INK }}>{MESES[mes]} {ano}</p>
                  <button aria-label="Próximo mês" onClick={() => mudarMes(1)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#f1f5f9", color: INK }}><IconChevron size={16} /></button>
                </div>
                <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold" style={{ color: INK_SOFT }}>{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: inicioSemana }, (_, i) => <span key={"b" + i} />)}
                  {Array.from({ length: totalDias }, (_, i) => i + 1).map((d) => {
                    const iso = isoDe(ano, mes, d);
                    const evs = doMes.filter((e) => cobre(e, iso));
                    const on = sel === d;
                    const cor = evs.length ? tipoDe(evs[0].tipo).cor : null;
                    return (
                      <button key={d} onClick={() => setSel(on ? null : d)} aria-label={`Dia ${d}${evs.length ? `: ${evs.map((e) => e.titulo).join(", ")}` : ""}`}
                        className="relative grid aspect-square place-items-center rounded-lg text-[12px] font-semibold transition"
                        style={{ ...(on ? { background: VIOLET, color: "#fff" } : cor ? { background: cor + "14", color: cor } : { color: INK }), ...(iso === hoje && !on ? { boxShadow: `inset 0 0 0 2px ${VIOLET}` } : {}) }}>
                        {d}
                        {evs.length > 0 && <span className="absolute bottom-1 flex gap-0.5">{evs.slice(0, 3).map((e, n) => <span key={n} className="h-1 w-1 rounded-full" style={{ background: on ? "#fff" : tipoDe(e.tipo).cor }} />)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-1">
                {Object.values(TIPOS).map((t) => <span key={t.nome} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2 w-2 rounded-full" style={{ background: t.cor }} />{t.nome}</span>)}
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2.5 w-2.5 rounded" style={{ boxShadow: `inset 0 0 0 2px ${VIOLET}` }} />Hoje</span>
              </div>
            </div>

            <div>
              <SectionHeader title={sel ? `Dia ${sel}/${doisDigitos(mes + 1)}` : "Eventos do mês"} action={sel ? "Ver mês" : undefined} onAction={() => setSel(null)} />
              {lista.length === 0 ? <EmptyState title="Nada por aqui" text="Nenhum evento para este filtro e período." icon={<IconCalendar size={26} />} /> : (
                <div className="space-y-2.5">
                  {lista.map((e, n) => {
                    const t = tipoDe(e.tipo);
                    const diaInicio = Number(e.data.slice(8, 10));
                    return (
                      <div key={`${e.data}-${e.titulo}-${n}`} className="card flex items-center gap-3 p-3.5">
                        <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: t.cor + "16", color: t.cor }}><span className="text-[15px] font-extrabold">{e.data < primeiro ? "…" : diaInicio}</span></div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{e.titulo}</p>
                          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.fim ? `${dataBR(e.data)} a ${dataBR(e.fim)}` : dataBR(e.data)}</p>
                        </div>
                        <Pill color={t.cor}>{t.nome}</Pill>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </EstadoApi>

        <Olimpiadas />
      </Screen>
    </>
  );
}

/* Olimpíadas: dados fixos do protótipo (src/data/calendario.ts), só para informação. */
function Olimpiadas() {
  const [card, setCard] = useState<EvCal | null>(null);
  const [lembretes, setLembretes] = useState<string[]>([]);
  const olimpiadas = EVENTOS_CAL.filter((e) => e.tipo === "olimpiada").sort((a, b) => a.m - b.m || a.d - b.d);
  const data = (e: EvCal) => `${doisDigitos(e.d)}/${doisDigitos(e.m + 1)}`;
  const lembrar = (e: EvCal) => setLembretes(lembretes.includes(e.id) ? lembretes.filter((x) => x !== e.id) : [...lembretes, e.id]);

  return (
    <>
      <SectionHeader title="Olimpíadas (informativo)" />
      <p className="-mt-1 mb-2.5 text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Datas de referência das olimpíadas científicas. Confirme no site oficial de cada uma.</p>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {olimpiadas.map((e) => (
          <button key={e.id} onClick={() => setCard(e)} className="card flex w-full items-center gap-3 p-3.5 text-left">
            <div className="grid h-11 w-14 flex-none place-items-center rounded-2xl text-[11px] font-extrabold text-white" style={{ background: e.c }}>{e.sigla}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold" style={{ color: INK }}>{e.fase}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.d} de {MESES[e.m].toLowerCase()}</p></div>
            {lembretes.includes(e.id) ? <span style={{ color: GREEN }}><IconBell size={17} /></span> : <IconChevron size={16} className="text-slate-400" />}
          </button>
        ))}
      </div>

      {card && (
        <div className="absolute inset-0 z-30 flex items-end bg-slate-900/40" onClick={() => setCard(null)}>
          <div className="animate-in w-full rounded-t-3xl bg-white p-5 pb-7" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-16 flex-none place-items-center rounded-2xl text-[12px] font-extrabold text-white" style={{ background: card.c }}>{card.sigla}</div>
              <div className="flex-1"><p className="text-[15px] font-bold leading-snug" style={{ color: INK }}>{card.nome}</p></div>
              <button aria-label="Fechar" onClick={() => setCard(null)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#f1f5f9", color: INK }}><IconX size={16} /></button>
            </div>
            <div className="mt-4 space-y-2.5">
              {[{ I: IconCalendar, l: "Fase / data", v: `${card.fase} · ${data(card)}` }, { I: IconGrad, l: "Nível", v: card.nivel }].map((r) => (
                <div key={r.l} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: card.c + "0f" }}>
                  <span style={{ color: card.c }}><r.I size={18} /></span>
                  <div><p className="text-[11px]" style={{ color: INK_SOFT }}>{r.l}</p><p className="text-[13px] font-semibold" style={{ color: INK }}>{r.v}</p></div>
                </div>
              ))}
            </div>
            {lembretes.includes(card.id) && <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: GREEN }}><IconCheck size={15} />Marcado (só neste aparelho, enquanto a tela estiver aberta).</p>}
            <div className="mt-4"><PrimaryButton color={lembretes.includes(card.id) ? GREEN : card.c} onClick={() => lembrar(card)}><IconBell size={17} />{lembretes.includes(card.id) ? "Marcado" : "Marcar como interesse"}</PrimaryButton></div>
          </div>
        </div>
      )}
    </>
  );
}
