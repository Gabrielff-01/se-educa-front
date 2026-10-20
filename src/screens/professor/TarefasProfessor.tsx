/* Tarefas do professor: passar tarefa para uma turma (criar, editar, apagar) e marcar quem entregou.
   Dados: GET/POST /api/tarefas/, PATCH/DELETE /api/tarefas/ID/.
   Entregas: lista de alunos de GET /api/matriculas/?turma=ID e POST /api/tarefas/ID/entregas/ {matriculas: [ids]}
   (a lista enviada substitui a anterior). */

import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconClock, IconDoc, IconEdit, IconPlus, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api, type ErroApi } from "@/lib/api";
import { dataBR, hojeISO } from "@/lib/formato";
import type { Matricula, Tarefa } from "@/lib/tipos";
import { CaixaTexto, ComTurmas, Confirmacao, chaveDe, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type FormTarefa = { id?: number; lotacao: string; titulo: string; descricao: string; prazo: string };

export function TarefasProfessor({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const tarefas = useApi<Tarefa[]>("/api/tarefas/");
  const [filtro, setFiltro] = useState(""); // chave "turma-matéria", "" = todas
  const [form, setForm] = useState<FormTarefa | null>(null);
  const [entregasDe, setEntregasDe] = useState<number | null>(null); // id da tarefa com a lista de entregas aberta
  const [salvo, setSalvo] = useState("");
  const [erroApagar, setErroApagar] = useState("");
  const envio = useEnvio(["turma", "materia", "titulo", "descricao", "prazo"]);

  const meuId = minhas.painel.dados?.professor?.id;
  // A API mostra as tarefas de todos os professores das minhas turmas; aqui ficam só as minhas.
  const minhasTarefas = (tarefas.dados ?? []).filter((t) => t.professor === meuId);
  const lista = minhasTarefas.filter((t) => !filtro || chaveDe(t) === filtro);
  const lotacoes = minhas.turmas.map((t) => ({ valor: chaveDe(t), nome: nomeDe(t) }));

  // Leva a tela até o formulário (ele pode abrir longe de onde o professor está).
  const verFormulario = () => setTimeout(() => document.getElementById("form-tarefa")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  const abrir = (t?: Tarefa) => {
    envio.limpar(); setSalvo(""); setEntregasDe(null);
    const primeira = minhas.turmas[0];
    setForm(t
      ? { id: t.id, lotacao: chaveDe(t), titulo: t.titulo, descricao: t.descricao, prazo: t.prazo }
      : { lotacao: filtro || (primeira ? chaveDe(primeira) : ""), titulo: "", descricao: "", prazo: "" });
    verFormulario();
  };
  const mudar = (campo: keyof FormTarefa) => (v: string) => form && setForm({ ...form, [campo]: v });

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const [turma, materia] = form.lotacao.split("-").map(Number); // "3-5" -> turma 3, matéria 5
    const corpo = { turma, materia, titulo: form.titulo, descricao: form.descricao, prazo: form.prazo || null };
    if (form.id) await api(`/api/tarefas/${form.id}/`, { method: "PATCH", body: corpo });
    else await api("/api/tarefas/", { method: "POST", body: corpo });
    setSalvo(form.id ? "Tarefa atualizada!" : "Tarefa criada!");
    setForm(null);
    tarefas.recarregar();
  });

  const apagar = async (t: Tarefa) => {
    if (!window.confirm(`Apagar a tarefa "${t.titulo}"? As entregas marcadas também serão apagadas.`)) return;
    setErroApagar(""); setSalvo("");
    try {
      await api(`/api/tarefas/${t.id}/`, { method: "DELETE" });
      setSalvo("Tarefa apagada.");
      tarefas.recarregar();
    } catch (e) {
      setErroApagar((e as ErroApi).message);
    }
  };

  // O mesmo formulário serve para criar (aparece no topo) e editar (aparece no lugar da tarefa).
  const formulario = form && (
    <div id="form-tarefa" className="scroll-mt-3">
      <CartaoForm titulo={form.id ? "Editar tarefa" : "Nova tarefa"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
        <Escolha label="Turma · matéria" value={form.lotacao} onChange={mudar("lotacao")} opcoes={lotacoes} erro={envio.campos.turma || envio.campos.materia} />
        <Entrada label="Título" value={form.titulo} onChange={mudar("titulo")} erro={envio.campos.titulo} placeholder="Ex.: Lista de progressões" />
        <CaixaTexto label="Descrição (opcional)" value={form.descricao} onChange={mudar("descricao")} erro={envio.campos.descricao} placeholder="O que fazer e como entregar" linhas={2} />
        <Entrada label="Prazo de entrega" type="date" value={form.prazo} onChange={mudar("prazo")} erro={envio.campos.prazo} />
      </CartaoForm>
    </div>
  );

  return (
    <>
      <TopBar title="Tarefas" subtitle={`Atividades atribuídas · ${minhasTarefas.length}`} onBack={back} accent={TEAL} right={minhas.turmas.length > 0 ? <BotaoNovo label="Nova tarefa" cor={TEAL} onClick={() => abrir()} /> : undefined} />
      <Screen>
        <ComTurmas minhas={minhas}>
          {form && !form.id && formulario}
          <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
            {[{ valor: "", nome: "Todas" }, ...lotacoes].map((l) => (
              <button key={l.valor} onClick={() => setFiltro(l.valor)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === l.valor ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{l.nome}</button>
            ))}
          </div>
          {salvo && <Confirmacao texto={salvo} />}
          {erroApagar && <div className="mt-3"><AvisoErro texto={erroApagar} /></div>}

          <div className="mt-3">
            <EstadoApi carregando={tarefas.carregando} erro={tarefas.erro} onRetry={tarefas.recarregar}>
              {lista.length === 0 ? (
                <EmptyState title="Nenhuma tarefa aqui" text="Passe uma tarefa para a turma no botão +." icon={<IconDoc size={26} />} />
              ) : (
                <div className="space-y-2.5">
                  {lista.map((t) => {
                    if (form?.id === t.id) return <div key={t.id}>{formulario}</div>;
                    const entregues = t.entregas.length;
                    const pct = t.total_alunos ? Math.round((entregues / t.total_alunos) * 100) : 0;
                    const cor = pct === 100 ? GREEN : t.prazo < hojeISO() ? AMBER : BLUE;
                    return (
                      <div key={t.id} className="card p-4">
                        <div className="flex items-center justify-between gap-2">
                          <Pill color={BLUE}>{nomeDe(t)}</Pill>
                          <span className="flex items-center gap-1 text-[11.5px]" style={{ color: t.prazo < hojeISO() ? RED : INK_SOFT }}><IconClock size={13} />{t.prazo < hojeISO() ? "Encerrou" : "Prazo"} {dataBR(t.prazo)}</span>
                        </div>
                        <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{t.titulo}</p>
                        {t.descricao && <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>{t.descricao}</p>}
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: cor }} /></div>
                          <span className="text-[12px] font-bold" style={{ color: cor }}>{entregues}/{t.total_alunos}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <button onClick={() => { setEntregasDe(entregasDe === t.id ? null : t.id); setSalvo(""); }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ background: TEAL + "14", color: TEAL }}>
                            <IconCheck size={14} />Entregas · {t.total_alunos - entregues} pendente(s)
                          </button>
                          <div className="flex gap-1.5">
                            <button onClick={() => abrir(t)} aria-label={`Editar ${t.titulo}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: TEAL + "14", color: TEAL }}><IconEdit size={15} /></button>
                            <button onClick={() => apagar(t)} aria-label={`Apagar ${t.titulo}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: RED + "12", color: RED }}><IconX size={15} /></button>
                          </div>
                        </div>
                        {entregasDe === t.id && (
                          <Entregas tarefa={t} onFechar={() => setEntregasDe(null)} onSalvo={(n) => { setEntregasDe(null); setSalvo(`Entregas de "${t.titulo}" salvas: ${n} aluno(s).`); tarefas.recarregar(); }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </EstadoApi>
          </div>
          {!form && (
            <button onClick={() => abrir()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Nova tarefa</button>
          )}
        </ComTurmas>
      </Screen>
    </>
  );
}

/* Lista de alunos da turma com uma caixinha para marcar quem entregou a tarefa. */
function Entregas({ tarefa, onFechar, onSalvo }: { tarefa: Tarefa; onFechar: () => void; onSalvo: (quantos: number) => void }) {
  const alunos = useApi<Matricula[]>(`/api/matriculas/?turma=${tarefa.turma}&situacao=confirmada`);
  const [marcados, setMarcados] = useState<number[]>(tarefa.entregas);
  const envio = useEnvio();
  const lista = [...(alunos.dados ?? [])].sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome));
  const alternar = (id: number) => setMarcados(marcados.includes(id) ? marcados.filter((m) => m !== id) : [...marcados, id]);
  const salvar = () => envio.enviar(async () => {
    await api(`/api/tarefas/${tarefa.id}/entregas/`, { method: "POST", body: { matriculas: marcados } });
    onSalvo(marcados.length);
  });

  return (
    <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "#e2e8f0" }}>
      <EstadoApi carregando={alunos.carregando} erro={alunos.erro} onRetry={alunos.recarregar}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[12.5px] font-bold" style={{ color: INK }}>Quem entregou? ({marcados.length}/{lista.length})</p>
          <button onClick={() => setMarcados(marcados.length === lista.length ? [] : lista.map((m) => m.id))} className="text-[11.5px] font-semibold" style={{ color: TEAL }}>
            {marcados.length === lista.length ? "Desmarcar todos" : "Marcar todos"}
          </button>
        </div>
        <div className="divide-y divide-[color:var(--color-line)]">
          {lista.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-3 py-2">
              <input type="checkbox" checked={marcados.includes(m.id)} onChange={() => alternar(m.id)} className="h-4 w-4 flex-none accent-[color:var(--color-brand-blue)]" />
              <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: INK }}>{m.aluno_nome}</span>
              {marcados.includes(m.id) && <Pill color={GREEN}>Entregou</Pill>}
            </label>
          ))}
        </div>
        {envio.erro && <div className="mt-2"><AvisoErro texto={envio.erro} /></div>}
        <div className="mt-3 flex gap-2">
          <button onClick={onFechar} className="flex-1 rounded-xl border py-2.5 text-[13px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Cancelar</button>
          <button onClick={salvar} disabled={envio.enviando} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-70" style={{ background: TEAL }}>
            {envio.enviando ? "Salvando..." : "Salvar entregas"}
          </button>
        </div>
      </EstadoApi>
    </div>
  );
}
