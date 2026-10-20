/* Histórico escolar: todos os anos do aluno na rede (ano, série, escola, média e situação).
   Dados: /api/historico/ (o responsável escolhe o filho no topo).
   O ano em andamento aparece como "Cursando", com a média parcial calculada pelas notas. */

import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconShield, IconUser } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { dataBR, notaBR } from "@/lib/formato";
import type { Historico } from "@/lib/tipos";
import { corDaSituacao } from "@/screens/aluno/Boletim";
import { INDIGO, INK, INK_SOFT } from "@/theme/colors";

export function HistoricoEscolar({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const historico = useApi<Historico>(comAluno("/api/historico/"));
  const h = historico.dados;

  return (
    <>
      <TopBar title="Histórico escolar" subtitle={h?.aluno.nome ?? atual?.nome} onBack={back} accent={INDIGO} />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={INDIGO} />
        <EstadoApi carregando={filhos.carregando || historico.carregando} erro={filhos.erro ?? historico.erro} onRetry={historico.recarregar}>
          {!atual || !h ? (
            <EmptyState title="Nenhum aluno" text="Não há aluno ligado a este usuário." icon={<IconUser size={26} />} />
          ) : (
            <>
              <div className="card flex items-center gap-3 p-4">
                <Avatar name={h.aluno.nome} color={INDIGO} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{h.aluno.nome}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Código {h.aluno.codigo} · Nascimento {dataBR(h.aluno.data_nascimento)}</p>
                </div>
              </div>
              <SectionHeader title="Trajetória escolar" />
              {h.anos.length === 0 ? (
                <EmptyState title="Sem anos registrados" text="Ainda não há matrícula deste aluno na rede." icon={<IconBook size={26} />} />
              ) : (
                <div className="relative space-y-3 pl-5">
                  <span className="absolute bottom-3 left-[5px] top-3 w-0.5" style={{ background: "#e2e8f0" }} />
                  {h.anos.map((ano) => {
                    const cor = corDaSituacao(ano.situacao);
                    return (
                      <div key={`${ano.ano_letivo}-${ano.serie_nome}`} className="relative card p-3.5">
                        <span className="absolute -left-[17px] top-5 h-3 w-3 rounded-full border-2 border-white" style={{ background: cor }} />
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold" style={{ color: INK }}>{ano.serie_nome} · {ano.ano_letivo}</p>
                            <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{ano.escola_nome}</p>
                          </div>
                          <div className="flex-none text-right">
                            <p className="text-[18px] font-extrabold" style={{ color: cor }}>{notaBR(ano.media)}</p>
                            <Pill color={cor}>{ano.situacao}</Pill>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: INDIGO + "0d" }}>
                <IconShield size={18} className="mt-0.5 flex-none" style={{ color: INDIGO }} />
                <p className="text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>O ano em andamento mostra a média parcial (das notas já lançadas). O documento oficial do histórico é pedido na secretaria da escola.</p>
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
