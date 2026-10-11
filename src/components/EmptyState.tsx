import { IconDoc } from "@/components/icons";
import { BLUE, INK, INK_SOFT } from "@/theme/colors";

export function EmptyState({ title, text, icon }: { title: string; text: string; icon?: React.ReactNode }) {
  return (
    <div className="mt-10 flex flex-col items-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl" style={{ background: BLUE + "12", color: BLUE }}>{icon ?? <IconDoc size={28} />}</div>
      <h3 className="mt-4 text-[15px] font-bold" style={{ color: INK }}>{title}</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>{text}</p>
    </div>
  );
}
