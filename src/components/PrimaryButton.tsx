import { BLUE } from "@/theme/colors";

export function PrimaryButton({ children, onClick, color = BLUE, loading = false }: { children: React.ReactNode; onClick?: () => void; color?: string; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70" style={{ background: color, boxShadow: `0 12px 24px -10px ${color}99` }}>
      {loading && <span className="spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}
