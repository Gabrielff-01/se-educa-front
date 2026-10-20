import { useState } from "react";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, opcoesDe } from "@/lib/formato";
import type { Curso, Escola, Opcoes, Turma } from "@/lib/tipos";
import { INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type FormTurma = { serie: string; turno: string; letra: string; sala: string; capacidade: string };

/* DIES — Turmas de cada escola. A API só deixa criar turma de série que a escola oferece (DED). */
export function DiesTurmas({ back }: { back: () => void }) {
  const escolas = useApi<Escola[]>("/api/escolas/");
  const cursos = useApi<Curso[]>("/api/cursos/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [escola, setEscola] = useState("");
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const escolaId = escola || String(escolas.dados?.[0]?.id ?? "");
  const turmas = useApi<Turma[]>(escolaId ? `/api/turmas/?escola=${escolaId}&ano_letivo=${ano}` : null);
  const [form, setForm] = useState<FormTurma | null>(null);
  const envio = useEnvio(["serie", "letra", "capacidade"]);

  const series = (cursos.dados ?? []).flatMap((c) => c.series.map((s) => ({ valor: String(s.id), nome: `${s.nome} · ${c.nome}` })));
  const abrir = () => { envio.limpar(); setForm({ serie: series[0]?.valor ?? "", turno: "matutino", letra: "", sala: "", capacidade: "35" }); };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    await api("/api/turmas/", {
      method: "POST",
      body: { ...form, escola: Number(escolaId), serie: Number(form.serie), ano_letivo: Number(ano), capacidade: Number(form.capacidade) },
    });
    setForm(null);
    turmas.recarregar();
  });
  const apagar = (turma: Turma) => envio.enviar(async () => {
    if (!window.confirm(`Apagar a turma ${turma.nome}?`)) return;
    await api(`/api/turmas/${turma.id}/`, { method: "DELETE" });
    turmas.recarregar();
  });
  const mudar = (campo: keyof FormTurma) => (v: string) => form && setForm({ ...form, [campo]: v });
  const anos = [ANO_ATUAL - 1, ANO_ATUAL, ANO_ATUAL + 1].map((a) => ({ valor: String(a), nome: String(a) }));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Turmas" subtitle={`DIES · ${turmas.dados?.length ?? 0} turmas nesta escola`} onBack={back} accent={TEAL} right={<BotaoNovo label="Nova turma" cor={TEAL} onClick={abrir} />} />
      <Screen>
        <div className="mb-3 flex gap-2">
          <Escolha label="Escola" value={escolaId} onChange={setEscola} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} />
          <div className="w-28 flex-none"><Escolha label="Ano letivo" value={ano} onChange={setAno} opcoes={anos} /></div>
        </div>
        {form && (
          <CartaoForm titulo="Nova turma" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL}>
            <Escolha label="Série" value={form.serie} onChange={mudar("serie")} opcoes={series} erro={envio.campos.serie} />
            <div className="flex gap-2">
              <Escolha label="Turno" value={form.turno} onChange={mudar("turno")} opcoes={opcoes.dados?.turnos ?? []} />
              <Entrada label="Letra" value={form.letra} onChange={mudar("letra")} erro={envio.campos.letra} placeholder="A" />
            </div>
            <div className="flex gap-2">
              <Entrada label="Sala (opcional)" value={form.sala} onChange={mudar("sala")} />
              <Entrada label="Capacidade" value={form.capacidade} onChange={mudar("capacidade")} erro={envio.campos.capacidade} inputMode="numeric" />
            </div>
          </CartaoForm>
        )}
        {!form && envio.erro && <p className="mb-3 text-[12px] font-medium" style={{ color: RED }}>{envio.erro}</p>}
        <EstadoApi carregando={escolas.carregando || turmas.carregando} erro={escolas.erro || turmas.erro} onRetry={turmas.recarregar}>
          <div className="space-y-2.5">
            {(turmas.dados ?? []).map((t) => (
              <div key={t.id} className="card flex items-center gap-3 p-4">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: TEAL + "16", color: TEAL }}><IconUsers size={20} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold" style={{ color: INK }}>{t.nome}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{t.curso_nome} · {t.sala ? `Sala ${t.sala} · ` : ""}até {t.capacidade} alunos</p>
                </div>
                <Pill color={TEAL}>{t.turno_nome}</Pill>
                <button onClick={() => apagar(t)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Apagar</button>
              </div>
            ))}
            {turmas.dados?.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma turma nesta escola em {ano}.</p>}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
