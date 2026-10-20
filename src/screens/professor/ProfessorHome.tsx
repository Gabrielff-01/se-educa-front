/* Início do professor: nome, turmas, chamada de hoje e pendências.
   Dados: GET /api/painel/professor/ (turmas e totais) e GET /api/comunicados/ (avisos). */

import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBell, IconBook, IconCheck, IconDoc, IconEdit, IconStar } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataBR, dataHoraBR } from "@/lib/formato";
import type { Comunicado } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { SemTurmas, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, RED, TEAL, VIOLET } from "@/theme/colors";

/* "Em dia" = verde, "Em andamento" (unidade atual, ainda no prazo) = azul, "Pendente" = amarelo, "Atrasado" = vermelho */
function corDoStatus(status: string) {
  if (status === "Em andamento") return BLUE;
  return status === "Em dia" ? GREEN : status === "Pendente" ? AMBER : RED;
}

export function ProfessorHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const minhas = useMinhasTurmas();
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");
  const painel = minhas.painel.dados;
  const professor = painel?.professor ?? null;

  const nome = professor?.nome ?? usuario?.nome ?? "Professor(a)";
  const sub = professor
    ? `${professor.materias.join(", ") || "Sem matéria"} · ${painel?.totais.turmas ?? 0} turma(s)`
    : "Professor(a)";
  // Os 3 comunicados mais novos
  const avisos = [...(comunicados.dados ?? [])].sort((a, b) => b.criado_em.localeCompare(a.criado_em)).slice(0, 3);

  return (
    <>
      <ProfileHeader nome={nome} sub={sub} cor={TEAL} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        {professor?.afastado_ate && (
          <div className="mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: AMBER + "1a", color: "#b45309" }}>
            <IconAlert size={16} className="mt-0.5 flex-none" />Você está afastado(a) até {dataBR(professor.afastado_ate)}. As turmas continuam aqui para consulta.
          </div>
        )}

        {painel && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[{ n: painel.totais.alunos, l: "Alunos", c: TEAL }, { n: painel.totais.turmas, l: "Turmas", c: BLUE }, { n: painel.totais.pendencias, l: "Pendências", c: painel.totais.pendencias ? AMBER : GREEN }].map((k) => (
              <div key={k.l} className="card p-3 text-center"><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
            ))}
          </div>
        )}

        <SectionHeader title="Ações do dia" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "Registrar frequência", Icon: IconCheck, c: GREEN, s: "profFrequencia" as ScreenId },
            { t: "Lançar notas", Icon: IconStar, c: BLUE, s: "profNotas" as ScreenId },
            { t: "Plano de aula", Icon: IconBook, c: TEAL, s: "profPlanejamento" as ScreenId },
            { t: "Diário de classe", Icon: IconEdit, c: VIOLET, s: "profDiario" as ScreenId },
            { t: "Tarefas", Icon: IconDoc, c: AMBER, s: "tarefas" as ScreenId },
            { t: "Comunicados", Icon: IconBell, c: PINK, s: "comunicados" as ScreenId },
          ].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex items-center gap-2.5 p-3.5 text-left active:scale-[0.98] transition">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
              <span className="text-[12.5px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Minhas turmas" />
        {minhas.semCadastro ? <SemTurmas semCadastro /> : (
          <EstadoApi carregando={minhas.painel.carregando} erro={minhas.painel.erro} onRetry={minhas.painel.recarregar}>
            {minhas.turmas.length === 0 ? <SemTurmas semCadastro={false} /> : (
              <div className="space-y-2.5">
                {minhas.turmas.map((t) => (
                  <button key={t.lotacao} onClick={() => nav("profFrequencia")} className="card w-full p-3.5 text-left active:scale-[0.98] transition">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-[13px] font-extrabold" style={{ background: TEAL + "16", color: TEAL }}>{t.turma_nome.split(" ")[0]}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{nomeDe(t)}</p>
                        <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>
                          {t.alunos} alunos · {t.sala || "sem sala"} · {t.horarios_hoje.length ? `hoje ${t.horarios_hoje.join(", ")}` : "sem aula hoje"}
                        </p>
                        <p className="truncate text-[11px]" style={{ color: INK_SOFT }}>{t.escola_nome}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {t.chamada_hoje ? <Pill color={GREEN}>Chamada feita</Pill> : t.horarios_hoje.length > 0 ? <Pill color={AMBER}>Fazer chamada</Pill> : null}
                      <Pill color={corDoStatus(t.status_diario)}>Diário: {t.status_diario}{t.aulas_sem_registro ? ` (${t.aulas_sem_registro} sem registro)` : ""}</Pill>
                      <Pill color={corDoStatus(t.status_notas)}>Notas {t.unidade_notas}ª: {t.notas_lancadas}/{t.alunos}</Pill>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </EstadoApi>
        )}

        <SectionHeader title="Avisos" action="Ver todos" onAction={() => nav("comunicados")} />
        <EstadoApi carregando={comunicados.carregando} erro={comunicados.erro} onRetry={comunicados.recarregar}>
          {avisos.length === 0 ? (
            <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</p>
          ) : (
            <div className="card space-y-3 p-4">
              {avisos.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full" style={{ background: a.alcance === "turma" ? BLUE : TEAL }} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: INK }}>{a.titulo}</p>
                    <p className="text-[12px]" style={{ color: INK_SOFT }}>{a.texto}</p>
                    <p className="mt-0.5 text-[10.5px]" style={{ color: INK_SOFT }}>{a.para} · {dataHoraBR(a.criado_em)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </EstadoApi>
      </div>
    </>
  );
}
