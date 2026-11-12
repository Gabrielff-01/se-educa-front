/* Início da Secretaria (DIES, DED e RH), no visual novo: cartões coloridos + coluna com calendário.
   Cada setor vê só o que é da sua função:
   - DIES: panorama da rede (/api/escolas/, /api/rede/matriculas/, /api/rede/frequencia/, atos em /api/atos/),
     pedidos das escolas (/api/solicitacoes/) e frequência por regional.
     (A matrícula pela internet é aprovada pela escola, não pelo DIES.)
   - DED: panorama das matrizes curriculares (/api/matrizes/, /api/ofertas/) e gestão pedagógica (ilustrativo).
   - RH: panorama dos professores (/api/rh/painel/).
   - Todos: calendário (/api/agenda/) e os atalhos do próprio setor.
   Sem setor (superusuário ou galeria de telas): mostra tudo. */

import { menuDoPerfil } from "@/components/BottomNav";
import {
  BarraHorizontal, BotoesTopo, CalendarioMini, CartaoCor, Esqueleto, LinhaDoTempo, LinhaLista, MiniBarras, Numeros, Pendencia, Rosca, Saudacao, TituloSecao, TopoCelular, proximasDatas,
} from "@/components/Painel";
import type { CorCartao, Enfeite } from "@/components/Painel";
import { Pill } from "@/components/Pill";
import { IconAlert, IconChat, IconChart, IconChevron, IconGrad, IconInbox, IconPin, IconShield, IconTrend, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { ANO_ATUAL, dataBR, porcentoBR } from "@/lib/formato";
import type { Ato, Escola, EventoAgenda, Matriz, Oferta, Pedido, Setor, Usuario } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, PERFIL } from "@/theme/colors";
import type { EscCtx } from "@/types";

type MatriculasRegional = { regional: number; regional_nome: string; escolas: number; confirmadas: number; em_analise: number; sem_turma: number };
type FreqRegional = { regional: number; regional_nome: string; atual: number | null; anterior: number | null };
type PainelRh = { professores: number; afastados_hoje: number; aulas_sem_professor: number; aulas_para_substituir: number };

const LIMITE_FREQ = 85; // mínimo do Bolsa Família: regional abaixo disso fica em vermelho
const numero = (n: number) => n.toLocaleString("pt-BR");
const curto = (regional: string) => regional.replace("DRE ", "");
const plural = (n: number, um: string, varios: string) => `${numero(n)} ${n === 1 ? um : varios}`;

/* Título de seção com a etiqueta "ilustrativo" (dados de exemplo, não vêm da API). */
function TituloIlustrativo({ titulo }: { titulo: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <h2 className="text-[16.5px] font-extrabold lg:text-[18px]" style={{ color: INK }}>{titulo}</h2>
      <Pill color={INK_SOFT}>ilustrativo</Pill>
    </div>
  );
}

export function SecretariaHome({ nav, abrirEscolas, usuario }: { nav: (s: ScreenId) => void; abrirEscolas: (c: EscCtx) => void; usuario: Usuario | null }) {
  // Quem tem setor vê só o seu. Sem login (galeria de telas) ou superusuário: mostra os três.
  const setores: Setor[] = usuario?.setor ? [usuario.setor] : ["dies", "ded", "rh"];
  const ve = (setor: Setor) => setores.includes(setor);
  // Cada setor só busca os números dele. useApi(null) = não busca nada (ex.: sem login).
  const busca = (setor: Setor, caminho: string) => (usuario && ve(setor) ? caminho : null);

  const escolas = useApi<Escola[]>(busca("dies", "/api/escolas/"));
  const matriculas = useApi<MatriculasRegional[]>(busca("dies", "/api/rede/matriculas/"));
  const frequencia = useApi<FreqRegional[]>(busca("dies", "/api/rede/frequencia/"));
  const pedidos = useApi<Pedido[]>(busca("dies", "/api/solicitacoes/?status=aberta"));
  const atos = useApi<Ato[]>(busca("dies", "/api/atos/"));
  const matrizes = useApi<Matriz[]>(busca("ded", "/api/matrizes/"));
  const ofertas = useApi<Oferta[]>(busca("ded", "/api/ofertas/"));
  const rh = useApi<PainelRh>(busca("rh", "/api/rh/painel/"));
  const agenda = useApi<EventoAgenda[]>(usuario ? `/api/agenda/?ano=${ANO_ATUAL}` : null);

  // ----- Números da DIES -----
  const regionais = matriculas.dados ?? [];
  const soma = (campo: "confirmadas" | "em_analise" | "sem_turma") => regionais.reduce((s, r) => s + r[campo], 0);
  const ativas = (escolas.dados ?? []).filter((e) => e.ativa).length;
  const comAulas = (frequencia.dados ?? []).filter((r) => r.atual !== null).sort((a, b) => (b.atual ?? 0) - (a.atual ?? 0));
  const semAulas = (frequencia.dados ?? []).filter((r) => r.atual === null);
  const mediaRede = comAulas.length ? comAulas.reduce((s, r) => s + (r.atual ?? 0), 0) / comAulas.length : null;
  const mediaAntes = comAulas.filter((r) => r.anterior !== null);
  const variacao = mediaRede !== null && mediaAntes.length ? mediaRede - mediaAntes.reduce((s, r) => s + (r.anterior ?? 0), 0) / mediaAntes.length : null;
  const abaixoLimite = comAulas.filter((r) => (r.atual ?? 0) < LIMITE_FREQ);
  const atosVencidos = (atos.dados ?? []).filter((a) => !a.vigente);
  const listaPedidos = [...(pedidos.dados ?? [])].sort((a, b) => b.atualizada_em.localeCompare(a.atualizada_em));
  const esperando = listaPedidos.filter((p) => p.ultima_fala === "escola");

  // ----- Números do DED -----
  const listaMatrizes = matrizes.dados ?? [];
  const abaixoMinimo = listaMatrizes.filter((m) => !m.cumpre_minimo);
  const escolasComOferta = new Set((ofertas.dados ?? []).filter((o) => o.ano_letivo === ANO_ATUAL).map((o) => o.escola)).size;

  // ----- Frase de resumo -----
  const partes: string[] = [];
  if (usuario?.setor_nome) partes.push(`Setor ${usuario.setor_nome}.`);
  const pend: string[] = [];
  if (ve("dies") && esperando.length) pend.push(`${plural(esperando.length, "pedido das escolas esperando", "pedidos das escolas esperando")} você`);
  if (ve("dies") && atosVencidos.length) pend.push(plural(atosVencidos.length, "ato autorizativo vencido", "atos autorizativos vencidos"));
  if (ve("ded") && abaixoMinimo.length) pend.push(plural(abaixoMinimo.length, "matriz abaixo do mínimo de horas", "matrizes abaixo do mínimo de horas"));
  if (ve("rh") && rh.dados?.aulas_sem_professor) pend.push(`${numero(rh.dados.aulas_sem_professor)} aulas por semana sem professor`);
  partes.push(pend.length ? `Tem ${pend.join(" e ")}.` : usuario ? "Nada urgente esperando por você agora." : "Entre com dies1, ded1 ou rh1 para ver os números.");

  // ----- Calendário: próximas datas (a partir de hoje) -----
  const eventos = agenda.dados ?? [];
  const proximas = proximasDatas(eventos, () => nav(ve("dies") ? "diesCalendario" : "calendario"));

  // ----- Cartões coloridos de cada setor -----
  type Cartao = { cor: CorCartao; titulo: string; enfeite: Enfeite; ir: () => void; conteudo: React.ReactNode };
  const carregandoDies = escolas.carregando || matriculas.carregando || atos.carregando || frequencia.carregando;
  const cartoesDies: Cartao[] = [
    { cor: "azul", titulo: "Escolas", enfeite: "losango", ir: () => nav("diesEscolas"), conteudo: (
      <>
        <Numeros itens={[{ v: numero(ativas), l: "ativas" }, { v: numero(regionais.filter((r) => r.escolas > 0).length), l: "regionais com escola" }]} />
        <MiniBarras dados={regionais.map((r) => ({ rotulo: curto(r.regional_nome), valor: r.escolas }))} max={Math.max(1, ...regionais.map((r) => r.escolas))} />
      </>
    ) },
    { cor: "agua", titulo: "Matrículas", enfeite: "coracao", ir: () => nav("secMatriculas"), conteudo: (
      <>
        <Numeros itens={[{ v: numero(soma("confirmadas")), l: "confirmadas" }, { v: numero(soma("em_analise")), l: "em análise" }, { v: numero(soma("sem_turma")), l: "sem turma", cor: soma("sem_turma") ? RED : INK }]} />
        <MiniBarras dados={regionais.map((r) => ({ rotulo: curto(r.regional_nome), valor: r.confirmadas }))} max={Math.max(1, ...regionais.map((r) => r.confirmadas))} cor={TEAL} />
      </>
    ) },
    { cor: "verde", titulo: "Frequência da rede", enfeite: "circulo", ir: () => nav("diesMunicipios"), conteudo: (
      <div className="mt-2 flex items-center gap-3">
        <Rosca valor={mediaRede} />
        <div className="min-w-0 text-[12px] leading-snug" style={{ color: INK_SOFT }}>
          <p>Últimos 30 dias</p>
          {variacao !== null && <p className="font-bold" style={{ color: variacao >= 0 ? GREEN : RED }}>{variacao >= 0 ? "▲" : "▼"} {Math.abs(variacao).toFixed(1).replace(".", ",")} ponto no mês</p>}
          <p className="font-semibold" style={{ color: abaixoLimite.length ? RED : INK }}>{abaixoLimite.length ? `${plural(abaixoLimite.length, "regional", "regionais")} abaixo de ${LIMITE_FREQ}%` : `Todas acima de ${LIMITE_FREQ}%`}</p>
        </div>
      </div>
    ) },
    { cor: "lilas", titulo: "Atos autorizativos", enfeite: "estrela", ir: () => nav("diesAtos"), conteudo: (
      <Numeros itens={[{ v: numero(atosVencidos.length), l: "vencidos", cor: atosVencidos.length ? RED : INK }, { v: numero((atos.dados ?? []).length - atosVencidos.length), l: "vigentes" }]} />
    ) },
  ];
  const cartoesDed: Cartao[] = [
    { cor: "azul", titulo: "Oferta de séries", enfeite: "losango", ir: () => nav("dedOfertas"), conteudo: <Numeros itens={[{ v: numero(escolasComOferta), l: `escolas com oferta em ${ANO_ATUAL}` }]} /> },
    { cor: "agua", titulo: "Matrizes curriculares", enfeite: "coracao", ir: () => nav("dedMatrizes"), conteudo: <Numeros itens={[{ v: numero(listaMatrizes.filter((m) => m.escola === null).length), l: "da rede" }, { v: numero(listaMatrizes.filter((m) => m.escola !== null).length), l: "próprias de escolas" }]} /> },
    { cor: "verde", titulo: "Dentro do mínimo", enfeite: "circulo", ir: () => nav("dedMatrizes"), conteudo: (
      <div className="mt-2 flex items-center gap-3"><Rosca valor={listaMatrizes.length ? ((listaMatrizes.length - abaixoMinimo.length) / listaMatrizes.length) * 100 : null} /><p className="text-[12px]" style={{ color: INK_SOFT }}>das matrizes fecham a carga horária mínima do curso</p></div>
    ) },
    { cor: "lilas", titulo: "Abaixo do mínimo", enfeite: "estrela", ir: () => nav("dedMatrizes"), conteudo: <Numeros itens={[{ v: numero(abaixoMinimo.length), l: abaixoMinimo.length === 1 ? "matriz precisa de ajuste" : "matrizes precisam de ajuste", cor: abaixoMinimo.length ? RED : INK }]} /> },
  ];
  const cartoesRh: Cartao[] = rh.dados ? [
    { cor: "azul", titulo: "Professores", enfeite: "losango", ir: () => nav("rhProfessores"), conteudo: <Numeros itens={[{ v: numero(rh.dados.professores), l: "ativos na rede" }]} /> },
    { cor: "agua", titulo: "Afastados hoje", enfeite: "coracao", ir: () => nav("rhAfastamentos"), conteudo: <Numeros itens={[{ v: numero(rh.dados.afastados_hoje), l: "licenças e afastamentos", cor: rh.dados.afastados_hoje ? AMBER : INK }]} /> },
    { cor: "verde", titulo: "Aulas sem professor", enfeite: "circulo", ir: () => nav("rhCarencias"), conteudo: <Numeros itens={[{ v: numero(rh.dados.aulas_sem_professor), l: "aulas por semana", cor: rh.dados.aulas_sem_professor ? RED : INK }]} /> },
    { cor: "lilas", titulo: "Para substituir", enfeite: "estrela", ir: () => nav("rhCarencias"), conteudo: <Numeros itens={[{ v: numero(rh.dados.aulas_para_substituir), l: "aulas por semana de afastados" }]} /> },
  ] : [];

  const blocos: { setor: Setor; titulo: string; carregando: boolean; cartoes: Cartao[] }[] = [
    { setor: "dies", titulo: "Panorama da rede", carregando: carregandoDies, cartoes: cartoesDies },
    { setor: "ded", titulo: "Panorama da regulação", carregando: matrizes.carregando || ofertas.carregando, cartoes: cartoesDed },
    { setor: "rh", titulo: "Panorama dos professores", carregando: rh.carregando, cartoes: cartoesRh },
  ].filter((b) => ve(b.setor as Setor)) as { setor: Setor; titulo: string; carregando: boolean; cartoes: Cartao[] }[];

  // Atalhos do setor (no celular não tem menu lateral, então eles aparecem aqui embaixo)
  const gruposSetor = menuDoPerfil("secretaria", usuario?.setor ?? "").grupos.slice(1);

  const nome = usuario?.nome.split(" ")[0] ?? "gestor";
  const iniciais = (usuario?.nome ?? "Secretaria").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("");

  return (
    <div className="scroll-area animate-in flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-5">
        {/* ================= Coluna principal ================= */}
        <div className="flex min-w-0 flex-col gap-5">
          <TopoCelular nav={nav} iniciais={iniciais} />
          <div>
            <Saudacao nome={nome} resumo={partes.join(" ")} />
            {usuario && (
              <div className="mt-3 flex flex-wrap gap-2">
                {ve("dies") && <Pendencia texto="Pedidos esperando" n={esperando.length} cor={RED} ir={() => nav("diesPedidos")} />}
                {ve("dies") && <Pendencia texto="Atos vencidos" n={atosVencidos.length} cor={RED} ir={() => nav("diesAtos")} />}
                {ve("dies") && <Pendencia texto="Alunos sem turma" n={soma("sem_turma")} cor={AMBER} ir={() => nav("secEnturmacao")} />}
                {ve("ded") && <Pendencia texto="Matrizes abaixo do mínimo" n={abaixoMinimo.length} cor={RED} ir={() => nav("dedMatrizes")} />}
                {ve("rh") && <Pendencia texto="Aulas sem professor" n={rh.dados?.aulas_sem_professor ?? 0} cor={RED} ir={() => nav("rhCarencias")} />}
                {ve("rh") && <Pendencia texto="Afastados hoje" n={rh.dados?.afastados_hoje ?? 0} cor={AMBER} ir={() => nav("rhAfastamentos")} />}
              </div>
            )}
          </div>

          {/* Cartões coloridos de cada setor */}
          {blocos.map((b) => (
            <section key={b.setor}>
              {blocos.length > 1 && <TituloSecao titulo={b.titulo} />}
              {!usuario ? (
                <p className="rounded-2xl bg-white p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Entre com dies1, ded1 ou rh1 para ver os números.</p>
              ) : b.carregando ? (
                <div className="grid grid-cols-2 gap-3 lg:gap-4">{[0, 1, 2, 3].map((i) => <Esqueleto key={i} altura={150} />)}</div>
              ) : b.cartoes.length === 0 ? (
                <p className="rounded-2xl bg-white p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Não consegui buscar os números agora.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr] lg:gap-4">
                  {b.cartoes.map((c) => <CartaoCor key={c.titulo} cor={c.cor} titulo={c.titulo} enfeite={c.enfeite} onClick={c.ir}>{c.conteudo}</CartaoCor>)}
                </div>
              )}
            </section>
          ))}

          {/* DIES: pedidos das escolas + frequência por regional */}
          {ve("dies") && usuario && (
            <div className="grid gap-5 md:grid-cols-2">
              <section className="min-w-0">
                <TituloSecao titulo="Pedidos das escolas" acao="Ver todos" onAcao={() => nav("diesPedidos")} />
                {pedidos.carregando ? <Esqueleto altura={160} />
                  : listaPedidos.length === 0 ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum pedido aberto.</p>
                  : (
                    <div className="space-y-2">
                      {listaPedidos.slice(0, 4).map((p) => (
                        <LinhaLista key={p.id} Icon={p.tipo === "nova_turma" ? IconGrad : p.tipo === "capacidade" ? IconUsers : IconInbox} titulo={p.titulo} detalhe={p.escola_nome}
                          etiqueta={p.ultima_fala === "escola" ? "responder" : "com a escola"} destaque={p === esperando[0]} onClick={() => nav("diesPedidos")} />
                      ))}
                    </div>
                  )}
              </section>
              <section className="min-w-0">
                <TituloSecao titulo="Frequência por regional" acao="Regionais" onAcao={() => nav("diesMunicipios")} />
                {frequencia.carregando ? <Esqueleto altura={160} /> : (
                  <div className="space-y-2.5 rounded-[20px] bg-white p-4">
                    {comAulas.length === 0 && <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma regional com aulas registradas nos últimos 30 dias.</p>}
                    {comAulas.map((r) => <BarraHorizontal key={r.regional} rotulo={r.regional_nome} valor={r.atual} texto={porcentoBR(r.atual)} min={50} limite={LIMITE_FREQ} />)}
                    {comAulas.length > 0 && <p className="pt-1 text-[11px]" style={{ color: INK_SOFT }}>Traço escuro = {LIMITE_FREQ}%, mínimo do Bolsa Família. Eixo começa em 50%.</p>}
                    {semAulas.length > 0 && <p className="text-[11px]" style={{ color: INK_SOFT }}>Sem aulas registradas: {semAulas.map((r) => r.regional_nome).join(", ")}.</p>}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* DED: matrizes que precisam de ajuste + gestão pedagógica (exemplo) */}
          {ve("ded") && usuario && (
            <div className="grid gap-5 md:grid-cols-2">
              <section className="min-w-0">
                <TituloSecao titulo="Matrizes abaixo do mínimo" acao="Ver matrizes" onAcao={() => nav("dedMatrizes")} />
                {matrizes.carregando ? <Esqueleto altura={140} />
                  : abaixoMinimo.length === 0 ? <p className="rounded-2xl bg-white p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Todas as matrizes fecham a carga horária mínima.</p>
                  : <div className="space-y-2">{abaixoMinimo.slice(0, 4).map((m) => <LinhaLista key={m.id} Icon={IconAlert} corIcone={RED} titulo={`${m.serie_nome} · ${m.ano_letivo}`} detalhe={m.escola_nome ?? "Matriz da rede"} etiqueta="ajustar" onClick={() => nav("dedMatrizes")} />)}</div>}
              </section>
              <section className="min-w-0">
                <TituloIlustrativo titulo="Gestão pedagógica" />
                <div className="space-y-2">
                  {[{ t: "IDEB da rede", v: "5,8", d: "Meta 6,0 · +0,3 no ano", c: GREEN }, { t: "Alfabetização (2º ano)", v: "81%", d: "no nível adequado", c: BLUE }, { t: "Distorção idade-série", v: "9,4%", d: "-1,2 p.p.", c: AMBER }].map((i) => (
                    <div key={i.t} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                      <div className="grid h-11 w-11 flex-none place-items-center rounded-xl text-[13.5px] font-extrabold" style={{ background: i.c + "18", color: i.c }}>{i.v}</div>
                      <div className="min-w-0 flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{i.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{i.d}</p></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Atalhos do setor: no celular (sem menu lateral) */}
          <section className="md:hidden">
            {gruposSetor.map((g) => (
              <div key={g.titulo} className="mb-4">
                <TituloSecao titulo={g.titulo} />
                <div className="grid grid-cols-3 gap-2.5">
                  {g.itens.map((i) => (
                    <button key={i.s} onClick={() => nav(i.s)} className="lift flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1.5 py-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: BLUE + "16", color: BLUE }}><i.Icon size={19} /></span>
                      <span className="text-center text-[11px] font-semibold leading-tight" style={{ color: INK }}>{i.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Histórico + módulos que ainda são de exemplo */}
          <section>
            <button onClick={() => nav("historicoAlteracoes")} className="lift flex w-full items-center gap-3 rounded-[20px] bg-white p-3.5 text-left">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl" style={{ background: "#6366f118", color: "#6366f1" }}><IconShield size={20} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14px] font-bold" style={{ color: INK }}>Histórico de alterações</span><span className="block text-[12px]" style={{ color: INK_SOFT }}>Tudo que foi cadastrado, editado ou apagado e por quem</span></span>
              <IconChevron size={18} style={{ color: "#cbd5e1" }} />
            </button>
          </section>
          <section>
            <TituloIlustrativo titulo="Outros módulos" />
            <div className="flex flex-wrap gap-2.5">
              {[
                { t: "Pedagógico", Icon: IconGrad, setor: "ded" as Setor, ir: () => nav("secPedagogico") },
                { t: "Regional", Icon: IconChat, setor: "dies" as Setor, ir: () => nav("secRegional") },
                { t: "Pesquisas", Icon: IconTrend, setor: "dies" as Setor, ir: () => nav("secPesquisas") },
                { t: "Mapa das escolas", Icon: IconPin, setor: "dies" as Setor, ir: () => abrirEscolas("todas") },
                { t: "Carga horária", Icon: IconChart, setor: "rh" as Setor, ir: () => nav("secCargaHoraria") },
              ].filter((m) => ve(m.setor)).map((m) => (
                <button key={m.t} onClick={m.ir} className="lift flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: AMBER + "18", color: AMBER }}><m.Icon size={17} /></span>
                  <span className="text-[12.5px] font-semibold" style={{ color: INK }}>{m.t}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* ================= Coluna da direita (só no computador) ================= */}
        <aside className="hidden min-w-0 flex-col gap-4 lg:flex">
          <BotoesTopo nav={nav} />
          <CalendarioMini eventos={eventos} />
          <button onClick={() => nav(ve("dies") ? "diesCalendario" : "calendario")} className="rounded-full py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-110" style={{ background: PERFIL }}>{ve("dies") ? "Calendário letivo da rede" : "Ver calendário"}</button>
          <p className="mt-1 text-[18px] font-extrabold" style={{ color: INK }}>Próximas datas</p>
          <LinhaDoTempo itens={proximas} vazio={agenda.carregando ? "Buscando o calendário..." : "Nenhuma data marcada daqui pra frente."} />
        </aside>
      </div>
    </div>
  );
}
