import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { GREEN, INK } from "@/theme/colors";

export function useToast() {
  const [toast, setToast] = useState("");
  const show = (t: string) => { setToast(t); setTimeout(() => setToast(""), 2600); };
  const node = toast ? (
    <div className="pointer-events-none absolute inset-x-5 bottom-24 z-40 flex items-center gap-2 rounded-2xl p-3.5 text-[12.5px] font-semibold text-white shadow-lg animate-in" style={{ background: INK }}><span style={{ color: GREEN }}><IconCheck size={17} /></span>{toast}</div>
  ) : null;
  return { show, node };
}
