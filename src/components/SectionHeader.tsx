import { BLUE, INK } from "@/theme/colors";

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-2.5 mt-5 flex items-center justify-between">
      <h2 className="text-[15px] font-bold" style={{ color: INK }}>{title}</h2>
      {action && <button onClick={onAction} className="text-[12.5px] font-semibold" style={{ color: BLUE }}>{action}</button>}
    </div>
  );
}
