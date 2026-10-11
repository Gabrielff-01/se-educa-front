import { useState } from "react";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconChevron, IconLogout } from "@/components/icons";
import { BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";
import type { A11y } from "@/types";

export function Configuracoes({ back, a11y, setA11y, onLogout }: { back: () => void; a11y: A11y; setA11y: (a: A11y) => void; onLogout: () => void }) {
  const [notif, setNotif] = useState({ push: true, email: true, resultados: true });
  const fontes = [{ l: "A", v: 0.9, n: "Pequena" }, { l: "A", v: 1, n: "Padrão" }, { l: "A", v: 1.15, n: "Grande" }, { l: "A", v: 1.3, n: "Máx." }];
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="relative h-6 w-11 flex-none rounded-full transition" style={{ background: on ? GREEN : "#cbd5e1" }}><span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "22px" : "2px" }} /></button>
  );
  return (
    <>
      <TopBar title="Configurações" subtitle="Preferências e acessibilidade" onBack={back} accent={BLUE} />
      <Screen>
        <SectionHeader title="Acessibilidade" />
        <div className="card p-4">
          <p className="text-[13px] font-semibold" style={{ color: INK }}>Tamanho da fonte</p>
          <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>Ajuste para uma leitura mais confortável.</p>
          <div className="flex gap-2">
            {fontes.map((f, i) => {
              const on = a11y.fontScale === f.v;
              return (
                <button key={i} onClick={() => setA11y({ ...a11y, fontScale: f.v })} className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2.5 transition" style={{ borderColor: on ? BLUE : "#e2e8f0", background: on ? BLUE + "10" : "#fff", color: on ? BLUE : INK_SOFT }}>
                  <span className="font-extrabold" style={{ fontSize: 12 + i * 3 }}>{f.l}</span>
                  <span className="text-[9.5px] font-semibold">{f.n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-3 card divide-y divide-[color:var(--color-line)]">
          <div className="flex items-center gap-3 px-4 py-3"><div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>Alto contraste</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Realça textos e cores</p></div><Toggle on={a11y.contraste} onClick={() => setA11y({ ...a11y, contraste: !a11y.contraste })} /></div>
          <div className="flex items-center gap-3 px-4 py-3"><div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>Reduzir animações</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Menos movimento na tela</p></div><Toggle on={!a11y.animacoes} onClick={() => setA11y({ ...a11y, animacoes: !a11y.animacoes })} /></div>
        </div>

        <SectionHeader title="Notificações" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[{ k: "push", t: "Notificações no aparelho" }, { k: "email", t: "Resumo por e-mail" }, { k: "resultados", t: "Novas notas e frequência" }].map((o) => {
            const on = (notif as any)[o.k];
            return <div key={o.k} className="flex items-center gap-3 px-4 py-3"><p className="flex-1 text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><Toggle on={on} onClick={() => setNotif({ ...notif, [o.k]: !on })} /></div>;
          })}
        </div>

        <SectionHeader title="Conta" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {["Editar dados cadastrais", "Alterar senha", "Idioma · Português (Brasil)", "Política de Privacidade (LGPD)"].map((t) => (
            <button key={t} className="flex w-full items-center justify-between px-4 py-3 text-left active:bg-[color:var(--color-surface)] transition"><span className="text-[13px] font-medium" style={{ color: INK }}>{t}</span><IconChevron size={18} style={{ color: "#cbd5e1" }} /></button>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px]" style={{ color: "#94a3b8" }}>SE Educa · versão 1.0.0 (protótipo)</p>
        <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold" style={{ background: RED + "12", color: RED }}><IconLogout size={18} />Sair da conta</button>
      </Screen>
    </>
  );
}
