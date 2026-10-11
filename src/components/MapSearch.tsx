import { Avatar } from "@/components/Avatar";
import { IconBack, IconSearch } from "@/components/icons";
import { INK, INK_SOFT } from "@/theme/colors";

export function MapSearch({ placeholder, onBack }: { placeholder: string; onBack: () => void }) {
  return (
    <div className="absolute left-3 right-3 top-3 flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-lg">
      <button onClick={onBack} className="grid h-8 w-8 place-items-center rounded-full" style={{ color: INK }} aria-label="Voltar"><IconBack size={19} /></button>
      <span className="flex-1 truncate text-[13px]" style={{ color: "#94a3b8" }}>{placeholder}</span>
      <IconSearch size={18} style={{ color: INK_SOFT }} />
      <Avatar name="Ana Nunes" size={28} />
    </div>
  );
}
