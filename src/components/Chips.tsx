import { BLUE, INK } from "@/theme/colors";

export function Chips<T extends string>({ items, value, onChange, cor = BLUE, multi }: { items: { id: T; label: string }[]; value: T[]; onChange: (v: T[]) => void; cor?: string; multi?: boolean }) {
  return (
    <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
      {items.map((it) => {
        const on = value.includes(it.id);
        return (
          <button key={it.id} onClick={() => onChange(multi ? (on ? value.filter((v) => v !== it.id) : [...value, it.id]) : [it.id])} className="flex-none rounded-full border px-3 py-1.5 text-[11.5px] font-semibold shadow-sm transition" style={on ? { background: cor, color: "#fff", borderColor: cor } : { background: "#fff", color: INK, borderColor: "#e2e8f0" }}>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
