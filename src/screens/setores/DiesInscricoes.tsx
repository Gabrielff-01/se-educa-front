/* DIES — Matrículas pela internet: os pedidos que as famílias mandaram na tela de entrada do app.
   - Aprovar (POST /api/inscricoes/ID/aprovar/): o sistema cria o aluno, o responsável, o login do aluno
     e a matrícula "em análise" sem turma, que cai na Enturmação.
   - Recusar (POST /api/inscricoes/ID/recusar/ {motivo}): a família vê o motivo quando tenta entrar. */

import { useState } from "react";
import { AvisoErro, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconChevron, IconEdit, IconUsers, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR, dataHoraBR, mascaraCpf } from "@/lib/formato";
import type { Inscricao } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type Aba = Inscricao["status"];
const ABAS: { id: Aba; nome: string; cor: string }[] = [
  { id: "aguardando", nome: "Aguardando", cor: AMBER },
  { id: "aprovada", nome: "Aprovadas", cor: GREEN },
  { id: "recusada", nome: "Recusadas", cor: RED },
];

function Linha({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{rotulo}: <b className="font-semibold [overflow-wrap:anywhere]" style={{ color: INK }}>{valor || "—"}</b></p>
  );
}

function Cartao({ i, aberto, abrir, mudou, nav }: { i: Inscricao; aberto: boolean; abrir: () => void; mudou: (i: Inscricao, texto: string) => void; nav: (s: ScreenId) => void }) {
  const [recusando, setRecusando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const envio = useEnvio(["motivo"]);
  const cor = ABAS.find((a) => a.id === i.status)!.cor;

  const aprovar = () => envio.enviar(async () => {
    const nova = await api<Inscricao>(`/api/inscricoes/${i.id}/aprovar/`, { method: "POST" });
    mudou(nova, `${nova.aluno_nome} foi matriculado(a) e está na Enturmação esperando turma.`);
  });
  const recusar = () => envio.enviar(async () => {
    const nova = await api<Inscricao>(`/api/inscricoes/${i.id}/recusar/`, { method: "POST", body: { motivo } });
    mudou(nova, `Pedido de ${nova.aluno_nome} recusado. A família vê o motivo quando tentar entrar.`);
  });

  return (
    <div className="card overflow-hidden">
      <button onClick={abrir} aria-expanded={aberto} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><IconEdit size={19} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight" style={{ color: INK }}>{i.aluno_nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{i.serie_nome} · {i.escola_nome}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Pill color={cor}>{i.status_nome}</Pill>
            <Pill color={INK_SOFT}>protocolo {i.protocolo}</Pill>
            {i.bolsa_familia && <Pill color={TEAL}>Bolsa Família</Pill>}
          </div>
        </div>
        <IconChevron size={18} className="mt-1 flex-none transition" style={{ color: "#cbd5e1", transform: aberto ? "rotate(90deg)" : undefined }} />
      </button>

      {aberto && (
        <div className="space-y-3 border-t px-4 pb-4 pt-3" style={{ borderColor: "#eef2f7" }}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-0.5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Aluno</p>
              <Linha rotulo="Nascimento" valor={`${dataBR(i.data_nascimento)} (${i.idade} anos)`} />
              <Linha rotulo="CPF" valor={mascaraCpf(i.cpf)} />
              <Linha rotulo="Sexo" valor={i.sexo_nome} />
              <Linha rotulo="Cor/raça" valor={i.raca_nome} />
              <Linha rotulo="Bolsa Família" valor={i.bolsa_familia ? `Sim · NIS ${i.nis}` : "Não"} />
            </div>
            <div className="space-y-0.5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Responsável</p>
              <Linha rotulo="Nome" valor={`${i.responsavel_nome} (${i.parentesco_nome})`} />
              <Linha rotulo="CPF" valor={mascaraCpf(i.responsavel_cpf)} />
              <Linha rotulo="Telefone" valor={i.telefone} />
              <Linha rotulo="E-mail (login)" valor={i.email} />
            </div>
            <div className="space-y-0.5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Endereço</p>
              <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{i.endereco}, {i.numero}{i.complemento ? ` · ${i.complemento}` : ""}</p>
              <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{i.bairro} · {i.cidade}/{i.uf} · CEP {i.cep}</p>
            </div>
            <div className="space-y-0.5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>Vaga pedida</p>
              <Linha rotulo="Escola" valor={`${i.escola_nome} (${i.municipio_escola})`} />
              <Linha rotulo="Série" valor={`${i.serie_nome} · ${i.curso_nome} · ${i.ano_letivo}`} />
              <Linha rotulo="Turno preferido" valor={i.turno_nome || "Sem preferência"} />
              <Linha rotulo="Enviado em" valor={dataHoraBR(i.criada_em)} />
            </div>
          </div>

          {i.status === "aprovada" && (
            <div className="rounded-xl px-3 py-2.5 text-[12.5px]" style={{ background: GREEN + "12", color: INK }}>
              Aprovada por {i.analisada_por_nome ?? "—"} em {i.analisada_em ? dataHoraBR(i.analisada_em) : "—"}.{" "}
              {i.turma_nome ? <>Já está na turma <b>{i.turma_nome}</b>.</> : <>Está na Enturmação esperando turma.</>}
              {!i.turma_nome && <button onClick={() => nav("secEnturmacao")} className="ml-1 font-semibold underline" style={{ color: GREEN }}>Abrir Enturmação</button>}
            </div>
          )}
          {i.status === "recusada" && (
            <div className="rounded-xl px-3 py-2.5 text-[12.5px]" style={{ background: RED + "10", color: INK }}>
              Recusada por {i.analisada_por_nome ?? "—"} em {i.analisada_em ? dataHoraBR(i.analisada_em) : "—"}. Motivo: <b>{i.motivo_recusa}</b>
            </div>
          )}

          {i.status === "aguardando" && (
            recusando ? (
              <div className="space-y-2 rounded-xl p-3" style={{ background: RED + "0a" }}>
                <label className="block">
                  <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Motivo da recusa (a família vai ler)</span>
                  <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} maxLength={500} placeholder="Ex.: A escola não tem vaga no 1º ano. Peça na Escola X, que fica no mesmo bairro."
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.motivo ? RED : "#e2e8f0", color: INK }} />
                  {envio.campos.motivo && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.motivo}</span>}
                </label>
                {envio.erro && <AvisoErro texto={envio.erro} />}
                <div className="flex gap-2">
                  <button onClick={() => { setRecusando(false); envio.limpar(); }} className="flex-1 rounded-xl border bg-white py-2.5 text-[13px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Cancelar</button>
                  <button onClick={recusar} disabled={envio.enviando} className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-60" style={{ background: RED }}>{envio.enviando ? "Recusando..." : "Recusar pedido"}</button>
                </div>
              </div>
            ) : (
              <>
                {envio.erro && <AvisoErro texto={envio.erro} />}
                <div className="flex gap-2">
                  <button onClick={() => { setRecusando(true); envio.limpar(); }} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border bg-white py-2.5 text-[13px] font-semibold" style={{ borderColor: RED + "55", color: RED }}><IconX size={16} />Recusar</button>
                  <button onClick={aprovar} disabled={envio.enviando} className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-60" style={{ background: GREEN }}><IconCheck size={16} />{envio.enviando ? "Aprovando..." : "Aprovar"}</button>
                </div>
                <p className="text-[11px] [overflow-wrap:anywhere]" style={{ color: INK_SOFT }}>Aprovar cria o aluno, o responsável, o login do aluno ({i.email}) e a matrícula sem turma, que vai para a Enturmação.</p>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function DiesInscricoes({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const inscricoes = useApi<Inscricao[]>("/api/inscricoes/");
  const [aba, setAba] = useState<Aba>("aguardando");
  const [aberto, setAberto] = useState<number | null>(null);
  const [aviso, setAviso] = useState<{ texto: string; enturmar: boolean } | null>(null);
  const [busca, setBusca] = useState("");

  const todas = inscricoes.dados ?? [];
  const filtro = busca.trim().toLowerCase();
  const lista = todas.filter((i) => i.status === aba).filter((i) => !filtro || [i.aluno_nome, i.protocolo, i.escola_nome, i.responsavel_nome, i.cpf].some((t) => t.toLowerCase().includes(filtro)));
  const cor = ABAS.find((a) => a.id === aba)!.cor;

  const mudou = (nova: Inscricao, texto: string) => {
    setAviso({ texto, enturmar: nova.status === "aprovada" });
    setAberto(null);
    inscricoes.recarregar();
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Matrículas pela internet" subtitle={`DIES · ${todas.filter((i) => i.status === "aguardando").length} aguardando análise`} onBack={back} accent={BLUE} />
      <Screen>
        {aviso && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>
            <IconCheck size={17} /><span className="flex-1">{aviso.texto}</span>
            {aviso.enturmar && <button onClick={() => nav("secEnturmacao")} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px]" style={{ color: GREEN }}><IconUsers size={14} />Abrir Enturmação</button>}
          </div>
        )}
        <div className="mb-3 flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {ABAS.map((a) => (
            <button key={a.id} onClick={() => { setAba(a.id); setAberto(null); }} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold transition" style={aba === a.id ? { background: a.cor, color: "#fff" } : { color: INK_SOFT }}>
              {a.nome} ({todas.filter((i) => i.status === a.id).length})
            </button>
          ))}
        </div>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno, protocolo, CPF ou escola" className="mb-3 w-full rounded-2xl bg-white px-4 py-2.5 text-[13px] shadow-sm outline-none" />
        <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>As famílias pedem a vaga na tela de entrada do app, em "Fazer matrícula". Aprovado, o aluno vai para a Enturmação, onde o DIES escolhe a turma.</p>
        <EstadoApi carregando={inscricoes.carregando} erro={inscricoes.erro} onRetry={inscricoes.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title={aba === "aguardando" ? "Nenhum pedido esperando" : aba === "aprovada" ? "Nenhum pedido aprovado" : "Nenhum pedido recusado"} text="Quando uma família pedir matrícula pela internet, o pedido aparece aqui." icon={<IconEdit size={26} />} />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2" style={{ alignItems: "start" }}>
              {lista.map((i) => <Cartao key={i.id} i={i} aberto={aberto === i.id} abrir={() => setAberto(aberto === i.id ? null : i.id)} mudou={mudou} nav={nav} />)}
            </div>
          )}
        </EstadoApi>
        <div className="mt-4 flex flex-wrap gap-1.5"><Pill color={cor}>{lista.length} {lista.length === 1 ? "pedido nesta aba" : "pedidos nesta aba"}</Pill></div>
      </Screen>
    </div>
  );
}
