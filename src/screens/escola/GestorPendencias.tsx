import { useState } from "react";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconEdit, IconSend, IconStar } from "@/components/icons";
import { PENDENCIAS, semaforo } from "@/data/escola";
import { useToast } from "@/hooks/useToast";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

export function GestorPendencias({ back }: { back: () => void }) {
  const [enviados, setEnviados] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<"Todos" | "Diário" | "Notas">("Todos");
  const { show, node } = useToast();
  const lista = PENDENCIAS.filter((p) => filtro === "Todos" || p.tipo === filtro);
  const diarios = PENDENCIAS.filter((p) => p.tipo === "Diário" && p.atraso > 0).length;
  const notas = PENDENCIAS.filter((p) => p.tipo === "Notas").length;
  const enviar = (id: string, prof: string) => { setEnviados((e) => [...e, id]); show(`Lembrete enviado para ${prof}`); };
  const todos = () => { const pend = lista.filter((p) => !enviados.includes(p.id)); setEnviados((e) => [...e, ...pend.map((p) => p.id)]); show(pend.length ? `${pend.length} lembretes enviados aos professores` : "Todos já foram lembrados"); };
  return (
    <>
      <TopBar title="Pendências dos professores" subtitle="Fechamento da 3ª unidade · 30/09" onBack={back} accent={RED} />
      <Screen>
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: RED }}><IconEdit size={19} /></span><Pill color={RED}>Urgente</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{diarios}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Diários sem preenchimento</p></div>
          <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: AMBER }}><IconStar size={19} /></span><Pill color={AMBER}>4 dias</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{notas}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Turmas sem nota perto do fechamento</p></div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {(["Todos", "Diário", "Notas"] as const).map((f) => <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold" style={filtro === f ? { background: INK, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{f}</button>)}
          </div>
          <button onClick={todos} className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-white active:scale-95 transition" style={{ background: BLUE }}><IconSend size={14} />Lembrar todos</button>
        </div>
        <div className="mt-2.5 flex gap-3 px-1">{[{ l: "Em dia", c: GREEN }, { l: "1–4 dias", c: AMBER }, { l: "5+ dias", c: RED }].map((x) => <span key={x.l} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.l}</span>)}</div>

        <div className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-[11.5px]">
            <thead><tr style={{ color: INK_SOFT, background: "#f8fafc" }}>{["", "Professor / turma", "Pendência", "Atraso", "Prazo", ""].map((h, i) => <th key={i} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {lista.map((p) => { const c = semaforo(p.atraso); const ok = enviados.includes(p.id); return (
                <tr key={p.id} className="border-t" style={{ borderColor: "#eef2f7" }}>
                  <td className="pl-3"><span className="block h-3 w-3 rounded-full" style={{ background: c, boxShadow: `0 0 0 3px ${c}26` }} aria-label={p.atraso >= 5 ? "Crítico" : p.atraso ? "Atenção" : "Em dia"} /></td>
                  <td className="px-3 py-2.5"><p className="font-semibold" style={{ color: INK }}>{p.prof}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{p.turma} · {p.disc}</p></td>
                  <td className="px-3 py-2.5" style={{ color: INK }}>{p.tipo}</td>
                  <td className="px-3 py-2.5 font-bold" style={{ color: c }}>{p.atraso ? `${p.atraso} dia${p.atraso > 1 ? "s" : ""}` : "—"}</td>
                  <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{p.prazo}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button disabled={ok} onClick={() => enviar(p.id, p.prof)} className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold transition" style={ok ? { background: GREEN + "16", color: GREEN } : { background: BLUE + "14", color: BLUE }}>{ok ? "Enviado" : "Enviar lembrete"}</button>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </Screen>
      {node}
    </>
  );
}
