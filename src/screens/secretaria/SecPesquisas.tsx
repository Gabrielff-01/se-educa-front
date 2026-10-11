import { useState } from "react";
import { Field } from "@/components/Field";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconCheck, IconSearch, IconTrend } from "@/components/icons";
import { PESQUISAS, SERIE_SEM } from "@/data/secretaria";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function SecPesquisas({ back }: { back: () => void }) {
  const [aberta, setAberta] = useState<string | null>(null);
  const [envio, setEnvio] = useState<"idle" | "form" | "loading" | "ok">("idle");
  const [qtd, setQtd] = useState(40);
  if (aberta) {
    const max = Math.max(...SERIE_SEM);
    return (
      <>
        <TopBar title="Necessidades especiais" subtitle="Pesquisas por vagas · últimas 8 semanas" onBack={() => { setAberta(null); setEnvio("idle"); }} accent={RED} />
        <Screen>
          <div className="card p-4">
            <div className="flex items-start justify-between">
              <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Buscas nesta semana</p><p className="text-[28px] font-extrabold leading-tight" style={{ color: INK }}>1.284</p></div>
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: RED + "14", color: RED }}><IconTrend size={14} />+62%</span>
            </div>
            <div className="mt-3 flex items-end gap-1.5" style={{ height: 110 }}>
              {SERIE_SEM.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-md" style={{ height: `${(v / max) * 100}%`, background: i === SERIE_SEM.length - 1 ? RED : RED + "40" }} /></div>
                  <span className="text-[9px]" style={{ color: INK_SOFT }}>S{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <SectionHeader title="Regiões com mais buscas" />
          <div className="card space-y-3 p-4">
            {[{ r: "Zona Norte · Santa Maria", v: 412 }, { r: "Zona Sul · Atalaia", v: 318 }, { r: "Centro · São José", v: 276 }, { r: "Zona Oeste · Capucho", v: 189 }].map((r) => (
              <div key={r.r}>
                <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: INK }}>{r.r}</span><span className="font-bold" style={{ color: INK }}>{r.v}</span></div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${(r.v / 412) * 100}%`, background: RED }} /></div>
              </div>
            ))}
          </div>
          <SectionHeader title="Escolas mais procuradas" />
          <div className="space-y-2">
            {[{ n: "Escola Inclusiva Jardins", b: 284, v: 31 }, { n: "Centro de Ensino Bilíngue para Surdos", b: 231, v: 9 }, { n: "E.M.E.F. Poeta João Ribeiro", b: 198, v: 6 }, { n: "E.M.E.F. Santa Maria", b: 176, v: 0 }].map((e) => (
              <div key={e.n} className="card flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{e.n}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.b} buscas</p></div>
                <div className="text-right"><p className="text-[16px] font-extrabold" style={{ color: e.v === 0 ? RED : e.v < 10 ? AMBER : GREEN }}>{e.v}</p><p className="text-[10px]" style={{ color: INK_SOFT }}>vagas AEE</p></div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: RED + "10" }}>
            <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: RED }} />
            <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Demanda estimada de <b>~120 novas vagas</b> em atendimento especializado; apenas <b>46</b> disponíveis na rede.</p>
          </div>
          <div className="mt-4">
            {envio === "ok" ? (
              <div className="card flex items-center gap-3 p-4"><div className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={22} /></div><div><p className="text-[14px] font-bold" style={{ color: INK }}>Solicitação enviada</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Protocolo SEDUC-2026-04812 · {qtd} vagas</p></div></div>
            ) : envio === "form" || envio === "loading" ? (
              <div className="card space-y-3 p-4">
                <p className="text-[14px] font-bold" style={{ color: INK }}>Solicitar criação de vagas</p>
                <Field label="Quantidade de vagas"><div className="flex items-center gap-3"><input type="range" min={10} max={120} step={5} value={qtd} onChange={(e) => setQtd(+e.target.value)} className="flex-1 accent-[#ef4444]" /><span className="w-10 text-right text-[15px] font-extrabold" style={{ color: RED }}>{qtd}</span></div></Field>
                <Field label="Região prioritária"><select className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]" style={{ borderColor: "#e2e8f0", color: INK }}><option>Zona Norte · Santa Maria</option><option>Zona Sul · Atalaia</option><option>Centro · São José</option></select></Field>
                <Field label="Tipo de atendimento"><select className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]" style={{ borderColor: "#e2e8f0", color: INK }}><option>Sala de recursos multifuncionais (AEE)</option><option>Intérprete de Libras</option><option>Profissional de apoio (TEA)</option></select></Field>
                <PrimaryButton color={RED} loading={envio === "loading"} onClick={() => { setEnvio("loading"); setTimeout(() => setEnvio("ok"), 1200); }}>Enviar solicitação</PrimaryButton>
              </div>
            ) : (
              <PrimaryButton color={RED} onClick={() => setEnvio("form")}>Solicitar criação de vagas</PrimaryButton>
            )}
          </div>
        </Screen>
      </>
    );
  }
  return (
    <>
      <TopBar title="Pesquisas recentes" subtitle="O que as famílias buscam no app" onBack={back} accent={AMBER} />
      <Screen>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <div className="card p-4"><p className="text-[23px] font-extrabold" style={{ color: BLUE }}>8.912</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Buscas na semana</p></div>
          <div className="card p-4"><p className="text-[23px] font-extrabold" style={{ color: RED }}>+62%</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Maior alta</p></div>
        </div>
        <SectionHeader title="Termos em alta" />
        <div className="space-y-2.5">
          {PESQUISAS.map((p) => (
            <button key={p.id} onClick={() => p.destaque && setAberta(p.id)} className="card w-full p-3.5 text-left active:scale-[0.99] transition" style={p.destaque ? { outline: `2px solid ${RED}33` } : undefined}>
              {p.destaque && <div className="mb-2"><Pill color={RED}>Alerta de demanda</Pill></div>}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: p.cor + "16", color: p.cor }}><IconSearch size={19} /></div>
                <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold leading-snug" style={{ color: INK }}>{p.termo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.volume.toLocaleString("pt-BR")} buscas</p></div>
                <span className="text-[12.5px] font-bold" style={{ color: p.var >= 0 ? (p.var > 30 ? RED : GREEN) : INK_SOFT }}>{p.var > 0 ? "+" : ""}{p.var}%</span>
              </div>
            </button>
          ))}
        </div>
      </Screen>
    </>
  );
}
