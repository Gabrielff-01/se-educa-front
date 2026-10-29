/* Tela inicial do aluno: resumo do dia e atalhos.
   Dados reais:
   - /api/boletim/: nome, turma, escola, média geral e frequência geral;
   - /api/horarios/?turma=ID: aulas de hoje (filtra o dia da semana de hoje);
   - /api/minhas-tarefas/: tarefas pendentes e atrasadas;
   - /api/agenda/: próximos eventos do calendário;  /api/comunicados/: últimos avisos.
   Os atalhos de serviços (mapa, transporte, biblioteca...) continuam como estavam. */

import { Avatar } from "@/components/Avatar";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { IconBell, IconBook, IconBus, IconCalendar, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrad, IconGrid, IconPin, IconSend, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataBR, hojeISO, horaCurta, notaBR, porcentoBR } from "@/lib/formato";
import type { Boletim, Comunicado, EventoAgenda, Horario, MinhaTarefa } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { abaixoDaMedia } from "@/screens/aluno/Boletim";
import { minimoDoPrograma } from "@/screens/aluno/Frequencia";
import { corDaMateria } from "@/screens/aluno/Horarios";
import { AMBER, BLUE, BLUE_DARK, GREEN, INDIGO, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

const MESES_CURTOS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const COR_EVENTO: Record<string, string> = { prova: BLUE, feriado: RED, recesso: AMBER, ferias: TEAL, planejamento: INDIGO, aula: GREEN };

function saudacao() {
  const hora = new Date().getHours();
  return hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
}

export function AlunoHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<Boletim>(comAluno("/api/boletim/"));
  const b = boletim.dados;
  const turma = b?.matricula?.turma ?? null;
  const horarios = useApi<Horario[]>(turma ? `/api/horarios/?turma=${turma}` : null);
  const tarefas = useApi<MinhaTarefa[]>(comAluno("/api/minhas-tarefas/"));
  const agenda = useApi<EventoAgenda[]>(comAluno("/api/agenda/"));
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");

  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Calendário", Icon: IconCalendar, cor: "#8b5cf6", s: "calendario" },
    { label: "Chat", Icon: IconChat, cor: "#ec4899", s: "chat" },
    { label: "Tarefas", Icon: IconEdit, cor: INDIGO, s: "tarefas" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
    { label: "Escolas", Icon: IconGrad, cor: TEAL, s: "escolas" },
    { label: "Biblioteca Virtual", Icon: IconBook, cor: INDIGO, s: "biblioteca" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
    { label: "Enviar documentos", Icon: IconSend, cor: TEAL, s: "documentos" },
  ];

  // Resumo de notas e frequência
  const aprovacao = b?.media_aprovacao ?? "6.0";
  const minimo = b?.frequencia_minima ?? 75;
  const minimoProg = minimoDoPrograma(b?.aluno.programa_social);
  const freq = b?.frequencia_geral ?? null;
  // Matéria com a menor frequência abaixo do mínimo da escola (pra avisar no cartão)
  const piorMateria = (b?.materias ?? []).filter((m) => m.frequencia !== null && m.frequencia < minimo).sort((x, y) => (x.frequencia ?? 0) - (y.frequencia ?? 0))[0];

  // Aulas de hoje (dia_semana: 1 = segunda ... 5 = sexta, igual ao getDay())
  const diaHoje = new Date().getDay();
  const agoraHHMM = new Date().toTimeString().slice(0, 5);
  const aulasHoje = (horarios.dados ?? []).filter((h) => h.dia_semana === diaHoje).sort((x, y) => x.inicio.localeCompare(y.inicio));

  const hoje = hojeISO();
  const aFazer = (tarefas.dados ?? []).filter((t) => t.status !== "Entregue").sort((x, y) => x.prazo.localeCompare(y.prazo));
  const proximosEventos = (agenda.dados ?? []).filter((e) => e.tipo !== "tarefa" && (e.fim ?? e.data) >= hoje).slice(0, 3);

  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${BLUE}, ${BLUE_DARK})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name={b?.aluno.nome ?? usuario?.nome ?? "Aluno"} color="#ffffff33" size={46} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-white/75">Olá, {saudacao().toLowerCase()}</p>
            <h1 className="truncate text-[17px] font-bold">{b?.aluno.nome ?? usuario?.nome ?? "Aluno"}</h1>
          </div>
          <button onClick={() => nav("notificacoes")} aria-label="Notificações" className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /></button>
        </div>
        {b?.matricula && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2.5 text-[12px]">
            <IconGrad size={16} /><span className="flex-none font-semibold">{b.matricula.turma_nome ?? b.matricula.serie_nome}</span><span className="text-white/60">·</span><span className="truncate text-white/80">{b.matricula.escola_nome}</span>
          </div>
        )}
      </div>

      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4"><SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} /></div>
        <EstadoApi carregando={filhos.carregando || boletim.carregando} erro={filhos.erro ?? boletim.erro} onRetry={boletim.recarregar}>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => nav("notas")} className="card p-3.5 text-left active:scale-[0.98] transition">
              <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Média geral</span><IconStar size={16} style={{ color: BLUE }} /></div>
              <div className="mt-1 text-[26px] font-extrabold" style={{ color: abaixoDaMedia(b?.media_geral, aprovacao) ? RED : BLUE }}>{notaBR(b?.media_geral)}</div>
              {b?.media_geral == null ? <Pill color={INK_SOFT}>Sem notas ainda</Pill>
                : abaixoDaMedia(b.media_geral, aprovacao) ? <Pill color={RED}>Abaixo da média</Pill>
                : <Pill color={GREEN}>Acima da média</Pill>}
            </button>
            <button onClick={() => nav("frequencia")} className="card p-3.5 text-left active:scale-[0.98] transition">
              <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Frequência</span><IconCheck size={16} style={{ color: GREEN }} /></div>
              <div className="mt-1 text-[26px] font-extrabold" style={{ color: freq !== null && freq < minimo ? RED : GREEN }}>{porcentoBR(freq)}</div>
              {freq === null ? <Pill color={INK_SOFT}>Sem aulas ainda</Pill>
                : freq < minimo ? <Pill color={RED}>Abaixo de {minimo}%</Pill>
                : minimoProg && freq < minimoProg ? <Pill color={AMBER}>{b?.aluno.programa_nome}: mín. {minimoProg}%</Pill>
                : piorMateria ? <Pill color={AMBER}>Atenção em {piorMateria.materia_nome}</Pill>
                : <Pill color={GREEN}>Dentro do limite</Pill>}
            </button>
          </div>
        </EstadoApi>

        {turma && (
          <>
            <SectionHeader title="Aulas de hoje" action="Ver grade" onAction={() => nav("horarios")} />
            {horarios.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
              : aulasHoje.length === 0 ? (
                <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>{diaHoje === 0 || diaHoje === 6 ? "Hoje é fim de semana: sem aulas. Bom descanso!" : "Nenhuma aula cadastrada para hoje."}</div>
              ) : (
                <div className="card divide-y divide-[color:var(--color-line)]">
                  {aulasHoje.map((a, i) => {
                    // Uma aula já passou quando a seguinte já começou (fica apagadinha)
                    const seguinte = aulasHoje[i + 1];
                    const passou = seguinte !== undefined && horaCurta(seguinte.inicio) <= agoraHHMM;
                    return (
                      <div key={a.id} className="flex items-center gap-3 px-3.5 py-2.5" style={{ opacity: passou ? 0.5 : 1 }}>
                        <span className="w-11 flex-none text-[12.5px] font-extrabold" style={{ color: INK }}>{horaCurta(a.inicio)}</span>
                        <span className="h-7 w-1 flex-none rounded-full" style={{ background: corDaMateria(a.materia) }} />
                        <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{a.materia_nome}</p><p className="truncate text-[11px]" style={{ color: INK_SOFT }}>{a.professor_nome}{a.sala ? ` · ${a.sala}` : ""}</p></div>
                      </div>
                    );
                  })}
                </div>
              )}
          </>
        )}

        <SectionHeader title="Tarefas a fazer" action="Ver todas" onAction={() => nav("tarefas")} />
        {tarefas.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
          : aFazer.length === 0 ? <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma tarefa pendente. Tudo em dia!</div>
          : (
            <div className="space-y-2.5">
              {aFazer.slice(0, 3).map((t) => (
                <button key={t.id} onClick={() => nav("tarefas")} className="card flex w-full items-center gap-3 p-3 text-left" style={{ borderLeft: `3px solid ${t.status === "Atrasada" ? RED : VIOLET}` }}>
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{t.titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{t.materia_nome} · até {dataBR(t.prazo)}</p></div>
                  <Pill color={t.status === "Atrasada" ? RED : AMBER}>{t.status}</Pill>
                </button>
              ))}
              {aFazer.length > 3 && <p className="text-center text-[11.5px]" style={{ color: INK_SOFT }}>+ {aFazer.length - 3} {aFazer.length - 3 === 1 ? "tarefa" : "tarefas"}</p>}
            </div>
          )}

        <SectionHeader title="Comunicados" action="Ver tudo" onAction={() => nav("comunicados")} />
        {comunicados.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
          : (comunicados.dados ?? []).length === 0 ? <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</div>
          : (
            <div className="card space-y-3 p-4">
              {(comunicados.dados ?? []).slice(0, 2).map((c) => (
                <button key={c.id} onClick={() => nav("comunicados")} className="flex w-full gap-3 text-left">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full" style={{ background: c.alcance === "turma" ? AMBER : c.alcance === "escola" ? TEAL : BLUE }} />
                  <div className="min-w-0"><p className="text-[13px] font-semibold" style={{ color: INK }}>{c.titulo}</p><p className="line-clamp-2 text-[12px]" style={{ color: INK_SOFT }}>{c.texto}</p></div>
                </button>
              ))}
            </div>
          )}

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-center text-[11.5px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Próximos eventos" action="Ver tudo" onAction={() => nav("calendario")} />
        {agenda.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
          : proximosEventos.length === 0 ? <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum evento marcado no calendário.</div>
          : (
            <div className="space-y-2.5">
              {proximosEventos.map((e) => {
                const cor = COR_EVENTO[e.tipo] ?? VIOLET;
                return (
                  <div key={`${e.data}-${e.titulo}`} className="card flex items-center gap-3 p-3">
                    <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-center" style={{ background: cor + "14", color: cor }}><div><div className="text-[16px] font-extrabold leading-none">{e.data.slice(8, 10)}</div><div className="text-[8px] font-bold">{MESES_CURTOS[Number(e.data.slice(5, 7)) - 1]}</div></div></div>
                    <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold" style={{ color: INK }}>{e.titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.fim ? `${dataBR(e.data)} a ${dataBR(e.fim)}` : dataBR(e.data)}</p></div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
}
