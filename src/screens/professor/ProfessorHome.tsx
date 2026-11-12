/* Início do professor (visual novo: cartões coloridos + coluna com calendário e o dia).
   Dados reais:
   - /api/painel/professor/: turmas, alunos, horários de hoje, chamada feita, situação do diário e das notas;
   - /api/agenda/: eventos do calendário (bolinhas no calendário e na faixa da semana);
   - /api/comunicados/: avisos recentes.

   Layout:
   - Computador: [conteúdo | coluna da direita com calendário do mês e as aulas de hoje].
   - Celular: uma coluna só; a faixa da semana entra no lugar do calendário. */

import { EstadoApi } from "@/components/Form";
import {
  AulaAgora, BotoesTopo, CalendarioMini, CartaoCor, DIAS_LONGOS, FaixaSemana, LinhaDoTempo, LinhaLista, MESES, MiniBarras, Numeros, Pendencia, Rosca, Saudacao, TituloSecao, TopoCelular,
} from "@/components/Painel";
import type { ItemLinha } from "@/components/Painel";
import { IconAlert, IconBell, IconBook, IconCalendar, IconCheck, IconDoc, IconEdit, IconStar, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { ANO_ATUAL, dataBR } from "@/lib/formato";
import type { Comunicado, EventoAgenda, TurmaDoProfessor } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { SemTurmas, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, RED, TEAL, VIOLET, PERFIL } from "@/theme/colors";

const DURACAO_AULA = 50; // minutos (a grade só guarda o início da aula)

/* "Em dia" = verde, "Em andamento" (unidade atual, ainda no prazo) = azul, "Pendente" = amarelo, "Atrasado" = vermelho */
function corDoStatus(status: string) {
  if (status === "Em andamento") return BLUE;
  return status === "Em dia" ? GREEN : status === "Pendente" ? AMBER : RED;
}

const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
/* "1ª série A" -> "1ªA" (cabe embaixo das barrinhas) */
const turmaCurta = (nome: string) => nome.replace(" série ", "").replace(" ano ", "");

/* Etiqueta colorida (chamada, diário, notas) dentro do cartão da turma */
function Etiqueta({ cor, children }: { cor: string; children: React.ReactNode }) {
  return <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: cor + "18", color: cor }}>{children}</span>;
}

export function ProfessorHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const minhas = useMinhasTurmas();
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");
  const agenda = useApi<EventoAgenda[]>(`/api/agenda/?ano=${ANO_ATUAL}`);
  const painel = minhas.painel.dados;
  const professor = painel?.professor ?? null;
  const turmas = minhas.turmas;

  const nome = professor?.nome ?? usuario?.nome ?? "Professor(a)";
  const primeiroNome = nome.split(" ")[0];
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  // ----- Aulas de hoje (cada turma traz os horários de hoje) -----
  const agora = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const agoraHHMM = hhmm(agoraMin);
  const aulasHoje = turmas
    .flatMap((t) => t.horarios_hoje.map((h) => ({ t, inicio: h, fim: hhmm(minutos(h) + DURACAO_AULA) })))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const aulaAgora = aulasHoje.find((a) => minutos(a.inicio) <= agoraMin && agoraMin < minutos(a.fim)) ?? null;
  const proxima = aulasHoje.find((a) => minutos(a.inicio) > agoraMin) ?? null;
  const linha: ItemLinha[] = aulasHoje.map((a) => ({
    hora: a.inicio,
    titulo: nomeDe(a.t),
    detalhe: `${a.t.sala || "sem sala"} · até ${a.fim}${a.t.chamada_hoje ? " · chamada feita" : ""}`,
    estado: agoraMin >= minutos(a.fim) ? "passou" : agoraMin >= minutos(a.inicio) ? "agora" : "depois",
    onClick: () => nav("profFrequencia"),
  }));

  // ----- Números dos cartões -----
  const comAulaHoje = turmas.filter((t) => t.horarios_hoje.length > 0);
  const chamadasFeitas = comAulaHoje.filter((t) => t.chamada_hoje).length;
  const chamadasFaltando = comAulaHoje.length - chamadasFeitas;
  const diarioAtrasado = turmas.filter((t) => t.aulas_sem_registro > 0);
  const semRegistro = turmas.reduce((s, t) => s + t.aulas_sem_registro, 0);
  const totalNotas = turmas.reduce((s, t) => s + t.alunos, 0);
  const notasLancadas = turmas.reduce((s, t) => s + Math.min(t.notas_lancadas, t.alunos), 0);
  const pctNotas = totalNotas ? (notasLancadas / totalNotas) * 100 : null;
  const unidade = turmas.find((t) => t.unidade_notas)?.unidade_notas ?? null;

  // ----- Frase de resumo -----
  const partes: string[] = [];
  partes.push(aulasHoje.length ? `Você tem ${aulasHoje.length} ${aulasHoje.length === 1 ? "aula" : "aulas"} hoje` : "Sem aulas hoje");
  if (chamadasFaltando) partes.push(`${chamadasFaltando} ${chamadasFaltando === 1 ? "chamada por fazer" : "chamadas por fazer"}`);
  if (semRegistro) partes.push(`${semRegistro} ${semRegistro === 1 ? "aula sem registro" : "aulas sem registro"} no diário`);
  const resumo = minhas.semCadastro ? "Seu login ainda não está ligado a um cadastro de professor no RH." : minhas.painel.carregando ? "Buscando suas turmas..." : `${partes.join(", ")}.`;

  const avisos = [...(comunicados.dados ?? [])].sort((a, b) => b.criado_em.localeCompare(a.criado_em)).slice(0, 3);
  const eventos = agenda.dados ?? [];
  const diaHoje = agora.getDay();
  const hojeTexto = `${agora.getDate()} de ${MESES[agora.getMonth()]}`;
  const vazioHoje = diaHoje === 0 || diaHoje === 6 ? "Fim de semana: sem aulas hoje. Bom descanso!" : "Nenhuma aula sua hoje.";

  const acoes: { t: string; Icon: (p: IconProps) => React.ReactElement; c: string; s: ScreenId }[] = [
    { t: "Registrar frequência", Icon: IconCheck, c: GREEN, s: "profFrequencia" },
    { t: "Lançar notas", Icon: IconStar, c: BLUE, s: "profNotas" },
    { t: "Plano de aula", Icon: IconBook, c: TEAL, s: "profPlanejamento" },
    { t: "Diário de classe", Icon: IconEdit, c: VIOLET, s: "profDiario" },
    { t: "Tarefas", Icon: IconDoc, c: AMBER, s: "tarefas" },
    { t: "Comunicados", Icon: IconBell, c: PINK, s: "comunicados" },
  ];

  return (
    <div className="scroll-area animate-in flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-5">
        {/* ================= Coluna principal ================= */}
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <TopoCelular nav={nav} iniciais={iniciais || "P"} />
          <div>
            <Saudacao nome={primeiroNome} resumo={resumo} />
            {(chamadasFaltando > 0 || diarioAtrasado.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Pendencia texto="Chamadas de hoje" n={chamadasFaltando} cor={AMBER} ir={() => nav("profFrequencia")} />
                <Pendencia texto="Diários atrasados" n={diarioAtrasado.length} cor={RED} ir={() => nav("profDiario")} />
              </div>
            )}
          </div>

          {professor?.afastado_ate && (
            <div className="flex items-start gap-2 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold" style={{ background: AMBER + "1a", color: "#b45309" }}>
              <IconAlert size={16} className="mt-0.5 flex-none" />Você está afastado(a) até {dataBR(professor.afastado_ate)}. As turmas continuam aqui para consulta.
            </div>
          )}

          <div className="lg:hidden"><FaixaSemana eventos={eventos} /></div>

          {/* Aula agora (ou a próxima de hoje). Tocar abre a chamada. */}
          {(aulaAgora || proxima) && (
            <button onClick={() => nav("profFrequencia")} className="lift block w-full rounded-[22px] text-left">
              {aulaAgora ? (
                <AulaAgora rotulo="Aula agora" Icon={IconUsers} titulo={nomeDe(aulaAgora.t)}
                  detalhe={`${aulaAgora.t.sala || "sem sala"} · ${aulaAgora.inicio} às ${aulaAgora.fim} · ${aulaAgora.t.chamada_hoje ? "chamada feita" : "toque para fazer a chamada"}`}
                  progresso={(agoraMin - minutos(aulaAgora.inicio)) / DURACAO_AULA}
                  depois={proxima ? { titulo: `${proxima.inicio} ${turmaCurta(proxima.t.turma_nome)}`, detalhe: proxima.t.sala || proxima.t.materia_nome } : null} />
              ) : proxima && (
                <AulaAgora rotulo="Próxima aula" Icon={IconCalendar} titulo={nomeDe(proxima.t)}
                  detalhe={`${proxima.t.sala || "sem sala"} · começa às ${proxima.inicio} · ${proxima.t.alunos} alunos`} progresso={null} />
              )}
            </button>
          )}

          {/* Cartões coloridos */}
          {minhas.semCadastro ? <SemTurmas semCadastro /> : (
            <EstadoApi carregando={minhas.painel.carregando} erro={minhas.painel.erro} onRetry={minhas.painel.recarregar}>
              {turmas.length === 0 ? <SemTurmas semCadastro={false} /> : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.3fr_1fr] lg:gap-4">
                  <CartaoCor cor="azul" titulo="Minhas turmas" enfeite="losango" onClick={() => nav("profFrequencia")}>
                    <Numeros itens={[
                      { v: String(painel?.totais.turmas ?? turmas.length), l: "turmas" },
                      { v: String(painel?.totais.alunos ?? 0), l: "alunos" },
                      ...(professor ? [{ v: `${professor.aulas_semanais}/${professor.limite_aulas}`, l: "aulas por semana" }] : []),
                    ]} />
                    <MiniBarras dados={turmas.map((t) => ({ rotulo: turmaCurta(t.turma_nome), valor: t.alunos }))} max={Math.max(1, ...turmas.map((t) => t.alunos))} />
                  </CartaoCor>

                  <CartaoCor cor="agua" titulo="Chamada de hoje" enfeite="coracao" onClick={() => nav("profFrequencia")}>
                    {comAulaHoje.length ? (
                      <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <Rosca valor={(chamadasFeitas / comAulaHoje.length) * 100} cor={chamadasFaltando ? TEAL : GREEN} />
                        <div className="min-w-0 text-[12px] leading-snug" style={{ color: INK_SOFT }}>
                          <p><b style={{ color: INK }}>{chamadasFeitas}</b> de {comAulaHoje.length} feitas</p>
                          <p className="font-semibold" style={{ color: chamadasFaltando ? AMBER : GREEN }}>{chamadasFaltando ? `Faltam ${chamadasFaltando}` : "Tudo em dia!"}</p>
                        </div>
                      </div>
                    ) : <p className="mt-2 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma turma sua tem aula hoje.</p>}
                  </CartaoCor>

                  <CartaoCor cor="verde" titulo="Diário de classe" enfeite="circulo" onClick={() => nav("profDiario")}>
                    <Numeros itens={[
                      { v: String(turmas.length - diarioAtrasado.length), l: "turmas em dia" },
                      { v: String(semRegistro), l: "aulas sem registro", cor: semRegistro ? RED : INK },
                    ]} />
                  </CartaoCor>

                  <CartaoCor cor="lilas" titulo={unidade ? `Notas da ${unidade}ª unidade` : "Notas"} enfeite="estrela" onClick={() => nav("profNotas")}>
                    <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Rosca valor={pctNotas} cor={VIOLET} />
                      <div className="min-w-0 text-[12px] leading-snug" style={{ color: INK_SOFT }}>
                        <p><b style={{ color: INK }}>{notasLancadas}</b> de {totalNotas} lançadas</p>
                        <p className="font-semibold" style={{ color: totalNotas - notasLancadas ? AMBER : GREEN }}>{totalNotas - notasLancadas ? `Faltam ${totalNotas - notasLancadas}` : "Todas lançadas!"}</p>
                      </div>
                    </div>
                  </CartaoCor>
                </div>
              )}
            </EstadoApi>
          )}

          {/* Celular: as aulas de hoje vêm aqui (no computador ficam na coluna da direita) */}
          <div className="lg:hidden">
            <TituloSecao titulo="Hoje" acao="Ver calendário" onAcao={() => nav("calendario")} />
            <LinhaDoTempo itens={linha} agora={aulasHoje.length ? agoraHHMM : undefined} vazio={vazioHoje} />
          </div>

          {/* Turmas, com a situação de cada uma */}
          {turmas.length > 0 && (
            <section>
              <TituloSecao titulo="Situação das turmas" />
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {turmas.map((t) => <CartaoTurma key={t.lotacao} t={t} ir={() => nav("profFrequencia")} />)}
              </div>
            </section>
          )}

          {/* Ações e avisos */}
          <div className="grid gap-4 md:grid-cols-2">
            <section className="min-w-0">
              <TituloSecao titulo="Ações do dia" />
              <div className="grid grid-cols-2 gap-2.5">
                {acoes.map((a) => (
                  <button key={a.t} onClick={() => nav(a.s)} className="lift flex items-center gap-2.5 rounded-2xl bg-white p-3 text-left">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: a.c + "18", color: a.c }}><a.Icon size={18} /></span>
                    <span className="text-[12.5px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="min-w-0">
              <TituloSecao titulo="Avisos" acao="Ver todos" onAcao={() => nav("comunicados")} />
              {comunicados.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
                : avisos.length === 0 ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</p>
                : (
                  <div className="space-y-2">
                    {avisos.map((a) => (
                      <LinhaLista key={a.id} Icon={IconBell} titulo={a.titulo} detalhe={`${a.para} · ${dataBR(a.criado_em.slice(0, 10))}`} corIcone={a.alcance === "turma" ? BLUE : TEAL} onClick={() => nav("comunicados")} />
                    ))}
                  </div>
                )}
            </section>
          </div>
        </div>

        {/* ================= Coluna da direita (só no computador) ================= */}
        <aside className="hidden min-w-0 flex-col gap-4 lg:flex">
          <BotoesTopo nav={nav} />
          <CalendarioMini eventos={eventos} />
          <button onClick={() => nav("calendario")} className="rounded-full py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-110" style={{ background: PERFIL }}>Ver calendário escolar</button>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-[18px] font-extrabold" style={{ color: INK }}>{hojeTexto}</p>
            <span className="text-[12.5px]" style={{ color: INK_SOFT }}>{DIAS_LONGOS[diaHoje].split("-")[0]}</span>
          </div>
          <LinhaDoTempo itens={linha} agora={aulasHoje.length ? agoraHHMM : undefined} vazio={vazioHoje} />
        </aside>
      </div>
    </div>
  );
}

/* Uma turma · matéria: alunos, horário de hoje e as etiquetas de chamada, diário e notas. */
function CartaoTurma({ t, ir }: { t: TurmaDoProfessor; ir: () => void }) {
  return (
    <button onClick={ir} className="lift w-full rounded-[20px] bg-white p-3.5 text-left">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-[13px] font-extrabold" style={{ background: TEAL + "18", color: TEAL }}>{t.turma_nome.split(" ")[0]}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{nomeDe(t)}</p>
          <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{t.alunos} alunos · {t.sala || "sem sala"} · {t.horarios_hoje.length ? `hoje ${t.horarios_hoje.join(", ")}` : "sem aula hoje"}</p>
          <p className="truncate text-[11px]" style={{ color: INK_SOFT }}>{t.escola_nome}</p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {t.chamada_hoje ? <Etiqueta cor={GREEN}>Chamada feita</Etiqueta> : t.horarios_hoje.length > 0 ? <Etiqueta cor={AMBER}>Fazer chamada</Etiqueta> : null}
        <Etiqueta cor={corDoStatus(t.status_diario)}>Diário: {t.status_diario}{t.aulas_sem_registro ? ` (${t.aulas_sem_registro} sem registro)` : ""}</Etiqueta>
        <Etiqueta cor={corDoStatus(t.status_notas)}>Notas {t.unidade_notas}ª: {t.notas_lancadas}/{t.alunos}</Etiqueta>
      </div>
    </button>
  );
}
