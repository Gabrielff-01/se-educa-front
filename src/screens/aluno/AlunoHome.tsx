/* Tela inicial do aluno (visual novo: cartões coloridos + coluna com calendário e o dia).
   Dados reais:
   - /api/boletim/: nome, turma, escola, média e frequência (geral e por matéria);
   - /api/horarios/?turma=ID: aulas de hoje (filtra o dia da semana de hoje) e a "Aula agora";
   - /api/minhas-tarefas/: tarefas pendentes, atrasadas e entregues;
   - /api/agenda/: eventos do calendário (bolinhas no calendário e na faixa da semana);
   - /api/olimpiadas/: olimpíadas em que o aluno está inscrito ou pode se inscrever;
   - /api/comunicados/: último aviso.

   Layout:
   - Computador: [conteúdo | coluna da direita com calendário do mês e a linha do tempo de hoje].
   - Celular: uma coluna só; a faixa da semana entra no lugar do calendário. */

import { EstadoApi } from "@/components/Form";
import {
  AulaAgora, BotoesTopo, CalendarioMini, CartaoCor, DIAS_LONGOS, FaixaSemana, isoDe, LinhaDoTempo, LinhaLista, MESES, MiniBarras, Numeros, Saudacao, TituloSecao, TopoCelular,
} from "@/components/Painel";
import type { ItemLinha } from "@/components/Painel";
import { SeletorAluno } from "@/components/SeletorAluno";
import { IconBook, IconBus, IconCalendar, IconChat, IconChart, IconDoc, IconEdit, IconFood, IconGrad, IconGrid, IconPin, IconSend, IconTrophy } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataBR, hojeISO, horaCurta, notaBR, porcentoBR } from "@/lib/formato";
import type { Boletim, Comunicado, EventoAgenda, Horario, MinhaTarefa, Olimpiada } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { abaixoDaMedia } from "@/screens/aluno/Boletim";
import { minimoDoPrograma } from "@/screens/aluno/Frequencia";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, RED, TEAL, VIOLET, PERFIL } from "@/theme/colors";

/* Nome curto da matéria embaixo das barrinhas */
const ABREVIA: Record<string, string> = { "Língua Portuguesa": "Port", Português: "Port", Matemática: "Mat", História: "Hist", Geografia: "Geo", Biologia: "Bio", Física: "Fís", Química: "Quím", Inglês: "Ing", "Língua Inglesa": "Ing", Artes: "Arte", Arte: "Arte", "Educação Física": "Ed F", Filosofia: "Filo", Sociologia: "Soc", Ciências: "Ciên" };
const abrevia = (nome: string) => ABREVIA[nome] ?? nome.slice(0, 4);

/* Hora "HH:MM" + minutos -> "HH:MM" */
function somaMinutos(hhmm: string, min: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + min;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
const minutos = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

export function AlunoHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const boletim = useApi<Boletim>(comAluno("/api/boletim/"));
  const b = boletim.dados;
  const turma = b?.matricula?.turma ?? null;
  const horarios = useApi<Horario[]>(turma ? `/api/horarios/?turma=${turma}` : null);
  const tarefas = useApi<MinhaTarefa[]>(comAluno("/api/minhas-tarefas/"));
  const agenda = useApi<EventoAgenda[]>(comAluno(`/api/agenda/?ano=${new Date().getFullYear()}`));
  const olimpiadas = useApi<Olimpiada[]>("/api/olimpiadas/");
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");

  const nomeCompleto = b?.aluno.nome ?? usuario?.nome ?? "Aluno";
  const primeiroNome = nomeCompleto.split(" ")[0];
  const iniciais = nomeCompleto.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("");

  // ----- Notas e frequência -----
  const aprovacao = b?.media_aprovacao ?? "6.0";
  const minimo = b?.frequencia_minima ?? 75;
  const minimoProg = minimoDoPrograma(b?.aluno.programa_social);
  const freq = b?.frequencia_geral ?? null;
  const materias = b?.materias ?? [];
  const comMedia = materias.filter((m) => m.media !== null);
  const abaixo = comMedia.filter((m) => abaixoDaMedia(m.media, aprovacao));
  const freqBaixa = materias.filter((m) => m.frequencia !== null && m.frequencia < minimo);

  // ----- Aulas de hoje (dia_semana: 1 = segunda ... 5 = sexta, igual ao getDay()) -----
  const agoraData = new Date();
  const diaHoje = agoraData.getDay();
  const agoraHHMM = agoraData.toTimeString().slice(0, 5);
  const aulasHoje = (horarios.dados ?? []).filter((h) => h.dia_semana === diaHoje).sort((x, y) => x.inicio.localeCompare(y.inicio));
  // Cada aula vai até a próxima começar (no máximo 50 min, a hora-aula); a última dura 50 min.
  const fimDe = (i: number) => {
    const ini = horaCurta(aulasHoje[i].inicio);
    const prox = aulasHoje[i + 1] ? horaCurta(aulasHoje[i + 1].inicio) : null;
    return prox && minutos(prox) - minutos(ini) <= 50 ? prox : somaMinutos(ini, 50);
  };
  const iAgora = aulasHoje.findIndex((a, i) => horaCurta(a.inicio) <= agoraHHMM && agoraHHMM < fimDe(i));
  const iProxima = aulasHoje.findIndex((a) => horaCurta(a.inicio) > agoraHHMM);
  const aulaAgora = iAgora >= 0 ? aulasHoje[iAgora] : null;
  const proxima = aulaAgora ? aulasHoje[iAgora + 1] ?? null : iProxima >= 0 ? aulasHoje[iProxima] : null;

  // ----- Tarefas -----
  const hoje = hojeISO();
  const amanha = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return isoDe(d); })();
  const todas = tarefas.dados ?? [];
  const aFazer = todas.filter((t) => t.status !== "Entregue").sort((x, y) => x.prazo.localeCompare(y.prazo));
  const atrasadas = aFazer.filter((t) => t.status === "Atrasada");
  const paraAmanha = aFazer.filter((t) => t.prazo === amanha);
  const entregues = todas.filter((t) => t.status === "Entregue");

  // ----- Olimpíadas -----
  const listaOlimp = olimpiadas.dados ?? [];
  const inscrito = listaOlimp.filter((o) => o.minhas.length > 0 && o.status !== "resultado").sort((x, y) => x.data_prova.localeCompare(y.data_prova));
  const abertas = listaOlimp.filter((o) => o.status === "inscricoes" && o.pode_participar && o.minhas.length === 0);

  // ----- Linha do tempo de hoje: aulas + tarefas que vencem hoje/amanhã -----
  const linha: ItemLinha[] = [
    ...aulasHoje.map((a, i): ItemLinha => ({
      hora: horaCurta(a.inicio), titulo: a.materia_nome, detalhe: `${a.sala || "Sala"} · até ${fimDe(i)}`,
      estado: i === iAgora ? "agora" : fimDe(i) <= agoraHHMM ? "passou" : "depois", onClick: () => nav("horarios"),
    })),
    ...aFazer.filter((t) => t.prazo === hoje || t.prazo === amanha).map((t): ItemLinha => ({
      hora: t.prazo === hoje ? "hoje" : "amanhã", titulo: `Entregar: ${t.titulo}`, detalhe: `${t.materia_nome} · tarefa`, estado: "depois", onClick: () => nav("tarefas"),
    })),
  ];

  // ----- Frase de resumo do dia -----
  const partes: string[] = [];
  if (diaHoje === 0 || diaHoje === 6) partes.push("Hoje é fim de semana, sem aulas");
  else if (turma && !horarios.carregando) partes.push(aulasHoje.length ? `Você tem ${aulasHoje.length} ${aulasHoje.length === 1 ? "aula" : "aulas"} hoje` : "Nenhuma aula cadastrada pra hoje");
  if (paraAmanha.length) partes.push(`${paraAmanha.length} ${paraAmanha.length === 1 ? "tarefa vence" : "tarefas vencem"} amanhã`);
  if (atrasadas.length) partes.push(`${atrasadas.length} ${atrasadas.length === 1 ? "tarefa atrasada" : "tarefas atrasadas"}`);
  let resumo = partes.join(", ");
  if (resumo) resumo += ".";
  if (abaixo.length === 1) resumo += ` A média de ${abaixo[0].materia_nome} está abaixo de ${notaBR(aprovacao)}, vale olhar.`;
  else if (abaixo.length > 1) resumo += ` ${abaixo.length} matérias estão abaixo da média.`;
  if (!resumo) resumo = b?.matricula ? `${b.matricula.turma_nome ?? b.matricula.serie_nome} · ${b.matricula.escola_nome}` : "Aqui está o resumo da sua vida escolar.";

  const eventos = agenda.dados ?? [];
  const ultimo = (comunicados.dados ?? [])[0];

  // Serviços: no celular aparecem todos (lá não tem o menu lateral); no computador só os que não estão no menu.
  const servicos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId; noMenu: boolean }[] = [
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim", noMenu: false },
    { label: "Histórico escolar", Icon: IconBook, cor: INDIGO, s: "historico", noMenu: false },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte", noMenu: true },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda", noMenu: true },
    { label: "Olimpíadas", Icon: IconTrophy, cor: VIOLET, s: "olimpiadas", noMenu: true },
    { label: "Enviar documentos", Icon: IconSend, cor: TEAL, s: "documentos", noMenu: true },
    { label: "Comunicados", Icon: IconChat, cor: BLUE, s: "comunicados", noMenu: true },
    { label: "Escolas", Icon: IconGrad, cor: TEAL, s: "escolas", noMenu: false },
    { label: "Biblioteca", Icon: IconBook, cor: INDIGO, s: "biblioteca", noMenu: false },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos", noMenu: false },
    { label: "Chat", Icon: IconChat, cor: VIOLET, s: "chat", noMenu: false },
    { label: "Secretaria Virtual", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual", noMenu: true },
  ];

  const hojeTexto = `${agoraData.getDate()} de ${MESES[agoraData.getMonth()]}`;

  return (
    <div className="scroll-area animate-in flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-5">
        {/* ================= Coluna principal ================= */}
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <TopoCelular nav={nav} iniciais={iniciais} />
          <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} />
          <Saudacao nome={primeiroNome} resumo={resumo} />

          <div className="lg:hidden"><FaixaSemana eventos={eventos} /></div>

          {/* Aula agora (ou a próxima de hoje) */}
          {aulaAgora ? (
            <AulaAgora rotulo="Aula agora" Icon={IconChart} titulo={`${aulaAgora.materia_nome}${aulaAgora.sala ? ` · ${aulaAgora.sala}` : ""}`}
              detalhe={`${aulaAgora.professor_nome} · ${horaCurta(aulaAgora.inicio)} às ${fimDe(iAgora)} · faltam ${minutos(fimDe(iAgora)) - minutos(agoraHHMM)} min`}
              progresso={(minutos(agoraHHMM) - minutos(horaCurta(aulaAgora.inicio))) / Math.max(1, minutos(fimDe(iAgora)) - minutos(horaCurta(aulaAgora.inicio)))}
              depois={proxima ? { titulo: `${horaCurta(proxima.inicio)} ${proxima.materia_nome}`, detalhe: proxima.sala || proxima.professor_nome } : null} />
          ) : proxima ? (
            <AulaAgora rotulo="Próxima aula" Icon={IconCalendar} titulo={`${proxima.materia_nome}${proxima.sala ? ` · ${proxima.sala}` : ""}`}
              detalhe={`${proxima.professor_nome} · começa às ${horaCurta(proxima.inicio)}`} progresso={null} />
          ) : null}

          {/* Cartões coloridos */}
          <EstadoApi carregando={filhos.carregando || boletim.carregando} erro={filhos.erro ?? boletim.erro} onRetry={boletim.recarregar}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1.3fr] lg:gap-4">
              <CartaoCor cor="azul" titulo="Notas" enfeite="losango" onClick={() => nav("notas")}>
                <Numeros itens={[
                  { v: notaBR(b?.media_geral), l: "média geral", cor: abaixoDaMedia(b?.media_geral, aprovacao) ? RED : INK },
                  { v: String(abaixo.length), l: `abaixo de ${notaBR(aprovacao)}`, cor: abaixo.length ? RED : INK },
                ]} />
                <MiniBarras dados={comMedia.map((m) => ({ rotulo: abrevia(m.materia_nome), valor: Number(m.media) }))} max={10} linha={Number(aprovacao)} />
                {comMedia.length === 0 && <p className="mt-2 text-[12px]" style={{ color: INK_SOFT }}>Sem notas lançadas ainda.</p>}
              </CartaoCor>

              <CartaoCor cor="agua" titulo="Frequência" enfeite="coracao" onClick={() => nav("frequencia")}>
                <Numeros itens={[
                  { v: porcentoBR(freq), l: "no ano", cor: freq !== null && freq < minimo ? RED : INK },
                  { v: String(b?.faltas_total ?? 0), l: "faltas" },
                  { v: `${minimoProg ?? minimo}%`, l: minimoProg ? `mínimo ${b?.aluno.programa_nome}` : "mínimo" },
                ]} />
                <MiniBarras dados={materias.filter((m) => m.frequencia !== null).map((m) => ({ rotulo: abrevia(m.materia_nome), valor: m.frequencia ?? 0 }))} min={50} max={100} linha={minimoProg ?? minimo} cor={TEAL} />
                {freqBaixa.length > 0 && <p className="mt-1 text-[11.5px] font-semibold" style={{ color: RED }}>Atenção em {freqBaixa.map((m) => m.materia_nome).join(", ")}</p>}
              </CartaoCor>

              <CartaoCor cor="verde" titulo="Tarefas" enfeite="circulo" onClick={() => nav("tarefas")}>
                <Numeros itens={[
                  { v: String(aFazer.length), l: "a fazer" },
                  ...(atrasadas.length ? [{ v: String(atrasadas.length), l: "atrasadas", cor: RED }] : [{ v: String(paraAmanha.length), l: "para amanhã" }]),
                  { v: String(entregues.length), l: "entregues" },
                ]} />
              </CartaoCor>

              <CartaoCor cor="lilas" titulo="Olimpíadas" enfeite="estrela" onClick={() => nav("olimpiadas")}>
                {inscrito.length ? (
                  <>
                    <Numeros itens={[{ v: dataBR(inscrito[0].data_prova).slice(0, 5), l: "sua próxima prova" }, ...(abertas.length ? [{ v: String(abertas.length), l: "com inscrição aberta" }] : [])]} />
                    <p className="mt-2 truncate text-[12px] font-semibold" style={{ color: INK }}>Inscrito: {inscrito[0].nome}</p>
                  </>
                ) : abertas.length ? (
                  <>
                    <Numeros itens={[{ v: String(abertas.length), l: abertas.length === 1 ? "inscrição aberta" : "inscrições abertas" }, { v: dataBR(abertas[0].data_prova).slice(0, 5), l: "data da prova" }]} />
                    <p className="mt-2 truncate text-[12px] font-semibold" style={{ color: INK }}>{abertas[0].nome}</p>
                  </>
                ) : (
                  <p className="mt-2 text-[12.5px]" style={{ color: INK_SOFT }}>{olimpiadas.carregando ? "Buscando..." : "Nenhuma olimpíada aberta agora."}</p>
                )}
              </CartaoCor>
            </div>
          </EstadoApi>

          {/* Celular: a linha do tempo de hoje vem aqui (no computador ela fica na coluna da direita) */}
          <div className="lg:hidden">
            <TituloSecao titulo="Hoje" acao="Ver calendário" onAcao={() => nav("calendario")} />
            <LinhaDoTempo itens={linha} agora={aulasHoje.length ? agoraHHMM : undefined} vazio={diaHoje === 0 || diaHoje === 6 ? "Fim de semana: sem aulas hoje. Bom descanso!" : "Nada marcado pra hoje."} />
          </div>

          {/* Tarefas e último comunicado */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <TituloSecao titulo="Tarefas a fazer" acao="Ver todas" onAcao={() => nav("tarefas")} />
              {tarefas.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
                : aFazer.length === 0 ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma tarefa pendente. Tudo em dia!</p>
                : (
                  <div className="space-y-2">
                    {aFazer.slice(0, 4).map((t, i) => (
                      <LinhaLista key={t.id} Icon={IconEdit} titulo={t.titulo} detalhe={`${t.materia_nome} · até ${dataBR(t.prazo)}`}
                        etiqueta={t.status === "Atrasada" ? "Atrasada" : t.prazo === amanha ? "amanhã" : dataBR(t.prazo).slice(0, 5)}
                        destaque={i === 0 && t.status !== "Atrasada" && (t.prazo === hoje || t.prazo === amanha)} corIcone={t.status === "Atrasada" ? RED : VIOLET} onClick={() => nav("tarefas")} />
                    ))}
                  </div>
                )}
            </div>
            <div className="min-w-0">
              <TituloSecao titulo="Último comunicado" acao="Ver todos" onAcao={() => nav("comunicados")} />
              {comunicados.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
                : !ultimo ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</p>
                : (
                  <button onClick={() => nav("comunicados")} className="lift block w-full rounded-[20px] border-l-4 bg-white p-4 text-left" style={{ borderColor: BLUE }}>
                    <p className="text-[15px] font-extrabold" style={{ color: INK }}>{ultimo.titulo}</p>
                    <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>{ultimo.autor_nome || "Escola"} · {dataBR(ultimo.criado_em.slice(0, 10))}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold" style={{ background: "#eef3f9", color: INK }}>{ultimo.alcance_nome}</span>
                      {ultimo.para && <span className="rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold" style={{ background: "#eef3f9", color: INK }}>{ultimo.para}</span>}
                    </div>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed" style={{ color: INK }}>{ultimo.texto}</p>
                  </button>
                )}
            </div>
          </div>

          {/* Serviços */}
          <div>
            <TituloSecao titulo="Serviços" />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:flex lg:flex-wrap">
              {servicos.map(({ label, Icon, cor, s, noMenu }) => (
                <button key={label} onClick={() => nav(s)} className={`lift flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 lg:flex-row lg:gap-2 lg:rounded-full lg:py-2 lg:pl-2 lg:pr-4 ${noMenu ? "lg:hidden" : ""}`}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl lg:h-8 lg:w-8 lg:rounded-full" style={{ background: cor + "18", color: cor }}><Icon size={19} /></span>
                  <span className="text-center text-[11.5px] font-semibold lg:text-[12.5px]" style={{ color: INK }}>{label}</span>
                </button>
              ))}
            </div>
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
          <LinhaDoTempo itens={linha} agora={aulasHoje.length ? agoraHHMM : undefined} vazio={diaHoje === 0 || diaHoje === 6 ? "Fim de semana: sem aulas hoje. Bom descanso!" : "Nada marcado pra hoje."} />
        </aside>
      </div>
    </div>
  );
}
