import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBack, IconBell, IconCalendar, IconCheck, IconChevron, IconGrad, IconStar, IconX } from "@/components/icons";
import { EVENTOS_CAL, MESES, OLIMPIADAS, TIPO_CAL } from "@/data/calendario";
import type { EvCal, EvTipo } from "@/data/calendario";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, VIOLET } from "@/theme/colors";

export function Calendario({ back }: { back: () => void }) {
  const [mes, setMes] = useState(8);
  const [filtro, setFiltro] = useState<"todos" | EvTipo>("todos");
  const [sel, setSel] = useState<number | null>(null);
  const [card, setCard] = useState<EvCal | null>(null);
  const [lembretes, setLembretes] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const ano = 2025;
  const inicio = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  const doMes = EVENTOS_CAL.filter((e) => e.m === mes && (filtro === "todos" || e.tipo === filtro)).sort((a, b) => a.d - b.d);
  const lista = sel ? doMes.filter((e) => e.d === sel) : doMes;
  const proximas = EVENTOS_CAL.filter((e) => e.tipo === "olimpiada").sort((a, b) => a.m - b.m || a.d - b.d);
  const lembrar = (e: EvCal) => {
    const on = lembretes.includes(e.id);
    setLembretes(on ? lembretes.filter((x) => x !== e.id) : [...lembretes, e.id]);
    setToast(on ? "Lembrete removido" : `Vamos te lembrar da ${e.sigla} em ${e.d}/${String(e.m + 1).padStart(2, "0")}`);
    setTimeout(() => setToast(""), 2400);
  };
  const filtros: { id: "todos" | EvTipo; label: string }[] = [{ id: "todos", label: "Todos" }, { id: "prova", label: "Provas" }, { id: "trabalho", label: "Trabalhos" }, { id: "evento", label: "Eventos" }, { id: "olimpiada", label: "Olimpíadas" }];
  const abrir = (e: EvCal) => e.tipo === "olimpiada" && setCard(e);
  return (
    <>
      <TopBar title="Calendário escolar" subtitle={`${MESES[mes]} · ${ano}`} onBack={back} accent={VIOLET} />
      <Screen>
        <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {filtros.map((f) => (
            <button key={f.id} onClick={() => { setFiltro(f.id); setSel(null); }} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f.id ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>
              {f.id === "olimpiada" && <IconStar size={12} className="mr-1 inline" />}{f.label}
            </button>
          ))}
        </div>
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <button aria-label="Mês anterior" disabled={mes === 7} onClick={() => { setMes(mes - 1); setSel(null); }} className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30" style={{ background: "#f1f5f9", color: INK }}><IconBack size={16} /></button>
            <p className="text-[14px] font-bold" style={{ color: INK }}>{MESES[mes]} {ano}</p>
            <button aria-label="Próximo mês" disabled={mes === 10} onClick={() => { setMes(mes + 1); setSel(null); }} className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30" style={{ background: "#f1f5f9", color: INK }}><IconChevron size={16} /></button>
          </div>
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold" style={{ color: INK_SOFT }}>{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: inicio }, (_, i) => <span key={"b" + i} />)}
            {Array.from({ length: total }, (_, i) => i + 1).map((d) => {
              const evs = doMes.filter((e) => e.d === d);
              const on = sel === d;
              return (
                <button key={d} onClick={() => { setSel(on ? null : d); if (evs.length === 1) abrir(evs[0]); }} className="relative grid aspect-square place-items-center rounded-lg text-[12px] font-semibold transition" style={on ? { background: VIOLET, color: "#fff" } : evs.length ? { background: evs[0].c + "14", color: evs[0].c } : { color: INK }}>
                  {d}
                  {evs.length > 0 && <span className="absolute bottom-1 flex gap-0.5">{evs.map((e) => <span key={e.id} className="h-1 w-1 rounded-full" style={{ background: on ? "#fff" : e.c }} />)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {filtro === "olimpiada" ? (
          <div className="card mt-3 p-3.5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Legenda</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">{OLIMPIADAS.map((o) => <span key={o.sigla} className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: INK }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: o.c }} />{o.sigla}</span>)}</div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-1">{[{ l: "Prova", c: BLUE }, { l: "Trabalho", c: GREEN }, { l: "Evento", c: AMBER }, { l: "Olimpíada", c: VIOLET }].map((x) => <span key={x.l} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2 w-2 rounded-full" style={{ background: x.c }} />{x.l}</span>)}</div>
        )}

        {toast && <div className="mt-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{toast}</div>}

        <SectionHeader title={sel ? `Dia ${sel}/${String(mes + 1).padStart(2, "0")}` : "Eventos do mês"} action={sel ? "Ver mês" : undefined} onAction={() => setSel(null)} />
        {lista.length === 0 ? <EmptyState title="Nada por aqui" text="Nenhum evento para este filtro e período." icon={<IconCalendar size={26} />} /> : (
          <div className="space-y-2.5">
            {lista.map((e) => (
              <button key={e.id} onClick={() => abrir(e)} className="card flex w-full items-center gap-3 p-3.5 text-left">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: e.c + "16", color: e.c }}><span className="text-[15px] font-extrabold">{e.d}</span></div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{e.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{MESES[e.m]} · {e.d}/{String(e.m + 1).padStart(2, "0")}</p></div>
                <Pill color={e.c}>{e.sigla ?? TIPO_CAL[e.tipo]}</Pill>
              </button>
            ))}
          </div>
        )}

        <SectionHeader title="Próximas olimpíadas" />
        <div className="space-y-2.5">
          {proximas.map((e) => (
            <button key={e.id} onClick={() => setCard(e)} className="card flex w-full items-center gap-3 p-3.5 text-left">
              <div className="grid h-11 w-14 flex-none place-items-center rounded-2xl text-[11px] font-extrabold text-white" style={{ background: e.c }}>{e.sigla}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold" style={{ color: INK }}>{e.fase}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.d} de {MESES[e.m].toLowerCase()}</p></div>
              {lembretes.includes(e.id) ? <span style={{ color: GREEN }}><IconBell size={17} /></span> : <IconChevron size={16} className="text-slate-400" />}
            </button>
          ))}
        </div>
      </Screen>

      {card && (
        <div className="absolute inset-0 z-30 flex items-end bg-slate-900/40" onClick={() => setCard(null)}>
          <div className="animate-in w-full rounded-t-3xl bg-white p-5 pb-7" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-16 flex-none place-items-center rounded-2xl text-[12px] font-extrabold text-white" style={{ background: card.c }}>{card.sigla}</div>
              <div className="flex-1"><p className="text-[15px] font-bold leading-snug" style={{ color: INK }}>{card.nome}</p></div>
              <button aria-label="Fechar" onClick={() => setCard(null)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#f1f5f9", color: INK }}><IconX size={16} /></button>
            </div>
            <div className="mt-4 space-y-2.5">
              {[{ I: IconCalendar, l: "Fase / data", v: `${card.fase} · ${card.d}/${String(card.m + 1).padStart(2, "0")}/2025` }, { I: IconGrad, l: "Nível", v: card.nivel }].map((r) => (
                <div key={r.l} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: card.c + "0f" }}>
                  <span style={{ color: card.c }}><r.I size={18} /></span>
                  <div><p className="text-[11px]" style={{ color: INK_SOFT }}>{r.l}</p><p className="text-[13px] font-semibold" style={{ color: INK }}>{r.v}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-4"><PrimaryButton color={lembretes.includes(card.id) ? GREEN : card.c} onClick={() => lembrar(card)}><IconBell size={17} />{lembretes.includes(card.id) ? "Lembrete ativado" : "Lembrar-me"}</PrimaryButton></div>
          </div>
        </div>
      )}
    </>
  );
}
