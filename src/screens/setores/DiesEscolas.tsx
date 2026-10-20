import { useState } from "react";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconEdit, IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { opcoesDe } from "@/lib/formato";
import type { Escola, Opcoes, Regional } from "@/lib/tipos";
import { BLUE, INK, INK_SOFT, RED } from "@/theme/colors";

type FormEscola = { id?: number; nome: string; codigo_inep: string; regional: string; municipio: string; bairro: string; dependencia: string };
const VAZIO: FormEscola = { nome: "", codigo_inep: "", regional: "", municipio: "", bairro: "", dependencia: "estadual" };

/* DIES — Cadastro de escolas (dados vindos da API) */
export function DiesEscolas({ back }: { back: () => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const regionais = useApi<Regional[]>("/api/regionais/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState<FormEscola | null>(null);
  const envio = useEnvio(["nome", "codigo_inep", "regional", "municipio"]);

  const abrir = (escola?: Escola) => {
    envio.limpar();
    if (!escola) return setForm({ ...VAZIO, regional: String(regionais.dados?.[0]?.id ?? "") });
    const { id, nome, codigo_inep, regional, municipio, bairro, dependencia } = escola;
    setForm({ id, nome, codigo_inep, regional: String(regional), municipio, bairro, dependencia });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, ...dados } = form;
    const corpo = { ...dados, regional: Number(dados.regional) || null };
    if (id) await api(`/api/escolas/${id}/`, { method: "PATCH", body: corpo });
    else await api("/api/escolas/", { method: "POST", body: corpo });
    setForm(null);
    escolas.recarregar();
  });

  const lista = (escolas.dados ?? []).filter((e) => `${e.nome} ${e.municipio} ${e.codigo_inep}`.toLowerCase().includes(busca.toLowerCase()));
  const mudar = (campo: keyof FormEscola) => (v: string) => form && setForm({ ...form, [campo]: v });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Escolas" subtitle={`DIES · ${escolas.dados?.length ?? 0} escolas cadastradas`} onBack={back} accent={BLUE} right={<BotaoNovo label="Nova escola" onClick={() => abrir()} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar escola" : "Nova escola"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro}>
            <Entrada label="Nome" value={form.nome} onChange={mudar("nome")} erro={envio.campos.nome} />
            <div className="flex gap-2">
              <Entrada label="Código INEP" value={form.codigo_inep} onChange={mudar("codigo_inep")} erro={envio.campos.codigo_inep} placeholder="28xxxxxx" inputMode="numeric" />
              <Escolha label="Dependência" value={form.dependencia} onChange={mudar("dependencia")} opcoes={opcoes.dados?.dependencias ?? []} />
            </div>
            <div className="flex gap-2">
              <Escolha label="Regional" value={form.regional} onChange={mudar("regional")} opcoes={opcoesDe(regionais.dados, (r) => r.nome)} erro={envio.campos.regional} vazio="Escolha" />
              <Entrada label="Município" value={form.municipio} onChange={mudar("municipio")} erro={envio.campos.municipio} />
            </div>
            <Entrada label="Bairro (opcional)" value={form.bairro} onChange={mudar("bairro")} />
          </CartaoForm>
        )}
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, município ou INEP" className="flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        <EstadoApi carregando={escolas.carregando} erro={escolas.erro} onRetry={escolas.recarregar}>
          <div className="space-y-2.5">
            {lista.map((e) => (
              <div key={e.id} className="card flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold" style={{ color: INK }}>{e.nome}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>INEP {e.codigo_inep} · {e.municipio} · {e.regional_nome}</p>
                  <div className="mt-1.5 flex gap-1.5"><Pill color={BLUE}>{e.dependencia_nome}</Pill>{!e.ativa && <Pill color={RED}>Inativa</Pill>}</div>
                </div>
                <button onClick={() => abrir(e)} aria-label={`Editar ${e.nome}`} className="grid h-9 w-9 flex-none place-items-center rounded-full" style={{ background: BLUE + "12", color: BLUE }}><IconEdit size={17} /></button>
              </div>
            ))}
            {lista.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma escola encontrada.</p>}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
