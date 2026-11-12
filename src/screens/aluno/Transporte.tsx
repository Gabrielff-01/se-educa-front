/* Aluno e responsável — Transporte escolar.
   Mostra a rota que a ESCOLA cadastrou para o aluno: turno, veículo, motorista, a parada onde ele
   embarca e o horário de cada parada (antes era uma tela ilustrativa, com dados inventados).
   Dados: GET /api/rotas/minha/?aluno=ID */

import { EstadoApi } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconBus, IconClock, IconPin } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataBR, horaCurta } from "@/lib/formato";
import type { MinhaRota } from "@/lib/tipos";
import { LinhaDoTempo } from "@/screens/escola/EscRotas";
import { GREEN, INK, INK_SOFT } from "@/theme/colors";

export function Transporte({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const minha = useApi<MinhaRota>(comAluno("/api/rotas/minha/"));
  const dados = minha.dados;
  const rota = dados?.rota;
  const parada = rota?.paradas.find((p) => p.id === dados?.parada);
  const primeiroNome = (dados?.aluno.nome ?? atual?.nome ?? "").split(" ")[0];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Transporte escolar" subtitle={dados?.escola_nome ?? "Rota cadastrada pela escola"} onBack={back} accent={GREEN} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={GREEN} />
        <EstadoApi carregando={filhos.carregando || minha.carregando} erro={filhos.erro || minha.erro} onRetry={() => { filhos.recarregar(); minha.recarregar(); }}>
          {!rota ? (
            <EmptyState title={`${primeiroNome || "O aluno"} não usa o transporte escolar`} text="Quem cadastra as rotas e coloca os alunos nelas é a escola. Se precisar do transporte, peça na secretaria da escola." icon={<IconBus size={26} />} />
          ) : (
            <>
              <div className="card overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-white" style={{ background: GREEN }}><IconBus size={24} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold leading-tight" style={{ color: INK }}>{rota.nome}</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Turno {rota.turno_nome.toLowerCase()} · {rota.veiculo_nome}</p>
                    {!rota.ativa && <div className="mt-1"><Pill color="#ef4444">Rota suspensa pela escola</Pill></div>}
                  </div>
                </div>
                {parada && (
                  <div className="flex items-center gap-3 border-t px-4 py-3" style={{ borderColor: "#eef2f7", background: GREEN + "0c" }}>
                    <IconPin size={20} style={{ color: GREEN }} className="flex-none" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>{usuario?.perfil === "aluno" ? "Você embarca em" : primeiroNome ? `${primeiroNome} embarca em` : "Embarque"}</p>
                      <p className="text-[13.5px] font-bold" style={{ color: INK }}>{parada.local}</p>
                      {parada.referencia && <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{parada.referencia}</p>}
                    </div>
                    <div className="text-right"><p className="text-[22px] font-extrabold leading-none" style={{ color: GREEN }}>{horaCurta(parada.horario)}</p><p className="text-[10px]" style={{ color: INK_SOFT }}>horário</p></div>
                  </div>
                )}
                <div className="grid grid-cols-3 border-t text-center text-[11px]" style={{ borderColor: "#eef2f7", color: INK_SOFT }}>
                  <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>{rota.placa || "—"}</p>Placa</div>
                  <div className="border-x py-2.5" style={{ borderColor: "#eef2f7" }}><p className="truncate px-1 text-[13px] font-bold" style={{ color: INK }}>{rota.motorista ? rota.motorista.split(" ").slice(0, 2).join(" ") : "—"}</p>Motorista</div>
                  <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>{rota.ocupados}/{rota.capacidade}</p>Lugares</div>
                </div>
              </div>

              {rota.telefone && (
                <a href={`tel:${rota.telefone.replace(/\D/g, "")}`} className="card mt-3 flex items-center gap-3 p-3.5" style={{ color: INK }}>
                  <IconClock size={18} style={{ color: GREEN }} />
                  <span className="flex-1 text-[12.5px]">Atrasou? Ligue para o motorista: <b>{rota.telefone}</b></span>
                </a>
              )}

              <SectionHeader title="Paradas e horários" />
              <div className="card p-4"><LinhaDoTempo paradas={rota.paradas} destaque={dados?.parada} /></div>
              {rota.observacao && <p className="card mt-3 p-3.5 text-[12.5px]" style={{ color: INK }}>{rota.observacao}</p>}
              <p className="mt-3 text-center text-[11px]" style={{ color: INK_SOFT }}>Rota cadastrada pela escola {rota.escola_nome} · atualizada em {dataBR(rota.atualizada_em.slice(0, 10))}</p>
            </>
          )}
        </EstadoApi>
      </Screen>
    </div>
  );
}
