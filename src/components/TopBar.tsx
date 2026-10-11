import { IconBack } from "@/components/icons";
import { BLUE, INK, INK_SOFT } from "@/theme/colors";

export function TopBar({ title, subtitle, onBack, right, accent = BLUE }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
      {onBack && (
        <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[color:var(--color-ink)] shadow-sm active:scale-95 transition" style={{ color: INK }}>
          <IconBack size={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[19px] font-bold leading-tight" style={{ color: INK }}>{title}</h1>
        {subtitle && <p className="truncate text-[12.5px]" style={{ color: INK_SOFT }}>{subtitle}</p>}
      </div>
      {right}
      <span className="ml-1 h-1.5 w-6 rounded-full" style={{ background: accent }} />
    </div>
  );
}
