/* Planejamento: os planos de aula do professor (criar, editar, apagar), com filtro por unidade e status.
   Dados: GET/POST /api/planos/, PATCH/DELETE /api/planos/ID/. As turmas vêm do painel do professor
   e os status de /api/opcoes/. O professor do plano é sempre quem está logado (a API preenche). */

import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconEdit, IconPlus, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api, type ErroApi } from "@/lib/api";
import type { Opcoes, PlanoAula } from "@/lib/tipos";
import { CaixaTexto, ComTurmas, Confirmacao, chaveDe, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type FormPlano = { id?: number; lotacao: string; unidade: string; tema: string; objetivos: string; status: string };

const COR_STATUS: Record<string, string> = { planejado: AMBER, em_andamento: BLUE, concluido: GREEN };
const UNIDADES = [1, 2, 3, 4].map((u) => ({ valor: String(u), nome: `${u}ª unidade` }));

export function ProfPlanejamento({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const planos = useApi<PlanoAula[]>("/api/planos/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [filtroUnidade, setFiltroUnidade] = useState(0); // 0 = todas
  const [filtroStatus, setFiltroStatus] = useState(""); // "" = todos
  const [form, setForm] = useState<FormPlano | null>(null);
  const [salvo, setSalvo] = useState("");
  const [erroApagar, setErroApagar] = useState("");
  const envio = useEnvio(["lotacao", "turma", "materia", "unidade", "tema", "objetivos", "status"]);

  const lotacoes = minhas.turmas.map((t) => ({ valor: chaveDe(t), nome: nomeDe(t) }));
  const status = opcoes.dados?.status_plano ?? [];

  // Leva a tela até o formulário (ele pode abrir longe de onde o professor está).
  const verFormulario = () => setTimeout(() => document.getElementById("form-plano")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  const abrir = (p?: PlanoAula) => {
    envio.limpar(); setSalvo("");
    const primeira = minhas.turmas[0];
    setForm(p
      ? { id: p.id, lotacao: chaveDe(p), unidade: String(p.unidade), tema: p.tema, objetivos: p.objetivos, status: p.status }
      : { lotacao: primeira ? chaveDe(primeira) : "", unidade: String(primeira?.unidade_atual ?? 1), tema: "", objetivos: "", status: "planejado" });
    verFormulario();
  };
  const mudar = (campo: keyof FormPlano) => (v: string) => form && setForm({ ...form, [campo]: v });

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const [turma, materia] = form.lotacao.split("-").map(Number); // "3-5" -> turma 3, matéria 5
    const corpo = { turma, materia, unidade: Number(form.unidade), tema: form.tema, objetivos: form.objetivos, status: form.status };
    if (form.id) await api(`/api/planos/${form.id}/`, { method: "PATCH", body: corpo });
    else await api("/api/planos/", { method: "POST", body: corpo });
    setSalvo(form.id ? "Plano atualizado!" : "Plano criado!");
    setForm(null);
    planos.recarregar();
  });

  const apagar = async (p: PlanoAula) => {
    if (!window.confirm(`Apagar o plano "${p.tema}"?`)) return;
    setErroApagar(""); setSalvo("");
    try {
      await api(`/api/planos/${p.id}/`, { method: "DELETE" });
      setSalvo("Plano apagado.");
      planos.recarregar();
    } catch (e) {
      setErroApagar((e as ErroApi).message);
    }
  };

  const lista = (planos.dados ?? []).filter((p) => (!filtroUnidade || p.unidade === filtroUnidade) && (!filtroStatus || p.status === filtroStatus));
  const chip = (ativo: boolean) => (ativo ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT });

  // O mesmo formulário serve para criar (aparece no topo) e editar (aparece no lugar do plano).
  const formulario = form && (
    <div id="form-plano" className="scroll-mt-3">
      <CartaoForm titulo={form.id ? "Editar plano" : "Novo plano de aula"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
        <Escolha label="Turma · matéria" value={form.lotacao} onChange={mudar("lotacao")} opcoes={lotacoes} erro={envio.campos.turma || envio.campos.materia} />
        <div className="flex gap-2">
          <Escolha label="Unidade" value={form.unidade} onChange={mudar("unidade")} opcoes={UNIDADES} erro={envio.campos.unidade} />
          <Escolha label="Status" value={form.status} onChange={mudar("status")} opcoes={status} erro={envio.campos.status} />
        </div>
        <Entrada label="Tema" value={form.tema} onChange={mudar("tema")} erro={envio.campos.tema} placeholder="Ex.: Progressões aritméticas" />
        <CaixaTexto label="Objetivos e atividades" value={form.objetivos} onChange={mudar("objetivos")} erro={envio.campos.objetivos} placeholder="O que os alunos vão aprender e como" />
      </CartaoForm>
    </div>
  );

  return (
    <>
      <TopBar title="Planejamento" subtitle={`Planos de aula · ${planos.dados?.length ?? 0} no total`} onBack={back} accent={TEAL} right={minhas.turmas.length > 0 ? <BotaoNovo label="Novo plano de aula" cor={TEAL} onClick={() => abrir()} /> : undefined} />
      <Screen>
        <ComTurmas minhas={minhas}>
          {form && !form.id && formulario}

          <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
            {[0, 1, 2, 3, 4].map((u) => <button key={u} onClick={() => setFiltroUnidade(u)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={chip(filtroUnidade === u)}>{u ? `${u}ª unidade` : "Todas"}</button>)}
          </div>
          <div className="scroll-area mt-2 flex gap-2 overflow-x-auto pb-1">
            {[{ valor: "", nome: "Todos" }, ...status].map((s) => <button key={s.valor} onClick={() => setFiltroStatus(s.valor)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={chip(filtroStatus === s.valor)}>{s.nome}</button>)}
          </div>
          {salvo && <Confirmacao texto={salvo} />}
          {erroApagar && <div className="mt-3"><AvisoErro texto={erroApagar} /></div>}

          <div className="mt-3">
            <EstadoApi carregando={planos.carregando} erro={planos.erro} onRetry={planos.recarregar}>
              {lista.length === 0 ? (
                <EmptyState title="Nenhum plano aqui" text={planos.dados?.length ? "Nenhum plano com esses filtros." : "Crie seu primeiro plano de aula no botão +."} icon={<IconBook size={26} />} />
              ) : (
                <div className="space-y-2.5">
                  {lista.map((p) => form?.id === p.id ? <div key={p.id}>{formulario}</div> : (
                    <div key={p.id} className="card p-4">
                      <div className="flex items-center justify-between gap-2"><Pill color={BLUE}>{nomeDe(p)}</Pill><Pill color={COR_STATUS[p.status] ?? INK_SOFT}>{p.status_nome}</Pill></div>
                      <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{p.tema}</p>
                      {p.objetivos && <p className="mt-1 text-[12px] leading-snug" style={{ color: INK_SOFT }}>{p.objetivos}</p>}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconBook size={13} />{p.unidade}ª unidade</p>
                        <div className="flex gap-1.5">
                          <button onClick={() => abrir(p)} aria-label={`Editar ${p.tema}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: TEAL + "14", color: TEAL }}><IconEdit size={15} /></button>
                          <button onClick={() => apagar(p)} aria-label={`Apagar ${p.tema}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: RED + "12", color: RED }}><IconX size={15} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EstadoApi>
          </div>
          {!form && (
            <button onClick={() => abrir()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Novo plano de aula</button>
          )}
        </ComTurmas>
      </Screen>
    </>
  );
}
