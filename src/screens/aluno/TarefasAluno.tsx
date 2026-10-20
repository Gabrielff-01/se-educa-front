/* Tarefas do aluno (o responsável também abre, escolhendo o filho).
   Dados: /api/minhas-tarefas/ — cada tarefa da turma com status Pendente, Entregue ou Atrasada.
   Aqui só se consulta: quem marca a entrega é o professor, na tela de tarefas dele. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconClock, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { dataBR, hojeISO } from "@/lib/formato";
import type { MinhaTarefa } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

const FILTROS = ["Todas", "Pendentes", "Entregues", "Atrasadas"] as const;
type Filtro = (typeof FILTROS)[number];
const STATUS_DO_FILTRO: Record<Filtro, MinhaTarefa["status"] | null> = { Todas: null, Pendentes: "Pendente", Entregues: "Entregue", Atrasadas: "Atrasada" };
const COR_STATUS: Record<MinhaTarefa["status"], string> = { Pendente: AMBER, Entregue: GREEN, Atrasada: RED };
// Ordem da lista: primeiro o que está atrasado, depois o que falta fazer, por último o que já foi entregue
const ORDEM: Record<MinhaTarefa["status"], number> = { Atrasada: 0, Pendente: 1, Entregue: 2 };

/* Quantos dias faltam até o prazo (negativo = já passou). Datas "2026-10-27" comparadas sem fuso. */
function diasAte(prazo: string) {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(prazo) - Date.parse(hojeISO())) / umDia);
}

function textoDoPrazo(t: MinhaTarefa) {
  const dias = diasAte(t.prazo);
  if (t.status === "Entregue") return `Prazo era ${dataBR(t.prazo)}`;
  if (dias < 0) return `Venceu em ${dataBR(t.prazo)} (há ${-dias} ${dias === -1 ? "dia" : "dias"})`;
  if (dias === 0) return "Entrega hoje";
  if (dias === 1) return "Entrega amanhã";
  return `Entrega até ${dataBR(t.prazo)} (faltam ${dias} dias)`;
}

export function TarefasAluno({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const tarefas = useApi<MinhaTarefa[]>(comAluno("/api/minhas-tarefas/"));
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const todas = tarefas.dados ?? [];
  const contar = (f: Filtro) => (STATUS_DO_FILTRO[f] ? todas.filter((t) => t.status === STATUS_DO_FILTRO[f]).length : todas.length);
  const lista = todas
    .filter((t) => !STATUS_DO_FILTRO[filtro] || t.status === STATUS_DO_FILTRO[filtro])
    .sort((a, b) => ORDEM[a.status] - ORDEM[b.status] || (a.status === "Entregue" ? b.prazo.localeCompare(a.prazo) : a.prazo.localeCompare(b.prazo)));

  return (
    <>
      <TopBar title="Tarefas" subtitle={atual ? `${atual.turma_nome ?? "Sem turma"} · atividades` : "Atividades da turma"} onBack={back} accent={VIOLET} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={VIOLET} />
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
              {f}{tarefas.dados ? ` (${contar(f)})` : ""}
            </button>
          ))}
        </div>
        <EstadoApi carregando={filhos.carregando || tarefas.carregando} erro={filhos.erro ?? tarefas.erro} onRetry={tarefas.recarregar}>
          {!atual ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : lista.length === 0 ? (
            <EmptyState title="Nada por aqui" text={filtro === "Todas" ? "A turma ainda não tem tarefas." : "Não há tarefas nesta categoria no momento."} icon={<IconCheck size={26} />} />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {lista.map((t) => {
                const cor = COR_STATUS[t.status];
                return (
                  <div key={t.id} className="card p-3.5" style={{ borderLeft: `3px solid ${cor}` }}>
                    <div className="flex items-center justify-between gap-2"><Pill color={BLUE}>{t.materia_nome}</Pill><Pill color={cor}>{t.status}</Pill></div>
                    <p className="mt-2 text-[13.5px] font-semibold" style={{ color: INK }}>{t.titulo}</p>
                    {t.descricao && <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>{t.descricao}</p>}
                    <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium" style={{ color: t.status === "Atrasada" ? RED : INK_SOFT }}><IconClock size={13} />{textoDoPrazo(t)}</p>
                    <p className="mt-0.5 text-[11px]" style={{ color: INK_SOFT }}>Prof. {t.professor_nome}</p>
                  </div>
                );
              })}
            </div>
          )}
          {atual && todas.length > 0 && <p className="mt-4 text-[11px]" style={{ color: INK_SOFT }}>Quem marca a tarefa como entregue é o professor. Se você entregou e ainda aparece pendente, fale com ele.</p>}
        </EstadoApi>
      </Screen>
    </>
  );
}
