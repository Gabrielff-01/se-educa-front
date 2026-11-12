/* Escola — Transporte escolar: a escola cadastra as rotas (pedido do mentor: "quem gerou a rota?").
   Cada rota tem turno, veículo, motorista e as paradas em ordem, com horário. A escola põe cada aluno
   numa rota e na parada onde ele embarca; o aluno e a família veem isso na tela Transporte.
   A API confere: aluno da tarde não vai em rota da manhã, e a rota não passa da lotação.
   Dados: /api/rotas/ (+ /vincular/, /desvincular/), /api/opcoes/ e /api/alunos/?busca= */

import { useEffect, useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconBus, IconCheck, IconChevron, IconEdit, IconPlus, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { dataHoraBR, horaCurta, mascaraTelefone } from "@/lib/formato";
import type { Aluno, Opcoes, Parada, Rota } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type Form = {
  id?: number; nome: string; turno: string; veiculo: string; placa: string; motorista: string; telefone: string;
  capacidade: string; ativa: boolean; observacao: string; paradas: Parada[];
};
const PARADA_VAZIA: Parada = { local: "", referencia: "", horario: "" };
const VAZIO: Form = {
  nome: "", turno: "matutino", veiculo: "onibus", placa: "", motorista: "", telefone: "", capacidade: "40", ativa: true, observacao: "",
  paradas: [{ ...PARADA_VAZIA }, { ...PARADA_VAZIA }],
};

/* As paradas em linha do tempo (a última costuma ser a escola). Também usada na tela do aluno. */
export function LinhaDoTempo({ paradas, destaque }: { paradas: Parada[]; destaque?: number | null }) {
  return (
    <div>
      {paradas.map((p, i) => {
        const minha = destaque != null && p.id === destaque;
        return (
          <div key={p.id ?? i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-3 w-3 rounded-full border-[3px]" style={{ borderColor: minha ? GREEN : BLUE, background: i === paradas.length - 1 || minha ? (minha ? GREEN : BLUE) : "#fff" }} />
              {i < paradas.length - 1 && <span className="w-0.5 flex-1" style={{ background: "#dbe3ee", minHeight: 26 }} />}
            </div>
            <div className="flex flex-1 justify-between gap-2 pb-3">
              <div className="min-w-0">
                <p className="text-[12.5px]" style={{ color: INK, fontWeight: minha ? 700 : 500 }}>{p.local}{minha && <span style={{ color: GREEN }}> · sua parada</span>}</p>
                {p.referencia && <p className="text-[11px]" style={{ color: INK_SOFT }}>{p.referencia}</p>}
              </div>
              <span className="text-[12px] font-semibold" style={{ color: INK }}>{horaCurta(p.horario)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Cartao({ r, aberto, abrir, editar, mudou }: { r: Rota; aberto: boolean; abrir: () => void; editar: () => void; mudou: (texto: string, nova?: Rota) => void }) {
  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
  const [parada, setParada] = useState("");
  useEffect(() => { const t = setTimeout(() => setTermo(busca.trim()), 400); return () => clearTimeout(t); }, [busca]);
  const achados = useApi<Aluno[]>(aberto && termo.length >= 2 ? `/api/alunos/?busca=${encodeURIComponent(termo)}` : null);
  const envio = useEnvio(["aluno", "parada"]);
  const naRota = new Set(r.alunos.map((a) => a.aluno));
  const lotacao = r.capacidade ? Math.round((r.ocupados / r.capacidade) * 100) : 0;
  const embarque = r.paradas.slice(0, -1).length ? r.paradas.slice(0, -1) : r.paradas;

  const vincular = (a: Aluno) => envio.enviar(async () => {
    const nova = await api<Rota>(`/api/rotas/${r.id}/vincular/`, { method: "POST", body: { aluno: a.id, parada: Number(parada || embarque[0]?.id) } });
    setBusca("");
    mudou(`${a.nome} agora usa a ${r.nome}.`, nova);
  });
  const tirar = (alunoId: number, nome: string) => envio.enviar(async () => {
    const nova = await api<Rota>(`/api/rotas/${r.id}/desvincular/`, { method: "POST", body: { aluno: alunoId } });
    mudou(`${nome} saiu da ${r.nome}.`, nova);
  });
  const apagar = () => envio.enviar(async () => {
    await api(`/api/rotas/${r.id}/`, { method: "DELETE" });
    mudou(`${r.nome} apagada.`);
  });

  return (
    <div className="card overflow-hidden">
      <button onClick={abrir} aria-expanded={aberto} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: (r.ativa ? GREEN : INK_SOFT) + "16", color: r.ativa ? GREEN : INK_SOFT }}><IconBus size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight" style={{ color: INK }}>{r.nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{r.veiculo_nome}{r.placa ? ` ${r.placa}` : ""}{r.motorista ? ` · ${r.motorista}` : ""}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Pill color={BLUE}>{r.turno_nome}</Pill>
            <Pill color={lotacao >= 100 ? RED : lotacao >= 85 ? AMBER : GREEN}>{r.ocupados}/{r.capacidade} lugares</Pill>
            <Pill color={INK_SOFT}>{r.paradas.length} paradas · sai {horaCurta(r.paradas[0]?.horario ?? "")}</Pill>
            {!r.ativa && <Pill color={RED}>desativada</Pill>}
          </div>
        </div>
        <IconChevron size={18} className="mt-1 flex-none transition" style={{ color: "#cbd5e1", transform: aberto ? "rotate(90deg)" : undefined }} />
      </button>

      {aberto && (
        <div className="space-y-3 border-t px-4 pb-4 pt-3" style={{ borderColor: "#eef2f7" }}>
          <LinhaDoTempo paradas={r.paradas} />
          {r.observacao && <p className="rounded-xl bg-[#f6f8fb] px-3 py-2 text-[12px]" style={{ color: INK }}>{r.observacao}</p>}
          <p className="text-[11px]" style={{ color: INK_SOFT }}>Cadastrada pela escola{r.cadastrada_por_nome ? ` (${r.cadastrada_por_nome})` : ""} · atualizada em {dataHoraBR(r.atualizada_em)}{r.telefone ? ` · motorista: ${r.telefone}` : ""}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={editar} className="flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: BLUE }}><IconEdit size={14} />Editar rota e paradas</button>
            {r.ocupados === 0 && <button onClick={apagar} className="rounded-xl border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: RED + "55", color: RED }}>Apagar</button>}
          </div>
          {envio.erro && <AvisoErro texto={envio.erro} />}

          {/* Pôr aluno na rota */}
          <div className="space-y-2 rounded-xl p-3" style={{ background: TEAL + "0c" }}>
            <p className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: TEAL }}>Pôr aluno nesta rota</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Aluno (nome ou CPF)" value={busca} onChange={setBusca} placeholder="Digite o nome" erro={envio.campos.aluno} />
              <Escolha label="Embarca em" value={parada || String(embarque[0]?.id ?? "")} onChange={setParada} opcoes={embarque.map((p) => ({ valor: String(p.id), nome: `${horaCurta(p.horario)} · ${p.local}` }))} erro={envio.campos.parada} />
            </div>
            {termo.length >= 2 && (
              <div className="space-y-1">
                {(achados.dados ?? []).slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[12.5px]">
                    <span className="min-w-0 flex-1 truncate" style={{ color: INK }}><b>{a.nome}</b> <span style={{ color: INK_SOFT }}>· {a.matricula_atual?.turma_nome ?? a.matricula_atual?.serie_nome ?? "sem matrícula"}</span></span>
                    {naRota.has(a.id) ? <Pill color={GREEN}>já está</Pill> : (
                      <button onClick={() => vincular(a)} disabled={envio.enviando} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: GREEN + "16", color: GREEN }}><IconPlus size={13} />Pôr na rota</button>
                    )}
                  </div>
                ))}
                {achados.dados?.length === 0 && <p className="text-[12px]" style={{ color: INK_SOFT }}>Nenhum aluno encontrado.</p>}
              </div>
            )}
          </div>

          {/* Quem usa a rota, por parada */}
          <div>
            <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Alunos na rota ({r.ocupados})</p>
            {r.alunos.length === 0 ? (
              <p className="rounded-xl bg-[#f6f8fb] px-3 py-3 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno nesta rota ainda.</p>
            ) : (
              <div className="divide-y rounded-xl border" style={{ borderColor: "#eef2f7" }}>
                {r.alunos.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{a.aluno_nome}</p>
                      <p className="text-[11px]" style={{ color: INK_SOFT }}>{a.turma_nome ?? "sem turma"} · embarca {a.parada_horario} em {a.parada_local}</p>
                    </div>
                    <button onClick={() => tirar(a.aluno, a.aluno_nome)} aria-label={`Tirar ${a.aluno_nome}`} className="grid h-7 w-7 flex-none place-items-center rounded-full" style={{ color: INK_SOFT }}><IconX size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function EscRotas({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const rotas = useApi<Rota[]>("/api/rotas/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState<Form | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["nome", "turno", "veiculo", "placa", "motorista", "telefone", "capacidade", "observacao", "paradas"]);
  const lista = rotas.dados ?? [];

  const mudou = (texto: string) => { setAviso(texto); rotas.recarregar(); };
  const muda = (campo: keyof Form) => (v: string) => form && setForm({ ...form, [campo]: v });
  const mudaParada = (i: number, campo: keyof Parada, v: string) => form && setForm({ ...form, paradas: form.paradas.map((p, j) => (j === i ? { ...p, [campo]: v } : p)) });

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, ...dados } = form;
    const corpo = { ...dados, capacidade: Number(dados.capacidade), paradas: dados.paradas.filter((p) => p.local.trim() || p.horario) };
    const salva = await api<Rota>(id ? `/api/rotas/${id}/` : "/api/rotas/", { method: id ? "PATCH" : "POST", body: corpo });
    setForm(null);
    setAberto(salva.id);
    mudou(id ? `${salva.nome} atualizada.` : `${salva.nome} cadastrada. Agora ponha os alunos nela.`);
  });
  const editar = (r: Rota) => {
    envio.limpar();
    setForm({ id: r.id, nome: r.nome, turno: r.turno, veiculo: r.veiculo, placa: r.placa, motorista: r.motorista, telefone: r.telefone, capacidade: String(r.capacidade), ativa: r.ativa, observacao: r.observacao, paradas: r.paradas.map((p) => ({ ...p, horario: horaCurta(p.horario) })) });
  };
  const erroParadas = envio.campos.paradas;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Transporte escolar" subtitle={usuario?.escola_nome ?? "Rotas da escola"} onBack={back} accent={GREEN} right={<BotaoNovo label="Nova rota" cor={GREEN} onClick={() => { envio.limpar(); setForm({ ...VAZIO, paradas: VAZIO.paradas.map((p) => ({ ...p })) }); }} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar rota" : "Nova rota"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
            <Entrada label="Nome da rota" value={form.nome} onChange={muda("nome")} erro={envio.campos.nome} placeholder="Ex.: Rota 2 · Povoado Pedra Branca" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Escolha label="Turno" value={form.turno} onChange={muda("turno")} opcoes={opcoes.dados?.turnos ?? []} erro={envio.campos.turno} />
              <Escolha label="Veículo" value={form.veiculo} onChange={muda("veiculo")} opcoes={opcoes.dados?.veiculos ?? []} erro={envio.campos.veiculo} />
              <Entrada label="Placa" value={form.placa} onChange={(v) => muda("placa")(v.toUpperCase())} erro={envio.campos.placa} placeholder="ABC1D23" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Motorista" value={form.motorista} onChange={muda("motorista")} erro={envio.campos.motorista} />
              <Entrada label="Telefone do motorista" value={form.telefone} onChange={(v) => muda("telefone")(mascaraTelefone(v))} erro={envio.campos.telefone} placeholder="(79) 99999-0000" />
              <Entrada label="Lugares" value={form.capacidade} onChange={muda("capacidade")} erro={envio.campos.capacidade} inputMode="numeric" />
            </div>

            <div>
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Paradas, na ordem do trajeto (a última pode ser a escola)</span>
              <div className="space-y-2">
                {form.paradas.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-[#f6f8fb] p-2">
                    <span className="mt-2 grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: BLUE }}>{i + 1}</span>
                    <div className="grid min-w-0 flex-1 gap-1.5 sm:grid-cols-[90px_1fr_1fr]">
                      <input type="time" value={p.horario} onChange={(e) => mudaParada(i, "horario", e.target.value)} aria-label={`Horário da parada ${i + 1}`} className="rounded-lg border bg-white px-2 py-2 text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
                      <input value={p.local} onChange={(e) => mudaParada(i, "local", e.target.value)} placeholder="Local (ex.: Praça da igreja)" className="rounded-lg border bg-white px-2.5 py-2 text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
                      <input value={p.referencia} onChange={(e) => mudaParada(i, "referencia", e.target.value)} placeholder="Referência (opcional)" className="rounded-lg border bg-white px-2.5 py-2 text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, paradas: form.paradas.filter((_, j) => j !== i) })} aria-label={`Tirar a parada ${i + 1}`} className="mt-1.5 grid h-7 w-7 flex-none place-items-center rounded-full" style={{ color: INK_SOFT }}><IconX size={15} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setForm({ ...form, paradas: [...form.paradas, { ...PARADA_VAZIA }] })} className="mt-2 flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: BLUE }}><IconPlus size={14} />Adicionar parada</button>
              {erroParadas && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{typeof erroParadas === "string" ? erroParadas : "Confira o horário e o local de cada parada."}</span>}
            </div>

            <label className="block">
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Observação (os alunos leem)</span>
              <textarea value={form.observacao} onChange={(e) => muda("observacao")(e.target.value)} rows={2} placeholder="Ex.: A volta sai 15 minutos depois da última aula." className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: "#e2e8f0", color: INK }} />
            </label>
            <label className="flex items-center gap-2 text-[13px] font-medium" style={{ color: INK }}>
              <input type="checkbox" checked={form.ativa} onChange={(e) => setForm({ ...form, ativa: e.target.checked })} style={{ accentColor: GREEN }} /> Rota ativa
            </label>
          </CartaoForm>
        )}

        {aviso && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
        <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>A escola cadastra as rotas do transporte escolar e põe cada aluno na parada onde ele embarca. O aluno e a família veem a rota, o horário e o motorista no app.</p>

        <EstadoApi carregando={rotas.carregando} erro={rotas.erro} onRetry={rotas.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhuma rota cadastrada" text="Toque em Nova rota para cadastrar a primeira." icon={<IconBus size={26} />} />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2" style={{ alignItems: "start" }}>
              {lista.map((r) => <Cartao key={r.id} r={r} aberto={aberto === r.id} abrir={() => setAberto(aberto === r.id ? null : r.id)} editar={() => editar(r)} mudou={mudou} />)}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </div>
  );
}
