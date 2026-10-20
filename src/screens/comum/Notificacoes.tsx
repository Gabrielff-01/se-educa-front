/* Notificações dos últimos 30 dias: notas lançadas, faltas, tarefas novas, comunicados e respostas dos pedidos à DIES.
   Dados: GET /api/notificacoes/ (cada item tem tipo, título, texto, quando e "nova").
   Assim que a lista chega, POST /api/notificacoes/ marca tudo como lido no servidor
   (o número do sino some). As que eram novas continuam destacadas até sair da tela. */

import { useEffect, useRef } from "react";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconBell, IconChat, IconChevron, IconEdit, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import type { Notificacao } from "@/lib/tipos";
import { SCREENS } from "@/routes";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

/* Ícone e cor de cada tipo que a API manda */
const ESTILO: Record<string, { Icon: (p: IconProps) => React.ReactElement; cor: string }> = {
  nota: { Icon: IconStar, cor: BLUE },
  falta: { Icon: IconAlert, cor: AMBER },
  tarefa: { Icon: IconEdit, cor: VIOLET },
  comunicado: { Icon: IconChat, cor: TEAL },
  pedido: { Icon: IconChat, cor: BLUE },
};
const PADRAO = { Icon: IconBell, cor: GREEN };

/* "Há 10 min", "Há 3 h", "Ontem", "Há 5 dias" */
function haQuanto(quando: string) {
  const data = new Date(quando.replace(" ", "T")); // a API às vezes manda "2026-10-20 13:00:32+00:00"
  if (Number.isNaN(data.getTime())) return "";
  const minutos = Math.floor((Date.now() - data.getTime()) / 60000);
  if (minutos < 1) return "Agora";
  if (minutos < 60) return `Há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? "Ontem" : `Há ${dias} dias`;
}

export function Notificacoes({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const notificacoes = useApi<Notificacao[]>("/api/notificacoes/");
  const marcou = useRef(false); // marca como lido uma vez só por visita à tela

  useEffect(() => {
    if (!notificacoes.dados || marcou.current) return;
    marcou.current = true;
    // Não recarregamos a lista depois: assim as "novas" ficam destacadas até sair da tela.
    api("/api/notificacoes/", { method: "POST" }).catch(() => { marcou.current = false; });
  }, [notificacoes.dados]);

  const todas = notificacoes.dados ?? [];
  const novas = todas.filter((n) => n.nova);
  const antigas = todas.filter((n) => !n.nova);

  return (
    <>
      <TopBar title="Notificações" subtitle={notificacoes.dados ? (novas.length ? `${novas.length} ${novas.length === 1 ? "nova" : "novas"}` : "Tudo em dia") : "Últimos 30 dias"} onBack={back} accent={RED} />
      <Screen>
        <EstadoApi carregando={notificacoes.carregando} erro={notificacoes.erro} onRetry={notificacoes.recarregar}>
          {todas.length === 0 ? (
            <EmptyState title="Nenhuma notificação" text="Notas, faltas, tarefas e comunicados dos últimos 30 dias aparecem aqui." icon={<IconBell size={26} />} />
          ) : (
            <>
              {novas.length > 0 && (
                <>
                  <SectionHeader title="Novas" />
                  <div className="space-y-2.5">{novas.map((n) => <Item key={n.id} n={n} nav={nav} />)}</div>
                </>
              )}
              {antigas.length > 0 && (
                <>
                  <SectionHeader title={novas.length ? "Anteriores" : "Últimos 30 dias"} />
                  <div className="space-y-2.5">{antigas.map((n) => <Item key={n.id} n={n} nav={nav} />)}</div>
                </>
              )}
            </>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}

function Item({ n, nav }: { n: Notificacao; nav: (s: ScreenId) => void }) {
  const { Icon, cor } = ESTILO[n.tipo] ?? PADRAO;
  // Só os pedidos à DIES ganham atalho: as outras notificações já ficam no menu do aluno.
  const tela = n.tipo === "pedido" && (SCREENS as readonly string[]).includes(n.tela ?? "") ? (n.tela as ScreenId) : null;
  return (
    <div className="card flex items-start gap-3 p-3.5" style={{ borderLeft: n.nova ? `3px solid ${cor}` : "3px solid transparent", background: n.nova ? undefined : "#fbfcfe" }}>
      <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={20} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{n.titulo}</p>{n.nova && <span className="h-2 w-2 flex-none rounded-full" style={{ background: RED }} />}</div>
        <p className="text-[12px]" style={{ color: INK_SOFT }}>{n.texto}</p>
        <p className="mt-1 text-[11px]" style={{ color: "#94a3b8" }}>{haQuanto(n.quando)}</p>
        {tela && <button onClick={() => nav(tela)} className="mt-2 flex items-center gap-1 text-[12px] font-bold" style={{ color: cor }}>Abrir pedido<IconChevron size={14} /></button>}
      </div>
    </div>
  );
}
