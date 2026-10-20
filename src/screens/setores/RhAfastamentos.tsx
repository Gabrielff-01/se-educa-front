/* RH — Afastamentos: licenças, férias e formações dos professores.
   Dados: GET /api/afastamentos/ (?vigentes=1 = só quem está afastado hoje).
   Cadastro: POST/PATCH/DELETE /api/afastamentos/ID/. Professores de /api/professores/ e tipos de /api/opcoes/.
   A API não deixa dois afastamentos do mesmo professor se sobreporem (o erro aparece no campo Início). */

import { useState } from "react";
import { Chips } from "@/components/Chips";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCalendar, IconCheck, IconEdit, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR, hojeISO, opcoesDe } from "@/lib/formato";
import type { Afastamento, Opcoes, Professor } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

type FormAfastamento = { id?: number; professor: string; tipo: string; inicio: string; fim: string; observacao: string };
type Filtro = "vigentes" | "todos";

export function RhAfastamentos({ back }: { back: () => void }) {
  const [filtro, setFiltro] = useState<Filtro[]>(["vigentes"]);
  const afastamentos = useApi<Afastamento[]>(filtro[0] === "vigentes" ? "/api/afastamentos/?vigentes=1" : "/api/afastamentos/");
  const professores = useApi<Professor[]>("/api/professores/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState<FormAfastamento | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["professor", "tipo", "inicio", "fim", "observacao"]);

  const abrir = (a?: Afastamento) => {
    envio.limpar();
    setAviso("");
    setForm(a
      ? { id: a.id, professor: String(a.professor), tipo: a.tipo, inicio: a.inicio, fim: a.fim, observacao: a.observacao }
      : { professor: String(professores.dados?.[0]?.id ?? ""), tipo: opcoes.dados?.tipos_afastamento[0]?.valor ?? "", inicio: hojeISO(), fim: "", observacao: "" });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, ...resto } = form;
    const corpo = { ...resto, professor: Number(resto.professor), fim: resto.fim || null };
    if (id) await api(`/api/afastamentos/${id}/`, { method: "PATCH", body: corpo });
    else await api("/api/afastamentos/", { method: "POST", body: corpo });
    setForm(null);
    setAviso(id ? "Afastamento atualizado." : "Afastamento cadastrado.");
    afastamentos.recarregar();
  });
  const apagar = (a: Afastamento) => envio.enviar(async () => {
    if (!window.confirm(`Apagar o afastamento de ${a.professor_nome} (${dataBR(a.inicio)} a ${dataBR(a.fim)})?`)) return;
    await api(`/api/afastamentos/${a.id}/`, { method: "DELETE" });
    setAviso("Afastamento apagado.");
    afastamentos.recarregar();
  });
  const mudar = (campo: keyof FormAfastamento) => (v: string) => form && setForm({ ...form, [campo]: v });
  const lista = afastamentos.dados ?? [];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Afastamentos" subtitle="Licenças, férias e formações" onBack={back} accent={VIOLET} right={<BotaoNovo label="Novo afastamento" cor={VIOLET} onClick={() => abrir()} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar afastamento" : "Novo afastamento"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
            <Escolha label="Professor" value={form.professor} onChange={mudar("professor")} opcoes={opcoesDe(professores.dados, (p) => `${p.nome} (${p.matricula})`)} erro={envio.campos.professor} />
            <Escolha label="Tipo" value={form.tipo} onChange={mudar("tipo")} opcoes={opcoes.dados?.tipos_afastamento ?? []} erro={envio.campos.tipo} />
            <div className="flex gap-2">
              <Entrada label="Início" type="date" value={form.inicio} onChange={mudar("inicio")} erro={envio.campos.inicio} />
              <Entrada label="Último dia" type="date" value={form.fim} onChange={mudar("fim")} erro={envio.campos.fim} />
            </div>
            <Entrada label="Observação (opcional)" value={form.observacao} onChange={mudar("observacao")} erro={envio.campos.observacao} placeholder="Ex.: atestado de 15 dias" />
          </CartaoForm>
        )}
        {aviso && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>
            <IconCheck size={17} />{aviso}
          </div>
        )}
        {!form && envio.erro && <div className="mb-3"><AvisoErro texto={envio.erro} /></div>}
        <Chips<Filtro> items={[{ id: "vigentes", label: "Vigentes hoje" }, { id: "todos", label: "Todos" }]} value={filtro} onChange={setFiltro} cor={VIOLET} />
        <EstadoApi carregando={afastamentos.carregando} erro={afastamentos.erro} onRetry={afastamentos.recarregar}>
          {lista.length === 0 && (
            <EmptyState title={filtro[0] === "vigentes" ? "Ninguém afastado hoje" : "Nenhum afastamento"} text="Toque no + para cadastrar uma licença, férias ou formação." icon={<IconCalendar size={26} />} />
          )}
          <div className="mt-3 space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {lista.map((a) => (
              <div key={a.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold" style={{ color: INK }}>{a.professor_nome}</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{a.tipo_nome}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {a.vigente ? <Pill color={VIOLET}>Vigente</Pill> : <Pill color={INK_SOFT}>{a.fim < hojeISO() ? "Encerrado" : "Agendado"}</Pill>}
                      <span className="text-[11.5px] font-semibold" style={{ color: INK }}>{dataBR(a.inicio)} a {dataBR(a.fim)}</span>
                    </div>
                    {a.observacao && <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{a.observacao}</p>}
                  </div>
                  <div className="flex flex-none gap-1.5">
                    <button onClick={() => abrir(a)} aria-label={`Editar afastamento de ${a.professor_nome}`} className="grid h-9 w-9 place-items-center rounded-full" style={{ background: VIOLET + "14", color: VIOLET }}><IconEdit size={17} /></button>
                    <button onClick={() => apagar(a)} aria-label={`Apagar afastamento de ${a.professor_nome}`} className="grid h-9 w-9 place-items-center rounded-full" style={{ background: RED + "12", color: RED }}><IconX size={17} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
