import { GREEN, INK, INK_SOFT } from "@/theme/colors";

export function Ring({ value, size = 64, color = GREEN, label }: { value: number; size?: number; color?: string; label?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e9eef4" strokeWidth={6} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} />
      </svg>
      <div className="absolute text-center">
        <div className="text-[15px] font-extrabold leading-none" style={{ color: INK }}>{value}%</div>
        {label && <div className="text-[8px]" style={{ color: INK_SOFT }}>{label}</div>}
      </div>
    </div>
  );
}
