/* Tela inicial do responsável: um cartão para cada filho, com média, frequência e alertas.
   Dados reais:
   - /api/meus-alunos/: os filhos ligados a este responsável;
   - /api/boletim/?aluno=ID e /api/minhas-tarefas/?aluno=ID: números e alertas de cada filho;
   - /api/comunicados/: avisos recentes.
   Alertas: frequência abaixo do mínimo do programa social (ou dos 75% da escola),
   média abaixo de 6 em alguma matéria e tarefas atrasadas.
   Tocar num atalho do cartão já deixa aquele filho escolhido nas outras telas. */

import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { SectionHeader } from "@/components/SectionHeader";
import { IconAlert, IconBell, IconBook, IconBus, IconCalendar, IconChat, IconCheck, IconClock, IconDoc, IconEdit, IconFood, IconGrid, IconPin, IconSend, IconStar, IconUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataHoraBR, notaBR, porcentoBR } from "@/lib/formato";
import type { Boletim, Comunicado, MeuAluno, MinhaTarefa } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { abaixoDaMedia } from "@/screens/aluno/Boletim";
import { minimoDoPrograma } from "@/screens/aluno/Frequencia";
import { AMBER, BLUE, GREEN, INDIGO, INK, INK_SOFT, PINK, RED, TEAL, VIOLET, shade } from "@/theme/colors";

export function ResponsavelHome({ nav }: { nav: (s: ScreenId) => void }) {
  const usuario = useUsuario();
  const { filhos, escolher } = useAlunoEscolhido();
  const comunicados = useApi<Comunicado[]>("/api/comunicados/");
  const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Tarefas", Icon: IconEdit, cor: VIOLET, s: "tarefas" },
    { label: "Calendário", Icon: IconCalendar, cor: "#0ea5e9", s: "calendario" },
    { label: "Histórico", Icon: IconBook, cor: INDIGO, s: "historico" },
    { label: "Comunicação", Icon: IconChat, cor: PINK, s: "chat" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
    { label: "Enviar documentos", Icon: IconSend, cor: TEAL, s: "documentos" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
  ];

  // Abre uma tela já com aquele filho escolhido
  const abrirDoFilho = (id: number, tela: ScreenId) => { escolher(id); nav(tela); };
  const lista = filhos.dados ?? [];

  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${INDIGO}, ${shade(INDIGO)})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name={usuario?.nome ?? "Responsável"} color="#ffffff33" size={46} />
          <div className="min-w-0 flex-1"><p className="text-[12px] text-white/80">Olá{primeiroNome ? `, ${primeiroNome}` : ""}</p><h1 className="truncate text-[16px] font-bold">Acompanhamento familiar</h1></div>
          <button onClick={() => nav("notificacoes")} aria-label="Notificações" className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /></button>
        </div>
        {lista.length > 0 && (
          <p className="mt-3 rounded-2xl bg-white/12 px-3 py-2.5 text-[12px] text-white/85">
            {lista.length === 1 ? "1 aluno" : `${lista.length} alunos`} ligados à sua conta: {lista.map((a) => a.nome.split(" ")[0]).join(" e ")}
          </p>
        )}
      </div>
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <SectionHeader title={lista.length === 1 ? "Seu filho" : "Seus filhos"} />
        <EstadoApi carregando={filhos.carregando} erro={filhos.erro} onRetry={filhos.recarregar}>
          {lista.length === 0 ? (
            <EmptyState title="Nenhum aluno ligado" text="Peça à secretaria da escola para ligar seu cadastro ao do aluno." icon={<IconUsers size={26} />} />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {lista.map((a) => <CartaoFilho key={a.id} aluno={a} abrir={(tela) => abrirDoFilho(a.id, tela)} />)}
            </div>
          )}
        </EstadoApi>

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-center text-[11px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Comunicados recentes" action="Ver tudo" onAction={() => nav("comunicados")} />
        {comunicados.carregando ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Carregando...</p>
          : (comunicados.dados ?? []).length === 0 ? <div className="card p-3.5 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum comunicado por enquanto.</div>
          : (
            <div className="space-y-2.5">
              {(comunicados.dados ?? []).slice(0, 3).map((c) => (
                <button key={c.id} onClick={() => nav("comunicados")} className="card flex w-full items-start gap-3 p-3.5 text-left active:scale-[0.99] transition">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full" style={{ background: c.alcance === "turma" ? AMBER : c.alcance === "escola" ? TEAL : BLUE }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold" style={{ color: INK }}>{c.titulo}</p>
                    <p className="line-clamp-1 text-[11.5px]" style={{ color: INK_SOFT }}>{c.texto}</p>
                    <p className="mt-0.5 text-[10.5px]" style={{ color: "#94a3b8" }}>{c.para} · {dataHoraBR(c.criado_em)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
      </div>
    </>
  );
}

/* Cartão de um filho: busca o boletim e as tarefas dele e monta os alertas. */
function CartaoFilho({ aluno, abrir }: { aluno: MeuAluno; abrir: (tela: ScreenId) => void }) {
  const boletim = useApi<Boletim>(`/api/boletim/?aluno=${aluno.id}`);
  const tarefas = useApi<MinhaTarefa[]>(`/api/minhas-tarefas/?aluno=${aluno.id}`);
  const b = boletim.dados;
  const aprovacao = b?.media_aprovacao ?? "6.0";
  const minimoEscola = b?.frequencia_minima ?? 75;
  const minimoProg = minimoDoPrograma(aluno.programa_social);
  const freq = b?.frequencia_geral ?? null;

  // Alertas que merecem a atenção da família
  const alertas: { texto: string; tela: ScreenId; cor: string }[] = [];
  if (freq !== null && freq < minimoEscola) {
    alertas.push({ texto: `Frequência de ${porcentoBR(freq)}: abaixo dos ${minimoEscola}% exigidos pela escola`, tela: "frequencia", cor: RED });
  } else if (freq !== null && minimoProg && freq < minimoProg) {
    alertas.push({ texto: `Frequência de ${porcentoBR(freq)}: o ${aluno.programa_nome} exige ${minimoProg}%`, tela: "frequencia", cor: AMBER });
  }
  const notasBaixas = (b?.materias ?? []).filter((m) => abaixoDaMedia(m.media, aprovacao));
  if (notasBaixas.length) {
    alertas.push({ texto: `Média abaixo de ${notaBR(aprovacao)} em ${notasBaixas.map((m) => m.materia_nome).join(", ")}`, tela: "notas", cor: RED });
  }
  const atrasadas = (tarefas.dados ?? []).filter((t) => t.status === "Atrasada");
  if (atrasadas.length) {
    alertas.push({ texto: `${atrasadas.length} ${atrasadas.length === 1 ? "tarefa atrasada" : "tarefas atrasadas"}: ${atrasadas.map((t) => t.materia_nome).join(", ")}`, tela: "tarefas", cor: RED });
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <Avatar name={aluno.nome} color={INDIGO} size={42} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold" style={{ color: INK }}>{aluno.nome}</p>
          <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{aluno.turma_nome ?? "Sem turma"} · {aluno.escola_nome ?? "sem escola"}</p>
        </div>
        {aluno.parentesco && <Pill color={INDIGO}>{aluno.parentesco}</Pill>}
      </div>

      <EstadoApi carregando={boletim.carregando} erro={boletim.erro} onRetry={boletim.recarregar}>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button onClick={() => abrir("notas")} className="rounded-xl p-3 text-left" style={{ background: "#f4f7fb" }}>
            <span className="text-[11px] font-medium" style={{ color: INK_SOFT }}>Média geral</span>
            <div className="text-[22px] font-extrabold" style={{ color: abaixoDaMedia(b?.media_geral, aprovacao) ? RED : BLUE }}>{notaBR(b?.media_geral)}</div>
          </button>
          <button onClick={() => abrir("frequencia")} className="rounded-xl p-3 text-left" style={{ background: "#f4f7fb" }}>
            <span className="text-[11px] font-medium" style={{ color: INK_SOFT }}>Frequência</span>
            <div className="text-[22px] font-extrabold" style={{ color: freq !== null && freq < minimoEscola ? RED : minimoProg && freq !== null && freq < minimoProg ? AMBER : GREEN }}>{porcentoBR(freq)}</div>
          </button>
        </div>
        {aluno.programa_nome && <p className="mt-2 text-[11px]" style={{ color: INK_SOFT }}>{aluno.programa_nome}: frequência mínima de {minimoProg}%.</p>}

        {alertas.length > 0 ? (
          <div className="mt-3 space-y-1.5">
            {alertas.map((al) => (
              <button key={al.texto} onClick={() => abrir(al.tela)} className="flex w-full items-start gap-2 rounded-xl p-2.5 text-left" style={{ background: al.cor + "10" }}>
                <IconAlert size={16} className="mt-0.5 flex-none" style={{ color: al.cor }} />
                <span className="text-[12px] leading-snug" style={{ color: INK }}>{al.texto}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-xl p-2.5 text-[12px]" style={{ background: GREEN + "10", color: INK }}>
            <IconCheck size={16} style={{ color: GREEN }} />Nenhum alerta. Está tudo em dia!
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {([["boletim", "Boletim"], ["tarefas", "Tarefas"], ["horarios", "Horários"]] as [ScreenId, string][]).map(([tela, nome]) => (
            <button key={tela} onClick={() => abrir(tela)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold" style={{ background: INDIGO + "12", color: INDIGO }}>{nome}</button>
          ))}
        </div>
      </EstadoApi>
    </div>
  );
}
