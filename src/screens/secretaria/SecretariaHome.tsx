/* Início da Secretaria (DIES, DED e RH). Cada setor vê só o que é da sua função:
   - DIES: panorama da rede (/api/escolas/, /api/rede/matriculas/, pedidos das escolas em /api/solicitacoes/), matrículas, enturmação e frequência por regional.
   - DED: panorama da regulação (/api/atos/, /api/matrizes/) e gestão pedagógica (ilustrativo).
   - RH: panorama dos professores (/api/rh/painel/) e carga horária das escolas.
   - Todos: os módulos do próprio setor + Histórico de alterações.
   Sem setor (superusuário ou galeria de telas): mostra tudo. */

import { ProfileHeader } from "@/components/ProfileHeader";
import { Pill } from "@/components/Pill";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBook, IconCalendar, IconChart, IconChat, IconChevron, IconClock, IconDoc, IconEdit, IconGrad, IconGrid, IconLayers, IconPin, IconShield, IconTrend, IconUser, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import type { Ato, Escola, Matriz, Pedido, Setor, Usuario } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { FreqRegioes } from "@/screens/secretaria/FreqRegioes";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";
import type { EscCtx } from "@/types";

type MatriculasRegional = { regional: number; escolas: number; confirmadas: number; em_analise: number; sem_turma: number; vagas: number };
type PainelRh = { professores: number; afastados_hoje: number; aulas_sem_professor: number; aulas_para_substituir: number };
/* Um cartão de número do panorama. n = null quando a API não respondeu (o cartão some). */
type Cartao = { n: string | null; l: string; c: string; ir?: () => void };

/* Telas de cada setor. Elas usam a API de verdade (cadastros no Django). */
const MODULOS_SETOR: Record<Setor, { titulo: string; cor: string; itens: { t: string; d: string; Icon: (p: IconProps) => React.ReactElement; s: ScreenId }[] }> = {
  dies: { titulo: "DIES · Rede e calendário", cor: BLUE, itens: [
    { t: "Escolas", d: "Cadastro e código INEP", Icon: IconGrid, s: "diesEscolas" },
    { t: "Turmas", d: "Turmas de cada escola", Icon: IconUsers, s: "diesTurmas" },
    { t: "Cursos e matérias", d: "Séries e componentes", Icon: IconBook, s: "diesCursos" },
    { t: "Calendário letivo", d: "200 dias, feriados e férias", Icon: IconCalendar, s: "diesCalendario" },
    { t: "Pedidos das escolas", d: "Turmas novas e capacidade", Icon: IconChat, s: "diesPedidos" },
  ] },
  ded: { titulo: "DED · Regulação", cor: VIOLET, itens: [
    { t: "Atos autorizativos", d: "Credenciamento e reconhecimento", Icon: IconDoc, s: "dedAtos" },
    { t: "Oferta de séries", d: "O que cada escola oferece", Icon: IconLayers, s: "dedOfertas" },
    { t: "Matrizes curriculares", d: "Carga horária por matéria", Icon: IconClock, s: "dedMatrizes" },
  ] },
  rh: { titulo: "RH · Professores", cor: GREEN, itens: [
    { t: "Painel do RH", d: "Quadro, limites e carências", Icon: IconChart, s: "rhPainel" },
    { t: "Professores", d: "Matrícula, CPF e carga", Icon: IconUser, s: "rhProfessores" },
    { t: "Lotação", d: "Quem dá aula em qual turma", Icon: IconUsers, s: "rhLotacoes" },
    { t: "Carências", d: "Aulas sem professor", Icon: IconAlert, s: "rhCarencias" },
    { t: "Afastamentos", d: "Licenças e substituições", Icon: IconCalendar, s: "rhAfastamentos" },
  ] },
};

/* Título de seção com a etiqueta "ilustrativo" (dados de exemplo, não vêm da API). */
function TituloIlustrativo({ titulo }: { titulo: string }) {
  return (
    <div className="mb-2.5 mt-5 flex items-center justify-between gap-2">
      <h2 className="text-[15px] font-bold" style={{ color: INK }}>{titulo}</h2>
      <Pill color={INK_SOFT}>ilustrativo</Pill>
    </div>
  );
}

/* Botão de atalho com ícone e texto (usado em várias seções). */
function Atalho({ titulo, descricao, Icon, cor, ir }: { titulo: string; descricao: string; Icon: (p: IconProps) => React.ReactElement; cor: string; ir: () => void }) {
  return (
    <button onClick={ir} className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.98] transition">
      <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={21} /></div>
      <div className="min-w-0 flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{descricao}</p></div>
      <IconChevron size={18} style={{ color: "#cbd5e1" }} />
    </button>
  );
}

const numero = (n: number) => n.toLocaleString("pt-BR");

export function SecretariaHome({ nav, abrirEscolas, usuario }: { nav: (s: ScreenId) => void; abrirEscolas: (c: EscCtx) => void; usuario: Usuario | null }) {
  // Quem tem setor vê só o seu. Sem login (galeria de telas) ou superusuário: mostra os três.
  const setores: Setor[] = usuario?.setor ? [usuario.setor] : ["dies", "ded", "rh"];
  const ve = (setor: Setor) => setores.includes(setor);
  // Cada setor só busca os números dele. useApi(null) = não busca nada (ex.: sem login).
  const busca = (setor: Setor, caminho: string) => (usuario && ve(setor) ? caminho : null);

  const escolas = useApi<Escola[]>(busca("dies", "/api/escolas/"));
  const matriculas = useApi<MatriculasRegional[]>(busca("dies", "/api/rede/matriculas/"));
  const pedidos = useApi<Pedido[]>(busca("dies", "/api/solicitacoes/?status=aberta"));
  const semResposta = (pedidos.dados ?? []).filter((p) => p.ultima_fala === "escola").length;
  const atos = useApi<Ato[]>(busca("ded", "/api/atos/"));
  const matrizes = useApi<Matriz[]>(busca("ded", "/api/matrizes/"));
  const rh = useApi<PainelRh>(busca("rh", "/api/rh/painel/"));

  const soma = (campo: "confirmadas" | "vagas" | "sem_turma") => (matriculas.dados ? numero(matriculas.dados.reduce((s, r) => s + r[campo], 0)) : null);
  const conta = <T,>(lista: T[] | null, filtro: (x: T) => boolean) => (lista ? numero(lista.filter(filtro).length) : null);

  // Um panorama por setor. Cada número só aparece se a API respondeu (nada de número inventado).
  const paineis: { setor: Setor; titulo: string; carregando: boolean; cartoes: Cartao[] }[] = [
    { setor: "dies", titulo: "Panorama da rede", carregando: escolas.carregando || matriculas.carregando, cartoes: [
      { n: conta(escolas.dados, (e) => e.ativa), l: "Escolas ativas", c: BLUE, ir: () => nav("diesEscolas") },
      { n: soma("confirmadas"), l: "Alunos matriculados", c: TEAL, ir: () => nav("secMatriculas") },
      { n: soma("vagas"), l: "Vagas abertas", c: AMBER, ir: () => nav("secMatriculas") },
      { n: soma("sem_turma"), l: "Alunos aguardando turma", c: RED, ir: () => nav("secEnturmacao") },
    ] },
    { setor: "ded", titulo: "Panorama da regulação", carregando: atos.carregando || matrizes.carregando, cartoes: [
      { n: conta(atos.dados, (a) => a.vigente), l: "Atos vigentes", c: VIOLET, ir: () => nav("dedAtos") },
      { n: conta(atos.dados, (a) => !a.vigente), l: "Atos vencidos", c: RED, ir: () => nav("dedAtos") },
      { n: conta(matrizes.dados, () => true), l: "Matrizes curriculares", c: BLUE, ir: () => nav("dedMatrizes") },
      { n: conta(matrizes.dados, (m) => !m.cumpre_minimo), l: "Matrizes abaixo do mínimo", c: AMBER, ir: () => nav("dedMatrizes") },
    ] },
    { setor: "rh", titulo: "Panorama dos professores", carregando: rh.carregando, cartoes: [
      { n: rh.dados ? numero(rh.dados.professores) : null, l: "Professores ativos", c: GREEN, ir: () => nav("rhProfessores") },
      { n: rh.dados ? numero(rh.dados.afastados_hoje) : null, l: "Afastados hoje", c: AMBER, ir: () => nav("rhAfastamentos") },
      { n: rh.dados ? numero(rh.dados.aulas_sem_professor) : null, l: "Aulas/semana sem professor", c: RED, ir: () => nav("rhCarencias") },
      { n: rh.dados ? numero(rh.dados.aulas_para_substituir) : null, l: "Aulas/semana para substituir", c: VIOLET, ir: () => nav("rhCarencias") },
    ] },
  ];

  // Módulos que ainda são de exemplo, cada um com o setor a que pertence.
  const outrosModulos = [
    { t: "Pedagógico", Icon: IconGrad, setor: "ded" as Setor, ir: () => nav("secPedagogico") },
    { t: "Regional", Icon: IconChat, setor: "dies" as Setor, ir: () => nav("secRegional") },
    { t: "Pesquisas", Icon: IconTrend, setor: "dies" as Setor, ir: () => nav("secPesquisas") },
    { t: "Mapa", Icon: IconPin, setor: "dies" as Setor, ir: () => abrirEscolas("todas") },
  ].filter((m) => ve(m.setor));

  return (
    <>
      <ProfileHeader nome={usuario?.nome ?? "Gestor Rafael Andrade"} sub={usuario?.setor ? `SEDUC · Setor ${usuario.setor_nome}` : "Secretaria de Estado da Educação"} cor={AMBER} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        {setores.map((setor) => {
          const m = MODULOS_SETOR[setor];
          return (
            <div key={setor}>
              <SectionHeader title={m.titulo} />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {m.itens.map((i) => (
                  <button key={i.s} onClick={() => nav(i.s)} className="card flex items-center gap-3 p-3.5 text-left active:scale-[0.98] transition">
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: m.cor + "16", color: m.cor }}><i.Icon size={20} /></div>
                    <div className="min-w-0"><p className="text-[13px] font-bold leading-tight" style={{ color: INK }}>{i.t}</p><p className="text-[11px] leading-tight" style={{ color: INK_SOFT }}>{i.d}</p></div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <Atalho titulo="Histórico de alterações" descricao="Tudo que foi cadastrado, editado ou apagado e por quem" Icon={IconShield} cor={INDIGO} ir={() => nav("historicoAlteracoes")} />

        {paineis.filter((p) => ve(p.setor)).map((p) => {
          const cartoes = p.cartoes.filter((k) => k.n !== null);
          return (
            <div key={p.setor}>
              <SectionHeader title={p.titulo} />
              {!usuario ? (
                <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Entre com dies1, ded1 ou rh1 para ver os números.</p>
              ) : p.carregando ? (
                <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Buscando os números...</p>
              ) : cartoes.length === 0 ? (
                <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Não consegui buscar os números agora.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {cartoes.map((k) => (
                    <button key={k.l} onClick={k.ir} disabled={!k.ir} className="card p-4 text-left active:scale-[0.98] transition disabled:active:scale-100">
                      <div className="flex items-start justify-between"><div className="text-[23px] font-extrabold" style={{ color: k.c }}>{k.n}</div>{k.ir && <IconChevron size={16} style={{ color: "#cbd5e1" }} />}</div>
                      <div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {ve("dies") && (
          <>
            {usuario && pedidos.dados && (
              <Atalho titulo="Pedidos das escolas" descricao={semResposta ? `${semResposta} ${semResposta === 1 ? "pedido esperando" : "pedidos esperando"} sua resposta` : "Nenhum pedido esperando resposta"} Icon={IconChat} cor={semResposta ? RED : INDIGO} ir={() => nav("diesPedidos")} />
            )}
            <SectionHeader title="Matrículas e turmas" />
            <div className="grid grid-cols-2 gap-3">
              {[{ t: "Matrículas", Icon: IconEdit, s: "secMatriculas" as ScreenId }, { t: "Enturmação", Icon: IconUsers, s: "secEnturmacao" as ScreenId }].map((a) => (
                <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: TEAL + "16", color: TEAL }}><a.Icon size={20} /></div>
                  <span className="text-[11px] font-semibold" style={{ color: INK }}>{a.t}</span>
                </button>
              ))}
            </div>

            <div className="mb-2.5 mt-5 flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-bold" style={{ color: INK }}>Frequência por regional</h2>
              <span className="text-[12px]" style={{ color: INK_SOFT }}>Últimos 30 dias</span>
            </div>
            {usuario ? <FreqRegioes /> : <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Entre para ver a frequência das regionais.</p>}
          </>
        )}

        {/* Carga horária = aulas que a matriz pede × aulas que já têm professor: é a falta de professor, assunto do RH. */}
        {ve("rh") && (
          <Atalho titulo="Carga horária das escolas" descricao="Aulas previstas na matriz × aulas que têm professor" Icon={IconClock} cor={TEAL} ir={() => nav("secCargaHoraria")} />
        )}

        {/* Daqui pra baixo: ainda são dados de exemplo do protótipo (não vêm da API). */}
        {ve("ded") && (
          <>
            <TituloIlustrativo titulo="Gestão pedagógica" />
            <p className="-mt-1 mb-2.5 text-[11.5px]" style={{ color: INK_SOFT }}>Exemplos do protótipo: estes números ainda não vêm do sistema.</p>
            <div className="space-y-2.5">
              {[{ t: "IDEB da rede", v: "5,8", d: "Meta 6,0 · +0,3 no ano", c: GREEN }, { t: "Alfabetização (2º ano)", v: "81%", d: "no nível adequado", c: BLUE }, { t: "Distorção idade-série", v: "9,4%", d: "-1,2 p.p.", c: AMBER }].map((i) => (
                <div key={i.t} className="card flex items-center gap-3 p-3.5 opacity-90">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-[15px] font-extrabold" style={{ background: i.c + "16", color: i.c }}>{i.v}</div>
                  <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{i.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{i.d}</p></div>
                  <IconChart size={20} style={{ color: i.c }} />
                </div>
              ))}
            </div>
          </>
        )}

        {ve("dies") && (
          <>
            <TituloIlustrativo titulo="Procura por vagas" />
            <button onClick={() => nav("secPesquisas")} className="card flex w-full items-center gap-3 p-3.5 text-left" style={{ outline: `2px solid ${RED}2a` }}>
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: RED + "14", color: RED }}><IconTrend size={21} /></div>
              <div className="flex-1"><p className="text-[13px] font-bold" style={{ color: INK }}>+62% em buscas por vagas especiais</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Pesquisas recentes (exemplo) · ver análise</p></div>
              <IconChevron size={18} style={{ color: "#cbd5e1" }} />
            </button>
          </>
        )}

        {outrosModulos.length > 0 && (
          <>
            <TituloIlustrativo titulo="Outros módulos" />
            <div className="grid grid-cols-4 gap-3">
              {outrosModulos.map((a) => (
                <button key={a.t} onClick={a.ir} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: AMBER + "16", color: AMBER }}><a.Icon size={20} /></div>
                  <span className="text-[10.5px] font-semibold" style={{ color: INK }}>{a.t}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
