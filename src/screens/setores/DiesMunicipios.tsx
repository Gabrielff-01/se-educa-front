import { useState } from "react";
import { AvisoErro, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconPin, IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { opcoesDe } from "@/lib/formato";
import type { Escola, Municipio, Regional } from "@/lib/tipos";
import { BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

/* DIES — Regionais e municípios: as 10 regionais da SEDUC (DEA e DRE 1 a 9) e os 75 municípios de cada uma.
   A escola pega a DRE do município dela. Se a SEDUC mudar um município de DRE, o DIES troca aqui
   e as escolas daquele município vão junto (PATCH /api/municipios/ID/ {regional}). */
export function DiesMunicipios({ back }: { back: () => void }) {
  const regionais = useApi<Regional[]>("/api/regionais/");
  const municipios = useApi<Municipio[]>("/api/municipios/");
  const escolas = useApi<Escola[]>("/api/escolas/");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<Municipio | null>(null);
  const [novaDre, setNovaDre] = useState("");
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["regional"]);

  // Quantas escolas cada município tem (pelo nome, igual a API).
  const escolasEm = (nome: string) => (escolas.dados ?? []).filter((e) => e.municipio.toLowerCase() === nome.toLowerCase()).length;
  const filtro = busca.trim().toLowerCase();
  const grupos = (regionais.dados ?? []).map((r) => ({
    regional: r,
    todos: (municipios.dados ?? []).filter((m) => m.regional === r.id),
  })).map((g) => ({ ...g, lista: g.todos.filter((m) => !filtro || m.nome.toLowerCase().includes(filtro) || g.regional.nome.toLowerCase().includes(filtro) || g.regional.sede.toLowerCase().includes(filtro)) }))
    .filter((g) => g.lista.length > 0);

  const abrir = (m: Municipio) => { envio.limpar(); setAviso(""); setAberto(aberto?.id === m.id ? null : m); setNovaDre(String(m.regional)); };
  const mover = () => envio.enviar(async () => {
    if (!aberto) return;
    await api(`/api/municipios/${aberto.id}/`, { method: "PATCH", body: { regional: Number(novaDre) } });
    const nome = regionais.dados?.find((r) => String(r.id) === novaDre)?.nome ?? "";
    const n = escolasEm(aberto.nome);
    setAviso(`${aberto.nome} agora é da ${nome}${n ? ` (e ${n === 1 ? "a escola foi junto" : `as ${n} escolas foram junto`})` : ""}.`);
    setAberto(null);
    municipios.recarregar();
    escolas.recarregar();
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Regionais e municípios" subtitle={`DIES · ${municipios.dados?.length ?? 0} municípios em ${regionais.dados?.length ?? 0} regionais`} onBack={back} accent={BLUE} />
      <Screen>
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar município ou DRE" className="flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        {aviso && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>
            <IconCheck size={17} />{aviso}
          </div>
        )}
        <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>Toque num município para mudar a DRE dele. As escolas do município mudam junto.</p>
        <EstadoApi carregando={regionais.carregando || municipios.carregando} erro={regionais.erro ?? municipios.erro} onRetry={() => { regionais.recarregar(); municipios.recarregar(); }}>
          <div className="grid gap-3 lg:grid-cols-2">
            {grupos.map(({ regional, todos, lista }) => {
              const totalEscolas = todos.reduce((s, m) => s + escolasEm(m.nome), 0);
              const aquiAberto = aberto && aberto.regional === regional.id ? aberto : null;
              return (
                <div key={regional.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: BLUE + "14", color: BLUE }}><IconPin size={19} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold" style={{ color: INK }}>{regional.nome}{regional.sede && <span className="font-semibold" style={{ color: INK_SOFT }}> · sede em {regional.sede}</span>}</p>
                      <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{todos.length} {todos.length === 1 ? "município" : "municípios"} · {totalEscolas} {totalEscolas === 1 ? "escola cadastrada" : "escolas cadastradas"}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lista.map((m) => {
                      const n = escolasEm(m.nome);
                      const sel = aberto?.id === m.id;
                      return (
                        <button key={m.id} onClick={() => abrir(m)} aria-pressed={sel} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold transition"
                          style={sel ? { background: BLUE, color: "#fff" } : { background: "#f6f8fb", color: INK, border: "1px solid #e2e8f0" }}>
                          {m.nome}{n > 0 && <span className="rounded-full px-1.5 text-[10.5px]" style={{ background: sel ? "#ffffff33" : GREEN + "1f", color: sel ? "#fff" : GREEN }}>{n}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {aquiAberto && (
                    <div className="mt-3 space-y-2 rounded-xl p-3" style={{ background: BLUE + "0b" }}>
                      <Escolha label={`DRE de ${aquiAberto.nome}`} value={novaDre} onChange={setNovaDre}
                        opcoes={opcoesDe(regionais.dados, (r) => (r.sede ? `${r.nome} · ${r.sede}` : r.nome))} erro={envio.campos.regional} />
                      {envio.erro && <AvisoErro texto={envio.erro} />}
                      <div className="flex gap-2">
                        <button onClick={() => setAberto(null)} className="flex-1 rounded-xl border bg-white py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Cancelar</button>
                        <button onClick={mover} disabled={envio.enviando || novaDre === String(aquiAberto.regional)} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold text-white disabled:opacity-50" style={{ background: BLUE }}>
                          {envio.enviando ? "Salvando..." : "Mudar de DRE"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {grupos.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum município encontrado.</p>}
          </div>
        </EstadoApi>
        <div className="mt-4 flex flex-wrap gap-1.5"><Pill color={GREEN}>número = escolas cadastradas no município</Pill></div>
      </Screen>
    </div>
  );
}
