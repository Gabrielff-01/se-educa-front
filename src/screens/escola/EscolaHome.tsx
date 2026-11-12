/* Início da gestão da escola (visual novo: cartões coloridos + coluna com calendário).
   Dados reais:
   - /api/painel/escola/: números do ano e as turmas (a escola é a do usuário logado);
   - /api/documentos/?status=aguardando: documentos que alunos e responsáveis mandaram;
   - /api/inscricoes/?status=aguardando: matrículas pela internet que a escola precisa analisar;
   - /api/agenda/: calendário (bolinhas no mês e "Próximas datas").

   Layout:
   - Computador: [conteúdo | coluna da direita com calendário do mês e as próximas datas].
   - Celular: uma coluna só; a faixa da semana entra no lugar do calendário e os atalhos da gestão aparecem no fim. */

import { EstadoApi } from "@/components/Form";
import {
  BotoesTopo, CalendarioMini, CartaoCor, FaixaSemana, LinhaDoTempo, MiniBarras, Numeros, Pendencia, Rosca, Saudacao, TituloSecao, TopoCelular, proximasDatas,
} from "@/components/Painel";
import { IconAlert, IconBook, IconBus, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrid, IconPin, IconShield, IconTrophy, IconUser, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { ANO_ATUAL } from "@/lib/formato";
import type { Documento, EventoAgenda, Inscricao } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, RED, TEAL, VIOLET, PERFIL } from "@/theme/colors";

type PainelEscola = {
  escola: { id: number; nome: string; municipio: string; inep: string };
  ano_letivo: number;
  indicadores: {
    alunos: number; em_analise: number; aguardando_turma: number; canceladas: number;
    professores: number; turmas: number; vagas: number; frequencia_30_dias: number | null;
  };
  turmas: {
    id: number; nome: string; turno_nome: string; sala: string; capacidade: number; alunos: number;
    aulas_previstas: number; aulas_com_professor: number; professores: number;
  }[];
};

/* Atalhos da gestão. No computador eles já estão no menu lateral, então aqui só aparecem no celular e no tablet. */
const ATALHOS: { t: string; Icon: (p: IconProps) => React.ReactElement; c: string; s: ScreenId }[] = [
  { t: "Matrículas", Icon: IconEdit, c: AMBER, s: "admMatriculas" },
  { t: "Matrículas pela internet", Icon: IconEdit, c: GREEN, s: "escInscricoes" },
  { t: "Alunos e responsáveis", Icon: IconUser, c: BLUE, s: "admAlunos" },
  { t: "Turmas", Icon: IconGrid, c: GREEN, s: "admTurmas" },
  { t: "Pedidos à DIES", Icon: IconChat, c: BLUE, s: "escPedidos" },
  { t: "Documentos recebidos", Icon: IconDoc, c: TEAL, s: "escDocumentos" },
  { t: "Professores e funções", Icon: IconUsers, c: TEAL, s: "admProfessores" },
  { t: "Ficha da escola", Icon: IconDoc, c: BLUE, s: "fichaEscola" },
  { t: "Horários", Icon: IconClock, c: BLUE, s: "admHorarios" },
  { t: "Diário", Icon: IconCheck, c: VIOLET, s: "admDiario" },
  { t: "Boletins", Icon: IconBook, c: PINK, s: "admBoletins" },
  { t: "Freq. programas", Icon: IconShield, c: GREEN, s: "gestorFreqSocial" },
  { t: "Pendências", Icon: IconAlert, c: RED, s: "gestorPendencias" },
  { t: "Escolas", Icon: IconPin, c: RED, s: "escolas" },
  { t: "Olimpíadas", Icon: IconTrophy, c: VIOLET, s: "escOlimpiadas" },
  { t: "Transporte (rotas)", Icon: IconBus, c: GREEN, s: "escRotas" },
  { t: "Merenda", Icon: IconFood, c: AMBER, s: "merenda" },
];

const LIMITE_FREQ = 85; // mínimo do Bolsa Família
/* "1ª série A" -> "1ªA" (cabe embaixo das barrinhas) */
const turmaCurta = (nome: string) => nome.replace(" série ", "").replace(" ano ", "");
const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function EscolaHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const painel = useApi<PainelEscola>("/api/painel/escola/");
  const documentos = useApi<Documento[]>("/api/documentos/?status=aguardando");
  const inscricoes = useApi<Inscricao[]>("/api/inscricoes/?status=aguardando");
  const agenda = useApi<EventoAgenda[]>(`/api/agenda/?ano=${ANO_ATUAL}`);
  const docs = documentos.dados?.length ?? 0;
  const pedidosNovos = inscricoes.dados?.length ?? 0;
  const p = painel.dados;
  const ind = p?.indicadores;

  const nome = usuario?.nome ?? "Gestão da escola";
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
  const escolaNome = p?.escola.nome ?? usuario?.escola_nome ?? "";

  // Turmas: ocupação (alunos / capacidade) e cobertura (aulas com professor / aulas da matriz)
  const turmas = p?.turmas ?? [];
  const cobertura = (t: PainelEscola["turmas"][number]) => (t.aulas_previstas ? Math.round((t.aulas_com_professor / t.aulas_previstas) * 100) : 0);
  const semProfessor = turmas.filter((t) => t.aulas_previstas > 0 && t.aulas_com_professor < t.aulas_previstas);
  const freq = ind?.frequencia_30_dias ?? null;

  // ----- Frase de resumo -----
  const pend: string[] = [];
  if (pedidosNovos) pend.push(plural(pedidosNovos, "matrícula pela internet para analisar", "matrículas pela internet para analisar"));
  if (docs) pend.push(plural(docs, "documento esperando", "documentos esperando"));
  if (ind?.aguardando_turma) pend.push(plural(ind.aguardando_turma, "aluno sem turma", "alunos sem turma"));
  const resumo = (
    <>
      {escolaNome}{p ? ` · INEP ${p.escola.inep}` : ""}.{" "}
      {pend.length ? `Tem ${pend.join(", ")}.` : p ? "Nada urgente esperando por você agora." : ""}
    </>
  );

  const eventos = agenda.dados ?? [];
  const proximas = proximasDatas(eventos, () => nav("calendario"));

  return (
    <div className="scroll-area animate-in flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-5">
        {/* ================= Coluna principal ================= */}
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <TopoCelular nav={nav} iniciais={iniciais || "E"} />
          <div>
            <Saudacao nome={nome.split(" ")[0]} resumo={resumo} />
            {(pedidosNovos > 0 || docs > 0 || (ind?.aguardando_turma ?? 0) > 0 || semProfessor.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Pendencia texto="Matrículas pela internet" n={pedidosNovos} cor={GREEN} ir={() => nav("escInscricoes")} />
                <Pendencia texto="Documentos" n={docs} cor={TEAL} ir={() => nav("escDocumentos")} />
                <Pendencia texto="Alunos sem turma" n={ind?.aguardando_turma ?? 0} cor={AMBER} ir={() => nav("admMatriculas")} />
                <Pendencia texto="Turmas sem professor" n={semProfessor.length} cor={RED} ir={() => nav("admProfessores")} />
              </div>
            )}
          </div>

          <div className="lg:hidden"><FaixaSemana eventos={eventos} /></div>

          <EstadoApi carregando={painel.carregando} erro={painel.erro} onRetry={painel.recarregar}>
            {p && ind && (
              <div className="flex flex-col gap-4 lg:gap-5">
                {/* Cartões coloridos */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.3fr_1fr] lg:gap-4">
                  <CartaoCor cor="azul" titulo={`Alunos · ${p.ano_letivo}`} enfeite="losango" onClick={() => nav("admMatriculas")}>
                    <Numeros itens={[
                      { v: String(ind.alunos), l: "confirmados" },
                      { v: String(ind.em_analise), l: "em análise", cor: ind.em_analise ? AMBER : INK },
                      { v: String(ind.aguardando_turma), l: "sem turma", cor: ind.aguardando_turma ? RED : INK },
                    ]} />
                    <MiniBarras dados={turmas.map((t) => ({ rotulo: turmaCurta(t.nome), valor: t.alunos }))} max={Math.max(1, ...turmas.map((t) => t.capacidade))} />
                  </CartaoCor>

                  <CartaoCor cor="agua" titulo="Turmas" enfeite="coracao" onClick={() => nav("admTurmas")}>
                    <Numeros itens={[{ v: String(ind.turmas), l: "turmas" }, { v: String(ind.vagas), l: "vagas livres" }]} />
                    <MiniBarras dados={turmas.map((t) => ({ rotulo: turmaCurta(t.nome), valor: cobertura(t) }))} max={100} linha={100} cor={TEAL} />
                    <p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>Barras: % das aulas da matriz com professor</p>
                  </CartaoCor>

                  <CartaoCor cor="verde" titulo="Frequência" enfeite="circulo" onClick={() => nav("gestorFreqSocial")}>
                    <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Rosca valor={freq} cor={freq !== null && freq < LIMITE_FREQ ? RED : GREEN} />
                      <div className="min-w-0 text-[12px] leading-snug" style={{ color: INK_SOFT }}>
                        <p>Últimos 30 dias</p>
                        <p className="font-semibold" style={{ color: freq !== null && freq < LIMITE_FREQ ? RED : INK }}>{freq === null ? "Sem chamadas ainda" : freq < LIMITE_FREQ ? `Abaixo de ${LIMITE_FREQ}%` : `Acima de ${LIMITE_FREQ}%`}</p>
                      </div>
                    </div>
                  </CartaoCor>

                  <CartaoCor cor="lilas" titulo="Professores" enfeite="estrela" onClick={() => nav("admProfessores")}>
                    <Numeros itens={[
                      { v: String(ind.professores), l: "lotados nas turmas" },
                      { v: String(semProfessor.length), l: semProfessor.length === 1 ? "turma faltando professor" : "turmas faltando professor", cor: semProfessor.length ? RED : INK },
                    ]} />
                  </CartaoCor>
                </div>

                {/* Turmas */}
                <section>
                  <TituloSecao titulo="Turmas" acao="Ver todas" onAcao={() => nav("admTurmas")} />
                  {turmas.length === 0 ? (
                    <p className="rounded-2xl bg-white p-4 text-[12.5px]" style={{ color: INK_SOFT }}>A escola ainda não tem turmas neste ano. Quem cria as turmas é a DIES: peça em "Pedidos à DIES".</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      {turmas.map((t) => {
                        const ocupacao = t.capacidade ? Math.round((t.alunos / t.capacidade) * 100) : 0;
                        const cob = cobertura(t);
                        return (
                          <button key={t.id} onClick={() => nav("admTurmas")} className="lift rounded-[20px] bg-white p-3.5 text-left">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[14px] font-bold" style={{ color: INK }}>{t.nome}</p>
                              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: "#eef3f9", color: INK_SOFT }}>{t.turno_nome}{t.sala ? ` · ${t.sala}` : ""}</span>
                            </div>
                            <Barra rotulo="Alunos" valor={`${t.alunos}/${t.capacidade}`} pct={ocupacao} cor={ocupacao >= 95 ? AMBER : BLUE} />
                            <Barra rotulo="Aulas com professor" valor={`${t.aulas_com_professor}/${t.aulas_previstas} por semana`} pct={cob} cor={cob >= 100 ? GREEN : cob >= 60 ? AMBER : RED} />
                            <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>{t.professores} professor(es) lotado(s){cob < 100 && t.aulas_previstas > 0 ? " · faltam professores pela matriz" : ""}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}
          </EstadoApi>

          {/* Celular e tablet: próximas datas e os atalhos da gestão */}
          <section className="lg:hidden">
            <TituloSecao titulo="Próximas datas" acao="Ver calendário" onAcao={() => nav("calendario")} />
            <LinhaDoTempo itens={proximas} vazio={agenda.carregando ? "Buscando o calendário..." : "Nenhuma data marcada daqui pra frente."} />
          </section>
          <section className="lg:hidden">
            <TituloSecao titulo="Gestão" />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {ATALHOS.map((a) => (
                <button key={a.t} onClick={() => nav(a.s)} className="lift flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1.5 py-3 text-center">
                  <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: a.c + "18", color: a.c }}><a.Icon size={19} /></span>
                  <span className="text-[11.5px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* ================= Coluna da direita (só no computador) ================= */}
        <aside className="hidden min-w-0 flex-col gap-4 lg:flex">
          <BotoesTopo nav={nav} />
          <CalendarioMini eventos={eventos} />
          <button onClick={() => nav("calendario")} className="rounded-full py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-110" style={{ background: PERFIL }}>Ver calendário escolar</button>
          <p className="mt-1 text-[18px] font-extrabold" style={{ color: INK }}>Próximas datas</p>
          <LinhaDoTempo itens={proximas} vazio={agenda.carregando ? "Buscando o calendário..." : "Nenhuma data marcada daqui pra frente."} />
        </aside>
      </div>
    </div>
  );
}

function Barra({ rotulo, valor, pct, cor }: { rotulo: string; valor: string; pct: number; cor: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-[11px]"><span style={{ color: INK_SOFT }}>{rotulo}</span><span className="font-bold" style={{ color: INK }}>{valor}</span></div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef3f9" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: cor }} /></div>
    </div>
  );
}
