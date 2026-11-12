/* Menu principal do app (responsivo):
   - Computador (lg): menu lateral azul com a logo, o cartão do perfil e as telas em grupos ("Geral", "Serviços"...).
   - Tablet (md): a mesma coluna azul, só com os ícones (o nome aparece ao passar o mouse).
   - Celular: barra branca embaixo com 4 atalhos + Perfil.

   Os itens mudam conforme o perfil (aluno, responsável, professor, escola, secretaria)
   e, na Secretaria, conforme o setor (DIES, DED ou RH). Ver menuDoPerfil() lá embaixo. */

import {
  IconAlert, IconBell, IconBook, IconBus, IconCalendar, IconChart, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood,
  IconGear, IconGrad, IconGrid, IconHome, IconInbox, IconLayers, IconLogout, IconPin, IconRoute, IconSchool, IconSend, IconShield,
  IconStar, IconTrophy, IconUser, IconUsers,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";
import type { Setor, Usuario } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { INK_SOFT, PERFIL, PERFIL_CLARA, PERFIL_ESCURA, RED } from "@/theme/colors";
import type { Perfil } from "@/types";

type Icone = (p: IconProps) => React.ReactElement;
export type ItemMenu = { s: ScreenId; label: string; Icon: Icone };
type Grupo = { titulo: string; itens: ItemMenu[] };

const NOME_PERFIL: Record<Perfil, string> = { aluno: "Aluno", responsavel: "Responsável", professor: "Professor", escola: "Escola", secretaria: "Secretaria" };

/* Telas de cada setor da Secretaria */
const SETORES: Record<Setor, Grupo> = {
  dies: { titulo: "DIES · Rede", itens: [
    { s: "diesEscolas", label: "Escolas", Icon: IconSchool },
    { s: "diesTurmas", label: "Turmas", Icon: IconUsers },
    { s: "diesCursos", label: "Cursos e matérias", Icon: IconBook },
    { s: "diesCalendario", label: "Calendário letivo", Icon: IconCalendar },
    { s: "diesPedidos", label: "Pedidos das escolas", Icon: IconInbox },
    { s: "diesAtos", label: "Atos autorizativos", Icon: IconDoc },
    { s: "diesMunicipios", label: "Regionais e municípios", Icon: IconPin },
    { s: "secEnturmacao", label: "Enturmação", Icon: IconLayers },
    { s: "secMatriculas", label: "Matrículas", Icon: IconEdit },
  ] },
  ded: { titulo: "DED · Regulação", itens: [
    { s: "dedOfertas", label: "Oferta de séries", Icon: IconLayers },
    { s: "dedMatrizes", label: "Matrizes curriculares", Icon: IconClock },
  ] },
  rh: { titulo: "RH · Professores", itens: [
    { s: "rhPainel", label: "Painel do RH", Icon: IconChart },
    { s: "rhProfessores", label: "Professores", Icon: IconUser },
    { s: "rhLotacoes", label: "Alocação nas escolas", Icon: IconUsers },
    { s: "rhCarencias", label: "Carências", Icon: IconAlert },
    { s: "rhAfastamentos", label: "Afastamentos", Icon: IconCalendar },
    { s: "secCargaHoraria", label: "Carga horária", Icon: IconClock },
  ] },
};

/* grupos = menu lateral (computador/tablet); barra = 4 atalhos da barra do celular (o Perfil entra sozinho no fim). */
export function menuDoPerfil(perfil: Perfil, setor: Setor | ""): { grupos: Grupo[]; barra: ItemMenu[] } {
  const inicio: ItemMenu = { s: perfil === "aluno" ? "alunoHome" : perfil === "responsavel" ? "responsavelHome" : perfil === "professor" ? "professorHome" : perfil === "escola" ? "escolaHome" : "secretariaHome", label: "Início", Icon: IconHome };
  const calendario: ItemMenu = { s: "calendario", label: "Calendário", Icon: IconCalendar };
  const comunicados: ItemMenu = { s: "comunicados", label: "Comunicados", Icon: IconChat };

  if (perfil === "aluno" || perfil === "responsavel") {
    const notas: ItemMenu = perfil === "aluno" ? { s: "notas", label: "Notas", Icon: IconStar } : { s: "boletim", label: "Boletim", Icon: IconStar };
    const servicos: ItemMenu = { s: "secretariaVirtual", label: "Secretaria Virtual", Icon: IconGrid };
    return {
      grupos: [
        { titulo: "Geral", itens: [inicio, notas, { s: "frequencia", label: "Frequência", Icon: IconCheck }, { s: "horarios", label: "Horários", Icon: IconClock }, { s: "tarefas", label: "Tarefas", Icon: IconEdit }, calendario, comunicados] },
        { titulo: "Serviços", itens: [{ s: "transporte", label: "Transporte", Icon: IconBus }, { s: "merenda", label: "Merenda", Icon: IconFood }, { s: "olimpiadas", label: "Olimpíadas", Icon: IconTrophy }, { s: "documentos", label: "Enviar documentos", Icon: IconSend }, servicos] },
      ],
      barra: [inicio, notas, { ...calendario, label: "Agenda" }, { ...servicos, label: "Serviços" }],
    };
  }
  if (perfil === "professor") {
    const diario: ItemMenu = { s: "profDiario", label: "Diário de classe", Icon: IconBook };
    const notas: ItemMenu = { s: "profNotas", label: "Notas", Icon: IconStar };
    return {
      grupos: [
        { titulo: "Geral", itens: [inicio, diario, { s: "profFrequencia", label: "Frequência", Icon: IconCheck }, notas, { s: "profPlanejamento", label: "Planejamento", Icon: IconClock }, { s: "tarefas", label: "Tarefas", Icon: IconEdit }] },
        { titulo: "Escola", itens: [calendario, comunicados] },
      ],
      barra: [inicio, { ...diario, label: "Diário" }, notas, { ...calendario, label: "Agenda" }],
    };
  }
  if (perfil === "escola") {
    const alunos: ItemMenu = { s: "admAlunos", label: "Alunos e responsáveis", Icon: IconUsers };
    const matriculas: ItemMenu = { s: "admMatriculas", label: "Matrículas", Icon: IconEdit };
    const pedidos: ItemMenu = { s: "escPedidos", label: "Pedidos à DIES", Icon: IconInbox };
    return {
      grupos: [
        { titulo: "Secretaria escolar", itens: [inicio, alunos, matriculas, { s: "escInscricoes", label: "Inscrições pela internet", Icon: IconSend }, { s: "admTurmas", label: "Turmas", Icon: IconLayers }, { s: "admProfessores", label: "Professores e funções", Icon: IconUser }, { s: "admHorarios", label: "Horários", Icon: IconClock }] },
        { titulo: "Pedagógico", itens: [{ s: "admDiario", label: "Diário de classe", Icon: IconBook }, { s: "admBoletins", label: "Boletins", Icon: IconStar }, { s: "escDocumentos", label: "Documentos recebidos", Icon: IconDoc }, { s: "escOlimpiadas", label: "Olimpíadas", Icon: IconTrophy }] },
        { titulo: "Escola", itens: [pedidos, { s: "escRotas", label: "Rotas do transporte", Icon: IconRoute }, calendario, comunicados] },
      ],
      barra: [inicio, { ...alunos, label: "Alunos" }, matriculas, { ...pedidos, label: "Pedidos" }],
    };
  }
  // Secretaria: só as telas do setor de quem entrou (sem setor = superusuário ou galeria: todos)
  const setores: Setor[] = setor ? [setor] : ["dies", "ded", "rh"];
  const doSetor = setores.map((x) => SETORES[x]);
  const primeiros = doSetor.flatMap((g) => g.itens).slice(0, 3);
  return {
    grupos: [
      { titulo: "Geral", itens: [inicio, { s: "escolas", label: "Escolas da rede", Icon: IconGrad }, comunicados, { s: "historicoAlteracoes", label: "Histórico de alterações", Icon: IconShield }] },
      ...doSetor,
    ],
    barra: [inicio, ...primeiros.map((i) => ({ ...i, label: i.label.split(" ")[0] }))],
  };
}

export function BottomNav({ perfil, usuario, screen, nav, badge = 0, onSair }: {
  perfil: Perfil; usuario: Usuario | null; screen: ScreenId; nav: (s: ScreenId) => void; badge?: number; onSair: () => void;
}) {
  const setor = usuario?.setor ?? "";
  const { grupos, barra } = menuDoPerfil(perfil, setor);
  const nomePerfil = perfil === "secretaria" && usuario?.setor_nome ? `Secretaria · ${usuario.setor_nome}` : NOME_PERFIL[perfil];
  const perfilItem: ItemMenu = { s: "perfil", label: "Perfil", Icon: IconUser };

  return (
    <>
      {/* ===== Computador e tablet: coluna à esquerda, na cor do perfil ===== */}
      <nav aria-label="Menu principal" className="order-first hidden flex-none flex-col p-3 md:flex md:w-[84px] lg:w-[250px]">
        <div className="flex min-h-0 flex-1 flex-col rounded-[24px] px-2.5 py-5 text-white lg:px-3" style={{ background: `linear-gradient(180deg, ${PERFIL}, ${PERFIL_ESCURA})` }}>
          {/* Logo */}
          <div className="mb-4 flex items-center justify-center gap-2.5 lg:justify-start lg:px-2">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.35), #0891b2)" }}><IconGrad size={22} strokeWidth={2} /></div>
            <p className="hidden text-[19px] font-extrabold tracking-tight lg:block">SE Educa</p>
          </div>

          {/* Cartão do perfil (abre "Meu perfil") */}
          <button onClick={() => nav("perfil")} title="Meu perfil" className="mb-3 flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 p-2 text-left transition hover:bg-white/15 lg:justify-start lg:px-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/20"><IconUser size={18} /></span>
            <span className="hidden min-w-0 leading-tight lg:block">
              <span className="block truncate text-[13.5px] font-bold">{usuario?.nome.split(" ")[0] ?? "Visitante"}</span>
              <span className="block truncate text-[11.5px] text-white/75">Perfil {nomePerfil}</span>
            </span>
          </button>

          {/* Telas do perfil, em grupos */}
          <div className="scroll-area -mx-1 min-h-0 flex-1 overflow-y-auto px-1">
            {grupos.map((g) => (
              <div key={g.titulo} className="mb-2">
                <p className="mb-1 mt-3 hidden px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55 lg:block">{g.titulo}</p>
                <div className="hidden h-px bg-white/15 md:my-2 md:block lg:hidden" />
                {g.itens.map((i) => <ItemLateral key={i.s + i.label} item={i} ativo={screen === i.s} nav={nav} />)}
              </div>
            ))}
          </div>

          {/* Rodapé do menu */}
          <div className="mt-2 border-t border-white/15 pt-2">
            <ItemLateral item={{ s: "notificacoes", label: "Notificações", Icon: IconBell }} ativo={screen === "notificacoes"} nav={nav} badge={badge} />
            <ItemLateral item={{ s: "configuracoes", label: "Configurações", Icon: IconGear }} ativo={screen === "configuracoes"} nav={nav} />
            <button onClick={onSair} title="Sair" className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-white/85 transition hover:bg-white/10 lg:justify-start">
              <IconLogout size={20} /><span className="hidden lg:inline">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Celular: barra branca embaixo ===== */}
      <nav aria-label="Menu" style={{ gridTemplateColumns: `repeat(${barra.length + 1}, minmax(0, 1fr))` }} className="grid flex-none border-t border-[color:var(--color-line)] bg-white px-1.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
        {[...barra, perfilItem].map((i) => {
          const on = screen === i.s;
          return (
            <button key={i.s + i.label} onClick={() => nav(i.s)} className="flex flex-col items-center gap-1 transition active:scale-95" style={{ color: on ? PERFIL_ESCURA : INK_SOFT }}>
              <span className="grid h-8 w-14 place-items-center rounded-full transition" style={{ background: on ? PERFIL_CLARA : "transparent" }}><i.Icon size={21} strokeWidth={on ? 2.2 : 1.8} /></span>
              <span className="max-w-full truncate text-[10.5px] font-bold leading-none">{i.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

/* Um item do menu lateral. No tablet só o ícone (o nome vai no title, aparece ao passar o mouse). */
function ItemLateral({ item, ativo, nav, badge = 0 }: { item: ItemMenu; ativo: boolean; nav: (s: ScreenId) => void; badge?: number }) {
  return (
    <button onClick={() => nav(item.s)} title={item.label} aria-current={ativo ? "page" : undefined}
      className={`relative flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition lg:justify-start ${ativo ? "bg-white font-bold shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]" : "font-medium text-white/85 hover:bg-white/10"}`}
      style={ativo ? { color: PERFIL_ESCURA } : undefined}>
      <span className="relative flex-none">
        <item.Icon size={20} strokeWidth={ativo ? 2.2 : 1.8} />
        {badge > 0 && <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: RED }}>{badge > 99 ? "99+" : badge}</span>}
      </span>
      <span className="hidden truncate lg:inline">{item.label}</span>
    </button>
  );
}
