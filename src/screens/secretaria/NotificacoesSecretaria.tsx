/* Notificações da Secretaria.
   Dois tipos de aviso, todos com atalho para a tela certa:
   - Pendências calculadas agora: matrículas em análise e alunos sem turma (GET /api/rede/matriculas/)
     e, para o RH, aulas sem professor (GET /api/rh/carencias/); para a DIES, pedidos das escolas esperando resposta (GET /api/solicitacoes/).
   - Comunicados dos últimos 30 dias (GET /api/notificacoes/). "Marcar lidas" = POST /api/notificacoes/. */

import { useState } from "react";
import { Chips } from "@/components/Chips";
import { EmptyState } from "@/components/EmptyState";
import { AvisoErro, EstadoApi } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconBell, IconChat, IconChevron, IconEdit, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import type { ErroApi } from "@/lib/api";
import { dataHoraBR } from "@/lib/formato";
import type { Notificacao, Pedido } from "@/lib/tipos";
import { SCREENS } from "@/routes";
import type { ScreenId } from "@/routes";
import { AMBER, BLUE, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type MatriculasRegional = { em_analise: number; sem_turma: number };
type Carencia = { tipo: "sem_professor" | "substituicao"; aulas: number };
type Categoria = "todas" | "pendencias" | "comunicados";
type Alerta = { id: string; titulo: string; texto: string; cor: string; Icon: (p: IconProps) => React.ReactElement; tela: ScreenId; acao: string };

/* A API manda o nome da tela ("comunicados"); só navegamos se ela existir no app. */
const telaValida = (tela: string | null): ScreenId | null => ((SCREENS as readonly string[]).includes(tela ?? "") ? (tela as ScreenId) : null);

/* "Hoje", "Ontem", "Esta semana" ou "Antes", para agrupar os comunicados. */
function quandoFoi(iso: string) {
  const dia = new Date(iso);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.floor((hoje.getTime() - new Date(dia.getFullYear(), dia.getMonth(), dia.getDate()).getTime()) / 86400000);
  return dias <= 0 ? "Hoje" : dias === 1 ? "Ontem" : dias < 7 ? "Esta semana" : "Antes";
}

export function NotificacoesSecretaria({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const ehRh = !!usuario && (usuario.setor === "rh" || usuario.is_superuser);
  const notificacoes = useApi<Notificacao[]>("/api/notificacoes/");
  const matriculas = useApi<MatriculasRegional[]>("/api/rede/matriculas/");
  const carencias = useApi<Carencia[]>(ehRh ? "/api/rh/carencias/" : null);
  const ehDies = !!usuario && (usuario.setor === "dies" || usuario.is_superuser);
  const pedidos = useApi<Pedido[]>(ehDies ? "/api/solicitacoes/?status=aberta" : null);
  const [cat, setCat] = useState<Categoria[]>(["todas"]);
  const [erroMarcar, setErroMarcar] = useState("");

  // Pendências: só entram as que têm algo a fazer.
  const emAnalise = (matriculas.dados ?? []).reduce((s, r) => s + r.em_analise, 0);
  const semTurma = (matriculas.dados ?? []).reduce((s, r) => s + r.sem_turma, 0);
  const semProfessor = (carencias.dados ?? []).filter((c) => c.tipo === "sem_professor").reduce((s, c) => s + c.aulas, 0);
  const substituir = (carencias.dados ?? []).filter((c) => c.tipo === "substituicao").reduce((s, c) => s + c.aulas, 0);
  const esperando = (pedidos.dados ?? []).filter((p) => p.ultima_fala === "escola").length;
  const alertas: Alerta[] = [];
  if (esperando) alertas.push({ id: "pedidos", titulo: `${esperando} ${esperando === 1 ? "pedido de escola esperando" : "pedidos de escolas esperando"} resposta`, texto: "Turmas novas, mudança de capacidade e outros assuntos.", cor: BLUE, Icon: IconChat, tela: "diesPedidos", acao: "Responder" });
  if (semTurma) alertas.push({ id: "sem-turma", titulo: `${semTurma} ${semTurma === 1 ? "aluno sem turma" : "alunos sem turma"}`, texto: "Matrículas ativas que ainda não foram colocadas numa turma.", cor: RED, Icon: IconUsers, tela: "secEnturmacao", acao: "Enturmar" });
  if (emAnalise) alertas.push({ id: "em-analise", titulo: `${emAnalise} ${emAnalise === 1 ? "matrícula em análise" : "matrículas em análise"}`, texto: "Pedidos de matrícula que as escolas ainda não confirmaram.", cor: AMBER, Icon: IconEdit, tela: "secMatriculas", acao: "Ver matrículas" });
  if (semProfessor) alertas.push({ id: "sem-professor", titulo: `${semProfessor} aulas por semana sem professor`, texto: "Matérias da matriz sem ninguém lotado.", cor: RED, Icon: IconAlert, tela: "rhCarencias", acao: "Ver carências" });
  if (substituir) alertas.push({ id: "substituir", titulo: `${substituir} aulas por semana para substituir`, texto: "Professores afastados hoje que estão lotados em turmas.", cor: AMBER, Icon: IconAlert, tela: "rhCarencias", acao: "Ver carências" });

  const comunicados = notificacoes.dados ?? [];
  const naoLidas = comunicados.filter((n) => n.nova).length;
  const verPendencias = cat[0] !== "comunicados";
  const verComunicados = cat[0] !== "pendencias";

  const marcarLidas = async () => {
    setErroMarcar("");
    try {
      await api("/api/notificacoes/", { method: "POST" });
      notificacoes.recarregar();
    } catch (e) {
      setErroMarcar((e as ErroApi).message);
    }
  };

  const carregando = notificacoes.carregando || matriculas.carregando || carencias.carregando || pedidos.carregando;
  const erro = notificacoes.erro ?? matriculas.erro ?? carencias.erro ?? pedidos.erro;
  const nada = (!verPendencias || alertas.length === 0) && (!verComunicados || comunicados.length === 0);

  return (
    <>
      <TopBar title="Notificações" subtitle={naoLidas ? `${naoLidas} não lidas · Secretaria` : "Tudo em dia"} onBack={back} accent={AMBER}
        right={naoLidas ? <button onClick={marcarLidas} className="text-[12px] font-semibold" style={{ color: BLUE }}>Marcar lidas</button> : undefined} />
      <Screen>
        <EstadoApi carregando={carregando} erro={erro} onRetry={() => { notificacoes.recarregar(); matriculas.recarregar(); carencias.recarregar(); pedidos.recarregar(); }}>
          <div className="grid grid-cols-3 gap-2">
            {[{ n: alertas.length, l: "Pendências", c: RED }, { n: comunicados.length, l: "Comunicados", c: TEAL }, { n: naoLidas, l: "Não lidas", c: BLUE }].map((k) => (
              <div key={k.l} className="card p-3 text-center"><p className="text-[20px] font-extrabold" style={{ color: k.c }}>{k.n}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</p></div>
            ))}
          </div>
          {erroMarcar && <div className="mt-3"><AvisoErro texto={erroMarcar} /></div>}
          <div className="mt-3"><Chips<Categoria> items={[{ id: "todas", label: "Todas" }, { id: "pendencias", label: "Pendências" }, { id: "comunicados", label: "Comunicados" }]} value={cat} onChange={setCat} cor={AMBER} /></div>
          {nada && <EmptyState title="Nada por aqui" text="Nenhuma pendência ou comunicado nesta categoria." icon={<IconBell size={26} />} />}

          {verPendencias && alertas.length > 0 && (
            <>
              <SectionHeader title="Pendências agora" />
              <div className="space-y-2.5">
                {alertas.map((a) => (
                  <button key={a.id} onClick={() => nav(a.tela)} className="card flex w-full items-start gap-3 p-3.5 text-left" style={{ borderLeft: `3px solid ${a.cor}` }}>
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: a.cor + "16", color: a.cor }}><a.Icon size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold" style={{ color: INK }}>{a.titulo}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>{a.texto}</p>
                      <span className="mt-2 flex items-center gap-1 text-[12px] font-bold" style={{ color: a.cor }}>{a.acao}<IconChevron size={14} /></span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {verComunicados && (["Hoje", "Ontem", "Esta semana", "Antes"] as const).map((dia) => {
            const grupo = comunicados.filter((n) => quandoFoi(n.quando) === dia);
            if (!grupo.length) return null;
            return (
              <div key={dia}>
                <SectionHeader title={dia} />
                <div className="space-y-2.5">
                  {grupo.map((n) => {
                    const tela = telaValida(n.tela);
                    return (
                      <div key={n.id} className="card flex items-start gap-3 p-3.5" style={{ borderLeft: n.nova ? `3px solid ${TEAL}` : "3px solid transparent" }}>
                        <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: TEAL + "16", color: TEAL }}><IconChat size={20} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2"><p className="min-w-0 text-[13.5px] font-bold" style={{ color: INK }}>{n.titulo}</p>{n.nova && <span className="h-2 w-2 flex-none rounded-full" style={{ background: RED }} />}<span className="ml-auto flex-none text-[11px]" style={{ color: "#94a3b8" }}>{dataHoraBR(n.quando)}</span></div>
                          <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>{n.texto}</p>
                          {tela && <button onClick={() => nav(tela)} className="mt-2 flex items-center gap-1 text-[12px] font-bold" style={{ color: TEAL }}>{n.tipo === "comunicado" ? "Abrir comunicados" : "Abrir"}<IconChevron size={14} /></button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </EstadoApi>
      </Screen>
    </>
  );
}
