import { IconGrad } from "@/components/icons";
import { BLUE, TEAL } from "@/theme/colors";

export function Logo({ size = 56, light = false }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid place-items-center rounded-2xl shadow-lg" style={{ width: size, height: size, background: light ? "#fff" : `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
        <IconGrad size={size * 0.55} className="" strokeWidth={2} />
      </div>
    </div>
  );
}
