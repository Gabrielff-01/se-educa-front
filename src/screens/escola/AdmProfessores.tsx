/* Professores e funções: quem o RH alocou na escola e o que cada um faz aqui.
   - O RH só aloca o professor na escola (horas e portaria).
   - A ESCOLA escolhe a função (Professor, Diretor, Coordenador, Secretário escolar),
     as turmas e matérias de quem é professor e, depois, o horário (tela Horários).
   A API confere a matriz da série e o limite de 2/3 das horas que ele tem nesta escola.
   Dados: GET /api/escola/professores/, POST /api/alocacoes/ID/funcao/, POST/DELETE /api/lotacoes/. */

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvisoErro, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconSearch } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { ANO_ATUAL, dataBR, opcoesDe } from "@/lib/formato";
import type { Matriz, Materia, Opcoes, ProfessorDaEscola, Turma } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

// Só um formulário aberto por vez: o da função ou o de nova turma, de um professor.
type FormFuncao = { tipo: "funcao"; professor: ProfessorDaEscola; funcao: string; portaria_funcao: string };
type FormTurma = { tipo: "turma"; professor: ProfessorDaEscola; turma: string; materia: string; aulas_semanais: string };

export function AdmProfessores({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const professores = useApi<ProfessorDaEscola[]>("/api/escola/professores/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const turmas = useApi<Turma[]>(usuario?.escola ? `/api/turmas/?escola=${usuario.escola}&ano_letivo=${ANO_ATUAL}` : null);
  const matrizes = useApi<Matriz[]>(`/api/matrizes/?ano_letivo=${ANO_ATUAL}`);
  const materias = useApi<Materia[]>("/api/materias/");
  const [q, setQ] = useState("");
  const [form, setForm] = useState<FormFuncao | FormTurma | null>(null);
  const envio = useEnvio(["funcao", "portaria_funcao", "turma", "materia", "aulas_semanais"]);

  const todos = professores.dados ?? [];
  const lista = todos.filter((p) => `${p.nome} ${p.funcao_nome} ${p.materias.join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const afastados = todos.filter((p) => p.afastamento).length;

  // Matérias que a turma escolhida pode ter: as da matriz da série dela (DED).
  // Se a série ainda não tem matriz, mostra todas e a API explica o problema ao salvar.
  const materiasDaTurma = (turmaId: string) => {
    const turma = turmas.dados?.find((t) => String(t.id) === turmaId);
    const daSerie = (matrizes.dados ?? []).filter((m) => m.serie === turma?.serie).flatMap((m) => m.itens.map((i) => i.materia));
    const lista = (materias.dados ?? []).filter((m) => daSerie.length === 0 || daSerie.includes(m.id));
    return opcoesDe(lista, (m) => m.nome);
  };

  const abrirFuncao = (p: ProfessorDaEscola) => { envio.limpar(); setForm({ tipo: "funcao", professor: p, funcao: p.funcao, portaria_funcao: p.portaria_funcao }); };
  const abrirTurma = (p: ProfessorDaEscola) => {
    envio.limpar();
    const turma = String(turmas.dados?.[0]?.id ?? "");
    setForm({ tipo: "turma", professor: p, turma, materia: materiasDaTurma(turma)[0]?.valor ?? "", aulas_semanais: "2" });
  };
  const mudar = (campo: string) => (v: string) => {
    if (!form) return;
    // Trocou a turma: volta a matéria pra primeira da matriz da nova turma.
    if (form.tipo === "turma" && campo === "turma") setForm({ ...form, turma: v, materia: materiasDaTurma(v)[0]?.valor ?? "" });
    else setForm({ ...form, [campo]: v } as FormFuncao | FormTurma);
  };

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    if (form.tipo === "funcao") {
      await api(`/api/alocacoes/${form.professor.alocacao}/funcao/`, { method: "POST", body: { funcao: form.funcao, portaria_funcao: form.portaria_funcao } });
    } else {
      await api("/api/lotacoes/", { method: "POST", body: { professor: form.professor.id, turma: Number(form.turma), materia: Number(form.materia), aulas_semanais: Number(form.aulas_semanais) } });
    }
    setForm(null);
    professores.recarregar();
  });
  const tirarTurma = (p: ProfessorDaEscola, l: ProfessorDaEscola["lotacoes"][number]) => envio.enviar(async () => {
    const aviso = l.no_quadro ? ` As ${l.no_quadro} aulas dele no quadro de horários também saem.` : "";
    if (!window.confirm(`Tirar ${p.nome} de ${l.materia_nome} na ${l.turma_nome}?${aviso}`)) return;
    await api(`/api/lotacoes/${l.id}/`, { method: "DELETE" });
    professores.recarregar();
  });

  return (
    <>
      <TopBar title="Professores e funções" subtitle={professores.dados ? `${todos.length} alocados pelo RH · ${afastados} afastado(s)` : "Quadro da escola"} onBack={back} accent={TEAL} />
      <Screen>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, função ou matéria" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        {!form && envio.erro && <div className="mt-3"><AvisoErro texto={envio.erro} /></div>}

        <EstadoApi carregando={professores.carregando} erro={professores.erro} onRetry={professores.recarregar}>
          {lista.length === 0 ? <EmptyState title="Nenhum professor" text={q ? "Ninguém com esse nome, função ou matéria." : "O RH ainda não alocou professores nesta escola."} icon={<IconSearch size={26} />} /> : (
            <div className="mt-3 grid items-start gap-2.5 lg:grid-cols-2">
              {lista.map((p) => {
                const ehProfessor = p.funcao === "professor";
                const aberto = form?.professor.id === p.id ? form : null;
                return (
                  <div key={p.id} className="card p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.nome} color={p.afastamento ? RED : ehProfessor ? TEAL : AMBER} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{p.nome}</p>
                        <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.horas_na_escola} h nesta escola · {p.vinculo_nome}</p>
                      </div>
                      <Pill color={ehProfessor ? TEAL : AMBER}>{p.funcao_nome}</Pill>
                    </div>
                    {!ehProfessor && p.portaria_funcao && <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>Portaria da função: {p.portaria_funcao}</p>}
                    {p.afastamento && (
                      <p className="mt-2 rounded-xl px-3 py-2 text-[11.5px] font-medium" style={{ background: RED + "10", color: RED }}>{p.afastamento.tipo_nome} até {dataBR(p.afastamento.fim)}.</p>
                    )}

                    {ehProfessor && (
                      <div className="mt-2.5">
                        <p className="mb-1 text-[11px] font-semibold" style={{ color: p.aulas_na_escola > p.limite_aulas ? RED : INK_SOFT }}>
                          Turmas em {ANO_ATUAL} · {p.aulas_na_escola} de {p.limite_aulas} aulas por semana (2/3 das horas)
                        </p>
                        {p.lotacoes.length === 0 && <p className="text-[12px]" style={{ color: INK_SOFT }}>Ainda sem turma.</p>}
                        <div className="divide-y divide-[color:var(--color-line)]">
                          {p.lotacoes.map((l) => (
                            <div key={l.id} className="flex items-center gap-2 py-1.5">
                              <p className="min-w-0 flex-1 text-[12.5px]" style={{ color: INK }}>
                                <span className="font-semibold">{l.turma_nome}</span> · {l.materia_nome} · {l.aulas_semanais} aulas
                                {l.no_quadro < l.aulas_semanais && <span style={{ color: AMBER }}> ({l.no_quadro} no horário)</span>}
                              </p>
                              <button onClick={() => tirarTurma(p, l)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Tirar</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aberto?.tipo === "funcao" && (
                      <div className="mt-3">
                        <CartaoForm titulo="Função nesta escola" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
                          <Escolha label="Função" value={aberto.funcao} onChange={mudar("funcao")} opcoes={opcoes.dados?.funcoes ?? []} erro={envio.campos.funcao} />
                          {aberto.funcao !== "professor" && <Entrada label="Portaria da função" value={aberto.portaria_funcao} onChange={mudar("portaria_funcao")} placeholder="Ex.: 0428/2026" erro={envio.campos.portaria_funcao} />}
                          <p className="text-[11px]" style={{ color: INK_SOFT }}>Diretor, coordenador e secretário escolar não ficam com turmas.</p>
                        </CartaoForm>
                      </div>
                    )}
                    {aberto?.tipo === "turma" && (
                      <div className="mt-3">
                        <CartaoForm titulo="Nova turma para o professor" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
                          <div className="flex gap-2">
                            <Escolha label="Turma" value={aberto.turma} onChange={mudar("turma")} opcoes={opcoesDe(turmas.dados, (t) => `${t.nome} · ${t.turno_nome}`)} erro={envio.campos.turma} />
                            <Escolha label="Matéria" value={aberto.materia} onChange={mudar("materia")} opcoes={materiasDaTurma(aberto.turma)} erro={envio.campos.materia} />
                          </div>
                          <Entrada label="Aulas por semana" value={aberto.aulas_semanais} onChange={mudar("aulas_semanais")} erro={envio.campos.aulas_semanais} inputMode="numeric" />
                        </CartaoForm>
                      </div>
                    )}

                    {!aberto && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button onClick={() => abrirFuncao(p)} className="rounded-xl px-3 py-1.5 text-[11.5px] font-semibold" style={{ background: TEAL + "12", color: TEAL }}>Mudar função</button>
                        {ehProfessor && <button onClick={() => abrirTurma(p)} className="rounded-xl px-3 py-1.5 text-[11.5px] font-semibold" style={{ background: GREEN + "12", color: GREEN }}>+ Turma</button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </EstadoApi>
        <button onClick={() => nav("admHorarios")} className="card mt-3 w-full p-3.5 text-left text-[12.5px] font-semibold transition active:scale-[.99]" style={{ color: TEAL }}>
          Montar o horário das turmas →
        </button>
        <p className="mt-3 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>O RH aloca o professor na escola (horas e portaria). Função, turmas e horário são da escola.</p>
      </Screen>
    </>
  );
}
