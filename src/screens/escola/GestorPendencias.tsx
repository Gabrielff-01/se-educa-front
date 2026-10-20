/* Pendências dos professores (diário sem registro e notas faltando) e lembrete por mensagem.
   Dados: GET /api/escola/diario/. O lembrete é um comunicado só para o professor:
   POST /api/comunicados/ {alcance: "pessoa", destinatario: id do login do professor, titulo, texto}. */

import { useState } from "react";
import { AvisoErro, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconEdit, IconSend, IconStar } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR } from "@/lib/formato";
import type { SituacaoDiario } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type Pendencia = {
  id: string; tipo: "Diário" | "Notas"; d: SituacaoDiario;
  quantos: number; // aulas sem registro, ou notas que faltam
  detalhe: string; cor: string;
};

/* Transforma cada linha do diário em 0, 1 ou 2 pendências (diário e/ou notas). */
function pendenciasDe(lista: SituacaoDiario[]): Pendencia[] {
  const saida: Pendencia[] = [];
  for (const d of lista) {
    if (d.aulas_sem_registro > 0) {
      saida.push({
        id: `diario-${d.lotacao}`, tipo: "Diário", d, quantos: d.aulas_sem_registro,
        detalhe: `${d.aulas_sem_registro} aula(s) sem registro desde ${dataBR(d.sem_registro_desde)}`,
        cor: d.status_diario === "Atrasado" ? RED : AMBER,
      });
    }
    // "Em andamento" = a unidade ainda não venceu: não é pendência.
    if (d.status_notas === "Pendente" || d.status_notas === "Atrasado") {
      saida.push({
        id: `notas-${d.lotacao}`, tipo: "Notas", d, quantos: d.notas_faltando,
        detalhe: `Faltam ${d.notas_faltando} nota(s) da ${d.unidade_notas}ª unidade`,
        cor: d.status_notas === "Atrasado" ? RED : AMBER,
      });
    }
  }
  return saida;
}

function textoDoLembrete(p: Pendencia) {
  const onde = `${p.d.materia_nome} da ${p.d.turma_nome}`;
  return p.tipo === "Diário"
    ? `Olá, ${p.d.professor_nome.split(" ")[0]}. O diário de ${onde} tem ${p.detalhe.toLowerCase()}. Por favor, registre as aulas e a chamada.`
    : `Olá, ${p.d.professor_nome.split(" ")[0]}. ${p.detalhe} em ${onde}. Por favor, lance as notas para a escola fechar a unidade.`;
}

export function GestorPendencias({ back }: { back: () => void }) {
  const diario = useApi<SituacaoDiario[]>("/api/escola/diario/");
  const [filtro, setFiltro] = useState<"Todos" | "Diário" | "Notas">("Todos");
  const [enviados, setEnviados] = useState<string[]>([]);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio();

  const todas = pendenciasDe(diario.dados ?? []);
  const lista = todas.filter((p) => filtro === "Todos" || p.tipo === filtro);
  const diarios = todas.filter((p) => p.tipo === "Diário").length;
  const notas = todas.filter((p) => p.tipo === "Notas").length;
  // A faixa verde some sozinha depois de 4 s (só se ninguém trocou a mensagem nesse meio-tempo).
  const avisar = (msg: string) => { setAviso(msg); setTimeout(() => setAviso((atual) => (atual === msg ? "" : atual)), 4000); };

  const enviar = (p: Pendencia) => envio.enviar(async () => {
    await api("/api/comunicados/", {
      method: "POST",
      body: { alcance: "pessoa", destinatario: p.d.professor_usuario, titulo: `Lembrete: ${p.tipo === "Diário" ? "diário" : "notas"} de ${p.d.materia_nome} · ${p.d.turma_nome}`, texto: textoDoLembrete(p) },
    });
    setEnviados((e) => [...e, p.id]);
    avisar(`Lembrete enviado para ${p.d.professor_nome}. A mensagem aparece nos comunicados do app.`);
  });

  /* "Lembrar todos": uma mensagem só por professor, juntando as pendências dele. */
  const lembrarTodos = () => envio.enviar(async () => {
    const faltam = lista.filter((p) => !enviados.includes(p.id) && p.d.professor_usuario);
    const porProfessor = new Map<number, Pendencia[]>();
    faltam.forEach((p) => porProfessor.set(p.d.professor_usuario!, [...(porProfessor.get(p.d.professor_usuario!) ?? []), p]));
    for (const [usuario, itens] of porProfessor) {
      await api("/api/comunicados/", {
        method: "POST",
        body: { alcance: "pessoa", destinatario: usuario, titulo: `Lembrete: ${itens.length} pendência(s) no diário e nas notas`, texto: itens.map(textoDoLembrete).join("\n\n") },
      });
      setEnviados((e) => [...e, ...itens.map((p) => p.id)]);
    }
    avisar(porProfessor.size ? `Lembrete enviado para ${porProfessor.size} professor(es).` : "Nenhum professor com login para lembrar.");
  });

  return (
    <>
      <TopBar title="Pendências" subtitle="Diário e notas dos professores" onBack={back} accent={RED} />
      <Screen>
        <EstadoApi carregando={diario.carregando} erro={diario.erro} onRetry={diario.recarregar}>
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: RED }}><IconEdit size={19} /></span><Pill color={RED}>Diário</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{diarios}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Diários com aula sem registro</p></div>
            <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: AMBER }}><IconStar size={19} /></span><Pill color={AMBER}>Notas</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{notas}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Turmas com notas faltando na unidade que vence</p></div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {(["Todos", "Diário", "Notas"] as const).map((f) => <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold" style={filtro === f ? { background: INK, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{f}</button>)}
            </div>
            <button onClick={lembrarTodos} disabled={envio.enviando || !lista.some((p) => p.d.professor_usuario && !enviados.includes(p.id))} title="Só vai para quem tem login no app" className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-white transition active:scale-95 disabled:opacity-50" style={{ background: BLUE }}><IconSend size={14} />Lembrar todos</button>
          </div>
          <div className="mt-2.5 flex gap-3 px-1">{[{ l: "Pendente (1–4)", c: AMBER }, { l: "Atrasado (5+)", c: RED }].map((x) => <span key={x.l} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.l}</span>)}</div>

          {aviso && <div className="mt-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
          {envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}

          {lista.length === 0 ? <EmptyState title="Nenhuma pendência" text="Todos os diários e notas estão em dia." icon={<IconCheck size={26} />} /> : (
            <div className="card mt-3 divide-y divide-[color:var(--color-line)]">
              {lista.map((p) => {
                const ok = enviados.includes(p.id);
                const semLogin = p.d.professor_usuario === null;
                return (
                  <div key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-3">
                    <span className="block h-3 w-3 flex-none rounded-full" style={{ background: p.cor, boxShadow: `0 0 0 3px ${p.cor}26` }} aria-label={p.cor === RED ? "Atrasado" : "Pendente"} />
                    <div className="min-w-[60%] flex-1 text-[11.5px]">
                      <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{p.d.professor_nome} <span className="font-normal" style={{ color: INK_SOFT }}>· {p.d.turma_nome} · {p.d.materia_nome}</span></p>
                      <p style={{ color: INK }}><b style={{ color: p.cor }}>{p.tipo}:</b> {p.detalhe}</p>
                    </div>
                    <button disabled={ok || semLogin || envio.enviando} onClick={() => enviar(p)} title={semLogin ? "Esse professor ainda não tem login no app" : undefined} className="ml-6 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold transition disabled:cursor-not-allowed sm:ml-0" style={ok ? { background: GREEN + "16", color: GREEN } : semLogin ? { background: "#eef2f7", color: INK_SOFT } : { background: BLUE + "14", color: BLUE }}>
                      {ok ? "Enviado" : semLogin ? "Professor sem login" : "Enviar lembrete"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
