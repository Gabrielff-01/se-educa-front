import { useState } from "react";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { horasBR } from "@/lib/formato";
import type { Curso, Materia, Opcoes } from "@/lib/tipos";
import { INDIGO, INK, INK_SOFT } from "@/theme/colors";

/* DIES — Cursos (com as séries) e matérias da rede */
export function DiesCursos({ back }: { back: () => void }) {
  const cursos = useApi<Curso[]>("/api/cursos/");
  const materias = useApi<Materia[]>("/api/materias/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState<{ nome: string; area: string } | null>(null);
  const envio = useEnvio(["nome"]);

  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    await api("/api/materias/", { method: "POST", body: form });
    setForm(null);
    materias.recarregar();
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Cursos e matérias" subtitle="DIES" onBack={back} accent={INDIGO} right={<BotaoNovo label="Nova matéria" cor={INDIGO} onClick={() => { envio.limpar(); setForm({ nome: "", area: "linguagens" }); }} />} />
      <Screen>
        <EstadoApi carregando={cursos.carregando || materias.carregando} erro={cursos.erro || materias.erro} onRetry={cursos.recarregar}>
          <SectionHeader title="Cursos" />
          <div className="space-y-2.5">
            {(cursos.dados ?? []).map((c) => (
              <div key={c.id} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.nome}</p>
                  <Pill color={INDIGO}>mín. {horasBR(c.carga_horaria_minima_anual)} h/ano</Pill>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.series.map((s) => <span key={s.id} className="rounded-full border px-2.5 py-1 text-[11.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>{s.nome}</span>)}
                </div>
              </div>
            ))}
          </div>
          <SectionHeader title={`Matérias (${materias.dados?.length ?? 0})`} />
          {form && (
            <CartaoForm titulo="Nova matéria" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={INDIGO}>
              <div className="flex gap-2">
                <Entrada label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} erro={envio.campos.nome} />
                <Escolha label="Área" value={form.area} onChange={(v) => setForm({ ...form, area: v })} opcoes={opcoes.dados?.areas ?? []} />
              </div>
            </CartaoForm>
          )}
          <div className="card divide-y divide-[color:var(--color-line)]">
            {(materias.dados ?? []).map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-[13px] font-semibold" style={{ color: INK }}>{m.nome}</span>
                <span className="text-[11.5px]" style={{ color: INK_SOFT }}>{m.area_nome}</span>
              </div>
            ))}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
