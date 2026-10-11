import { BLUE } from "@/theme/colors";

export function Avatar({ name, color = BLUE, size = 44 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("");
  return (
    <div className="grid flex-none place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}>{initials}</div>
  );
}
