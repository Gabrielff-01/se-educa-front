/* Secretaria — Enturmação: alunos com matrícula ativa que ainda não estão em nenhuma turma.
   Dados: GET /api/matriculas/?sem_turma=1 (&escola=ID para filtrar).
   Para cada aluno, as turmas possíveis vêm de GET /api/turmas/?escola=ID&serie=ID&ano_letivo=ANO
   (vagas = capacidade - alunos confirmados). Enturmar = PATCH /api/matriculas/ID/ {turma, situacao: "confirmada"}. */

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvisoErro, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR, opcoesDe } from "@/lib/formato";
import type { Escola, Matricula, Turma } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT } from "@/theme/colors";

export function SecEnturmacao({ back }: { back: () => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const [escola, setEscola] = useState(""); // "" = todas as escolas
  // Só o ano letivo atual: matrículas antigas sem turma são histórico, não fila.
  const fila = useApi<Matricula[]>(`/api/matriculas/?sem_turma=1&ano_letivo=${ANO_ATUAL}${escola ? `&escola=${escola}` : ""}`);
  const [feito, setFeito] = useState("");

  // Agrupa por escola + série + ano: todos do grupo escolhem entre as mesmas turmas.
  const grupos = new Map<string, Matricula[]>();
  for (const m of fila.dados ?? []) {
    const chave = `${m.escola}-${m.serie}-${m.ano_letivo}`;
    grupos.set(chave, [...(grupos.get(chave) ?? []), m]);
  }
  const total = fila.dados?.length ?? 0;

  const enturmado = (texto: string) => {
    setFeito(texto);
    fila.recarregar();
  };

  return (
    <>
      <TopBar title="Enturmação" subtitle="Alunos aguardando turma" onBack={back} accent={BLUE} />
      <Screen>
        <Escolha label="Escola" value={escola} onChange={(v) => { setEscola(v); setFeito(""); }} vazio="Todas as escolas" opcoes={opcoesDe(escolas.dados, (e) => e.nome)} />
        {feito && (
          // "sticky": a confirmação fica visível mesmo com a lista rolada.
          <div className="sticky top-0 z-10 mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 text-[12.5px] font-semibold shadow-sm" style={{ color: GREEN }}>
            <IconCheck size={17} />{feito}
          </div>
        )}
        <EstadoApi carregando={fila.carregando && !fila.dados} erro={fila.erro} onRetry={fila.recarregar}>
          <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5 text-[12.5px]" style={{ background: BLUE + "0d", color: INK }}>
            <IconUsers size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />
            {total === 0 ? "Ninguém na fila de enturmação." : `${total} ${total === 1 ? "aluno" : "alunos"} sem turma. Escolha a turma de cada um e toque em Enturmar (a matrícula fica Confirmada).`}
          </div>
          {total === 0 && <EmptyState title="Fila vazia" text="Todos os alunos com matrícula ativa já estão numa turma." icon={<IconCheck size={26} />} />}
          {[...grupos.values()].map((lista) => (
            <GrupoSerie key={`${lista[0].escola}-${lista[0].serie}-${lista[0].ano_letivo}`} matriculas={lista} onEnturmado={enturmado} />
          ))}
        </EstadoApi>
      </Screen>
    </>
  );
}

/* Um grupo (mesma escola, série e ano): busca as turmas uma vez só para todos os alunos do grupo. */
function GrupoSerie({ matriculas, onEnturmado }: { matriculas: Matricula[]; onEnturmado: (texto: string) => void }) {
  const m = matriculas[0];
  const turmas = useApi<Turma[]>(`/api/turmas/?escola=${m.escola}&serie=${m.serie}&ano_letivo=${m.ano_letivo}`);
  const aoEnturmar = (texto: string) => {
    turmas.recarregar(); // as vagas mudaram
    onEnturmado(texto);
  };
  return (
    <div>
      <SectionHeader title={`${m.serie_nome} · ${m.escola_nome}`} />
      <EstadoApi carregando={turmas.carregando && !turmas.dados} erro={turmas.erro} onRetry={turmas.recarregar}>
        <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {matriculas.map((matricula) => <CartaoAluno key={matricula.id} matricula={matricula} turmas={turmas.dados ?? []} onEnturmado={aoEnturmar} />)}
        </div>
      </EstadoApi>
    </div>
  );
}

function CartaoAluno({ matricula, turmas, onEnturmado }: { matricula: Matricula; turmas: Turma[]; onEnturmado: (texto: string) => void }) {
  const vagas = (t: Turma) => Math.max(t.capacidade - t.alunos, 0);
  // Sugestão: a turma com mais vagas.
  const sugerida = [...turmas].sort((a, b) => vagas(b) - vagas(a))[0];
  const [turma, setTurma] = useState("");
  const escolhida = turma || String(sugerida?.id ?? "");
  const envio = useEnvio(["turma"]);

  const enturmar = () => envio.enviar(async () => {
    await api(`/api/matriculas/${matricula.id}/`, { method: "PATCH", body: { turma: Number(escolhida), situacao: "confirmada" } });
    const nome = turmas.find((t) => String(t.id) === escolhida)?.nome ?? "turma";
    onEnturmado(`${matricula.aluno_nome} foi para a ${nome}.`);
  });

  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-3">
        <Avatar name={matricula.aluno_nome} color={BLUE} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{matricula.aluno_nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Código {matricula.aluno_codigo} · matrícula em {dataBR(matricula.data)}</p>
        </div>
        <Pill color={matricula.situacao === "em_analise" ? AMBER : GREEN}>{matricula.situacao_nome}</Pill>
      </div>
      {turmas.length === 0 ? (
        <p className="mt-2.5 rounded-xl px-3 py-2 text-[12px]" style={{ background: "#f4f7fb", color: INK_SOFT }}>Nenhuma turma de {matricula.serie_nome} nesta escola em {matricula.ano_letivo}. O DIES precisa criar a turma.</p>
      ) : (
        <div className="mt-2.5 flex items-end gap-2">
          <Escolha label="Turma" value={escolhida} onChange={setTurma} erro={envio.campos.turma}
            opcoes={turmas.map((t) => ({ valor: String(t.id), nome: `${t.nome} · ${vagas(t)} ${vagas(t) === 1 ? "vaga" : "vagas"}` }))} />
          <button onClick={enturmar} disabled={envio.enviando || !escolhida} className="mb-[1px] flex-none rounded-xl px-3.5 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-60" style={{ background: BLUE }}>
            {envio.enviando ? "Salvando..." : "Enturmar"}
          </button>
        </div>
      )}
      {envio.erro && <div className="mt-2"><AvisoErro texto={envio.erro} /></div>}
    </div>
  );
}
