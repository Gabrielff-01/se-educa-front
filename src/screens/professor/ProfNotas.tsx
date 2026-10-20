/* Lançar notas: o professor escolhe turma · matéria e unidade, digita as notas e salva de verdade.
   Dados: alunos em GET /api/matriculas/, notas em GET /api/notas/, unidades fechadas em GET /api/fechamentos/.
   Salvar: POST /api/notas/lancar/ (se uma nota tiver erro, a API não salva nenhuma e diz o erro de cada aluno). */

import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvisoErro, EstadoApi } from "@/components/Form";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api, type ErroApi } from "@/lib/api";
import { notaBR } from "@/lib/formato";
import type { Fechamento, Matricula, Nota } from "@/lib/tipos";
import { ComTurmas, Confirmacao, SeletorTurma, nomeDe, useMinhasTurmas } from "@/screens/professor/SeletorTurma";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

/* "7.50" (como vem da API) -> "7,5" (como o professor digita) */
function paraCampo(valor: string) {
  return Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

/* "7,5" -> 7.5. Texto que não é número -> null */
function numeroDe(texto: string) {
  const n = Number(texto.trim().replace(",", "."));
  return texto.trim() === "" || Number.isNaN(n) ? null : n;
}

export function ProfNotas({ back }: { back: () => void }) {
  const minhas = useMinhasTurmas();
  const turma = minhas.escolhida;
  const [unidade, setUnidade] = useState<number | null>(null); // null = ainda não escolheu: usa a unidade atual
  const uni = unidade ?? turma?.unidade_atual ?? 1;

  const filtro = turma ? `turma=${turma.turma}&materia=${turma.materia}&unidade=${uni}` : null;
  const alunos = useApi<Matricula[]>(turma ? `/api/matriculas/?turma=${turma.turma}&situacao=confirmada` : null);
  const notas = useApi<Nota[]>(filtro ? `/api/notas/?${filtro}` : null);
  const fechamentos = useApi<Fechamento[]>(turma ? `/api/fechamentos/?turma=${turma.turma}` : null);

  const [valores, setValores] = useState<Record<number, string>>({}); // id da matrícula -> o que está digitado
  const [originais, setOriginais] = useState<Record<number, string>>({}); // o que veio da API
  const [errosAluno, setErrosAluno] = useState<Record<string, string>>({});
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState("");

  // Quando chegam as notas do servidor, elas viram o conteúdo dos campos.
  useEffect(() => {
    const doServidor: Record<number, string> = {};
    for (const n of notas.dados ?? []) doServidor[n.matricula] = paraCampo(n.valor);
    setValores(doServidor);
    setOriginais(doServidor);
    setErrosAluno({});
    setErro("");
  }, [notas.dados]);

  // Trocou de turma ou unidade: some a confirmação antiga.
  useEffect(() => setSalvo(""), [filtro]);

  const fechada = (fechamentos.dados ?? []).some((f) => f.unidade === uni);
  const lista = [...(alunos.dados ?? [])].sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome));
  const lancadas = lista.map((m) => numeroDe(valores[m.id] ?? "")).filter((n): n is number => n !== null);
  const media = lancadas.length ? lancadas.reduce((s, n) => s + n, 0) / lancadas.length : null;
  const faltam = lista.length - lancadas.length;
  const mudou = lista.some((m) => (valores[m.id] ?? "") !== (originais[m.id] ?? ""));

  const salvar = async () => {
    if (!turma) return;
    // Só manda quem mudou (valor vazio = apagar a nota).
    const alteradas = lista
      .filter((m) => (valores[m.id] ?? "") !== (originais[m.id] ?? ""))
      .map((m) => ({ matricula: m.id, valor: (valores[m.id] ?? "").trim() }));
    if (alteradas.length === 0) { setSalvo("Nenhuma nota mudou."); return; }
    setSalvando(true); setErro(""); setErrosAluno({}); setSalvo("");
    try {
      const resposta = await api<{ salvas: number }>("/api/notas/lancar/", {
        method: "POST", body: { turma: turma.turma, materia: turma.materia, unidade: uni, notas: alteradas },
      });
      setSalvo(`${resposta.salvas} nota(s) salva(s) na ${uni}ª unidade!`);
      notas.recarregar();
      minhas.painel.recarregar(); // atualiza "faltam lançar" do painel
    } catch (e) {
      const falha = e as ErroApi;
      const porAluno = (falha.dados as { alunos?: Record<string, string> } | null)?.alunos;
      if (porAluno) setErrosAluno(porAluno);
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <TopBar title="Lançar notas" subtitle={turma ? nomeDe(turma) : "Notas por unidade"} onBack={back} accent={BLUE} />
      <Screen>
        <ComTurmas minhas={minhas}>
          <SeletorTurma turmas={minhas.turmas} escolhida={turma} onEscolher={(t) => { minhas.escolher(t); setUnidade(null); }} cor={BLUE} />
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((u) => (
              <button key={u} onClick={() => setUnidade(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>
                {u}ª Uni.{turma?.unidade_atual === u ? " •" : ""}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Média da turma</p><p className="text-[22px] font-extrabold" style={{ color: media !== null && media < 6 ? RED : BLUE }}>{notaBR(media)}</p></div>
            <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Faltam lançar</p><p className="text-[22px] font-extrabold" style={{ color: faltam ? AMBER : GREEN }}>{alunos.dados ? faltam : "—"}</p></div>
          </div>

          {fechada && (
            <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: AMBER + "1a", color: "#b45309" }}>
              <IconAlert size={16} className="mt-0.5 flex-none" />Unidade fechada pela escola. As notas só podem ser vistas; para corrigir, peça à escola para reabrir.
            </div>
          )}
          {salvo && <Confirmacao texto={salvo} />}
          {erro && <div className="mt-3"><AvisoErro texto={erro} /></div>}

          <SectionHeader title={`Alunos · ${turma?.turma_nome ?? ""}`} />
          <EstadoApi carregando={alunos.carregando || notas.carregando} erro={alunos.erro ?? notas.erro} onRetry={() => { alunos.recarregar(); notas.recarregar(); }}>
            {lista.length === 0 ? (
              <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno com matrícula confirmada nesta turma.</p>
            ) : (
              <div className="card divide-y divide-[color:var(--color-line)]">
                {lista.map((m, i) => {
                  const erroDoAluno = errosAluno[String(m.id)];
                  const valor = valores[m.id] ?? "";
                  const n = numeroDe(valor);
                  return (
                    <div key={m.id} className="px-3.5 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-[11px] font-bold" style={{ color: "#94a3b8" }}>{i + 1}</span>
                        <Avatar name={m.aluno_nome} color={n !== null && n < 6 ? RED : BLUE} size={32} />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{m.aluno_nome}</span>
                        <input
                          value={valor}
                          onChange={(e) => { setValores({ ...valores, [m.id]: e.target.value }); setSalvo(""); }}
                          disabled={fechada}
                          inputMode="decimal"
                          placeholder="—"
                          aria-label={`Nota de ${m.aluno_nome}`}
                          className="w-16 rounded-xl border px-2 py-2 text-center text-[14px] font-bold outline-none focus:border-[color:var(--color-brand-blue)] disabled:bg-slate-50 disabled:opacity-70"
                          style={{ color: INK, borderColor: erroDoAluno ? RED : "#e2e8f0", background: erroDoAluno ? RED + "10" : undefined }}
                        />
                      </div>
                      {erroDoAluno && <p className="mt-1 text-right text-[11px] font-medium" style={{ color: RED }}>{erroDoAluno}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </EstadoApi>

          {!fechada && lista.length > 0 && (
            <>
              <p className="mt-3 text-[11px]" style={{ color: INK_SOFT }}>Notas de 0 a 10 (pode usar vírgula: 7,5). Apague o número para tirar a nota do aluno.</p>
              <div className="mt-3"><PrimaryButton onClick={salvar} loading={salvando}>{salvando ? "Salvando..." : mudou ? "Salvar notas" : "Salvar notas (nada mudou)"}</PrimaryButton></div>
            </>
          )}
        </ComTurmas>
      </Screen>
    </>
  );
}
