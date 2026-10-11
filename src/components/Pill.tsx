import { BLUE } from "@/theme/colors";

export function Pill({ children, color = BLUE, soft = true }: { children: React.ReactNode; color?: string; soft?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={soft ? { background: color + "1a", color } : { background: color, color: "#fff" }}>
      {children}
    </span>
  );
}
