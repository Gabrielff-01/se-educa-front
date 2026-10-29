/* Escolas da rede (lista e mapa) com as escolas cadastradas pelo DIES.
   Dados: GET /api/escolas/rede/ (vagas = capacidade das turmas - alunos confirmados).
   Quem toca numa escola:
   - Secretaria (DIES, DED, RH) ou a própria escola → Ficha da escola completa (turmas, alunos, equipe...);
   - os outros (aluno, responsável, professor) → detalhe público (contato, vagas, rota). */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { MapaReal } from "@/components/MapaReal";
import { Pill } from "@/components/Pill";
import { RouteButton } from "@/components/RouteButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconChevron, IconGrad, IconLayers, IconPin, IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import type { EscolaDaRede } from "@/lib/tipos";
import { FichaEscola } from "@/screens/comum/FichaEscola";
import { EscolaDetalhe } from "@/screens/servicos/EscolaDetalhe";
import { BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";
import type { EscCtx, Perfil } from "@/types";

const CTX_INFO: Record<EscCtx, { t: string; s: string }> = {
  todas: { t: "Escolas da rede", s: "Escolas cadastradas pelo DIES" },
  vagas: { t: "Escolas com vagas", s: "Vagas abertas por série e turno" },
  alunos: { t: "Alunos por escola", s: "Matrículas confirmadas na rede" },
  servidores: { t: "Servidores por escola", s: "Professores e equipe alocados pelo RH" },
};

export function Escolas({ back, perfil, ctx = "todas", modoInicial = "lista" }: { back: () => void; perfil: Perfil; ctx?: EscCtx; modoInicial?: "lista" | "mapa" }) {
  const usuario = useUsuario();
  const gestor = perfil === "escola" || perfil === "secretaria";
  const contexto: EscCtx = !gestor && (ctx === "alunos" || ctx === "servidores") ? "todas" : ctx;
  const escolas = useApi<EscolaDaRede[]>("/api/escolas/rede/");
  const [modo, setModo] = useState(modoInicial);
  const [q, setQ] = useState("");
  const [filtros, setFiltros] = useState<string[]>([]);
  const [soVagas, setSoVagas] = useState(contexto === "vagas");
  const [detalhe, setDetalhe] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);

  const todas = escolas.dados ?? [];
  // Filtros montados com o que existe no banco: cursos oferecidos, dependência e zona.
  const tags = (e: EscolaDaRede) => [...e.cursos, e.dependencia_nome, ...(e.zona === "rural" ? ["Zona rural"] : [])];
  const opcoesFiltro = [...new Set(todas.flatMap(tags))].sort();

  let lista = todas.filter((e) => `${e.nome} ${e.bairro} ${e.municipio}`.toLowerCase().includes(q.toLowerCase())
    && filtros.every((f) => tags(e).includes(f)) && (!soVagas || e.vagas > 0));
  if (contexto === "alunos") lista = [...lista].sort((a, b) => (b.alunos ?? 0) - (a.alunos ?? 0));
  if (contexto === "servidores") lista = [...lista].sort((a, b) => (b.servidores ?? 0) - (a.servidores ?? 0));
  if (contexto === "vagas") lista = [...lista].sort((a, b) => b.vagas - a.vagas);
  const ativos = filtros.length + (soVagas ? 1 : 0) + (q ? 1 : 0);
  const limpar = () => { setFiltros([]); setSoVagas(false); setQ(""); };

  // Abrir uma escola: a gestão vê a ficha completa; os outros, o detalhe público.
  const det = todas.find((e) => e.id === detalhe);
  if (det) {
    const fichaCompleta = perfil === "secretaria" || (perfil === "escola" && usuario?.escola === det.id);
    return fichaCompleta
      ? <FichaEscola back={() => setDetalhe(null)} inicial={det.id} />
      : <EscolaDetalhe esc={det} onBack={() => setDetalhe(null)} />;
  }

  const noMapa = lista.filter((e) => e.latitude !== null && e.longitude !== null);
  const semLocal = lista.length - noMapa.length;
  const escMapa = noMapa.find((e) => e.id === sel) ?? noMapa[0];
  const metrica = (e: EscolaDaRede) => contexto === "alunos" ? `${(e.alunos ?? 0).toLocaleString("pt-BR")} alunos`
    : contexto === "servidores" ? `${e.servidores ?? 0} servidores` : null;
  const local = (e: EscolaDaRede) => [e.bairro, e.municipio].filter(Boolean).join(" · ");

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
          <Chip ligado={soVagas} cor={GREEN} onClick={() => setSoVagas(!soVagas)}>Com vagas</Chip>
          {opcoesFiltro.map((f) => {
            const on = filtros.includes(f);
            return <Chip key={f} ligado={on} cor={VIOLET} onClick={() => setFiltros(on ? filtros.filter((x) => x !== f) : [...filtros, f])}>{f}</Chip>;
          })}
        </div>
        <div className="mt-1.5 flex items-center justify-between pb-2">
          <p className="text-[12px] font-semibold" style={{ color: INK }}>{lista.length} {lista.length === 1 ? "escola encontrada" : "escolas encontradas"}</p>
          {ativos > 0 && <button onClick={limpar} className="text-[12px] font-bold" style={{ color: RED }}>Limpar filtros ({ativos})</button>}
        </div>
      </div>

      <EstadoApi carregando={escolas.carregando} erro={escolas.erro} onRetry={escolas.recarregar}>
        {modo === "mapa" ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <MapaReal pontos={noMapa.map((e) => ({ id: e.id, lat: e.latitude as number, lng: e.longitude as number, nome: e.nome }))} selecionado={escMapa?.id} onSelect={setSel} height={window.innerWidth >= 1024 ? 460 : 300} />
            <div className="scroll-area relative z-[1] -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-3 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
              {semLocal > 0 && <p className="mb-2 text-[11px]" style={{ color: INK_SOFT }}>{semLocal} escola(s) sem localização cadastrada não aparecem no mapa (o DIES preenche latitude e longitude em Escolas).</p>}
              {!escMapa ? <EmptyState title="Nenhuma escola no mapa" text="Remova algum filtro ou cadastre a localização das escolas." icon={<IconPin size={26} />} /> : (
                <div className="card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>{local(escMapa)}</p>
                  <p className="mt-0.5 text-[15px] font-bold leading-snug" style={{ color: INK }}>{escMapa.nome}</p>
                  <Etiquetas e={escMapa} gestor={gestor} metrica={metrica(escMapa)} />
                  <div className="mt-3 flex items-center gap-2">
                    <RouteButton lat={escMapa.latitude as number} lng={escMapa.longitude as number} />
                    <button onClick={() => setDetalhe(escMapa.id)} className="ml-auto text-[12.5px] font-bold" style={{ color: BLUE }}>Ver detalhes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Screen>
            {lista.length === 0 ? <EmptyState title="Nenhuma escola encontrada" text={todas.length ? "Nenhuma escola atende a todos os filtros. Remova algum para ampliar a busca." : "O DIES ainda não cadastrou escolas."} icon={<IconSearch size={26} />} /> : (
              <div className="grid gap-3 lg:grid-cols-2">
                {lista.map((e) => (
                  <button key={e.id} onClick={() => setDetalhe(e.id)} className="card w-full p-4 text-left active:scale-[0.99] transition">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: GREEN + "16", color: GREEN }}><IconGrad size={22} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold leading-snug" style={{ color: INK }}>{e.nome}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} />{local(e)} · {e.regional_nome}</p>
                      </div>
                      <IconChevron size={18} style={{ color: "#cbd5e1" }} />
                    </div>
                    <Etiquetas e={e} gestor={gestor} metrica={metrica(e)} />
                  </button>
                ))}
              </div>
            )}
          </Screen>
        )}
      </EstadoApi>
    </>
  );
}

/* Vagas, alunos (só gestão), cursos e dependência da escola. */
function Etiquetas({ e, gestor, metrica }: { e: EscolaDaRede; gestor: boolean; metrica: string | null }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {e.vagas > 0 ? <Pill color={GREEN}>{e.vagas} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
      {metrica ? <Pill color={BLUE}>{metrica}</Pill> : gestor && e.alunos !== undefined && <Pill color={BLUE}>{e.alunos.toLocaleString("pt-BR")} alunos</Pill>}
      {e.cursos.map((c) => <Pill key={c} color={VIOLET}>{c}</Pill>)}
      <Pill color={INK_SOFT}>{e.dependencia_nome}</Pill>
    </div>
  );
}

function Chip({ ligado, cor, onClick, children }: { ligado: boolean; cor: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={ligado} className="flex flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition"
      style={ligado ? { background: cor, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>
      {ligado && <IconCheck size={12} strokeWidth={2.6} />}{children}
    </button>
  );
}
