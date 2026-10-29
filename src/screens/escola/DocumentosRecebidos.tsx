/* Documentos recebidos (gestão da escola): o que alunos e responsáveis mandaram.
   A escola abre o arquivo e aceita ou recusa (com o motivo, que a família vê e pode mandar de novo).
   No atestado aparece quantas faltas o aluno tem nos dias cobertos, pra conferir mais rápido.
   Dados: GET /api/documentos/, POST /api/documentos/ID/aceitar/ e /recusar/, GET .../arquivo/. */

import { useState } from "react";
import { CartaoForm, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { VerArquivo } from "@/components/VerArquivo";
import { IconCheck, IconDoc, IconSearch, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { COR_DO_STATUS, GRUPOS_DE_TIPOS, tamanhoBR } from "@/lib/documentos";
import { dataBR, dataHoraBR } from "@/lib/formato";
import type { Documento } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Aba = Documento["status"];
const ABAS: { id: Aba; nome: string }[] = [
  { id: "aguardando", nome: "Aguardando" },
  { id: "aceito", nome: "Aceitos" },
  { id: "recusado", nome: "Recusados" },
];
// Motivos comuns: um toque já preenche o texto (dá pra editar depois).
const MOTIVOS = ["Arquivo ilegível ou cortado", "Documento vencido", "Documento de outra pessoa", "Falta a assinatura", "Não é o documento pedido"];

export function DocumentosRecebidos({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const documentos = useApi<Documento[]>("/api/documentos/");
  const [aba, setAba] = useState<Aba>("aguardando");
  const [grupo, setGrupo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [vendo, setVendo] = useState<Documento | null>(null);
  // Documento sendo analisado agora: id + o que vai ser feito
  const [analise, setAnalise] = useState<{ id: number; acao: "aceitar" | "recusar" } | null>(null);
  const [resposta, setResposta] = useState("");
  const envio = useEnvio(["resposta"]);

  const todos = documentos.dados ?? [];
  const tiposDoGrupo = GRUPOS_DE_TIPOS.find((g) => g.grupo === grupo)?.tipos.map((t) => t.valor);
  const termo = busca.trim().toLowerCase();
  const lista = todos.filter((d) => d.status === aba
    && (!tiposDoGrupo || tiposDoGrupo.includes(d.tipo))
    && (!termo || d.aluno_nome.toLowerCase().includes(termo)));
  const quantos = (status: Aba) => todos.filter((d) => d.status === status).length;

  const abrirAnalise = (d: Documento, acao: "aceitar" | "recusar") => { envio.limpar(); setResposta(""); setAnalise({ id: d.id, acao }); };
  const confirmar = () => envio.enviar(async () => {
    if (!analise) return;
    await api<Documento>(`/api/documentos/${analise.id}/${analise.acao}/`, { method: "POST", body: { resposta } });
    setAnalise(null);
    documentos.recarregar();
  });

  return (
    <>
      <TopBar title="Documentos recebidos" subtitle={usuario?.escola_nome ?? "Enviados por alunos e responsáveis"} onBack={back} accent={GREEN} />
      <Screen>
        <div className="mb-3 flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {ABAS.map((a) => (
            <button key={a.id} onClick={() => { setAba(a.id); setAnalise(null); }} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold transition" style={aba === a.id ? { background: COR_DO_STATUS[a.id], color: "#fff" } : { color: INK_SOFT }}>
              {a.nome} ({quantos(a.id)})
            </button>
          ))}
        </div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <IconSearch size={16} style={{ color: INK_SOFT }} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar pelo nome do aluno" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" style={{ color: INK }} />
          </label>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="rounded-xl bg-white px-3 py-2.5 text-[13px] shadow-sm outline-none" style={{ color: INK }}>
            <option value="todos">Todos os tipos</option>
            {GRUPOS_DE_TIPOS.map((g) => <option key={g.grupo} value={g.grupo}>{g.grupo}</option>)}
          </select>
        </div>

        <EstadoApi carregando={documentos.carregando} erro={documentos.erro} onRetry={documentos.recarregar}>
          {lista.length === 0 ? (
            <EmptyState
              title={aba === "aguardando" ? "Nada esperando análise" : `Nenhum documento ${aba === "aceito" ? "aceito" : "recusado"}`}
              text={termo || tiposDoGrupo ? "Nenhum documento com esse filtro." : "Quando um aluno ou responsável enviar um documento pelo app, ele aparece aqui."}
              icon={<IconDoc size={26} />}
            />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2">
              {lista.map((d) => (
                <div key={d.id} className="card p-3.5" style={{ borderLeft: `3px solid ${COR_DO_STATUS[d.status]}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold" style={{ color: INK }}>{d.aluno_nome}</p>
                      <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{d.turma_nome ?? "Sem turma"} · {d.tipo_nome}</p>
                    </div>
                    <Pill color={COR_DO_STATUS[d.status]}>{d.status_nome}</Pill>
                  </div>

                  {d.data_inicio && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px]" style={{ color: INK }}>
                      <span>De <b>{dataBR(d.data_inicio)}</b> a <b>{dataBR(d.data_fim)}</b></span>
                      {d.faltas_no_periodo !== null && (
                        <Pill color={d.faltas_no_periodo ? AMBER : INK_SOFT}>{d.faltas_no_periodo === 0 ? "Sem faltas nesses dias" : `${d.faltas_no_periodo} ${d.faltas_no_periodo === 1 ? "falta" : "faltas"} nesses dias`}</Pill>
                      )}
                    </div>
                  )}
                  {d.descricao && <p className="mt-1.5 text-[12px]" style={{ color: INK_SOFT }}>“{d.descricao}”</p>}
                  <p className="mt-1.5 text-[11px]" style={{ color: "#94a3b8" }}>Enviado por {d.enviado_por_nome} em {dataHoraBR(d.enviado_em)}</p>
                  {d.analisado_em && (
                    <p className="mt-1 text-[11.5px]" style={{ color: COR_DO_STATUS[d.status] }}>
                      {d.status_nome} por {d.analisado_por_nome} em {dataHoraBR(d.analisado_em)}{d.resposta ? `: ${d.resposta}` : ""}
                    </p>
                  )}

                  <button onClick={() => setVendo(d)} className="mt-2.5 flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left" style={{ borderColor: "#e2e8f0" }}>
                    <IconDoc size={18} style={{ color: BLUE }} />
                    <span className="min-w-0 flex-1 truncate text-[12px] font-semibold" style={{ color: INK }}>{d.nome_arquivo}</span>
                    <span className="text-[11px]" style={{ color: INK_SOFT }}>{tamanhoBR(d.tamanho)}</span>
                    <span className="text-[12px] font-semibold" style={{ color: BLUE }}>Abrir</span>
                  </button>

                  {d.status === "aguardando" && analise?.id !== d.id && (
                    <div className="mt-2.5 flex gap-2">
                      <button onClick={() => abrirAnalise(d, "aceitar")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold text-white" style={{ background: GREEN }}><IconCheck size={15} />Aceitar</button>
                      <button onClick={() => abrirAnalise(d, "recusar")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold" style={{ background: RED + "14", color: RED }}><IconX size={15} />Recusar</button>
                    </div>
                  )}
                  {analise?.id === d.id && (
                    <div className="mt-3">
                      <CartaoForm
                        titulo={analise.acao === "aceitar" ? "Aceitar documento" : "Recusar documento"}
                        onSalvar={confirmar} onCancelar={() => setAnalise(null)} salvando={envio.enviando} erro={envio.erro}
                        cor={analise.acao === "aceitar" ? GREEN : RED} rotulo={analise.acao === "aceitar" ? "Aceitar" : "Recusar"} rotuloSalvando="Salvando..."
                      >
                        {analise.acao === "recusar" && (
                          <div className="flex flex-wrap gap-1.5">
                            {MOTIVOS.map((m) => <button key={m} onClick={() => setResposta(m)} className="rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={resposta === m ? { background: RED, color: "#fff", borderColor: RED } : { borderColor: "#e2e8f0", color: INK_SOFT }}>{m}</button>)}
                          </div>
                        )}
                        <label className="block">
                          <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{analise.acao === "recusar" ? "Motivo (a família vai ver)" : "Mensagem para a família (opcional)"}</span>
                          <textarea value={resposta} onChange={(e) => setResposta(e.target.value)} rows={2} maxLength={500} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.resposta ? RED : "#e2e8f0", color: INK }} />
                          {envio.campos.resposta && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.resposta}</span>}
                        </label>
                      </CartaoForm>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </EstadoApi>
      </Screen>
      {vendo && <VerArquivo documento={vendo} fechar={() => setVendo(null)} />}
    </>
  );
}
