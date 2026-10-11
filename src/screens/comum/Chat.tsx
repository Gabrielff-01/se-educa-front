import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { IconSend } from "@/components/icons";
import { BLUE, INK, INK_SOFT } from "@/theme/colors";

export function Chat({ back }: { back: () => void }) {
  const [aba, setAba] = useState(0);
  const abas = ["Aluno ↔ Escola", "Prof. ↔ Adm.", "Escola ↔ Sec."];
  const [msgs, setMsgs] = useState([
    { eu: false, txt: "Bom dia! A declaração de matrícula já está disponível na Secretaria Virtual.", h: "08:12" },
    { eu: true, txt: "Perfeito, muito obrigada! E sobre a reunião de pais?", h: "08:15" },
    { eu: false, txt: "Será dia 15/09 às 18h30 no auditório. Enviaremos o comunicado oficial.", h: "08:16" },
  ]);
  const [txt, setTxt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [msgs]);
  const enviar = () => {
    if (!txt.trim()) return;
    setMsgs([...msgs, { eu: true, txt, h: "08:20" }]);
    setTxt("");
    setTimeout(() => setMsgs((m) => [...m, { eu: false, txt: "Recebido! Retornaremos em breve. 😊", h: "08:21" }]), 900);
  };
  return (
    <>
      <TopBar title="Mensagens" subtitle="Secretaria Escolar · online" onBack={back} accent="#ec4899" />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {abas.map((a, i) => (
            <button key={a} onClick={() => setAba(i)} className="flex-1 rounded-xl py-2 text-[10.5px] font-semibold transition" style={aba === i ? { background: "#ec4899", color: "#fff" } : { color: INK_SOFT }}>{a}</button>
          ))}
        </div>
      </div>
      <div ref={scrollRef} className="scroll-area flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <p className="text-center text-[11px]" style={{ color: "#94a3b8" }}>Hoje</p>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.eu ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[78%] rounded-2xl px-3.5 py-2.5" style={m.eu ? { background: BLUE, color: "#fff", borderBottomRightRadius: 6 } : { background: "#fff", color: INK, borderBottomLeftRadius: 6, boxShadow: "0 1px 2px rgba(15,33,53,.06)" }}>
              <p className="text-[13px] leading-snug">{m.txt}</p>
              <p className="mt-1 text-right text-[9.5px]" style={{ color: m.eu ? "#ffffffaa" : "#94a3b8" }}>{m.h}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[color:var(--color-line)] bg-white px-4 py-3 pb-6">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()} placeholder="Escreva uma mensagem..." className="flex-1 rounded-full bg-[color:var(--color-surface)] px-4 py-2.5 text-[13.5px] outline-none" />
        <button onClick={enviar} className="grid h-10 w-10 flex-none place-items-center rounded-full text-white" style={{ background: BLUE }}><IconSend size={18} /></button>
      </div>
    </>
  );
}
