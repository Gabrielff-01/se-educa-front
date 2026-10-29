/* Diário de classe sucinto: uma linha por aula (data · conteúdo · presentes/total), separado por unidade.
   Tocar numa aula abre a edição: corrigir o conteúdo e a quantidade (PATCH /api/aulas/ID/) ou apagar (DELETE).
   Dados: GET /api/aulas/?turma=ID&materia=ID. A chamada em si é feita na tela Frequência. */

import { useState } from "react";
import { AvisoErro, CartaoForm, EstadoApi, Escolha, useEnvio } from "@/components/Form";
import { DiarioSucinto } from "@/components/DiarioSucinto";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { api, type ErroApi } from "@/lib/api";
import { dataBR } from "@/lib/formato";
import type { Aula } from "@/lib/tipos";
import { CaixaTexto, ComTurmas, Confirmacao, SeletorTurma, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

const QUANTIDADES = [1, 2, 3, 4].map((q) => ({ valor: String(q), nome: q === 1 ? "1 aula" : `${q} aulas seguidas` }));

export function ProfDiario({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const turma = minhas.escolhida;
  const aulas = useApi<Aula[]>(turma ? `/api/aulas/?turma=${turma.turma}&materia=${turma.materia}` : null);
  const [editando, setEditando] = useState<{ id: number; conteudo: string; quantidade: string } | null>(null);
  const [salvo, setSalvo] = useState("");
  const [erroApagar, setErroApagar] = useState("");
  const envio = useEnvio(["conteudo", "quantidade"]);

  const lista = aulas.dados ?? [];
  // "Aulas dadas" soma as aulas seguidas: um registro de aula dupla conta 2.
  const totalAulas = lista.reduce((s, a) => s + a.quantidade, 0);
  const naUnidade = lista.filter((a) => a.unidade === turma?.unidade_atual).reduce((s, a) => s + a.quantidade, 0);

  const trocarTurma = (t: NonNullable<typeof turma>) => { minhas.escolher(t); setEditando(null); setSalvo(""); };

  const salvar = () => envio.enviar(async () => {
    if (!editando) return;
    await api(`/api/aulas/${editando.id}/`, { method: "PATCH", body: { conteudo: editando.conteudo, quantidade: Number(editando.quantidade) } });
    setEditando(null);
    setSalvo("Registro atualizado!");
    aulas.recarregar();
  });

  const apagar = async (aula: Aula) => {
    if (!window.confirm(`Apagar a aula de ${dataBR(aula.data)}? A chamada desse dia também será apagada.`)) return;
    setErroApagar(""); setSalvo("");
    try {
      await api(`/api/aulas/${aula.id}/`, { method: "DELETE" });
      setEditando(null);
      setSalvo(`Aula de ${dataBR(aula.data)} apagada.`);
      aulas.recarregar();
      minhas.painel.recarregar();
    } catch (e) {
      setErroApagar((e as ErroApi).message);
    }
  };

  return (
    <>
      <TopBar title="Diário de classe" subtitle={turma ? nomeDe(turma) : "Aulas registradas"} onBack={back} accent={VIOLET} />
      <Screen>
        <ComTurmas minhas={minhas}>
          <SeletorTurma turmas={minhas.turmas} escolhida={turma} onEscolher={trocarTurma} cor={VIOLET} />
          <EstadoApi carregando={aulas.carregando} erro={aulas.erro} onRetry={aulas.recarregar}>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Aulas dadas no ano</p><p className="text-[22px] font-extrabold" style={{ color: VIOLET }}>{totalAulas}</p></div>
              <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Na {turma?.unidade_atual ?? "—"}ª unidade (atual)</p><p className="text-[22px] font-extrabold" style={{ color: VIOLET }}>{naUnidade}</p></div>
            </div>
            {turma && turma.aulas_sem_registro > 0 && (
              <p className="mt-2 text-[11.5px] font-semibold" style={{ color: RED }}>
                {turma.aulas_sem_registro} aula(s) da grade sem registro desde {dataBR(turma.sem_registro_desde)}. Registre na tela Frequência.
              </p>
            )}
            {salvo && <Confirmacao texto={salvo} />}
            {erroApagar && <div className="mt-3"><AvisoErro texto={erroApagar} /></div>}

            <SectionHeader title={`Registros · ${lista.length}`} />
            {lista.length === 0 ? (
              <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma aula registrada nesta turma ainda. A chamada feita na tela Frequência aparece aqui.</p>
            ) : (
              <DiarioSucinto
                aulas={lista}
                cor={VIOLET}
                unidadeAtual={turma?.unidade_atual}
                aberta={editando?.id ?? null}
                onTocar={(a) => {
                  envio.limpar(); setSalvo("");
                  setEditando(editando?.id === a.id ? null : { id: a.id, conteudo: a.conteudo, quantidade: String(a.quantidade) });
                }}
                detalhe={(a) => editando && (
                  <CartaoForm titulo={`Aula de ${dataBR(a.data)}`} onSalvar={salvar} onCancelar={() => setEditando(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
                    <CaixaTexto label="Conteúdo da aula" value={editando.conteudo} onChange={(v) => setEditando({ ...editando, conteudo: v })} erro={envio.campos.conteudo} />
                    <Escolha label="Quantidade" value={editando.quantidade} onChange={(v) => setEditando({ ...editando, quantidade: v })} opcoes={QUANTIDADES} erro={envio.campos.quantidade} />
                    <button onClick={() => apagar(a)} className="text-[12px] font-semibold" style={{ color: RED }}>Apagar esta aula</button>
                  </CartaoForm>
                )}
              />
            )}
            <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Toque numa aula para corrigir. O número à direita é presentes/total da chamada.</p>
          </EstadoApi>
        </ComTurmas>
      </Screen>
    </>
  );
}
