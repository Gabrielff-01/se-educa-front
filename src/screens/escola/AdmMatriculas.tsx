/* Matrículas da escola: fila "em análise", alunos sem turma, confirmadas e canceladas.
   A escola confirma a matrícula escolhendo a turma, troca de turma, cancela e faz matrícula nova.
   Dados: GET /api/matriculas/?situacao=... (ou ?sem_turma=1) e PATCH /api/matriculas/ID/,
          POST /api/matriculas/nova/, /api/turmas/?escola=ID, /api/ofertas/?escola=ID (séries oferecidas),
          /api/opcoes/ (programas e parentescos) e /api/painel/escola/ (os números das abas). */

import { useEffect, useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR } from "@/lib/formato";
import type { Matricula, Oferta, Opcoes, Turma } from "@/lib/tipos";
import { AMBER, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Aba = "em_analise" | "sem_turma" | "confirmada" | "cancelada";
type Indicadores = { alunos: number; em_analise: number; aguardando_turma: number; canceladas: number };

const ABAS: { id: Aba; nome: string; cor: string; vazio: string }[] = [
  { id: "em_analise", nome: "Em análise", cor: AMBER, vazio: "Nenhuma matrícula esperando análise." },
  { id: "sem_turma", nome: "Sem turma", cor: RED, vazio: "Todo aluno com matrícula ativa já está numa turma." },
  { id: "confirmada", nome: "Confirmadas", cor: GREEN, vazio: "Nenhuma matrícula confirmada." },
  { id: "cancelada", nome: "Canceladas", cor: INK_SOFT, vazio: "Nenhuma matrícula cancelada." },
];

type FormNova = {
  aluno_nome: string; aluno_nascimento: string; programa_social: string; nis: string; necessidade_especial: string;
  responsavel_nome: string; responsavel_cpf: string; responsavel_telefone: string; parentesco: string;
  serie: string; turma: string;
};
const NOVA_VAZIA: FormNova = {
  aluno_nome: "", aluno_nascimento: "", programa_social: "", nis: "", necessidade_especial: "",
  responsavel_nome: "", responsavel_cpf: "", responsavel_telefone: "", parentesco: "mae", serie: "", turma: "",
};
const CAMPOS_NOVA = [...Object.keys(NOVA_VAZIA)];

/* Endereço da lista de cada aba (sem turma é um filtro especial da API). */
function caminhoDaAba(aba: Aba, busca: string) {
  const filtro = aba === "sem_turma" ? "sem_turma=1" : `situacao=${aba}`;
  return `/api/matriculas/?${filtro}&ano_letivo=${ANO_ATUAL}${busca ? `&busca=${encodeURIComponent(busca)}` : ""}`;
}

export function AdmMatriculas({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const escola = usuario?.escola;
  const [aba, setAba] = useState<Aba>("em_analise");
  const [texto, setTexto] = useState("");
  const [busca, setBusca] = useState("");
  useEffect(() => { const t = setTimeout(() => setBusca(texto.trim()), 400); return () => clearTimeout(t); }, [texto]);

  const lista = useApi<Matricula[]>(caminhoDaAba(aba, busca));
  const painel = useApi<{ indicadores: Indicadores }>("/api/painel/escola/");
  const turmas = useApi<Turma[]>(escola ? `/api/turmas/?escola=${escola}&ano_letivo=${ANO_ATUAL}` : null);
  const ofertas = useApi<Oferta[]>(escola ? `/api/ofertas/?escola=${escola}&ano_letivo=${ANO_ATUAL}` : null);
  const opcoes = useApi<Opcoes>("/api/opcoes/");

  // Matrícula com o painel "escolher turma" aberto, e a turma escolhida nele.
  const [escolhendo, setEscolhendo] = useState<{ id: number; turma: string } | null>(null);
  const [nova, setNova] = useState<FormNova | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["turma"]);
  const envioNova = useEnvio(CAMPOS_NOVA);

  // A faixa verde some sozinha depois de 4 s (só se ninguém trocou a mensagem nesse meio-tempo).
  const avisar = (msg: string) => { setAviso(msg); setTimeout(() => setAviso((atual) => (atual === msg ? "" : atual)), 4000); };
  const recarregarTudo = () => { lista.recarregar(); painel.recarregar(); turmas.recarregar(); };
  const turmasDaSerie = (serie: number | string) => (turmas.dados ?? []).filter((t) => String(t.serie) === String(serie));
  const opcoesTurma = (serie: number | string) => turmasDaSerie(serie).map((t) => ({
    valor: String(t.id), nome: `${t.nome} · ${t.turno_nome} · ${t.alunos}/${t.capacidade}${t.alunos >= t.capacidade ? " (cheia)" : ""}`,
  }));

  /* Confirma (ou troca de turma). Turma em branco = confirmada, esperando enturmação. */
  const confirmar = (m: Matricula) => envio.enviar(async () => {
    const turma = escolhendo?.turma ? Number(escolhendo.turma) : null;
    await api(`/api/matriculas/${m.id}/`, { method: "PATCH", body: { situacao: "confirmada", turma } });
    setEscolhendo(null);
    const nomeTurma = turmas.dados?.find((t) => t.id === turma)?.nome;
    avisar(`${m.aluno_nome}: matrícula confirmada${nomeTurma ? ` na ${nomeTurma}` : ", ainda sem turma"}.`);
    recarregarTudo();
  });

  const cancelar = (m: Matricula) => {
    if (!window.confirm(`Cancelar a matrícula de ${m.aluno_nome}?`)) return;
    envio.enviar(async () => {
      await api(`/api/matriculas/${m.id}/`, { method: "PATCH", body: { situacao: "cancelada", turma: null } });
      setEscolhendo(null);
      avisar(`Matrícula de ${m.aluno_nome} cancelada.`);
      recarregarTudo();
    });
  };

  const abrirNova = () => { envioNova.limpar(); setNova({ ...NOVA_VAZIA, serie: String(ofertas.dados?.[0]?.series[0] ?? "") }); };
  const mudarNova = (campo: keyof FormNova) => (v: string) => nova && setNova({ ...nova, [campo]: v, ...(campo === "serie" ? { turma: "" } : {}) });
  const salvarNova = () => envioNova.enviar(async () => {
    if (!nova || !escola) return;
    const { turma, serie, parentesco, ...resto } = nova;
    const criada = await api<Matricula>("/api/matriculas/nova/", {
      method: "POST",
      body: {
        ...resto, escola, ano_letivo: ANO_ATUAL, serie: serie ? Number(serie) : null,
        // Só manda parentesco quando tem responsável (senão a API usa "outro").
        ...(resto.responsavel_nome ? { parentesco } : {}),
        // Com turma, a matrícula já entra confirmada; sem turma, entra em análise.
        turma: turma ? Number(turma) : null, situacao: turma ? "confirmada" : "em_analise",
      },
    });
    setNova(null);
    avisar(`Matrícula de ${criada.aluno_nome} criada (código ${criada.aluno_codigo}) · ${criada.situacao_nome}${criada.turma_nome ? ` na ${criada.turma_nome}` : ""}.`);
    setAba(criada.turma ? "confirmada" : "em_analise");
    recarregarTudo();
  });

  const ind = painel.dados?.indicadores;
  const numeros: Record<Aba, number | undefined> = { em_analise: ind?.em_analise, sem_turma: ind?.aguardando_turma, confirmada: ind?.alunos, cancelada: ind?.canceladas };
  const seriesOferecidas = (ofertas.dados ?? []).flatMap((o) => o.series.map((id, i) => ({ valor: String(id), nome: o.series_nomes[i] })));
  const abaAtual = ABAS.find((a) => a.id === aba)!;

  return (
    <>
      <TopBar title="Matrículas" subtitle={usuario?.escola_nome ?? `Ano letivo ${ANO_ATUAL}`} onBack={back} accent={GREEN} right={<BotaoNovo label="Nova matrícula" cor={GREEN} onClick={abrirNova} />} />
      <Screen>
        {nova && (
          <CartaoForm titulo={`Nova matrícula · ${ANO_ATUAL}`} onSalvar={salvarNova} onCancelar={() => setNova(null)} salvando={envioNova.enviando} erro={envioNova.erro} cor={GREEN}>
            <p className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Aluno</p>
            <Entrada label="Nome completo" value={nova.aluno_nome} onChange={mudarNova("aluno_nome")} erro={envioNova.campos.aluno_nome} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Nascimento" type="date" value={nova.aluno_nascimento} onChange={mudarNova("aluno_nascimento")} erro={envioNova.campos.aluno_nascimento} />
              <Entrada label="Necessidade especial (AEE)" value={nova.necessidade_especial} onChange={mudarNova("necessidade_especial")} erro={envioNova.campos.necessidade_especial} placeholder="Em branco = não tem" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Escolha label="Programa social" value={nova.programa_social} onChange={mudarNova("programa_social")} opcoes={opcoes.dados?.programas ?? []} vazio="Nenhum" erro={envioNova.campos.programa_social} />
              <Entrada label={nova.programa_social ? "NIS (obrigatório)" : "NIS (opcional)"} value={nova.nis} onChange={mudarNova("nis")} erro={envioNova.campos.nis} inputMode="numeric" placeholder="11 números" />
            </div>
            <p className="pt-1 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Responsável</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Nome do responsável" value={nova.responsavel_nome} onChange={mudarNova("responsavel_nome")} erro={envioNova.campos.responsavel_nome} />
              <Escolha label="Parentesco" value={nova.parentesco} onChange={mudarNova("parentesco")} opcoes={opcoes.dados?.parentescos ?? []} erro={envioNova.campos.parentesco} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="CPF" value={nova.responsavel_cpf} onChange={mudarNova("responsavel_cpf")} erro={envioNova.campos.responsavel_cpf} inputMode="numeric" placeholder="000.000.000-00" />
              <Entrada label="Telefone" value={nova.responsavel_telefone} onChange={mudarNova("responsavel_telefone")} erro={envioNova.campos.responsavel_telefone} placeholder="(79) 99999-9999" />
            </div>
            <p className="text-[10.5px]" style={{ color: INK_SOFT }}>Se o CPF já estiver cadastrado, o aluno é ligado a esse responsável.</p>
            <p className="pt-1 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Série e turma</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Escolha label="Série (oferecidas pela escola)" value={nova.serie} onChange={mudarNova("serie")} opcoes={seriesOferecidas} vazio="Escolha" erro={envioNova.campos.serie} />
              <Escolha label="Turma" value={nova.turma} onChange={mudarNova("turma")} opcoes={nova.serie ? opcoesTurma(nova.serie) : []} vazio="Sem turma (fica em análise)" erro={envioNova.campos.turma} />
            </div>
          </CartaoForm>
        )}

        {aviso && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ABAS.map((a) => (
            <button key={a.id} onClick={() => { setAba(a.id); setEscolhendo(null); envio.limpar(); }} className="card p-3 text-center transition active:scale-95" style={aba === a.id ? { outline: `2px solid ${a.cor}` } : undefined}>
              <div className="text-[19px] font-extrabold" style={{ color: a.cor }}>{numeros[a.id] ?? "–"}</div>
              <div className="text-[11px] font-semibold" style={{ color: aba === a.id ? INK : INK_SOFT }}>{a.nome}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} />
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar aluno por nome ou código" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>

        <EstadoApi carregando={lista.carregando} erro={lista.erro} onRetry={lista.recarregar}>
          {(lista.dados ?? []).length === 0 ? <EmptyState title="Nada por aqui" text={busca ? "Nenhum aluno com esse nome ou código nesta aba." : abaAtual.vazio} icon={<IconSearch size={26} />} /> : (
            <div className="card mt-3 divide-y divide-[color:var(--color-line)]">
              {(lista.dados ?? []).map((m) => {
                const aberto = escolhendo?.id === m.id;
                const ativa = m.situacao === "em_analise" || m.situacao === "confirmada";
                return (
                  <div key={m.id} className="px-3.5 py-3">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{m.aluno_nome}</p>
                        <p className="text-[11px]" style={{ color: INK_SOFT }}>{m.aluno_codigo} · {m.serie_nome} · {m.turma_nome ?? "sem turma"} · desde {dataBR(m.data)}</p>
                      </div>
                      <Pill color={m.situacao === "confirmada" ? GREEN : m.situacao === "em_analise" ? AMBER : INK_SOFT}>{m.situacao_nome}</Pill>
                    </div>
                    {ativa && !aberto && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button onClick={() => { envio.limpar(); setEscolhendo({ id: m.id, turma: String(m.turma ?? turmasDaSerie(m.serie)[0]?.id ?? "") }); }} className="rounded-full px-3 py-1.5 text-[11.5px] font-bold" style={{ background: GREEN + "16", color: GREEN }}>
                          {m.situacao === "em_analise" ? "Confirmar e escolher turma" : m.turma ? "Trocar turma" : "Escolher turma"}
                        </button>
                        <button onClick={() => cancelar(m)} className="rounded-full px-3 py-1.5 text-[11.5px] font-bold" style={{ background: RED + "12", color: RED }}>Cancelar matrícula</button>
                      </div>
                    )}
                    {aberto && (
                      <div className="mt-2.5 space-y-2.5 rounded-xl p-3" style={{ background: "#f6f8fb" }}>
                        <Escolha label={`Turma da ${m.serie_nome}`} value={escolhendo.turma} onChange={(v) => setEscolhendo({ id: m.id, turma: v })} opcoes={opcoesTurma(m.serie)} vazio="Sem turma por enquanto" erro={envio.campos.turma} />
                        {envio.erro && <AvisoErro texto={envio.erro} />}
                        <div className="flex gap-2">
                          <button onClick={() => setEscolhendo(null)} className="flex-1 rounded-xl border bg-white py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Voltar</button>
                          <button onClick={() => confirmar(m)} disabled={envio.enviando} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold text-white disabled:opacity-70" style={{ background: GREEN }}>{envio.enviando ? "Salvando..." : "Confirmar"}</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </EstadoApi>
        {!escolhendo && envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}
        <p className="mt-3 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Para ver os dados completos e os responsáveis de cada aluno, use "Alunos e responsáveis" no início.</p>
      </Screen>
    </>
  );
}
