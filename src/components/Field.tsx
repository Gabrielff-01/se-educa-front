import { INK } from "@/theme/colors";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-[13px] font-semibold" style={{ color: INK }}>{label}</p>{children}</div>;
}
