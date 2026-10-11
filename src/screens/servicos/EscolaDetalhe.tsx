import { Pill } from "@/components/Pill";
import { RouteButton } from "@/components/RouteButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconPin, IconShield, IconX } from "@/components/icons";
import { FILTRO_TAG, INFRA_LABEL, vagasTot } from "@/data/escolas";
import type { EscolaRede, Infra } from "@/data/escolas";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

export function EscolaDetalhe({ esc, gestor, onBack }: { esc: EscolaRede; gestor: boolean; onBack: () => void }) {
  const tot = vagasTot(esc);
  return (
    <>
      <TopBar title={esc.nome} subtitle={`${esc.bairro} · ${esc.cidade}`} onBack={onBack} accent={GREEN} />
      <Screen>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>Escola municipal · {esc.dist}</p>
          <p className="mt-1 flex items-center gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} />{esc.bairro}, {esc.cidade} - SE</p>
          <div className={`mt-3 grid gap-2 ${gestor ? "grid-cols-3" : "grid-cols-1"}`}>
            {gestor && <div className="rounded-2xl p-3" style={{ background: BLUE + "0e" }}><p className="text-[18px] font-extrabold" style={{ color: BLUE }}>{esc.alunos.toLocaleString("pt-BR")}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Alunos matriculados</p></div>}
            {gestor && <div className="rounded-2xl p-3" style={{ background: TEAL + "0e" }}><p className="text-[18px] font-extrabold" style={{ color: TEAL }}>{esc.servidores}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Servidores</p></div>}
            <div className="rounded-2xl p-3" style={{ background: (tot ? GREEN : RED) + "12" }}><p className="text-[18px] font-extrabold" style={{ color: tot ? GREEN : RED }}>{tot}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Vagas disponíveis</p></div>
          </div>
          {!gestor && <p className="mt-2 flex items-center gap-1.5 text-[10.5px]" style={{ color: INK_SOFT }}><IconShield size={12} />Número de matriculados visível apenas para a gestão.</p>}
          {esc.filtros.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{esc.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}</div>}
        </div>

        <SectionHeader title="Vagas por etapa e turno" />
        <div className="card divide-y" style={{ borderColor: "#eef2f7" }}>
          {esc.vagasDet.map((v) => (
            <div key={v.etapa + v.turno} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "#eef2f7" }}>
              <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{v.etapa}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{v.turno}</p></div>
              {v.n > 0 ? <Pill color={v.n < 6 ? AMBER : GREEN}>{v.n} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
            </div>
          ))}
        </div>

        <SectionHeader title="Infraestrutura" />
        <div className="card grid grid-cols-2 gap-2.5 p-4">
          {(Object.keys(INFRA_LABEL) as Infra[]).map((k) => {
            const tem = esc.infra.includes(k);
            return (
              <div key={k} className="flex items-center gap-2 text-[12px]" style={{ color: tem ? INK : "#94a3b8" }}>
                <span className="grid h-5 w-5 flex-none place-items-center rounded-full" style={{ background: tem ? GREEN + "18" : RED + "12", color: tem ? GREEN : RED }} aria-label={tem ? "Sim" : "Não"}>{tem ? <IconCheck size={12} strokeWidth={2.6} /> : <IconX size={11} strokeWidth={2.4} />}</span>
                {INFRA_LABEL[k]}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex"><RouteButton lat={esc.lat} lng={esc.lng} /></div>
      </Screen>
    </>
  );
}
