import { BLUE, INK_SOFT } from "@/theme/colors";

export function LoadingState({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-3">
      <div className="spinner h-9 w-9 rounded-full border-[3px]" style={{ borderColor: BLUE + "33", borderTopColor: BLUE }} />
      <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{text}</p>
    </div>
  );
}
