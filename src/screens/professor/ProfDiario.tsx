/* Diário de classe: as aulas que o professor já registrou numa turma · matéria (as mais novas primeiro).
   Dá para corrigir o conteúdo e a quantidade de aulas (PATCH /api/aulas/ID/) ou apagar o registro (DELETE).
   Dados: GET /api/aulas/?turma=ID&materia=ID. A chamada em si é feita na tela Frequência. */

import { useState } from "react";
import { AvisoErro, CartaoForm, EstadoApi, Escolha, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconEdit, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api, type ErroApi } from "@/lib/api";
import { dataBR } from "@/lib/formato";
import type { Aula } from "@/lib/tipos";
import { CaixaTexto, ComTurmas, Confirmacao, SeletorTurma, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

const POR_PAGINA = 20;
const QUANTIDADES = [1, 2, 3, 4].map((q) => ({ valor: String(q), nome: q === 1 ? "1 aula" : `${q} aulas seguidas` }));

export function ProfDiario({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const turma = minhas.escolhida;
  const aulas = useApi<Aula[]>(turma ? `/api/aulas/?turma=${turma.turma}&materia=${turma.materia}` : null);
  const [mostrar, setMostrar] = useState(POR_PAGINA);
  const [editando, setEditando] = useState<{ id: number; conteudo: string; quantidade: string } | null>(null);
  const [salvo, setSalvo] = useState("");
  const [erroApagar, setErroApagar] = useState("");
  const envio = useEnvio(["conteudo", "quantidade"]);

  const lista = [...(aulas.dados ?? [])].sort((a, b) => b.data.localeCompare(a.data));
  // "Aulas dadas" soma as aulas seguidas: um registro de aula dupla conta 2.
  const totalAulas = lista.reduce((s, a) => s + a.quantidade, 0);
  const naUnidade = lista.filter((a) => a.unidade === turma?.unidade_atual).reduce((s, a) => s + a.quantidade, 0);

  const trocarTurma = (t: NonNullable<typeof turma>) => { minhas.escolher(t); setEditando(null); setMostrar(POR_PAGINA); setSalvo(""); };

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
              <div className="space-y-2.5">
                {lista.slice(0, mostrar).map((a) => editando?.id === a.id ? (
                  <CartaoForm key={a.id} titulo={`Aula de ${dataBR(a.data)}`} onSalvar={salvar} onCancelar={() => setEditando(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
                    <CaixaTexto label="Conteúdo da aula" value={editando.conteudo} onChange={(v) => setEditando({ ...editando, conteudo: v })} erro={envio.campos.conteudo} />
                    <Escolha label="Quantidade" value={editando.quantidade} onChange={(v) => setEditando({ ...editando, quantidade: v })} opcoes={QUANTIDADES} erro={envio.campos.quantidade} />
                  </CartaoForm>
                ) : (
                  <div key={a.id} className="card flex gap-3 p-3.5">
                    <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-center" style={{ background: VIOLET + "14", color: VIOLET }}><span className="text-[12px] font-extrabold leading-tight">{dataBR(a.data).slice(0, 5)}</span></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug" style={{ color: a.conteudo ? INK : INK_SOFT }}>{a.conteudo || "Sem conteúdo registrado"}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Pill color={VIOLET}>{a.unidade ?? "—"}ª unidade</Pill>
                        {a.quantidade > 1 && <Pill color={INK_SOFT}>{a.quantidade} aulas</Pill>}
                        <Pill color={a.presentes < a.total_alunos ? RED : INK_SOFT}>{a.presentes}/{a.total_alunos} presentes</Pill>
                      </div>
                    </div>
                    <div className="flex flex-none gap-1.5 self-start">
                      <button onClick={() => { envio.limpar(); setEditando({ id: a.id, conteudo: a.conteudo, quantidade: String(a.quantidade) }); }} aria-label={`Editar aula de ${dataBR(a.data)}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: VIOLET + "14", color: VIOLET }}><IconEdit size={15} /></button>
                      <button onClick={() => apagar(a)} aria-label={`Apagar aula de ${dataBR(a.data)}`} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: RED + "12", color: RED }}><IconX size={15} /></button>
                    </div>
                  </div>
                ))}
                {lista.length > mostrar && (
                  <button onClick={() => setMostrar(mostrar + POR_PAGINA)} className="w-full rounded-2xl bg-white py-3 text-[13px] font-semibold shadow-sm" style={{ color: VIOLET }}>
                    Mostrar mais ({lista.length - mostrar} restantes)
                  </button>
                )}
              </div>
            )}
          </EstadoApi>
        </ComTurmas>
      </Screen>
    </>
  );
}
