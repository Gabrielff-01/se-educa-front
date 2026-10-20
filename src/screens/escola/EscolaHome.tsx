/* Início da gestão da escola: números do ano, ocupação das turmas e atalhos.
   Dados: GET /api/painel/escola/ (a escola é a do usuário logado). */

import { EstadoApi } from "@/components/Form";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBook, IconChat, IconCheck, IconClock, IconEdit, IconFood, IconGrid, IconPin, IconShield, IconUser, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { porcentoBR } from "@/lib/formato";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, PINK, RED, TEAL, VIOLET } from "@/theme/colors";

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

const ATALHOS: { t: string; Icon: typeof IconEdit; c: string; s: ScreenId }[] = [
  { t: "Matrículas", Icon: IconEdit, c: AMBER, s: "admMatriculas" },
  { t: "Alunos e responsáveis", Icon: IconUser, c: BLUE, s: "admAlunos" },
  { t: "Turmas", Icon: IconGrid, c: GREEN, s: "admTurmas" },
  { t: "Pedidos à DIES", Icon: IconChat, c: BLUE, s: "escPedidos" },
  { t: "Professores", Icon: IconUsers, c: TEAL, s: "admProfessores" },
  { t: "Horários", Icon: IconClock, c: BLUE, s: "admHorarios" },
  { t: "Diário", Icon: IconCheck, c: VIOLET, s: "admDiario" },
  { t: "Boletins", Icon: IconBook, c: PINK, s: "admBoletins" },
  { t: "Freq. programas", Icon: IconShield, c: GREEN, s: "gestorFreqSocial" },
  { t: "Pendências", Icon: IconAlert, c: RED, s: "gestorPendencias" },
  { t: "Escolas", Icon: IconPin, c: RED, s: "escolas" },
  { t: "Merenda", Icon: IconFood, c: AMBER, s: "merenda" },
];

export function EscolaHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const painel = useApi<PainelEscola>("/api/painel/escola/");
  const p = painel.dados;
  const ind = p?.indicadores;
  const sub = p ? `${p.escola.nome} · INEP ${p.escola.inep}` : usuario?.escola_nome ?? "Gestão da escola";
  // Total de lugares = alunos nas turmas + vagas (serve de "100%" nas barras de matrícula).
  const lugares = ind ? Math.max(ind.alunos + ind.vagas, ind.alunos + ind.em_analise + ind.aguardando_turma, 1) : 1;

  return (
    <>
      <ProfileHeader nome={usuario?.nome ?? "Gestão da escola"} sub={sub} cor={GREEN} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <EstadoApi carregando={painel.carregando} erro={painel.erro} onRetry={painel.recarregar}>
          {p && ind && (
            <>
              <SectionHeader title={`Indicadores · ${p.ano_letivo}`} />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { n: String(ind.alunos), l: "Alunos matriculados", c: BLUE, sub: `confirmados · ${ind.em_analise} em análise` },
                  { n: String(ind.professores), l: "Professores", c: TEAL, sub: "lotados nas turmas" },
                  { n: String(ind.turmas), l: "Turmas", c: GREEN, sub: `${ind.vagas} vagas livres` },
                  { n: porcentoBR(ind.frequencia_30_dias), l: "Frequência", c: AMBER, sub: "últimos 30 dias" },
                ].map((k) => (
                  <div key={k.l} className="card p-4"><div className="text-[24px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[12px] font-medium" style={{ color: INK }}>{k.l}</div><div className="text-[11px]" style={{ color: INK_SOFT }}>{k.sub}</div></div>
                ))}
              </div>

              <SectionHeader title="Matrículas por status" action="Abrir" onAction={() => nav("admMatriculas")} />
              <div className="card p-4">
                {[
                  { l: "Confirmadas", v: ind.alunos, c: GREEN },
                  { l: "Em análise", v: ind.em_analise, c: AMBER },
                  { l: "Aguardando turma", v: ind.aguardando_turma, c: RED },
                  { l: "Vagas restantes", v: ind.vagas, c: BLUE },
                ].map((b) => (
                  <div key={b.l} className="mb-3 last:mb-0">
                    <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: INK }}>{b.l}</span><span className="font-bold" style={{ color: b.c }}>{b.v}</span></div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min((b.v / lugares) * 100, 100)}%`, background: b.c }} /></div>
                  </div>
                ))}
              </div>

              <SectionHeader title="Gestão" />
              <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
                {ATALHOS.map((a) => (
                  <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 px-1 py-4 text-center transition active:scale-95">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
                    <span className="text-[11px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
                  </button>
                ))}
              </div>

              <SectionHeader title="Turmas" action="Ver todas" onAction={() => nav("admTurmas")} />
              {p.turmas.length === 0 ? (
                <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>A escola ainda não tem turmas neste ano. Quem cria as turmas é a DIES: peça em "Pedidos à DIES".</p>
              ) : (
                <div className="grid gap-2.5 lg:grid-cols-2">
                  {p.turmas.map((t) => {
                    const ocupacao = t.capacidade ? Math.round((t.alunos / t.capacidade) * 100) : 0;
                    const cobertura = t.aulas_previstas ? Math.round((t.aulas_com_professor / t.aulas_previstas) * 100) : 0;
                    return (
                      <div key={t.id} className="card p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[14px] font-bold" style={{ color: INK }}>{t.nome}</p>
                          <span className="text-[11px]" style={{ color: INK_SOFT }}>{t.turno_nome} · {t.sala}</span>
                        </div>
                        <Barra rotulo="Alunos" valor={`${t.alunos}/${t.capacidade}`} pct={ocupacao} cor={ocupacao >= 95 ? AMBER : GREEN} />
                        <Barra rotulo="Aulas com professor" valor={`${t.aulas_com_professor}/${t.aulas_previstas} por semana`} pct={cobertura} cor={cobertura >= 100 ? GREEN : cobertura >= 60 ? AMBER : RED} />
                        <p className="mt-1.5 text-[10.5px]" style={{ color: INK_SOFT }}>{t.professores} professor(es) lotado(s){cobertura < 100 && t.aulas_previstas > 0 ? " · faltam professores pela matriz" : ""}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </EstadoApi>
      </div>
    </>
  );
}

function Barra({ rotulo, valor, pct, cor }: { rotulo: string; valor: string; pct: number; cor: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-[11px]"><span style={{ color: INK_SOFT }}>{rotulo}</span><span className="font-bold" style={{ color: INK }}>{valor}</span></div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: cor }} /></div>
    </div>
  );
}
