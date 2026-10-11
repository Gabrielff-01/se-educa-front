import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconChat, IconChevron, IconEdit, IconGrid, IconLayers, IconLogout, IconShield } from "@/components/icons";
import { ALUNO } from "@/data/aluno";
import { PERFIS } from "@/data/perfis";
import type { ScreenId } from "@/routes";
import { BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";
import type { Perfil } from "@/types";

export function MeuPerfil({ back, onLogout, perfil, nav }: { back: () => void; onLogout: () => void; perfil: Perfil; nav: (s: ScreenId) => void }) {
  const [privacidade, setPrivacidade] = useState({ dados: true, notif: true, localizacao: false });
  const nomeMap: Record<Perfil, string> = { aluno: ALUNO.nome, responsavel: "Regina Nunes", professor: "Prof. Carlos Menezes", escola: "Diretora Márcia Lopes", secretaria: "Gestor Rafael Andrade" };
  const info = [
    { l: "CPF", v: "***.456.789-**" },
    { l: "E-mail", v: "ana.nunes@edu.se.gov.br" },
    { l: "Telefone", v: "(79) 9 9XXX-XX12" },
    { l: "Data de nascimento", v: "14/03/2010" },
  ];
  return (
    <>
      <TopBar title="Perfil" onBack={back} accent={BLUE} right={<button onClick={() => nav("configuracoes")} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconEdit size={18} /></button>} />
      <Screen>
        <div className="card flex flex-col items-center p-5">
          <Avatar name={nomeMap[perfil]} color={PERFIS.find((p) => p.id === perfil)!.cor} size={72} />
          <h2 className="mt-3 text-[17px] font-bold" style={{ color: INK }}>{nomeMap[perfil]}</h2>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{perfil === "aluno" ? `${ALUNO.turma} · ${ALUNO.escola}` : perfil === "responsavel" ? `Responsável · ${ALUNO.nome}` : "Rede Municipal de Aracaju"}</p>
          <div className="mt-3"><Pill color={PERFIS.find((p) => p.id === perfil)!.cor}>{PERFIS.find((p) => p.id === perfil)!.label}</Pill></div>
        </div>

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
          {info.map((i) => (<div key={i.l} className="flex items-center justify-between px-4 py-3"><span className="text-[12.5px]" style={{ color: INK_SOFT }}>{i.l}</span><span className="text-[13px] font-semibold" style={{ color: INK }}>{i.v}</span></div>))}
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
