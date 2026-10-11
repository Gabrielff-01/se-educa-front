import { useState } from "react";
import { Field } from "@/components/Field";
import { Pill } from "@/components/Pill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconBook, IconCheck, IconChevron, IconPlus, IconX } from "@/components/icons";
import { CURSOS, PROFESSORES, TURMAS_ADM } from "@/data/escola";
import { AMBER, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

export function AdmTurmas({ back }: { back: () => void }) {
  const [aba, setAba] = useState<"turmas" | "cursos">("turmas");
  const [turmas, setTurmas] = useState(TURMAS_ADM);
  const [form, setForm] = useState<null | { serie: string; letra: string; turno: string; sala: string; regente: string; cap: string }>(null);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");
  const abrir = () => { setErro(""); setForm({ serie: "6º ano", letra: "B", turno: "Matutino", sala: "", regente: "Prof. " + PROFESSORES[0].nome, cap: "35" }); };
  const salvar = () => {
    if (!form) return;
    const nome = `${form.serie} ${form.letra}`;
    if (!form.sala.trim()) return setErro("Informe a sala da turma.");
    if (turmas.some((t) => t.nome === nome && t.turno === form.turno)) return setErro(`Já existe ${nome} no turno ${form.turno.toLowerCase()}.`);
    setTurmas([{ nome, turno: form.turno, alunos: 0, cap: +form.cap || 35, sala: form.sala.padStart(2, "0"), regente: form.regente }, ...turmas]);
    setForm(null); setAba("turmas"); setToast(`${nome} cadastrada com sucesso`); setTimeout(() => setToast(""), 2500);
  };
  const sel = "w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]";
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Turmas e cursos" subtitle={`${turmas.length} turmas cadastradas`} onBack={back} accent={TEAL} right={<button onClick={abrir} aria-label="Adicionar turma" className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {(["turmas", "cursos"] as const).map((a) => (
            <button key={a} onClick={() => setAba(a)} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold capitalize transition" style={aba === a ? { background: TEAL, color: "#fff" } : { color: INK_SOFT }}>{a}</button>
          ))}
        </div>
      </div>
      <Screen className="pt-3">
        {toast && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{toast}</div>}
        {aba === "turmas" ? (
          <div className="space-y-2.5">
            <button onClick={abrir} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-[13px] font-semibold" style={{ borderColor: TEAL + "66", color: TEAL }}><IconPlus size={17} />Adicionar turma</button>
            {turmas.map((t) => {
              const lot = Math.round((t.alunos / t.cap) * 100);
              return (
                <div key={t.nome} className="card p-3.5">
                  <div className="flex items-center justify-between"><p className="text-[14px] font-bold" style={{ color: INK }}>{t.nome}</p><Pill color={TEAL}>{t.turno}</Pill></div>
                  <p className="mt-1 text-[11.5px]" style={{ color: INK_SOFT }}>Sala {t.sala} · Regente: {t.regente}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${lot}%`, background: lot >= 95 ? AMBER : GREEN }} /></div>
                    <span className="text-[11.5px] font-bold" style={{ color: INK }}>{t.alunos}/{t.cap}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {CURSOS.map((c) => (
              <div key={c.nome} className="card flex items-center gap-3 p-3.5">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: c.cor + "16", color: c.cor }}><IconBook size={22} /></div>
                <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{c.turmas} turmas · {c.alunos} alunos</p></div>
                <IconChevron size={18} style={{ color: "#cbd5e1" }} />
              </div>
            ))}
          </div>
        )}
      </Screen>
      {form && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: "rgba(15,33,53,.42)" }} onClick={() => setForm(null)}>
          <div className="animate-in rounded-t-[26px] bg-white px-5 pb-6 pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-bold" style={{ color: INK }}>Adicionar turma</h2><button onClick={() => setForm(null)} aria-label="Fechar" style={{ color: INK_SOFT }}><IconX size={20} /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_88px] gap-2">
                <Field label="Série"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })}>{["1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano", "7º ano", "8º ano", "9º ano", "EJA I", "EJA II"].map((o) => <option key={o}>{o}</option>)}</select></Field>
                <Field label="Turma"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.letra} onChange={(e) => setForm({ ...form, letra: e.target.value })}>{["A", "B", "C", "D"].map((o) => <option key={o}>{o}</option>)}</select></Field>
              </div>
              <Field label="Turno">
                <div className="flex gap-1.5 rounded-2xl p-1" style={{ background: "#eef2f7" }}>
                  {["Matutino", "Vespertino", "Noturno"].map((t) => <button key={t} onClick={() => setForm({ ...form, turno: t })} className="flex-1 rounded-xl py-2 text-[12px] font-semibold" style={form.turno === t ? { background: "#fff", color: TEAL, boxShadow: "0 1px 3px rgba(0,0,0,.08)" } : { color: INK_SOFT }}>{t}</button>)}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Sala"><input inputMode="numeric" placeholder="Ex.: 14" className={sel} style={{ borderColor: erro && !form.sala ? RED : "#e2e8f0", color: INK }} value={form.sala} onChange={(e) => setForm({ ...form, sala: e.target.value })} /></Field>
                <Field label="Capacidade"><input inputMode="numeric" className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} /></Field>
              </div>
              <Field label="Professor regente"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.regente} onChange={(e) => setForm({ ...form, regente: e.target.value })}>{PROFESSORES.map((p) => <option key={p.nome} value={"Prof. " + p.nome}>{p.nome} · {p.disc}</option>)}</select></Field>
              {erro && <p className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: RED }}><IconAlert size={14} />{erro}</p>}
              <PrimaryButton color={TEAL} onClick={salvar}>Cadastrar turma</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
