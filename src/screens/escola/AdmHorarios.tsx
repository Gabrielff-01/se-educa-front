/* Grade de horários de cada turma (segunda a sexta). A escola põe e tira aulas da grade.
   Cada aula da grade é uma "lotação" (professor + matéria na turma, feita pelo RH) num dia e hora.
   Dados: GET /api/turmas/?escola=ID, GET/POST/DELETE /api/horarios/ (?turma=ID) e
          /api/escola/diario/ (as lotações da turma, com quantas aulas por semana cada matéria tem). */

import { useState } from "react";
import { AvisoErro, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconClock, IconPlus, IconX } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { ANO_ATUAL, horaCurta } from "@/lib/formato";
import type { Horario, SituacaoDiario, Turma } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PINK, RED, TEAL, VIOLET } from "@/theme/colors";

const DIAS = [{ n: 1, nome: "Seg" }, { n: 2, nome: "Ter" }, { n: 3, nome: "Qua" }, { n: 4, nome: "Qui" }, { n: 5, nome: "Sex" }];
const DIAS_OPCOES = [["1", "Segunda"], ["2", "Terça"], ["3", "Quarta"], ["4", "Quinta"], ["5", "Sexta"]].map(([valor, nome]) => ({ valor, nome }));
// Horários de início comuns de cada turno (só sugestão da tela: a API aceita qualquer hora).
const TEMPOS_DO_TURNO: Record<string, string[]> = {
  matutino: ["07:00", "07:50", "08:40", "09:50", "10:40", "11:30"],
  vespertino: ["13:00", "13:50", "14:40", "15:50", "16:40", "17:30"],
  noturno: ["19:00", "19:45", "20:30", "21:15"],
  integral: ["07:00", "07:50", "08:40", "09:50", "10:40", "13:00", "13:50", "14:40", "15:50"],
};
const CORES = [BLUE, GREEN, VIOLET, AMBER, PINK, TEAL, INDIGO, RED];

type Form = { lotacao: string; dia_semana: string; inicio: string };

export function AdmHorarios({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const turmas = useApi<Turma[]>(usuario?.escola ? `/api/turmas/?escola=${usuario.escola}&ano_letivo=${ANO_ATUAL}` : null);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const turma = (turmas.dados ?? []).find((t) => t.id === escolhida) ?? turmas.dados?.[0] ?? null;
  const horarios = useApi<Horario[]>(turma ? `/api/horarios/?turma=${turma.id}` : null);
  const diario = useApi<SituacaoDiario[]>("/api/escola/diario/");
  const lotacoes = (diario.dados ?? []).filter((d) => turma && d.turma === turma.id);
  const [form, setForm] = useState<Form | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["lotacao", "dia_semana", "inicio"]);
  const apagando = useEnvio();

  const grade = horarios.dados ?? [];
  const tempos = Array.from(new Set([...(TEMPOS_DO_TURNO[turma?.turno ?? "matutino"] ?? []), ...grade.map((h) => horaCurta(h.inicio))])).sort();
  const naGrade = (lotacao: number) => grade.filter((h) => h.lotacao === lotacao).length;
  const corDa = (lotacao: number) => CORES[Math.max(lotacoes.findIndex((l) => l.lotacao === lotacao), 0) % CORES.length];
  // A faixa verde some sozinha depois de 4 s (só se ninguém trocou a mensagem nesse meio-tempo).
  const avisar = (msg: string) => { setAviso(msg); setTimeout(() => setAviso((atual) => (atual === msg ? "" : atual)), 4000); };

  const abrir = (dia = "1", inicio = tempos[0] ?? "07:00") => {
    envio.limpar();
    // Sugere a primeira matéria que ainda tem aula sobrando na semana.
    const livre = lotacoes.find((l) => naGrade(l.lotacao) < l.aulas_semanais) ?? lotacoes[0];
    setForm({ lotacao: livre ? String(livre.lotacao) : "", dia_semana: dia, inicio });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const nova = await api<Horario>("/api/horarios/", { method: "POST", body: { lotacao: Number(form.lotacao), dia_semana: Number(form.dia_semana), inicio: form.inicio } });
    setForm(null);
    avisar(`${nova.materia_nome} na ${nova.dia_nome.toLowerCase()} às ${horaCurta(nova.inicio)} adicionada.`);
    horarios.recarregar();
    diario.recarregar();
  });
  const apagar = (h: Horario) => {
    if (!window.confirm(`Tirar ${h.materia_nome} de ${h.dia_nome.toLowerCase()} às ${horaCurta(h.inicio)} da grade?`)) return;
    apagando.enviar(async () => {
      await api(`/api/horarios/${h.id}/`, { method: "DELETE" });
      avisar(`${h.materia_nome} de ${h.dia_nome.toLowerCase()} às ${horaCurta(h.inicio)} saiu da grade.`);
      horarios.recarregar();
      diario.recarregar();
    });
  };

  const previstas = lotacoes.reduce((s, l) => s + l.aulas_semanais, 0);
  return (
    <>
      <TopBar title="Gestão de horários" subtitle="Grade semanal por turma" onBack={back} accent={TEAL} />
      <Screen>
        <EstadoApi carregando={turmas.carregando} erro={turmas.erro} onRetry={turmas.recarregar}>
          {!turma ? <EmptyState title="Nenhuma turma" text="A escola ainda não tem turmas neste ano." icon={<IconClock size={26} />} /> : (
            <>
              <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
                {(turmas.dados ?? []).map((t) => (
                  <button key={t.id} onClick={() => { setEscolhida(t.id); setForm(null); }} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma.id === t.id ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t.nome}</button>
                ))}
              </div>

              {aviso && <div className="mt-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} className="flex-none" />{aviso}</div>}
              {apagando.erro && <div className="mt-3"><AvisoErro texto={apagando.erro} /></div>}

              {form && (
                <div className="mt-3">
                  <CartaoForm titulo={`Adicionar aula · ${turma.nome}`} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
                    <Escolha label="Matéria e professor" value={form.lotacao} onChange={(v) => setForm({ ...form, lotacao: v })} vazio={lotacoes.length ? undefined : "Nenhum professor lotado"} erro={envio.campos.lotacao}
                      opcoes={lotacoes.map((l) => ({ valor: String(l.lotacao), nome: `${l.materia_nome} · ${l.professor_nome.split(" ")[0]} (${naGrade(l.lotacao)}/${l.aulas_semanais})` }))} />
                    <div className="flex gap-2">
                      <Escolha label="Dia" value={form.dia_semana} onChange={(v) => setForm({ ...form, dia_semana: v })} opcoes={DIAS_OPCOES} erro={envio.campos.dia_semana} />
                      <Entrada label="Início" type="time" value={form.inicio} onChange={(v) => setForm({ ...form, inicio: v })} erro={envio.campos.inicio} />
                    </div>
                  </CartaoForm>
                </div>
              )}

              <EstadoApi carregando={horarios.carregando} erro={horarios.erro} onRetry={horarios.recarregar}>
                <div className="scroll-area mt-3 overflow-x-auto">
                  <div className="card min-w-[560px] overflow-hidden">
                    <div className="grid grid-cols-[56px_repeat(5,1fr)] bg-[color:var(--color-surface)] text-[10px] font-bold uppercase" style={{ color: INK_SOFT }}>
                      <span className="px-2 py-2.5">Hora</span>
                      {DIAS.map((d) => <span key={d.n} className="px-2 py-2.5 text-center">{d.nome}</span>)}
                    </div>
                    {tempos.map((hora) => (
                      <div key={hora} className="grid grid-cols-[56px_repeat(5,1fr)] border-t border-[color:var(--color-line)]">
                        <span className="px-2 py-2.5 text-[11px] font-bold" style={{ color: INK }}>{hora}</span>
                        {DIAS.map((d) => {
                          const aula = grade.find((h) => h.dia_semana === d.n && horaCurta(h.inicio) === hora);
                          if (!aula) {
                            return <button key={d.n} onClick={() => abrir(String(d.n), hora)} aria-label={`Adicionar aula ${d.nome} ${hora}`} className="grid place-items-center border-l border-[color:var(--color-line)] py-2 text-slate-300 transition hover:bg-slate-50 hover:text-[color:var(--color-ink)]"><IconPlus size={14} /></button>;
                          }
                          const cor = corDa(aula.lotacao);
                          return (
                            <div key={d.n} className="border-l border-[color:var(--color-line)] px-1 py-1.5">
                              <div className="group relative rounded-md px-1.5 py-1 text-center leading-tight" style={{ background: cor + "18", color: cor }}>
                                <p className="text-[10px] font-bold">{aula.materia_nome}</p>
                                <p className="truncate text-[9px] opacity-80">{aula.professor_nome.split(" ")[0]}</p>
                                <button onClick={() => apagar(aula)} aria-label={`Tirar ${aula.materia_nome} da grade`} className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-white shadow" style={{ color: RED }}><IconX size={10} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </EstadoApi>
              <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Toque no + de um horário vazio para pôr uma aula, ou no x para tirar.</p>

              <div className="card mt-3 p-3.5">
                <p className="text-[13px] font-bold" style={{ color: INK }}>Aulas por matéria · {grade.length} de {previstas} na grade</p>
                {lotacoes.length === 0 ? <p className="mt-1 text-[12px]" style={{ color: INK_SOFT }}>Nenhum professor lotado nesta turma (a lotação é feita pelo RH).</p> : (
                  <div className="mt-2 space-y-1.5">
                    {lotacoes.map((l) => {
                      const usadas = naGrade(l.lotacao);
                      return (
                        <div key={l.lotacao} className="flex items-center gap-2 text-[12px]">
                          <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: corDa(l.lotacao) }} />
                          <span className="min-w-0 flex-1 truncate" style={{ color: INK }}>{l.materia_nome} <span style={{ color: INK_SOFT }}>· {l.professor_nome}</span></span>
                          <span className="font-bold" style={{ color: usadas >= l.aulas_semanais ? GREEN : AMBER }}>{usadas}/{l.aulas_semanais}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => abrir()} disabled={!lotacoes.length} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-[13px] font-semibold disabled:opacity-50" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={17} />Adicionar aula</button>
              </div>
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}
