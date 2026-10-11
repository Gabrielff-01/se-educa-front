import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { MapCanvas } from "@/components/MapCanvas";
import { Pill } from "@/components/Pill";
import { RouteButton } from "@/components/RouteButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconChevron, IconGrad, IconLayers, IconPin, IconSearch } from "@/components/icons";
import { CTX_INFO, ESCOLAS_MAPA, FILTRO_ITENS, FILTRO_TAG, vagasTot } from "@/data/escolas";
import type { EscolaRede, FiltroEsc } from "@/data/escolas";
import { EscolaDetalhe } from "@/screens/servicos/EscolaDetalhe";
import { BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";
import type { EscCtx, Perfil } from "@/types";

export function Escolas({ back, perfil, ctx = "todas", modoInicial = "lista" }: { back: () => void; perfil: Perfil; ctx?: EscCtx; modoInicial?: "lista" | "mapa" }) {
  const gestor = perfil === "escola" || perfil === "secretaria";
  const contexto: EscCtx = !gestor && (ctx === "alunos" || ctx === "servidores") ? "todas" : ctx;
  const [modo, setModo] = useState(modoInicial);
  const [q, setQ] = useState("");
  const [filtros, setFiltros] = useState<FiltroEsc[]>([]);
  const [soVagas, setSoVagas] = useState(contexto === "vagas");
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  let lista = ESCOLAS_MAPA.filter((e) => (e.nome + e.bairro + e.cidade).toLowerCase().includes(q.toLowerCase()) && filtros.every((f) => e.filtros.includes(f)) && (!soVagas || vagasTot(e) > 0));
  if (contexto === "alunos") lista = [...lista].sort((a, b) => b.alunos - a.alunos);
  if (contexto === "servidores") lista = [...lista].sort((a, b) => b.servidores - a.servidores);
  if (contexto === "vagas") lista = [...lista].sort((a, b) => vagasTot(b) - vagasTot(a));
  const ativos = filtros.length + (soVagas ? 1 : 0) + (q ? 1 : 0);
  const limpar = () => { setFiltros([]); setSoVagas(false); setQ(""); };
  const det = ESCOLAS_MAPA.find((e) => e.id === detalhe);
  if (det) return <EscolaDetalhe esc={det} gestor={gestor} onBack={() => setDetalhe(null)} />;
  const escMapa = lista.find((e) => e.id === sel) ?? lista[0];
  const metrica = (e: EscolaRede) => contexto === "alunos" ? `${e.alunos.toLocaleString("pt-BR")} alunos` : contexto === "servidores" ? `${e.servidores} servidores` : null;

  return (
    <>
      <TopBar title={CTX_INFO[contexto].t} subtitle={CTX_INFO[contexto].s} onBack={back} accent={GREEN} />
      <div className="px-5 pt-1">
        <div className="grid grid-cols-2 rounded-2xl bg-white p-1 shadow-sm" role="tablist">
          {(["lista", "mapa"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={modo === m} onClick={() => setModo(m)} className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-bold transition" style={modo === m ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>
              {m === "lista" ? <IconLayers size={15} /> : <IconPin size={15} />}{m === "lista" ? "Lista" : "Mapa"}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
          <span style={{ color: INK_SOFT }}><IconSearch size={17} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por escola, bairro ou cidade" className="flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        <div className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1">
          <button onClick={() => setSoVagas(!soVagas)} aria-pressed={soVagas} className="flex flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition" style={soVagas ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{soVagas && <IconCheck size={12} strokeWidth={2.6} />}Com vagas</button>
          {FILTRO_ITENS.map((f) => { const on = filtros.includes(f.id); return (
            <button key={f.id} aria-pressed={on} onClick={() => setFiltros(on ? filtros.filter((x) => x !== f.id) : [...filtros, f.id])} className="flex flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition" style={on ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{on && <IconCheck size={12} strokeWidth={2.6} />}{f.label}</button>
          ); })}
        </div>
        <div className="mt-1.5 flex items-center justify-between pb-2">
          <p className="text-[12px] font-semibold" style={{ color: INK }}>{lista.length} {lista.length === 1 ? "escola encontrada" : "escolas encontradas"}</p>
          {ativos > 0 && <button onClick={limpar} className="text-[12px] font-bold" style={{ color: RED }}>Limpar filtros ({ativos})</button>}
        </div>
      </div>

      {modo === "mapa" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <MapCanvas pins={lista.map((e) => ({ id: e.id, x: e.x, y: e.y, label: e.nome.replace(/^E\.M\.(E\.F\.)? /, "") }))} selected={escMapa?.id} onSelect={setSel} height={260} />
          <div className="scroll-area -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-3 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
            {!escMapa ? <EmptyState title="Nenhuma escola no mapa" text="Remova algum filtro para ver mais escolas." icon={<IconPin size={26} />} /> : (
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>{escMapa.bairro} · {escMapa.dist}</p>
                <p className="mt-0.5 text-[15px] font-bold leading-snug" style={{ color: INK }}>{escMapa.nome}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {vagasTot(escMapa) > 0 ? <Pill color={GREEN}>{vagasTot(escMapa)} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
                  {gestor && <Pill color={BLUE}>{escMapa.alunos.toLocaleString("pt-BR")} alunos</Pill>}
                  {escMapa.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <RouteButton lat={escMapa.lat} lng={escMapa.lng} />
                  <button onClick={() => setDetalhe(escMapa.id)} className="ml-auto text-[12.5px] font-bold" style={{ color: BLUE }}>Ver detalhes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Screen>
          {lista.length === 0 ? <EmptyState title="Nenhuma escola encontrada" text="Nenhuma escola atende a todos os filtros. Remova algum para ampliar a busca." icon={<IconSearch size={26} />} /> : (
            <div className="space-y-3">
              {lista.map((e) => { const tot = vagasTot(e); const m = metrica(e); return (
                <button key={e.id} onClick={() => setDetalhe(e.id)} className="card w-full p-4 text-left active:scale-[0.99] transition">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: GREEN + "16", color: GREEN }}><IconGrad size={22} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold leading-snug" style={{ color: INK }}>{e.nome}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} />{e.bairro} · {e.cidade} · {e.dist}</p>
                    </div>
                    <IconChevron size={18} style={{ color: "#cbd5e1" }} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {tot > 0 ? <Pill color={GREEN}>{tot} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
                    {m ? <Pill color={BLUE}>{m}</Pill> : gestor && <Pill color={BLUE}>{e.alunos.toLocaleString("pt-BR")} alunos</Pill>}
                    {e.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}
                  </div>
                </button>
              ); })}
            </div>
          )}
        </Screen>
      )}
    </>
  );
}
