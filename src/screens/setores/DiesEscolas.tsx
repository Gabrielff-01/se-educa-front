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

// Os campos de texto do cadastro (iguais aos da ficha da escola no site da SEDUC).
const CAMPOS = ["nome", "codigo_inep", "cnpj", "dependencia", "regional", "zona", "telefone", "email", "numero_salas",
  "comodato", "endereco", "numero", "complemento", "bairro", "municipio", "cep", "localizacao"] as const;
type FormEscola = { id?: number } & Record<(typeof CAMPOS)[number], string>;
const VAZIO: FormEscola = {
  nome: "", codigo_inep: "", cnpj: "", dependencia: "estadual", regional: "", zona: "urbana", telefone: "", email: "",
  numero_salas: "", comodato: "nao", endereco: "", numero: "", complemento: "", bairro: "", municipio: "", cep: "", localizacao: "",
};
const SIM_NAO = [{ valor: "nao", nome: "Não" }, { valor: "sim", nome: "Sim" }];

/* DIES — Cadastro de escolas, com os dados cadastrais da ficha (CNPJ, contato, salas, endereço completo).
   O botão "Ficha" abre a ficha da escola: turmas, equipe diretiva, professores e resoluções. */
export function DiesEscolas({ back, abrirFicha }: { back: () => void; abrirFicha: (id: number) => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const regionais = useApi<Regional[]>("/api/regionais/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState<FormEscola | null>(null);
  const envio = useEnvio([...CAMPOS, "latitude", "longitude"]);

  const abrir = (escola?: Escola) => {
    envio.limpar();
    if (!escola) return setForm({ ...VAZIO, regional: String(regionais.dados?.[0]?.id ?? "") });
    setForm({
      id: escola.id, nome: escola.nome, codigo_inep: escola.codigo_inep, cnpj: escola.cnpj_formatado,
      dependencia: escola.dependencia, regional: String(escola.regional), zona: escola.zona, telefone: escola.telefone,
      email: escola.email, numero_salas: escola.numero_salas === null ? "" : String(escola.numero_salas),
      comodato: escola.comodato ? "sim" : "nao", endereco: escola.endereco, numero: escola.numero,
      complemento: escola.complemento, bairro: escola.bairro, municipio: escola.municipio, cep: escola.cep_formatado,
      localizacao: escola.latitude !== null && escola.longitude !== null ? `${escola.latitude}, ${escola.longitude}` : "",
    });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, localizacao, ...dados } = form;
    // "Localização no mapa" vem como "-10.9113, -37.0517" (copiado do Google Maps) e vira latitude e longitude.
    const [latitude, longitude] = localizacao.trim() ? localizacao.split(",").map((n) => Number(n.trim())) : [null, null];
    if (localizacao.trim() && (latitude === undefined || longitude === undefined || Number.isNaN(latitude) || Number.isNaN(longitude))) {
      throw new Error("Localização inválida. Use o formato -10.9113, -37.0517 (latitude, longitude).");
    }
    const corpo = {
      ...dados, regional: Number(dados.regional) || null, comodato: dados.comodato === "sim",
      numero_salas: dados.numero_salas.trim() === "" ? null : Number(dados.numero_salas),
      latitude, longitude,
    };
    if (id) await api(`/api/escolas/${id}/`, { method: "PATCH", body: corpo });
    else await api("/api/escolas/", { method: "POST", body: corpo });
    setForm(null);
    escolas.recarregar();
  });
  const mudar = (campo: keyof FormEscola) => (v: string) => form && setForm({ ...form, [campo]: v });
  const c = envio.campos;

  const lista = (escolas.dados ?? []).filter((e) => `${e.nome} ${e.municipio} ${e.codigo_inep}`.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Escolas" subtitle={`DIES · ${escolas.dados?.length ?? 0} escolas cadastradas`} onBack={back} accent={BLUE} right={<BotaoNovo label="Nova escola" onClick={() => abrir()} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar escola" : "Nova escola"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro}>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Dados da escola</p>
            <Entrada label="Nome" value={form.nome} onChange={mudar("nome")} erro={c.nome} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Código MEC (INEP)" value={form.codigo_inep} onChange={mudar("codigo_inep")} erro={c.codigo_inep} placeholder="28xxxxxx" inputMode="numeric" />
              <Entrada label="CNPJ (opcional)" value={form.cnpj} onChange={mudar("cnpj")} erro={c.cnpj} placeholder="00.000.000/0000-00" inputMode="numeric" />
            </div>
            <div className="flex gap-2">
              <Escolha label="DRE (regional)" value={form.regional} onChange={mudar("regional")} opcoes={opcoesDe(regionais.dados, (r) => r.nome)} erro={c.regional} vazio="Escolha" />
              <Escolha label="Dependência" value={form.dependencia} onChange={mudar("dependencia")} opcoes={opcoes.dados?.dependencias ?? []} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Telefone" value={form.telefone} onChange={mudar("telefone")} erro={c.telefone} placeholder="79-32059518" />
              <Entrada label="E-mail" value={form.email} onChange={mudar("email")} erro={c.email} type="email" />
            </div>
            <div className="flex gap-2">
              <Entrada label="Nº de salas" value={form.numero_salas} onChange={mudar("numero_salas")} erro={c.numero_salas} inputMode="numeric" />
              <Escolha label="Zona" value={form.zona} onChange={mudar("zona")} opcoes={opcoes.dados?.zonas ?? []} erro={c.zona} />
              <Escolha label="Comodato" value={form.comodato} onChange={mudar("comodato")} opcoes={SIM_NAO} />
            </div>
            <p className="pt-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Endereço</p>
            <div className="flex gap-2">
              <div className="min-w-0 flex-[3]"><Entrada label="Logradouro" value={form.endereco} onChange={mudar("endereco")} erro={c.endereco} placeholder="Rua, avenida, travessa..." /></div>
              <div className="min-w-0 flex-1"><Entrada label="Número" value={form.numero} onChange={mudar("numero")} erro={c.numero} placeholder="S/N" /></div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Complemento" value={form.complemento} onChange={mudar("complemento")} erro={c.complemento} />
              <Entrada label="Bairro" value={form.bairro} onChange={mudar("bairro")} erro={c.bairro} />
            </div>
            <div className="flex gap-2">
              <div className="min-w-0 flex-[2]"><Entrada label="Município" value={form.municipio} onChange={mudar("municipio")} erro={c.municipio} /></div>
              <div className="min-w-0 flex-1"><Entrada label="CEP" value={form.cep} onChange={mudar("cep")} erro={c.cep} placeholder="49000-000" inputMode="numeric" /></div>
            </div>
            <Entrada label="Localização no mapa (latitude, longitude)" value={form.localizacao} onChange={mudar("localizacao")} erro={c.latitude || c.longitude} placeholder="-10.9113, -37.0517" />
            <p className="text-[11px]" style={{ color: INK_SOFT }}>No Google Maps, clique com o botão direito em cima da escola e copie os números que aparecem primeiro.</p>
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
                  {(e.telefone || e.email) && <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{[e.telefone, e.email].filter(Boolean).join(" · ")}</p>}
                  <div className="mt-1.5 flex flex-wrap gap-1.5"><Pill color={BLUE}>{e.dependencia_nome}</Pill><Pill color={INK_SOFT}>{e.zona_nome}</Pill>{!e.ativa && <Pill color={RED}>Inativa</Pill>}</div>
                </div>
                <div className="flex flex-none flex-col gap-1.5 sm:flex-row">
                  <button onClick={() => abrirFicha(e.id)} className="rounded-full px-3 py-2 text-[12px] font-semibold text-white" style={{ background: BLUE }}>Ficha</button>
                  <button onClick={() => abrir(e)} aria-label={`Editar ${e.nome}`} className="grid h-9 w-9 place-items-center self-center rounded-full" style={{ background: BLUE + "12", color: BLUE }}><IconEdit size={17} /></button>
                </div>
              </div>
            ))}
            {lista.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma escola encontrada.</p>}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
