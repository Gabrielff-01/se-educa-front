/* Pedidos escola → DIES, com conversa (chat) em cada pedido.
   - Escola (lado="escola"): abre pedido para abrir turma nova, mudar a capacidade de uma turma ou outro assunto.
   - DIES (lado="dies"): vê os pedidos de todas as escolas, responde e atende (o sistema já cria/muda a turma) ou recusa.
   Dados: GET/POST /api/solicitacoes/, GET /api/solicitacoes/ID/, POST .../mensagens/, .../atender/ e .../recusar/.
   Para montar o formulário: /api/ofertas/ (séries da escola), /api/turmas/ e /api/opcoes/ (turnos). */

import { useEffect, useRef, useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconChat, IconCheck, IconChevron, IconSend, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataHoraBR } from "@/lib/formato";
import type { Oferta, Opcao, Opcoes, Pedido, Turma } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Lado = "escola" | "dies";

const TIPOS: Opcao[] = [
  { valor: "nova_turma", nome: "Abrir turma nova" },
  { valor: "capacidade", nome: "Mudar capacidade de uma turma" },
  { valor: "outro", nome: "Outro assunto" },
];
const COR_STATUS: Record<Pedido["status"], string> = { aberta: AMBER, atendida: GREEN, recusada: RED };

/* Frase curta de "de quem é a vez" no pedido aberto. */
function vezDe(p: Pedido, lado: Lado) {
  if (p.status !== "aberta") return null;
  const esperandoDies = p.ultima_fala === "escola";
  if (lado === "escola") return esperandoDies ? "Aguardando a DIES" : "A DIES respondeu";
  return esperandoDies ? "Escola aguardando resposta" : "Aguardando a escola";
}

/* Caixa de texto de várias linhas no mesmo estilo das Entradas do formulário. */
function Texto({ label, value, onChange, erro, placeholder }: { label: string; value: string; onChange: (v: string) => void; erro?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: erro ? RED : "#e2e8f0", color: INK }} />
      {erro && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{erro}</span>}
    </label>
  );
}

export function Pedidos({ back, lado }: { back: () => void; lado: Lado }) {
  const pedidos = useApi<Pedido[]>("/api/solicitacoes/");
  const [aba, setAba] = useState<"abertos" | "fechados">("abertos");
  const [aberto, setAberto] = useState<number | null>(null);
  const [novo, setNovo] = useState(false);

  if (aberto !== null) return <Conversa id={aberto} lado={lado} voltar={() => { setAberto(null); pedidos.recarregar(); }} />;

  const todos = pedidos.dados ?? [];
  const abertos = todos.filter((p) => p.status === "aberta");
  const fechados = todos.filter((p) => p.status !== "aberta");
  const lista = aba === "abertos" ? abertos : fechados;
  const cor = lado === "escola" ? GREEN : BLUE;

  return (
    <>
      <TopBar
        title={lado === "escola" ? "Pedidos à DIES" : "Pedidos das escolas"}
        subtitle={lado === "escola" ? "Turmas, capacidade e outros assuntos" : "Turmas novas, capacidade e outros assuntos"}
        onBack={back}
        accent={cor}
        right={lado === "escola" && !novo ? <BotaoNovo onClick={() => setNovo(true)} cor={cor} label="Novo pedido" /> : undefined}
      />
      <Screen>
        {novo && <NovoPedido fechar={() => setNovo(false)} criado={(p) => { setNovo(false); setAberto(p.id); }} />}
        <div className="mb-3 flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {([["abertos", `Abertos (${abertos.length})`], ["fechados", `Encerrados (${fechados.length})`]] as const).map(([id, nome]) => (
            <button key={id} onClick={() => setAba(id)} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold transition" style={aba === id ? { background: cor, color: "#fff" } : { color: INK_SOFT }}>{nome}</button>
          ))}
        </div>
        <EstadoApi carregando={pedidos.carregando} erro={pedidos.erro} onRetry={pedidos.recarregar}>
          {lista.length === 0 ? (
            <EmptyState
              title={aba === "abertos" ? "Nenhum pedido aberto" : "Nenhum pedido encerrado"}
              text={lado === "escola" ? "Toque no + para pedir à DIES uma turma nova ou mudar a capacidade de uma turma." : "Quando uma escola pedir algo, aparece aqui."}
              icon={<IconChat size={26} />}
            />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2">
              {lista.map((p) => {
                const ultima = p.mensagens[p.mensagens.length - 1];
                const vez = vezDe(p, lado);
                // Destaca quando é a vez de quem está olhando responder
                const minhaVez = p.status === "aberta" && (lado === "dies" ? p.ultima_fala === "escola" : p.ultima_fala !== "escola");
                return (
                  <button key={p.id} onClick={() => setAberto(p.id)} className="card block w-full p-3.5 text-left transition active:scale-[.99]" style={{ borderLeft: `3px solid ${minhaVez ? cor : "transparent"}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-bold" style={{ color: INK }}>{p.titulo}</p>
                        {lado === "dies" && <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.escola_nome}</p>}
                      </div>
                      <IconChevron size={18} style={{ color: "#cbd5e1" }} className="flex-none" />
                    </div>
                    {ultima && <p className="mt-1.5 line-clamp-2 text-[12px]" style={{ color: INK_SOFT }}><b style={{ color: INK }}>{ultima.lado === "sistema" ? "Sistema" : ultima.autor_nome.split(" ")[0]}:</b> {ultima.texto}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Pill color={COR_STATUS[p.status]}>{p.status_nome}</Pill>
                      {vez && <Pill color={minhaVez ? cor : INK_SOFT}>{vez}</Pill>}
                      <span className="ml-auto text-[10.5px]" style={{ color: "#94a3b8" }}>{dataHoraBR(p.atualizada_em)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}

/* Formulário da escola: o que pedir e a explicação (vira a primeira mensagem da conversa). */
function NovoPedido({ fechar, criado }: { fechar: () => void; criado: (p: Pedido) => void }) {
  const usuario = useUsuario();
  const escola = usuario?.escola;
  const ofertas = useApi<Oferta[]>(escola ? `/api/ofertas/?escola=${escola}&ano_letivo=${ANO_ATUAL}` : null);
  const turmas = useApi<Turma[]>(escola ? `/api/turmas/?escola=${escola}&ano_letivo=${ANO_ATUAL}` : null);
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState({ tipo: "nova_turma", serie: "", turno: "", turma: "", capacidade: "35", assunto: "", mensagem: "" });
  const envio = useEnvio(["tipo", "serie", "turno", "turma", "capacidade", "assunto", "mensagem"]);
  const mudar = (campo: keyof typeof form) => (v: string) => setForm({ ...form, [campo]: v });

  // Só as séries que o DED autorizou a escola a oferecer neste ano.
  const series: Opcao[] = (ofertas.dados ?? []).flatMap((o) => o.series.map((id, i) => ({ valor: String(id), nome: o.series_nomes[i] })));
  const listaTurmas: Opcao[] = (turmas.dados ?? []).map((t) => ({ valor: String(t.id), nome: `${t.nome} · ${t.turno_nome} · ${t.alunos}/${t.capacidade} alunos` }));
  const turmaEscolhida = (turmas.dados ?? []).find((t) => String(t.id) === form.turma);

  const salvar = () => envio.enviar(async () => {
    const corpo: Record<string, unknown> = { tipo: form.tipo, mensagem: form.mensagem };
    if (form.tipo === "nova_turma") Object.assign(corpo, { serie: form.serie || null, turno: form.turno, capacidade: form.capacidade || null });
    if (form.tipo === "capacidade") Object.assign(corpo, { turma: form.turma || null, capacidade: form.capacidade || null });
    if (form.tipo === "outro") corpo.assunto = form.assunto;
    criado(await api<Pedido>("/api/solicitacoes/", { method: "POST", body: corpo }));
  });

  return (
    <CartaoForm titulo="Novo pedido à DIES" onSalvar={salvar} onCancelar={fechar} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
      <Escolha label="O que você precisa?" value={form.tipo} onChange={(v) => { envio.limpar(); setForm({ ...form, tipo: v, capacidade: v === "nova_turma" ? "35" : "" }); }} opcoes={TIPOS} erro={envio.campos.tipo} />
      {form.tipo === "nova_turma" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Escolha label="Série" value={form.serie} onChange={mudar("serie")} opcoes={series} vazio="Escolha" erro={envio.campos.serie} />
          <Escolha label="Turno" value={form.turno} onChange={mudar("turno")} opcoes={opcoes.dados?.turnos ?? []} vazio="Escolha" erro={envio.campos.turno} />
          <Entrada label="Vagas" value={form.capacidade} onChange={mudar("capacidade")} inputMode="numeric" erro={envio.campos.capacidade} />
        </div>
      )}
      {form.tipo === "capacidade" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Escolha label="Turma" value={form.turma} onChange={mudar("turma")} opcoes={listaTurmas} vazio="Escolha" erro={envio.campos.turma} />
          <Entrada label={turmaEscolhida ? `Capacidade nova (hoje: ${turmaEscolhida.capacidade})` : "Capacidade nova"} value={form.capacidade} onChange={mudar("capacidade")} inputMode="numeric" erro={envio.campos.capacidade} />
        </div>
      )}
      {form.tipo === "outro" && <Entrada label="Assunto" value={form.assunto} onChange={mudar("assunto")} erro={envio.campos.assunto} placeholder="Ex.: reposição de aula" />}
      <Texto label="Explique para a DIES" value={form.mensagem} onChange={mudar("mensagem")} erro={envio.campos.mensagem} placeholder="Ex.: temos 12 alunos esperando turma e a sala 12 fica livre à tarde." />
    </CartaoForm>
  );
}

/* Um pedido aberto: resumo, conversa e (para a DIES) atender ou recusar. */
function Conversa({ id, lado, voltar }: { id: number; lado: Lado; voltar: () => void }) {
  const url = `/api/solicitacoes/${id}/`;
  const inicial = useApi<Pedido>(url);
  const [atual, setAtual] = useState<Pedido | null>(null);
  const pedido = atual ?? inicial.dados;
  const [texto, setTexto] = useState("");
  const [acao, setAcao] = useState<null | "atender" | "recusar">(null);
  const [letra, setLetra] = useState("");
  const [resposta, setResposta] = useState("");
  const envio = useEnvio(["texto", "letra", "resposta"]);
  const fim = useRef<HTMLDivElement>(null);

  // A cada 15 s busca mensagens novas do outro lado (sem piscar a tela).
  useEffect(() => {
    const t = setInterval(() => { api<Pedido>(url).then(setAtual).catch(() => {}); }, 15000);
    return () => clearInterval(t);
  }, [url]);
  const qtdMensagens = pedido?.mensagens.length ?? 0;
  useEffect(() => { fim.current?.scrollIntoView({ block: "end" }); }, [qtdMensagens]);

  const enviar = () => {
    if (!texto.trim()) return;
    envio.enviar(async () => {
      setAtual(await api<Pedido>(`${url}mensagens/`, { method: "POST", body: { texto } }));
      setTexto("");
    });
  };
  const confirmar = () => envio.enviar(async () => {
    const corpo = acao === "atender" ? { letra, resposta } : { resposta };
    setAtual(await api<Pedido>(`${url}${acao}/`, { method: "POST", body: corpo }));
    setAcao(null);
    setResposta("");
  });

  const cor = lado === "escola" ? GREEN : BLUE;
  return (
    <>
      <TopBar title={pedido?.tipo_nome ?? "Pedido"} subtitle={pedido ? (lado === "dies" ? pedido.escola_nome : `Aberto por ${pedido.criada_por_nome}`) : ""} onBack={voltar} accent={cor} />
      <Screen>
        <EstadoApi carregando={inicial.carregando && !pedido} erro={inicial.erro} onRetry={inicial.recarregar}>
          {pedido && (
            <>
              <div className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] font-bold" style={{ color: INK }}>{pedido.titulo}</p>
                  <Pill color={COR_STATUS[pedido.status]}>{pedido.status_nome}</Pill>
                </div>
                <p className="mt-1 text-[11.5px]" style={{ color: INK_SOFT }}>Aberto em {dataHoraBR(pedido.criada_em)}{pedido.tipo === "nova_turma" && pedido.capacidade ? ` · ${pedido.capacidade} vagas` : ""}</p>
              </div>

              <div className="mt-4 space-y-2.5">
                {pedido.mensagens.map((m) => {
                  if (m.lado === "sistema") {
                    return <div key={m.id} className="flex justify-center"><span className="rounded-full px-3 py-1.5 text-center text-[11.5px] font-semibold" style={{ background: COR_STATUS[pedido.status] + "16", color: COR_STATUS[pedido.status] }}>{m.texto}</span></div>;
                  }
                  const meu = m.lado === lado;
                  return (
                    <div key={m.id} className={`flex ${meu ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[82%] rounded-2xl px-3.5 py-2.5" style={meu ? { background: cor, color: "#fff", borderBottomRightRadius: 6 } : { background: "#fff", color: INK, borderBottomLeftRadius: 6, boxShadow: "0 1px 2px rgba(15,33,53,.06)" }}>
                        {!meu && <p className="mb-0.5 text-[10.5px] font-bold" style={{ color: m.lado === "dies" ? BLUE : GREEN }}>{m.autor_nome} · {m.lado === "dies" ? "DIES" : "Escola"}</p>}
                        <p className="whitespace-pre-line text-[13px] leading-snug">{m.texto}</p>
                        <p className="mt-1 text-right text-[9.5px]" style={{ color: meu ? "#ffffffaa" : "#94a3b8" }}>{dataHoraBR(m.criada_em)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={fim} />
              </div>

              {pedido.status === "aberta" ? (
                <>
                  {lado === "dies" && !acao && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => { envio.limpar(); setAcao("atender"); }} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold text-white" style={{ background: GREEN }}><IconCheck size={16} />Atender</button>
                      <button onClick={() => { envio.limpar(); setAcao("recusar"); }} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold" style={{ background: RED + "14", color: RED }}><IconX size={16} />Recusar</button>
                    </div>
                  )}
                  {acao && (
                    <div className="mt-4">
                      <CartaoForm titulo={acao === "atender" ? "Atender o pedido" : "Recusar o pedido"} onSalvar={confirmar} onCancelar={() => setAcao(null)} salvando={envio.enviando} erro={envio.erro} cor={acao === "atender" ? GREEN : RED}>
                        {acao === "atender" && (
                          <p className="text-[12px]" style={{ color: INK_SOFT }}>
                            {pedido.tipo === "nova_turma" ? "O sistema cria a turma com a série, o turno e as vagas do pedido." : pedido.tipo === "capacidade" ? "O sistema muda a capacidade da turma para o valor pedido." : "O pedido é marcado como atendido."}
                          </p>
                        )}
                        {acao === "atender" && pedido.tipo === "nova_turma" && <Entrada label="Letra da turma (vazio = próxima livre)" value={letra} onChange={setLetra} erro={envio.campos.letra} placeholder="Ex.: C" />}
                        <Texto label={acao === "atender" ? "Mensagem para a escola (opcional)" : "Motivo (a escola vai ver)"} value={resposta} onChange={setResposta} erro={envio.campos.resposta} />
                      </CartaoForm>
                    </div>
                  )}
                  {!acao && envio.erro && <div className="mt-3"><AvisoErro texto={envio.campos.texto ?? envio.erro} /></div>}
                  <div className="mt-4 flex items-center gap-2">
                    <input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()} placeholder="Escreva uma mensagem..." className="min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 text-[13.5px] shadow-sm outline-none" />
                    <button onClick={enviar} disabled={envio.enviando || !texto.trim()} aria-label="Enviar" className="grid h-10 w-10 flex-none place-items-center rounded-full text-white disabled:opacity-50" style={{ background: cor }}><IconSend size={18} /></button>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-center text-[12px]" style={{ color: INK_SOFT }}>Pedido {pedido.status_nome.toLowerCase()}. Para outro assunto, abra um pedido novo.</p>
              )}
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
