import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, opcoesDe } from "@/lib/formato";
import type { Escola, Lotacao, Materia, Professor, Turma } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT } from "@/theme/colors";

type FormLotacao = { professor: string; turma: string; materia: string; aulas_semanais: string };

/* RH — Lotação: qual professor dá qual matéria em qual turma.
   A API confere: matéria na matriz, aulas que sobram na matriz e o limite de 2/3 do professor. */
export function RhLotacoes({ back }: { back: () => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const [escola, setEscola] = useState("");
  const escolaId = escola || String(escolas.dados?.[0]?.id ?? "");
  const filtro = escolaId ? `escola=${escolaId}&ano_letivo=${ANO_ATUAL}` : null;
  const lotacoes = useApi<Lotacao[]>(filtro && `/api/lotacoes/?${filtro}`);
  const turmas = useApi<Turma[]>(filtro && `/api/turmas/?${filtro}`);
  const professores = useApi<Professor[]>("/api/professores/");
  const materias = useApi<Materia[]>("/api/materias/");
  const [form, setForm] = useState<FormLotacao | null>(null);
  const envio = useEnvio(["professor", "turma", "materia", "aulas_semanais"]);

  const abrir = () => {
    envio.limpar();
    setForm({ professor: String(professores.dados?.[0]?.id ?? ""), turma: String(turmas.dados?.[0]?.id ?? ""), materia: String(materias.dados?.[0]?.id ?? ""), aulas_semanais: "2" });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    await api("/api/lotacoes/", { method: "POST", body: { professor: Number(form.professor), turma: Number(form.turma), materia: Number(form.materia), aulas_semanais: Number(form.aulas_semanais) } });
    setForm(null);
    lotacoes.recarregar();
    professores.recarregar();
  });
  const apagar = (l: Lotacao) => envio.enviar(async () => {
    if (!window.confirm(`Tirar ${l.professor_nome} de ${l.materia_nome} na ${l.turma_nome}?`)) return;
    await api(`/api/lotacoes/${l.id}/`, { method: "DELETE" });
    lotacoes.recarregar();
    professores.recarregar();
  });
  const mudar = (campo: keyof FormLotacao) => (v: string) => form && setForm({ ...form, [campo]: v });

  // Agrupa as lotações por turma pra ficar fácil de ler.
  const porTurma = new Map<string, Lotacao[]>();
  for (const l of lotacoes.dados ?? []) porTurma.set(l.turma_nome, [...(porTurma.get(l.turma_nome) ?? []), l]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Lotação de professores" subtitle={`RH · ano letivo ${ANO_ATUAL}`} onBack={back} accent={GREEN} right={<BotaoNovo label="Nova lotação" cor={GREEN} onClick={abrir} />} />
      <Screen>
        <div className="mb-3"><Escolha label="Escola" value={escolaId} onChange={setEscola} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} /></div>
        {form && (
          <CartaoForm titulo="Nova lotação" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
            <Escolha label="Professor" value={form.professor} onChange={mudar("professor")} opcoes={opcoesDe(professores.dados, (p) => `${p.nome} (${p.aulas_ano_atual}/${p.limite_aulas} aulas)`)} erro={envio.campos.professor} />
            <div className="flex gap-2">
              <Escolha label="Turma" value={form.turma} onChange={mudar("turma")} opcoes={opcoesDe(turmas.dados, (t) => t.nome)} erro={envio.campos.turma} />
              <Escolha label="Matéria" value={form.materia} onChange={mudar("materia")} opcoes={opcoesDe(materias.dados, (m) => m.nome)} erro={envio.campos.materia} />
            </div>
            <Entrada label="Aulas por semana" value={form.aulas_semanais} onChange={mudar("aulas_semanais")} erro={envio.campos.aulas_semanais} inputMode="numeric" />
          </CartaoForm>
        )}
        {!form && envio.erro && <div className="mb-3"><AvisoErro texto={envio.erro} /></div>}
        <EstadoApi carregando={escolas.carregando || lotacoes.carregando} erro={escolas.erro || lotacoes.erro} onRetry={lotacoes.recarregar}>
          <div className="space-y-2.5">
            {[...porTurma.entries()].map(([turma, lista]) => (
              <div key={turma} className="card p-4">
                <p className="mb-1 text-[13.5px] font-bold" style={{ color: INK }}>{turma}</p>
                <div className="divide-y divide-[color:var(--color-line)]">
                  {lista.map((l) => (
                    <div key={l.id} className="flex items-center gap-2 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{l.materia_nome} · {l.aulas_semanais} aulas</p>
                        <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{l.professor_nome}</p>
                      </div>
                      <button onClick={() => apagar(l)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Tirar</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {lotacoes.dados?.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum professor lotado nesta escola.</p>}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
