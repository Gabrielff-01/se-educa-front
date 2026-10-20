import { useState } from "react";
import { AvisoErro, CartaoForm, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconEdit } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL } from "@/lib/formato";
import type { Curso, Escola, Oferta } from "@/lib/tipos";
import { INK, INK_SOFT, VIOLET } from "@/theme/colors";

/* DED — Oferta de séries: quais séries cada escola oferece no ano. Sem oferta, o DIES não abre turma. */
export function DedOfertas({ back }: { back: () => void }) {
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const ofertas = useApi<Oferta[]>(`/api/ofertas/?ano_letivo=${ano}`);
  const escolas = useApi<Escola[]>("/api/escolas/");
  const cursos = useApi<Curso[]>("/api/cursos/");
  const [editando, setEditando] = useState<{ escola: Escola; oferta?: Oferta; series: number[] } | null>(null);
  const envio = useEnvio();

  const abrir = (escola: Escola) => {
    envio.limpar();
    const oferta = ofertas.dados?.find((o) => o.escola === escola.id);
    setEditando({ escola, oferta, series: oferta?.series ?? [] });
  };
  const alternar = (id: number) => editando && setEditando({ ...editando, series: editando.series.includes(id) ? editando.series.filter((s) => s !== id) : [...editando.series, id] });
  const salvar = () => envio.enviar(async () => {
    if (!editando) return;
    if (editando.oferta) await api(`/api/ofertas/${editando.oferta.id}/`, { method: "PATCH", body: { series: editando.series } });
    else await api("/api/ofertas/", { method: "POST", body: { escola: editando.escola.id, ano_letivo: Number(ano), series: editando.series } });
    setEditando(null);
    ofertas.recarregar();
  });

  const anos = [ANO_ATUAL - 1, ANO_ATUAL, ANO_ATUAL + 1].map((a) => ({ valor: String(a), nome: String(a) }));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Oferta de séries" subtitle="DED · o que cada escola oferece" onBack={back} accent={VIOLET} />
      <Screen>
        <div className="mb-3 w-32"><Escolha label="Ano letivo" value={ano} onChange={setAno} opcoes={anos} /></div>
        {editando && (
          <CartaoForm titulo={`${editando.escola.nome} · ${ano}`} onSalvar={salvar} onCancelar={() => setEditando(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
            {(cursos.dados ?? []).map((c) => (
              <div key={c.id}>
                <p className="mb-1.5 text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{c.nome}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.series.map((s) => {
                    const on = editando.series.includes(s.id);
                    return <button key={s.id} onClick={() => alternar(s.id)} className="rounded-full border px-3 py-1.5 text-[12px] font-semibold transition" style={on ? { background: VIOLET, color: "#fff", borderColor: VIOLET } : { background: "#fff", color: INK, borderColor: "#e2e8f0" }}>{s.nome}</button>;
                  })}
                </div>
              </div>
            ))}
          </CartaoForm>
        )}
        <EstadoApi carregando={ofertas.carregando || escolas.carregando} erro={ofertas.erro || escolas.erro} onRetry={ofertas.recarregar}>
          <div className="space-y-2.5">
            {(escolas.dados ?? []).map((e) => {
              const oferta = ofertas.dados?.find((o) => o.escola === e.id);
              return (
                <div key={e.id} className="card flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold" style={{ color: INK }}>{e.nome}</p>
                    <p className="text-[11.5px]" style={{ color: oferta ? INK_SOFT : "#b45309" }}>{oferta ? oferta.series_nomes.join(", ") : `Sem oferta em ${ano}: não dá pra criar turmas`}</p>
                  </div>
                  <button onClick={() => abrir(e)} aria-label={`Editar oferta de ${e.nome}`} className="grid h-9 w-9 flex-none place-items-center rounded-full" style={{ background: VIOLET + "14", color: VIOLET }}><IconEdit size={17} /></button>
                </div>
              );
            })}
          </div>
          {!editando && envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}
        </EstadoApi>
      </Screen>
    </div>
  );
}
