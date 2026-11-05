/* Formação do professor e as matérias que ela habilita a lecionar.
   Ex.: "Licenciatura em Matemática · UFS, 2012" -> "Habilitado a lecionar: Matemática".
   Pós-graduação aparece, mas não habilita sozinha (LDB, art. 62).
   Usado no RH (Professores), na escola (Professores e funções) e na Ficha da escola. */

import { Pill } from "@/components/Pill";
import { IconGrad } from "@/components/icons";
import type { ResumoFormacao } from "@/lib/tipos";
import { AMBER, GREEN, INK, INK_SOFT } from "@/theme/colors";

/* Matérias que o professor pode lecionar, juntando todas as formações que habilitam. */
export function materiasHabilitadas(formacoes: ResumoFormacao[]) {
  return [...new Set(formacoes.filter((f) => f.habilita).flatMap((f) => f.materias_nomes))].sort();
}

export function Formacoes({ formacoes, semFormacao }: { formacoes: ResumoFormacao[]; semFormacao?: string }) {
  const habilitado = materiasHabilitadas(formacoes);
  if (formacoes.length === 0) {
    return (
      <p className="text-[11.5px] font-semibold" style={{ color: AMBER }}>
        {semFormacao ?? "Sem formação cadastrada. O RH precisa cadastrar para ele poder receber turmas."}
      </p>
    );
  }
  return (
    <div className="space-y-1">
      {formacoes.map((f, i) => (
        <p key={i} className="flex items-start gap-1.5 text-[11.5px]" style={{ color: INK }}>
          <IconGrad size={13} className="mt-0.5 flex-none" style={{ color: f.habilita ? GREEN : INK_SOFT }} />
          <span>
            {f.curso}
            <span style={{ color: INK_SOFT }}> · {f.instituicao}{f.ano_conclusao ? `, ${f.ano_conclusao}` : ""}</span>
            {!f.habilita && <span style={{ color: INK_SOFT }}> (pós-graduação, não habilita sozinha)</span>}
          </span>
        </p>
      ))}
      {habilitado.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <span className="text-[11px] font-semibold" style={{ color: GREEN }}>Habilitado a lecionar:</span>
          {habilitado.map((m) => <Pill key={m} color={GREEN}>{m}</Pill>)}
        </div>
      ) : (
        <p className="text-[11.5px] font-semibold" style={{ color: AMBER }}>Nenhuma formação dele habilita para lecionar (falta a licenciatura).</p>
      )}
    </div>
  );
}
