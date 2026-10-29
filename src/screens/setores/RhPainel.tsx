/* RH — Painel: o retrato do quadro de professores.
   Dados: GET /api/rh/painel/ -> total de professores ativos, 20h/40h, efetivos/temporários,
   afastados hoje, quem está perto do limite de 2/3 em sala, quem ainda não foi alocado em escola,
   aulas da matriz sem professor e aulas de professor afastado (precisam de substituto). */

import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconCalendar, IconChevron, IconUser, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

type PainelRh = {
  professores: number;
  carga_20h: number;
  carga_40h: number;
  efetivos: number;
  temporarios: number;
  afastados_hoje: number;
  perto_do_limite: { nome: string; aulas: number; limite: number }[];
  sem_escola: string[];
  aulas_sem_professor: number;
  aulas_para_substituir: number;
};

export function RhPainel({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const painel = useApi<PainelRh>("/api/rh/painel/");
  const p = painel.dados;
  const atalhos: { t: string; d: string; Icon: (p: IconProps) => React.ReactElement; s: ScreenId; cor: string }[] = [
    { t: "Professores", d: "Cadastro e acesso", Icon: IconUser, s: "rhProfessores", cor: GREEN },
    { t: "Alocação", d: "Em qual escola cada um trabalha", Icon: IconUsers, s: "rhLotacoes", cor: BLUE },
    { t: "Carências", d: "Aulas sem professor", Icon: IconAlert, s: "rhCarencias", cor: RED },
    { t: "Afastamentos", d: "Licenças", Icon: IconCalendar, s: "rhAfastamentos", cor: VIOLET },
  ];

  return (
    <>
      <TopBar title="Painel do RH" subtitle="Quadro de professores da rede" onBack={back} accent={GREEN} />
      <Screen>
        <EstadoApi carregando={painel.carregando} erro={painel.erro} onRetry={painel.recarregar}>
          {p && (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="card p-4"><div className="text-[23px] font-extrabold" style={{ color: GREEN }}>{p.professores}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>Professores ativos</div><p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{p.carga_40h} de 40h · {p.carga_20h} de 20h</p></div>
                <div className="card p-4"><div className="text-[23px] font-extrabold" style={{ color: TEAL }}>{p.efetivos}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>Efetivos</div><p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{p.temporarios} {p.temporarios === 1 ? "temporário" : "temporários"}</p></div>
                <button onClick={() => nav("rhAfastamentos")} className="card flex flex-col p-4 text-left active:scale-[0.98] transition">
                  <div className="flex w-full items-start justify-between"><div className="text-[23px] font-extrabold" style={{ color: VIOLET }}>{p.afastados_hoje}</div><IconChevron size={16} style={{ color: "#cbd5e1" }} /></div>
                  <div className="text-[12px]" style={{ color: INK_SOFT }}>Afastados hoje</div>
                </button>
                <button onClick={() => nav("rhCarencias")} className="card flex flex-col p-4 text-left active:scale-[0.98] transition" style={{ outline: p.aulas_sem_professor + p.aulas_para_substituir ? `2px solid ${RED}2a` : undefined }}>
                  <div className="flex w-full items-start justify-between"><div className="text-[23px] font-extrabold" style={{ color: RED }}>{p.aulas_sem_professor + p.aulas_para_substituir}</div><IconChevron size={16} style={{ color: "#cbd5e1" }} /></div>
                  <div className="text-[12px]" style={{ color: INK_SOFT }}>Aulas/semana descobertas</div>
                  <p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{p.aulas_sem_professor} sem professor · {p.aulas_para_substituir} p/ substituir</p>
                </button>
              </div>

              <SectionHeader title="Atalhos" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {atalhos.map((a) => (
                  <button key={a.s} onClick={() => nav(a.s)} className="card flex items-center gap-3 p-3.5 text-left active:scale-[0.98] transition">
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: a.cor + "16", color: a.cor }}><a.Icon size={20} /></div>
                    <div className="min-w-0"><p className="text-[13px] font-bold leading-tight" style={{ color: INK }}>{a.t}</p><p className="text-[11px] leading-tight" style={{ color: INK_SOFT }}>{a.d}</p></div>
                  </button>
                ))}
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-4">
                <div>
                  <SectionHeader title="Perto do limite de 2/3" />
                  <div className="card divide-y">
                    {p.perto_do_limite.length === 0 && <p className="px-4 py-3 text-[12.5px]" style={{ color: INK_SOFT }}>Ninguém com 80% ou mais das aulas permitidas.</p>}
                    {p.perto_do_limite.map((x) => {
                      const cor = x.aulas >= x.limite ? RED : AMBER;
                      return (
                        <div key={x.nome} className="flex items-center gap-3 px-4 py-2.5" style={{ borderColor: "#eef2f7" }}>
                          <p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold" style={{ color: INK }}>{x.nome}</p>
                          <Pill color={cor}>{x.aulas} de {x.limite} aulas</Pill>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>Pela Lei 11.738/2008, no máximo 2/3 da carga é em sala de aula.</p>
                </div>
                <div>
                  <SectionHeader title="Sem escola" action={p.sem_escola.length ? "Alocar" : undefined} onAction={() => nav("rhLotacoes")} />
                  <div className="card divide-y">
                    {p.sem_escola.length === 0 && <p className="px-4 py-3 text-[12.5px]" style={{ color: INK_SOFT }}>Todos os professores ativos estão alocados em uma escola.</p>}
                    {p.sem_escola.map((nome) => (
                      <div key={nome} className="flex items-center gap-3 px-4 py-2.5" style={{ borderColor: "#eef2f7" }}>
                        <p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold" style={{ color: INK }}>{nome}</p>
                        <Pill color={AMBER}>Sem escola</Pill>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
