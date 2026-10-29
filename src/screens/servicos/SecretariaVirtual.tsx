/* Secretaria Virtual (aluno e responsável): serviços online.
   "Enviar documentos à escola" é de verdade (tela documentos, GET /api/documentos/).
   Os outros serviços ainda são ilustrativos (abrem o acompanhamento de exemplo). */

import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconChevron, IconDoc, IconEdit, IconGrid, IconSend, IconStar } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { COR_DO_STATUS } from "@/lib/documentos";
import { dataBR } from "@/lib/formato";
import type { Documento } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, TEAL } from "@/theme/colors";

export function SecretariaVirtual({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const documentos = useApi<Documento[]>("/api/documentos/");
  const recentes = (documentos.dados ?? []).slice(0, 3);
  const servicos = [
    { t: "Declaração de matrícula", d: "Emissão imediata", Icon: IconDoc, cor: BLUE },
    { t: "Histórico escolar", d: "Prazo de 5 dias úteis", Icon: IconBook, cor: TEAL },
    { t: "Transferência", d: "Solicitar mudança de escola", Icon: IconGrid, cor: GREEN },
    { t: "Atualização cadastral", d: "Dados pessoais e contato", Icon: IconEdit, cor: AMBER },
    { t: "Segunda via de boletim", d: "Ano letivo atual", Icon: IconStar, cor: "#8b5cf6" },
    { t: "Requerimentos", d: "Outras solicitações", Icon: IconSend, cor: "#ec4899" },
  ];
  return (
    <>
      <TopBar title="Secretaria Virtual" subtitle="Serviços online" onBack={back} accent={BLUE} />
      <Screen>
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
          <p className="text-[13px] font-semibold">Resolva sem sair de casa 🏠</p>
          <p className="mt-1 text-[12px] text-white/85">Solicite documentos e serviços da rede municipal em poucos toques.</p>
        </div>
        <SectionHeader title="Serviços disponíveis" />
        <div className="space-y-2.5">
          <button onClick={() => nav("documentos")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition" style={{ outline: `2px solid ${TEAL}33` }}>
            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: TEAL + "16", color: TEAL }}><IconSend size={22} /></div>
            <div className="flex-1"><p className="text-[13.5px] font-semibold" style={{ color: INK }}>Enviar documentos à escola</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Atestado, certidão, comprovante, vacinação...</p></div>
            <Pill color={TEAL}>Novo</Pill>
          </button>
          {servicos.map((s) => (
            <button key={s.t} onClick={() => nav("acompanhamento")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: s.cor + "16", color: s.cor }}><s.Icon size={22} /></div>
              <div className="flex-1"><p className="text-[13.5px] font-semibold" style={{ color: INK }}>{s.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{s.d}</p></div>
              <IconChevron size={18} style={{ color: "#cbd5e1" }} />
            </button>
          ))}
        </div>
        <SectionHeader title="Documentos enviados" action="Ver todos" onAction={() => nav("documentos")} />
        {documentos.carregando ? (
          <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
        ) : recentes.length === 0 ? (
          <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Você ainda não mandou documentos para a escola.</div>
        ) : (
          <div className="space-y-2.5">
            {recentes.map((d) => (
              <button key={d.id} onClick={() => nav("documentos")} className="card flex w-full items-center gap-3 p-3.5 text-left">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: COR_DO_STATUS[d.status] + "16", color: COR_DO_STATUS[d.status] }}><IconDoc size={19} /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{d.tipo_nome}</p><p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{d.aluno_nome.split(" ")[0]} · enviado em {dataBR(d.enviado_em.slice(0, 10))}</p></div>
                <Pill color={COR_DO_STATUS[d.status]}>{d.status_nome}</Pill>
              </button>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
