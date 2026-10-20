/* Frequência (chamada): o professor escolhe turma · matéria e o dia, marca quem faltou e salva.
   Se a aula daquele dia já foi registrada (GET /api/aulas/?turma&materia&data), ela abre para editar (PATCH);
   senão, uma aula nova é criada (POST /api/aulas/). Todos começam presentes; "faltas" = ids das matrículas. */

import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvisoErro, Entrada, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR, hojeISO } from "@/lib/formato";
import type { Aula, Matricula } from "@/lib/tipos";
import { CaixaTexto, ComTurmas, Confirmacao, SeletorTurma, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function ProfFrequencia({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const turma = minhas.escolhida;
  const [data, setData] = useState(hojeISO());

  const alunos = useApi<Matricula[]>(turma ? `/api/matriculas/?turma=${turma.turma}&situacao=confirmada` : null);
  const aulasDoDia = useApi<Aula[]>(turma && data ? `/api/aulas/?turma=${turma.turma}&materia=${turma.materia}&data=${data}` : null);
  const existente = aulasDoDia.dados?.[0] ?? null; // só pode haver uma aula por turma, matéria e dia

  const [faltas, setFaltas] = useState<number[]>([]);
  const [conteudo, setConteudo] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [salvo, setSalvo] = useState("");
  const envio = useEnvio(["conteudo", "quantidade"]); // erro da data (dia não letivo, futuro...) vai para o aviso

  // Mudou a turma ou o dia: carrega a chamada que já existe, ou começa uma em branco (todos presentes).
  useEffect(() => {
    setFaltas(existente?.faltosos ?? []);
    setConteudo(existente?.conteudo ?? "");
    setQuantidade(existente?.quantidade ?? 1);
    envio.limpar();
  }, [aulasDoDia.dados]);

  const lista = [...(alunos.dados ?? [])].sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome));
  const faltaram = lista.filter((m) => faltas.includes(m.id)).length;
  const presentes = lista.length - faltaram;
  const alternar = (id: number, falta: boolean) => {
    setFaltas(falta ? [...faltas.filter((f) => f !== id), id] : faltas.filter((f) => f !== id));
    setSalvo("");
  };

  const salvar = () => envio.enviar(async () => {
    if (!turma) return;
    const corpo = { turma: turma.turma, materia: turma.materia, data, quantidade, conteudo, faltas };
    if (existente) await api(`/api/aulas/${existente.id}/`, { method: "PATCH", body: corpo });
    else await api("/api/aulas/", { method: "POST", body: corpo });
    setSalvo(existente ? "Chamada atualizada!" : "Chamada registrada!");
    aulasDoDia.recarregar();
    minhas.painel.recarregar(); // atualiza "Chamada feita" no início
  });

  return (
    <>
      <TopBar title="Frequência" subtitle={`Registro de chamada · ${data === hojeISO() ? "Hoje, " : ""}${dataBR(data)}`} onBack={back} accent={GREEN} />
      <Screen>
        <ComTurmas minhas={minhas}>
          <SeletorTurma turmas={minhas.turmas} escolhida={turma} onEscolher={(t) => { minhas.escolher(t); setSalvo(""); }} cor={GREEN} />
          <div className="mt-3 flex items-end gap-2">
            <Entrada label="Dia da aula" type="date" value={data} onChange={(v) => { setData(v); setSalvo(""); }} />
            <label className="block w-28 flex-none">
              <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Aulas seguidas</span>
              <select value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.quantidade ? RED : "#e2e8f0", color: INK }}>
                {[1, 2, 3, 4].map((q) => <option key={q} value={q}>{q === 1 ? "1 aula" : `${q} aulas`}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Presentes</p><p className="text-[22px] font-extrabold" style={{ color: GREEN }}>{presentes}</p></div>
            <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Faltas</p><p className="text-[22px] font-extrabold" style={{ color: RED }}>{faltaram}</p></div>
          </div>
          {salvo && <Confirmacao texto={salvo} />}

          <div className="mt-3">
            <CaixaTexto label="Conteúdo da aula" value={conteudo} onChange={setConteudo} erro={envio.campos.conteudo} placeholder="Ex.: Progressão aritmética: termo geral e exercícios" linhas={2} />
          </div>

          <EstadoApi carregando={alunos.carregando || aulasDoDia.carregando} erro={alunos.erro ?? aulasDoDia.erro} onRetry={() => { alunos.recarregar(); aulasDoDia.recarregar(); }}>
            <div className="mb-2.5 mt-5 flex items-center justify-between gap-2">
              <SectionHeaderInline titulo={`Alunos · ${turma ? nomeDe(turma) : ""}`} />
              {existente ? <Pill color={GREEN}>Já registrada</Pill> : <Pill color={INK_SOFT}>Chamada nova</Pill>}
            </div>
            {lista.length === 0 ? (
              <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno com matrícula confirmada nesta turma.</p>
            ) : (
              <div className="card divide-y divide-[color:var(--color-line)]">
                {lista.map((m) => {
                  const faltou = faltas.includes(m.id);
                  return (
                    <div key={m.id} className="flex items-center gap-3 px-3.5 py-2.5">
                      <Avatar name={m.aluno_nome} color={faltou ? RED : GREEN} size={32} />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{m.aluno_nome}</span>
                      <button onClick={() => alternar(m.id, false)} aria-label={`${m.aluno_nome} presente`} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={!faltou ? { background: GREEN, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>P</button>
                      <button onClick={() => alternar(m.id, true)} aria-label={`${m.aluno_nome} faltou`} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={faltou ? { background: RED, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>F</button>
                    </div>
                  );
                })}
              </div>
            )}
          </EstadoApi>

          {envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}
          <div className="mt-4"><PrimaryButton onClick={salvar} color={GREEN} loading={envio.enviando}>{envio.enviando ? "Salvando..." : existente ? "Atualizar chamada" : "Salvar chamada"}</PrimaryButton></div>
        </ComTurmas>
      </Screen>
    </>
  );
}

/* Título de seção sem a margem do SectionHeader (aqui ele divide a linha com a etiqueta). */
function SectionHeaderInline({ titulo }: { titulo: string }) {
  return <h2 className="min-w-0 truncate text-[15px] font-bold" style={{ color: INK }}>{titulo}</h2>;
}
