/* Tela inicial do responsável (visual novo: cartões coloridos + coluna com calendário).
   Dados reais:
   - /api/meus-alunos/: os filhos ligados a este responsável;
   - /api/boletim/?aluno=ID e /api/minhas-tarefas/?aluno=ID: números e alertas de cada filho;
   - /api/agenda/?aluno=ID: calendário da escola do filho escolhido;
   - /api/comunicados/: avisos recentes.
   Alertas: frequência abaixo do mínimo do programa social (ou dos 75% da escola),
   média abaixo de 6 em alguma matéria e tarefas atrasadas.
   Tocar num cartão já deixa aquele filho escolhido nas outras telas. */

import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import {
  BotoesTopo, CalendarioMini, CartaoCor, Esqueleto, FaixaSemana, LinhaDoTempo, LinhaLista, MiniBarras, Numeros, Rosca, Saudacao, TituloSecao, TopoCelular, proximasDatas,
} from "@/components/Painel";
import { IconAlert, IconBell, IconBook, IconBus, IconCalendar, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrid, IconPin, IconSend, IconStar, IconTrophy, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { ANO_ATUAL, dataBR, notaBR, porcentoBR } from "@/lib/formato";
import type { Boletim, Comunicado, EventoAgenda, MeuAluno, MinhaTarefa } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { abaixoDaMedia } from "@/screens/aluno/Boletim";
import { minimoDoPrograma } from "@/screens/aluno/Frequencia";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PINK, RED, TEAL, VIOLET, PERFIL } from "@/theme/colors";

/* Nome curto da matéria embaixo das barrinhas */
const ABREVIA: Record<string, string> = { "Língua Portuguesa": "Port", Português: "Port", Matemática: "Mat", História: "Hist", Geografia: "Geo", Biologia: "Bio", Física: "Fís", Química: "Quím", Inglês: "Ing", "Língua Inglesa": "Ing", Artes: "Arte", Arte: "Arte", "Educação Física": "Ed F", Filosofia: "Filo", Sociologia: "Soc", Ciências: "Ciên" };
const abrevia = (nome: string) => ABREVIA[nome] ?? nome.slice(0, 4);

export function ResponsavelHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const { filhos, escolher, comAluno } = useAlunoEscolhido();
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");
  const agenda = useApi<EventoAgenda[]>(comAluno(`/api/agenda/?ano=${ANO_ATUAL}`));
  const nome = usuario?.nome ?? "Responsável";
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
  const lista = filhos.dados ?? [];

  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Tarefas", Icon: IconEdit, cor: VIOLET, s: "tarefas" },
    { label: "Calendário", Icon: IconCalendar, cor: "#0ea5e9", s: "calendario" },
    { label: "Histórico", Icon: IconBook, cor: INDIGO, s: "historico" },
    { label: "Comunicação", Icon: IconChat, cor: PINK, s: "chat" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
    { label: "Enviar documentos", Icon: IconSend, cor: TEAL, s: "documentos" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Olimpíadas", Icon: IconTrophy, cor: VIOLET, s: "olimpiadas" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
  ];

  // Abre uma tela já com aquele filho escolhido
  const abrirDoFilho = (id: number, tela: ScreenId) => { escolher(id); nav(tela); };
  const resumo = filhos.carregando ? "Buscando seus filhos..."
    : lista.length === 0 ? "Nenhum aluno ligado à sua conta ainda."
    : `${lista.length === 1 ? "1 aluno ligado" : `${lista.length} alunos ligados`} à sua conta: ${lista.map((a) => a.nome.split(" ")[0]).join(" e ")}. Os alertas aparecem em vermelho.`;

  const eventos = agenda.dados ?? [];
  const proximas = proximasDatas(eventos, () => nav("calendario"));
  const avisos = [...(comunicados.dados ?? [])].sort((a, b) => b.criado_em.localeCompare(a.criado_em)).slice(0, 3);

  return (
    <div className="scroll-area animate-in flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-5">
        {/* ================= Coluna principal ================= */}
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <TopoCelular nav={nav} iniciais={iniciais || "R"} />
          <Saudacao nome={nome.split(" ")[0]} resumo={resumo} />
          <div className="lg:hidden"><FaixaSemana eventos={eventos} /></div>

          {/* Um bloco de cartões para cada filho */}
          <EstadoApi carregando={filhos.carregando} erro={filhos.erro} onRetry={filhos.recarregar}>
            {lista.length === 0 ? (
              <EmptyState title="Nenhum aluno ligado" text="Peça à secretaria da escola para ligar seu cadastro ao do aluno." icon={<IconUsers size={26} />} />
            ) : (
              <div className="flex flex-col gap-6">
                {lista.map((a) => <BlocoFilho key={a.id} aluno={a} abrir={(tela) => abrirDoFilho(a.id, tela)} />)}
              </div>
            )}
          </EstadoApi>

          {/* Celular e tablet: próximas datas */}
          <section className="lg:hidden">
            <TituloSecao titulo="Próximas datas" acao="Ver calendário" onAcao={() => nav("calendario")} />
            <LinhaDoTempo itens={proximas} vazio={agenda.carregando ? "Buscando o calendário..." : "Nenhuma data marcada daqui pra frente."} />
          </section>

          {/* Comunicados */}
          <section>
            <TituloSecao titulo="Comunicados recentes" acao="Ver todos" onAcao={() => nav("comunicados")} />
            {comunicados.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
              : avisos.length === 0 ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</p>
              : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {avisos.map((c) => (
                    <LinhaLista key={c.id} Icon={IconBell} titulo={c.titulo} detalhe={`${c.para} · ${dataBR(c.criado_em.slice(0, 10))}`} corIcone={c.alcance === "turma" ? AMBER : c.alcance === "escola" ? TEAL : BLUE} onClick={() => nav("comunicados")} />
                  ))}
                </div>
              )}
          </section>

          {/* Acesso rápido (no computador, os principais já estão no menu lateral) */}
          <section>
            <TituloSecao titulo="Acesso rápido" />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:flex lg:flex-wrap">
              {atalhos.map(({ label, Icon, cor, s }) => (
                <button key={label} onClick={() => nav(s)} className="lift flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 lg:flex-row lg:gap-2 lg:rounded-full lg:py-2 lg:pl-2 lg:pr-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl lg:h-8 lg:w-8 lg:rounded-full" style={{ background: cor + "18", color: cor }}><Icon size={19} /></span>
                  <span className="text-center text-[11.5px] font-semibold lg:text-[12.5px]" style={{ color: INK }}>{label}</span>
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

/* Bloco de um filho: nome, 4 cartões coloridos (notas, frequência, tarefas, alertas) e a lista de alertas. */
function BlocoFilho({ aluno, abrir }: { aluno: MeuAluno; abrir: (tela: ScreenId) => void }) {
  const boletim = useApi<Boletim>(`/api/boletim/?aluno=${aluno.id}`);
  const tarefas = useApi<MinhaTarefa[]>(`/api/minhas-tarefas/?aluno=${aluno.id}`);
  const b = boletim.dados;
  const aprovacao = b?.media_aprovacao ?? "6.0";
  const minimoEscola = b?.frequencia_minima ?? 75;
  const minimoProg = minimoDoPrograma(aluno.programa_social);
  const minimo = minimoProg ?? minimoEscola;
  const freq = b?.frequencia_geral ?? null;
  const comMedia = (b?.materias ?? []).filter((m) => m.media !== null);
  const notasBaixas = (b?.materias ?? []).filter((m) => abaixoDaMedia(m.media, aprovacao));
  const lista = tarefas.dados ?? [];
  const atrasadas = lista.filter((t) => t.status === "Atrasada");
  const aFazer = lista.filter((t) => t.status !== "Entregue");

  // Alertas que merecem a atenção da família
  const alertas: { texto: string; tela: ScreenId; cor: string }[] = [];
  if (freq !== null && freq < minimoEscola) {
    alertas.push({ texto: `Frequência de ${porcentoBR(freq)}: abaixo dos ${minimoEscola}% exigidos pela escola`, tela: "frequencia", cor: RED });
  } else if (freq !== null && minimoProg && freq < minimoProg) {
    alertas.push({ texto: `Frequência de ${porcentoBR(freq)}: o ${aluno.programa_nome} exige ${minimoProg}%`, tela: "frequencia", cor: AMBER });
  }
  if (notasBaixas.length) alertas.push({ texto: `Média abaixo de ${notaBR(aprovacao)} em ${notasBaixas.map((m) => m.materia_nome).join(", ")}`, tela: "notas", cor: RED });
  if (atrasadas.length) alertas.push({ texto: `${atrasadas.length} ${atrasadas.length === 1 ? "tarefa atrasada" : "tarefas atrasadas"}: ${atrasadas.map((t) => t.materia_nome).join(", ")}`, tela: "tarefas", cor: RED });

  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <Avatar name={aluno.nome} color={BLUE} size={42} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16.5px] font-extrabold lg:text-[18px]" style={{ color: INK }}>{aluno.nome}</p>
          <p className="truncate text-[12px]" style={{ color: INK_SOFT }}>{aluno.turma_nome ?? "Sem turma"} · {aluno.escola_nome ?? "sem escola"}</p>
        </div>
        {aluno.parentesco && <span className="flex-none rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold" style={{ color: BLUE }}>{aluno.parentesco}</span>}
      </div>

      {boletim.carregando ? (
        <div className="grid grid-cols-2 gap-3 lg:gap-4">{[0, 1, 2, 3].map((i) => <Esqueleto key={i} altura={130} />)}</div>
      ) : (
        <EstadoApi carregando={false} erro={boletim.erro} onRetry={boletim.recarregar}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.3fr_1fr] lg:gap-4">
            <CartaoCor cor="azul" titulo="Notas" enfeite="losango" onClick={() => abrir("notas")}>
              <Numeros itens={[
                { v: notaBR(b?.media_geral), l: "média geral", cor: abaixoDaMedia(b?.media_geral, aprovacao) ? RED : INK },
                { v: String(notasBaixas.length), l: `abaixo de ${notaBR(aprovacao)}`, cor: notasBaixas.length ? RED : INK },
              ]} />
              <MiniBarras dados={comMedia.map((m) => ({ rotulo: abrevia(m.materia_nome), valor: Number(m.media) }))} max={10} linha={Number(aprovacao)} />
              {comMedia.length === 0 && <p className="mt-2 text-[12px]" style={{ color: INK_SOFT }}>Sem notas lançadas ainda.</p>}
            </CartaoCor>

            <CartaoCor cor="agua" titulo="Frequência" enfeite="coracao" onClick={() => abrir("frequencia")}>
              <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Rosca valor={freq} cor={freq !== null && freq < minimo ? RED : TEAL} />
                <div className="min-w-0 text-[12px] leading-snug" style={{ color: INK_SOFT }}>
                  <p>{b?.faltas_total ?? 0} faltas no ano</p>
                  <p className="font-semibold" style={{ color: INK }}>Mínimo {minimo}%{minimoProg ? ` (${aluno.programa_nome})` : ""}</p>
                </div>
              </div>
            </CartaoCor>

            <CartaoCor cor="verde" titulo="Tarefas" enfeite="circulo" onClick={() => abrir("tarefas")}>
              <Numeros itens={[
                { v: String(aFazer.length), l: "a fazer" },
                { v: String(atrasadas.length), l: "atrasadas", cor: atrasadas.length ? RED : INK },
              ]} />
            </CartaoCor>

            <CartaoCor cor="lilas" titulo="Alertas" enfeite="estrela" onClick={() => abrir(alertas[0]?.tela ?? "boletim")}>
              <Numeros itens={[{ v: String(alertas.length), l: alertas.length === 1 ? "precisa de atenção" : alertas.length ? "precisam de atenção" : "tudo em dia", cor: alertas.length ? RED : GREEN }]} />
            </CartaoCor>
          </div>

          <div className="mt-3 space-y-2">
            {alertas.length > 0 ? alertas.map((al) => (
              <button key={al.texto} onClick={() => abrir(al.tela)} className="lift flex w-full items-start gap-2.5 rounded-2xl bg-white px-3.5 py-3 text-left">
                <IconAlert size={17} className="mt-0.5 flex-none" style={{ color: al.cor }} />
                <span className="text-[12.5px] leading-snug" style={{ color: INK }}>{al.texto}</span>
              </button>
            )) : (
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 text-[12.5px]" style={{ color: INK }}>
                <IconCheck size={17} style={{ color: GREEN }} />Nenhum alerta. Está tudo em dia!
              </div>
            )}
          </div>
        </EstadoApi>
      )}
    </section>
  );
}
