/* Detalhe público de uma escola (aluno, responsável, professor): contato, endereço,
   cursos e as séries com turma neste ano (com os turnos). A gestão abre a Ficha da escola completa.
   Os dados vêm da lista de /api/escolas/rede/ (a tela Escolas já carregou). */

import { Pill } from "@/components/Pill";
import { RouteButton } from "@/components/RouteButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconPin, IconShield } from "@/components/icons";
import type { EscolaDaRede } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT, VIOLET } from "@/theme/colors";

export function EscolaDetalhe({ esc, onBack }: { esc: EscolaDaRede; onBack: () => void }) {
  const endereco = [esc.endereco && `${esc.endereco}${esc.numero ? `, ${esc.numero}` : ""}`, esc.bairro, `${esc.municipio} - SE`, esc.cep_formatado && `CEP ${esc.cep_formatado}`]
    .filter(Boolean).join(" · ");
  return (
    <>
      <TopBar title={esc.nome} subtitle={`${esc.municipio} · ${esc.regional_nome}`} onBack={onBack} accent={GREEN} />
      <Screen>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>Escola {esc.dependencia_nome.toLowerCase()} · zona {esc.zona_nome.toLowerCase()}</p>
          <p className="mt-1 flex items-start gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} className="mt-0.5 flex-none" />{endereco}</p>
          {(esc.telefone || esc.email) && <p className="mt-1 text-[12px]" style={{ color: INK_SOFT }}>{[esc.telefone, esc.email].filter(Boolean).join(" · ")}</p>}
          <p className="mt-2 flex items-center gap-1.5 text-[10.5px]" style={{ color: INK_SOFT }}><IconShield size={12} />Número de alunos e a ficha completa ficam só para a gestão.</p>
          {(esc.cursos.length > 0 || esc.turnos.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {esc.cursos.map((c) => <Pill key={c} color={VIOLET}>{c}</Pill>)}
              {esc.turnos.map((t) => <Pill key={t} color={INK_SOFT}>{t}</Pill>)}
            </div>
          )}
        </div>

        <SectionHeader title="Séries e turnos" />
        {esc.series.length === 0 ? <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma turma aberta neste ano.</p> : (
          <div className="card divide-y divide-[color:var(--color-line)]">
            {esc.series.map((v) => (
              <div key={v.curso_nome + v.serie_nome} className="flex items-center gap-3 px-4 py-3">
                <p className="min-w-0 flex-1 text-[13px] font-semibold" style={{ color: INK }}>{v.serie_nome} · {v.curso_nome}</p>
                <div className="flex flex-wrap justify-end gap-1">{v.turnos.map((t) => <Pill key={t} color={GREEN}>{t}</Pill>)}</div>
              </div>
            ))}
          </div>
        )}
        {esc.latitude !== null && esc.longitude !== null && <div className="mt-4 flex"><RouteButton lat={esc.latitude} lng={esc.longitude} /></div>}
      </Screen>
    </>
  );
}
