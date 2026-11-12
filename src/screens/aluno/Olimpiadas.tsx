/* Aluno e responsável — Olimpíadas da escola.
   O aluno vê as olimpíadas da escola dele, se inscreve (enquanto as inscrições estão abertas)
   e, depois do resultado, vê os medalhistas e a própria posição. O responsável acompanha os filhos.
   Dados: GET /api/olimpiadas/, POST /api/olimpiadas/ID/inscrever/ e /sair/, GET /api/olimpiadas/ID/classificacao/ */

import { useState } from "react";
import { AvisoErro, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCalendar, IconCheck, IconTrophy } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { dataBR, notaBR } from "@/lib/formato";
import type { LinhaOlimpiada, Olimpiada } from "@/lib/tipos";
import { COR_STATUS, MEDALHA, Posicao } from "@/screens/escola/EscOlimpiadas";
import { GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

function Resultado({ o, eAluno }: { o: Olimpiada; eAluno: boolean }) {
  const podio = useApi<LinhaOlimpiada[]>(`/api/olimpiadas/${o.id}/classificacao/`);
  const medalhistas = (podio.dados ?? []).filter((l) => l.medalha);
  return (
    <div className="space-y-2">
      {o.minhas.map((m) => {
        const medalha = MEDALHA[m.medalha];
        return (
          <div key={m.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: (medalha?.cor ?? VIOLET) + "14" }}>
            <Posicao linha={m} />
            <p className="flex-1 text-[13px]" style={{ color: INK }}>
              {eAluno ? "Você" : m.aluno_nome.split(" ")[0]} {m.posicao ? <>ficou em <b>{m.posicao}º lugar</b></> : <>não fez a prova</>}
              {m.nota != null && <> com nota <b>{notaBR(m.nota)}</b></>}
              {medalha && <> · <b style={{ color: medalha.cor }}>medalha de {medalha.nome.toLowerCase()}</b></>}
            </p>
          </div>
        );
      })}
      <p className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Medalhistas</p>
      <EstadoApi carregando={podio.carregando} erro={podio.erro} onRetry={podio.recarregar}>
        <div className="divide-y rounded-xl border" style={{ borderColor: "#eef2f7" }}>
          {medalhistas.map((l) => (
            <div key={l.id} className="flex items-center gap-2.5 px-3 py-2">
              <Posicao linha={l} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{l.aluno_nome}</p>
                <p className="text-[11px]" style={{ color: INK_SOFT }}>{l.turma_nome}</p>
              </div>
              <span className="text-[13px] font-bold" style={{ color: MEDALHA[l.medalha]?.cor ?? INK }}>{MEDALHA[l.medalha]?.nome}</span>
            </div>
          ))}
        </div>
      </EstadoApi>
    </div>
  );
}

function Cartao({ o, eAluno, mudou }: { o: Olimpiada; eAluno: boolean; mudou: (texto: string) => void }) {
  const cor = COR_STATUS[o.status];
  const envio = useEnvio();
  const [verResultado, setVerResultado] = useState(false);
  const inscrito = o.minhas.length > 0;

  const entrar = () => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/inscrever/`, { method: "POST" });
    mudou(`Inscrição feita na ${o.nome}. Boa prova!`);
  });
  const sair = () => envio.enviar(async () => {
    await api(`/api/olimpiadas/${o.id}/sair/`, { method: "POST" });
    mudou(`Inscrição na ${o.nome} cancelada.`);
  });

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><IconTrophy size={22} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold leading-tight" style={{ color: INK }}>{o.nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.materia_nome ?? "Conhecimentos gerais"} · {o.escola_nome}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Pill color={cor}>{o.status_nome}</Pill>
            {inscrito && o.status !== "resultado" && <Pill color={GREEN}>{eAluno ? "Você está inscrito" : `${o.minhas.map((m) => m.aluno_nome.split(" ")[0]).join(" e ")} inscrito`}</Pill>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: INK_SOFT }}>
        <span className="flex items-center gap-1"><IconCalendar size={14} />Prova em {dataBR(o.data_prova)}</span>
        <span>{o.series_nomes.length ? `Para ${o.series_nomes.join(", ")}` : "Para todas as séries"}</span>
        <span>{o.premiados} medalhas</span>
      </div>
      {o.descricao && <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{o.descricao}</p>}

      {envio.erro && <AvisoErro texto={envio.erro} />}
      {eAluno && o.status === "inscricoes" && (
        inscrito ? (
          <button onClick={sair} disabled={envio.enviando} className="w-full rounded-xl border bg-white py-2.5 text-[13px] font-semibold disabled:opacity-60" style={{ borderColor: RED + "55", color: RED }}>{envio.enviando ? "Cancelando..." : "Cancelar inscrição"}</button>
        ) : o.pode_participar ? (
          <button onClick={entrar} disabled={envio.enviando} className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold text-white disabled:opacity-60" style={{ background: GREEN }}><IconCheck size={16} />{envio.enviando ? "Inscrevendo..." : "Quero participar"}</button>
        ) : (
          <p className="rounded-xl bg-[#f6f8fb] px-3 py-2 text-[12px]" style={{ color: INK_SOFT }}>Esta olimpíada não é para a sua série.</p>
        )
      )}
      {o.status === "andamento" && inscrito && <p className="rounded-xl bg-[#f6f8fb] px-3 py-2 text-[12px]" style={{ color: INK_SOFT }}>As inscrições fecharam. O resultado aparece aqui quando a escola publicar.</p>}
      {o.status === "resultado" && (
        verResultado ? <Resultado o={o} eAluno={eAluno} /> : (
          <button onClick={() => setVerResultado(true)} className="w-full rounded-xl py-2.5 text-[13px] font-semibold text-white" style={{ background: VIOLET }}>Ver resultado</button>
        )
      )}
    </div>
  );
}

export function Olimpiadas({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const olimpiadas = useApi<Olimpiada[]>("/api/olimpiadas/");
  const [aviso, setAviso] = useState("");
  const eAluno = usuario?.perfil === "aluno";
  const lista = olimpiadas.dados ?? [];
  const mudou = (texto: string) => { setAviso(texto); olimpiadas.recarregar(); };
  const grupos: { titulo: string; status: Olimpiada["status"] }[] = [
    { titulo: "Inscrições abertas", status: "inscricoes" },
    { titulo: "Em andamento", status: "andamento" },
    { titulo: "Resultados", status: "resultado" },
  ];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Olimpíadas" subtitle="Desafios da sua escola" onBack={back} accent={VIOLET} />
      <Screen>
        {aviso && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
        <EstadoApi carregando={olimpiadas.carregando} erro={olimpiadas.erro} onRetry={olimpiadas.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhuma olimpíada por enquanto" text="Quando a escola abrir uma olimpíada, ela aparece aqui para você se inscrever." icon={<IconTrophy size={26} />} />
          ) : (
            grupos.map((g) => {
              const doGrupo = lista.filter((o) => o.status === g.status);
              if (doGrupo.length === 0) return null;
              return (
                <div key={g.status}>
                  <SectionHeader title={g.titulo} />
                  <div className="grid gap-2.5 lg:grid-cols-2" style={{ alignItems: "start" }}>
                    {doGrupo.map((o) => <Cartao key={o.id} o={o} eAluno={eAluno} mudou={mudou} />)}
                  </div>
                </div>
              );
            })
          )}
        </EstadoApi>
      </Screen>
    </div>
  );
}
