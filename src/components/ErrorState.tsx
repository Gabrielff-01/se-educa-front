import { IconAlert } from "@/components/icons";
import { BLUE, INK, INK_SOFT, RED } from "@/theme/colors";

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl" style={{ background: RED + "14", color: RED }}><IconAlert size={28} /></div>
      <h3 className="mt-4 text-[15px] font-bold" style={{ color: INK }}>Não foi possível carregar</h3>
      <p className="mt-1 text-[12.5px]" style={{ color: INK_SOFT }}>Verifique sua conexão e tente novamente.</p>
      {onRetry && <button onClick={onRetry} className="mt-4 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: BLUE }}>Tentar novamente</button>}
    </div>
  );
}
