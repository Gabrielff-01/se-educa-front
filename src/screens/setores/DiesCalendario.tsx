import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCalendar, IconCheck } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR } from "@/lib/formato";
import type { Calendario, Evento, Opcoes } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type FormEvento = { tipo: string; descricao: string; data_inicio: string; data_fim: string };
type FormCalendario = { data_inicio: string; data_fim: string };

/* DIES — Calendário letivo da rede: dias letivos (mínimo 200, LDB art. 24), eventos e feriados. */
export function DiesCalendario({ back }: { back: () => void }) {
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const calendarios = useApi<Calendario[]>(`/api/calendarios/?ano_letivo=${ano}`);
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [evento, setEvento] = useState<FormEvento | null>(null);
  const [novoCal, setNovoCal] = useState<FormCalendario | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["descricao", "data_inicio", "data_fim"]);

  // Mostra o calendário da rede (sem escola); se só tiver de escola, mostra o primeiro.
  const lista = calendarios.dados ?? [];
  const cal = lista.find((c) => c.escola === null) ?? lista[0];

  const salvarEvento = () => envio.enviar(async () => {
    if (!evento || !cal) return;
    await api("/api/eventos/", { method: "POST", body: { ...evento, calendario: cal.id, data_fim: evento.data_fim || null } });
    setEvento(null);
    calendarios.recarregar();
  });
  const salvarCalendario = () => envio.enviar(async () => {
    if (!novoCal) return;
    await api("/api/calendarios/", { method: "POST", body: { ...novoCal, ano_letivo: Number(ano), escola: null } });
    setNovoCal(null);
    calendarios.recarregar();
  });
  const apagarEvento = (e: Evento) => envio.enviar(async () => {
    if (!window.confirm(`Apagar "${e.descricao}"?`)) return;
    await api(`/api/eventos/${e.id}/`, { method: "DELETE" });
    calendarios.recarregar();
  });
  const feriados = () => envio.enviar(async () => {
    if (!cal) return;
    const r = await api<{ criados: number }>(`/api/calendarios/${cal.id}/adicionar_feriados/`, { method: "POST" });
    setAviso(r.criados ? `${r.criados} feriado(s) e recesso(s) adicionados.` : "Os feriados já estavam no calendário.");
    calendarios.recarregar();
  });

  const anos = [ANO_ATUAL - 1, ANO_ATUAL, ANO_ATUAL + 1].map((a) => ({ valor: String(a), nome: String(a) }));
  const pct = cal ? Math.min(100, Math.round((cal.dias_letivos / cal.dias_letivos_minimos) * 100)) : 0;
  const cor = cal?.cumpre_minimo ? GREEN : RED;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Calendário letivo" subtitle={cal ? `DIES · ${cal.abrangencia}` : "DIES"} onBack={back} accent={AMBER}
        right={cal && <BotaoNovo label="Novo evento" cor={AMBER} onClick={() => { envio.limpar(); setEvento({ tipo: "feriado", descricao: "", data_inicio: "", data_fim: "" }); }} />} />
      <Screen>
        <div className="mb-3 w-32"><Escolha label="Ano letivo" value={ano} onChange={(v) => { setAno(v); setAviso(""); }} opcoes={anos} /></div>
        <EstadoApi carregando={calendarios.carregando} erro={calendarios.erro} onRetry={calendarios.recarregar}>
          {!cal && !novoCal && (
            <div className="card p-5 text-center">
              <p className="text-[13.5px] font-bold" style={{ color: INK }}>A rede ainda não tem calendário em {ano}.</p>
              <button onClick={() => { envio.limpar(); setNovoCal({ data_inicio: `${ano}-02-02`, data_fim: `${ano}-12-11` }); }} className="mt-3 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: AMBER }}>Criar calendário de {ano}</button>
            </div>
          )}
          {novoCal && (
            <CartaoForm titulo={`Calendário da rede ${ano}`} onSalvar={salvarCalendario} onCancelar={() => setNovoCal(null)} salvando={envio.enviando} erro={envio.erro} cor={AMBER}>
              <div className="flex gap-2">
                <Entrada label="Início das aulas" type="date" value={novoCal.data_inicio} onChange={(v) => setNovoCal({ ...novoCal, data_inicio: v })} erro={envio.campos.data_inicio} />
                <Entrada label="Fim das aulas" type="date" value={novoCal.data_fim} onChange={(v) => setNovoCal({ ...novoCal, data_fim: v })} erro={envio.campos.data_fim} />
              </div>
            </CartaoForm>
          )}
          {cal && (
            <>
              <div className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px]" style={{ color: INK_SOFT }}>Dias letivos</p>
                    <p className="text-[28px] font-extrabold leading-tight" style={{ color: cor }}>{cal.dias_letivos}<span className="text-[14px] font-semibold" style={{ color: INK_SOFT }}> / {cal.dias_letivos_minimos}</span></p>
                  </div>
                  <Pill color={cor}>{cal.cumpre_minimo ? "Cumpre a LDB" : "Abaixo do mínimo"}</Pill>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: cor }} /></div>
                <p className="mt-2 text-[11.5px]" style={{ color: INK_SOFT }}>Aulas de {dataBR(cal.data_inicio)} a {dataBR(cal.data_fim)}. Contam segunda a sexta e as aulas extras, menos feriados, férias, recessos e planejamento.</p>
                <button onClick={feriados} disabled={envio.enviando} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-semibold disabled:opacity-60" style={{ background: AMBER + "16", color: "#b45309" }}>
                  <IconCalendar size={16} /> Adicionar feriados e recessos de Sergipe
                </button>
              </div>
              {aviso && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{aviso}</div>}
              {evento && (
                <div className="mt-3">
                  <CartaoForm titulo="Novo evento" onSalvar={salvarEvento} onCancelar={() => setEvento(null)} salvando={envio.enviando} erro={envio.erro} cor={AMBER}>
                    <div className="flex gap-2">
                      <Escolha label="Tipo" value={evento.tipo} onChange={(v) => setEvento({ ...evento, tipo: v })} opcoes={opcoes.dados?.tipos_evento ?? []} />
                      <Entrada label="Descrição" value={evento.descricao} onChange={(v) => setEvento({ ...evento, descricao: v })} erro={envio.campos.descricao} placeholder="Ex.: Recesso escolar" />
                    </div>
                    <div className="flex gap-2">
                      <Entrada label="Data" type="date" value={evento.data_inicio} onChange={(v) => setEvento({ ...evento, data_inicio: v })} erro={envio.campos.data_inicio} />
                      <Entrada label="Até (só períodos)" type="date" value={evento.data_fim} onChange={(v) => setEvento({ ...evento, data_fim: v })} erro={envio.campos.data_fim} />
                    </div>
                  </CartaoForm>
                </div>
              )}
              {!evento && !novoCal && envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}
              <SectionHeader title={`Eventos (${cal.eventos.length})`} />
              <div className="card divide-y divide-[color:var(--color-line)]">
                {cal.eventos.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-[86px] flex-none text-[11.5px] font-bold" style={{ color: INK }}>{dataBR(e.data_inicio).slice(0, 5)}{e.data_fim && <span style={{ color: INK_SOFT }}> a {dataBR(e.data_fim).slice(0, 5)}</span>}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{e.descricao}</p>
                      <p className="text-[11px]" style={{ color: e.letivo ? BLUE : RED }}>{e.tipo_nome} · {e.letivo ? "dia letivo" : "sem aula"}</p>
                    </div>
                    <button onClick={() => apagarEvento(e)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Apagar</button>
                  </div>
                ))}
                {cal.eventos.length === 0 && <p className="px-4 py-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum evento ainda. Comece pelos feriados.</p>}
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </div>
  );
}
