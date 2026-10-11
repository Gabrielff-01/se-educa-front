import { INK, INK_SOFT } from "@/theme/colors";

export function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-[10.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border bg-white px-2.5 py-2 text-[12.5px] font-semibold outline-none" style={{ borderColor: "#e2e8f0", color: INK }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
