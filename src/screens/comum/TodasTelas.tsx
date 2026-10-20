import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconChevron } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { BLUE, INK } from "@/theme/colors";

export const GALLERY: { grupo: string; itens: { id: ScreenId; label: string }[] }[] = [
  { grupo: "Acesso", itens: [{ id: "splash", label: "Splash" }, { id: "login", label: "Login" }, { id: "cadastro", label: "Cadastro" }] },
  { grupo: "Aluno", itens: [{ id: "alunoHome", label: "Home" }, { id: "notas", label: "Notas" }, { id: "frequencia", label: "Frequência" }, { id: "horarios", label: "Horários" }, { id: "boletim", label: "Boletim" }, { id: "historico", label: "Histórico Escolar" }, { id: "tarefas", label: "Tarefas" }, { id: "mapaEstudos", label: "Locais de estudo" }, { id: "transporte", label: "Transporte Escolar" }, { id: "merenda", label: "Merenda Escolar" }, { id: "calendario", label: "Calendário + Olimpíadas" }, { id: "biblioteca", label: "Biblioteca Virtual" }] },
  { grupo: "Responsável", itens: [{ id: "responsavelHome", label: "Home" }] },
  { grupo: "Serviços", itens: [{ id: "matricula", label: "Matrícula" }, { id: "escolas", label: "Escolas (lista e mapa)" }, { id: "acompanhamento", label: "Acompanhamento" }, { id: "secretariaVirtual", label: "Secretaria Virtual" }] },
  { grupo: "Comum", itens: [{ id: "notificacoes", label: "Notificações" }, { id: "comunicados", label: "Comunicados" }, { id: "perfil", label: "Perfil" }, { id: "configuracoes", label: "Configurações" }, { id: "calendario", label: "Calendário" }, { id: "chat", label: "Chat" }, { id: "historicoAlteracoes", label: "Histórico de alterações" }] },
  { grupo: "Professor", itens: [{ id: "professorHome", label: "Home" }, { id: "profNotas", label: "Lançar notas" }, { id: "profFrequencia", label: "Frequência" }, { id: "profDiario", label: "Diário de classe" }, { id: "profPlanejamento", label: "Planejamento" }] },
  { grupo: "Administração", itens: [{ id: "escolaHome", label: "Home Escola" }, { id: "admAlunos", label: "Alunos e responsáveis" }, { id: "escPedidos", label: "Pedidos à DIES" }, { id: "admMatriculas", label: "Matrículas" }, { id: "admTurmas", label: "Turmas/Cursos" }, { id: "admProfessores", label: "Professores" }, { id: "admHorarios", label: "Horários" }, { id: "admDiario", label: "Supervisão diário" }, { id: "admBoletins", label: "Boletins" }, { id: "gestorFreqSocial", label: "Freq. programas sociais" }, { id: "gestorPendencias", label: "Pendências professores" }] },
  { grupo: "Secretaria", itens: [{ id: "secretariaHome", label: "Home Secretaria" }, { id: "secMatriculas", label: "Matrículas da rede" }, { id: "secEnturmacao", label: "Enturmação" }, { id: "secPedagogico", label: "Gestão pedagógica" }, { id: "secCargaHoraria", label: "Carga horária" }, { id: "secRegional", label: "Contato Regional" }, { id: "secPesquisas", label: "Pesquisas recentes" }] },
  { grupo: "Setores da Secretaria", itens: [{ id: "diesEscolas", label: "DIES · Escolas" }, { id: "diesTurmas", label: "DIES · Turmas" }, { id: "diesCursos", label: "DIES · Cursos e matérias" }, { id: "diesCalendario", label: "DIES · Calendário letivo" }, { id: "diesPedidos", label: "DIES · Pedidos das escolas" }, { id: "dedAtos", label: "DED · Atos autorizativos" }, { id: "dedOfertas", label: "DED · Oferta de séries" }, { id: "dedMatrizes", label: "DED · Matrizes curriculares" }, { id: "rhPainel", label: "RH · Painel" }, { id: "rhProfessores", label: "RH · Professores" }, { id: "rhLotacoes", label: "RH · Lotação" }, { id: "rhCarencias", label: "RH · Carências" }, { id: "rhAfastamentos", label: "RH · Afastamentos" }] },
];

export const TOTAL_TELAS = new Set(GALLERY.flatMap((g) => g.itens.map((i) => i.id))).size;

export function TodasTelas({ back, abrir }: { back: () => void; abrir: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Todas as telas" subtitle={`${TOTAL_TELAS} telas · entre com um login para ver os dados`} onBack={back} accent={BLUE} />
      <Screen>
        {GALLERY.map((g) => (
          <div key={g.grupo}>
            <SectionHeader title={g.grupo} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {g.itens.map((it) => (
                <button key={g.grupo + it.id} onClick={() => abrir(it.id)} className="card flex items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold transition active:scale-[0.98]" style={{ color: INK }}>
                  {it.label}
                  <IconChevron size={16} style={{ color: "#cbd5e1" }} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </Screen>
    </>
  );
}
