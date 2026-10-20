/* Meu perfil: quem está logado, atalhos, dados cadastrais e privacidade.
   Dados reais: o usuário logado (vem do login) e, para aluno e responsável, /api/meus-alunos/
   (o aluno vê código, turma e escola; o responsável vê os filhos).
   Sem login (galeria "Todas as telas") mostra um exemplo. */

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { EstadoApi } from "@/components/Form";
import { IconChat, IconChevron, IconEdit, IconGrid, IconLayers, IconLogout, IconShield } from "@/components/icons";
import { ALUNO } from "@/data/aluno";
import { PERFIS } from "@/data/perfis";
import { useApi } from "@/hooks/useApi";
import { dataBR } from "@/lib/formato";
import type { MeuAluno, Usuario } from "@/lib/tipos";
import type { ScreenId } from "@/routes";
import { BLUE, GREEN, INDIGO, INK, INK_SOFT, RED } from "@/theme/colors";
import type { Perfil } from "@/types";

export function MeuPerfil({ back, onLogout, perfil, nav, usuario }: { back: () => void; onLogout: () => void; perfil: Perfil; nav: (s: ScreenId) => void; usuario: Usuario | null }) {
  const [privacidade, setPrivacidade] = useState({ dados: true, notif: true, localizacao: false });
  const nomeMap: Record<Perfil, string> = { aluno: ALUNO.nome, responsavel: "Regina Nunes", professor: "Prof. Carlos Menezes", escola: "Diretora Márcia Lopes", secretaria: "Gestor Rafael Andrade" };
  // Logado pela API: nome e dados reais. Sem login (galeria de telas): dados de exemplo.
  const nome = usuario?.nome ?? nomeMap[perfil];
  // Aluno: ele mesmo. Responsável: os filhos. (Só busca quando é um desses perfis.)
  const daFamilia = usuario !== null && (usuario.perfil === "aluno" || usuario.perfil === "responsavel");
  const alunos = useApi<MeuAluno[]>(daFamilia ? "/api/meus-alunos/" : null);
  const eu = usuario?.perfil === "aluno" ? alunos.dados?.[0] ?? null : null;
  const detalhe = !usuario ? null
    : eu ? [eu.turma_nome, eu.escola_nome].filter(Boolean).join(" · ") || usuario.perfil_nome
    : [usuario.perfil_nome, usuario.setor_nome, usuario.escola_nome].filter(Boolean).join(" · ");
  const info = usuario
    ? [
      { l: "Usuário", v: usuario.username },
      { l: "E-mail", v: usuario.email || "não informado" },
      ...(eu ? [
        { l: "Código do aluno", v: eu.codigo },
        { l: "Data de nascimento", v: dataBR(eu.data_nascimento) },
        { l: "Turma", v: eu.turma_nome ?? "sem turma" },
        { l: "Escola", v: eu.escola_nome ?? "—" },
        ...(eu.programa_nome ? [{ l: "Programa social", v: eu.programa_nome }] : []),
      ] : []),
    ]
    // Galeria sem login: dados de exemplo
    : [
      { l: "CPF", v: "***.456.789-**" },
      { l: "E-mail", v: "ana.nunes@edu.se.gov.br" },
      { l: "Data de nascimento", v: "14/03/2010" },
    ];
  return (
    <>
      <TopBar title="Perfil" onBack={back} accent={BLUE} right={<button onClick={() => nav("configuracoes")} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconEdit size={18} /></button>} />
      <Screen>
        <div className="card flex flex-col items-center p-5">
          <Avatar name={nome} color={PERFIS.find((p) => p.id === perfil)!.cor} size={72} />
          <h2 className="mt-3 text-[17px] font-bold" style={{ color: INK }}>{nome}</h2>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{detalhe ?? (perfil === "aluno" ? `${ALUNO.turma} · ${ALUNO.escola}` : perfil === "responsavel" ? `Responsável · ${ALUNO.nome}` : "Rede Estadual de Sergipe")}</p>
          <div className="mt-3"><Pill color={PERFIS.find((p) => p.id === perfil)!.cor}>{PERFIS.find((p) => p.id === perfil)!.label}</Pill></div>
        </div>

        {usuario?.perfil === "responsavel" && (
          <>
            <SectionHeader title="Meus filhos" />
            <EstadoApi carregando={alunos.carregando} erro={alunos.erro} onRetry={alunos.recarregar}>
              {(alunos.dados ?? []).length === 0 ? (
                <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Nenhum aluno ligado a esta conta. Procure a secretaria da escola.</p>
              ) : (
                <div className="card divide-y divide-[color:var(--color-line)]">
                  {(alunos.dados ?? []).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar name={a.nome} color={INDIGO} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{a.nome}</p>
                        <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{a.turma_nome ?? "Sem turma"} · {a.escola_nome ?? "sem escola"}</p>
                        <p className="text-[11px]" style={{ color: INK_SOFT }}>Código {a.codigo}{a.programa_nome ? ` · ${a.programa_nome}` : ""}</p>
                      </div>
                      {a.parentesco && <Pill color={INDIGO}>{a.parentesco}</Pill>}
                    </div>
                  ))}
                </div>
              )}
            </EstadoApi>
          </>
        )}

        <SectionHeader title="Preferências" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[
            { t: "Configurações e acessibilidade", d: "Fonte, contraste, notificações", Icon: IconGrid, s: "configuracoes" as ScreenId },
            { t: "Central de mensagens", d: "Falar com a escola", Icon: IconChat, s: "chat" as ScreenId },
            { t: "Todas as telas do protótipo", d: "Atalho para qualquer tela", Icon: IconLayers, s: "telas" as ScreenId },
          ].map((o) => (
            <button key={o.t} onClick={() => nav(o.s)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[color:var(--color-surface)] transition">
              <div className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: BLUE + "12", color: BLUE }}><o.Icon size={18} /></div>
              <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.d}</p></div>
              <IconChevron size={18} style={{ color: "#cbd5e1" }} />
            </button>
          ))}
        </div>
        <SectionHeader title="Dados cadastrais" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {info.map((i) => (<div key={i.l} className="flex items-center justify-between gap-3 px-4 py-3"><span className="flex-none text-[12.5px]" style={{ color: INK_SOFT }}>{i.l}</span><span className="min-w-0 truncate text-right text-[13px] font-semibold" style={{ color: INK }}>{i.v}</span></div>))}
        </div>
        <SectionHeader title="Privacidade e LGPD" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[{ k: "dados", t: "Compartilhar dados com a escola", d: "Necessário para serviços acadêmicos" }, { k: "notif", t: "Notificações por e-mail", d: "Avisos e comunicados" }, { k: "localizacao", t: "Usar localização", d: "Sugerir escolas próximas" }].map((o) => {
            const on = (privacidade as any)[o.k];
            return (
              <div key={o.k} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.d}</p></div>
                <button onClick={() => setPrivacidade({ ...privacidade, [o.k]: !on })} className="relative h-6 w-11 flex-none rounded-full transition" style={{ background: on ? GREEN : "#cbd5e1" }}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "22px" : "2px" }} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: BLUE + "0d" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: BLUE } as any} />
          <p className="text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD nº 13.709/2018). <span className="font-semibold" style={{ color: BLUE }}>Saiba mais</span></p>
        </div>
        <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold" style={{ background: RED + "12", color: RED }}><IconLogout size={18} />Sair da conta</button>
      </Screen>
    </>
  );
}
