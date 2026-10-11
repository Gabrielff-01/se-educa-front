import { Avatar } from "@/components/Avatar";
import { IconBell } from "@/components/icons";
import type { ScreenId } from "@/routes";
import { shade } from "@/theme/colors";

/* Header compartilhado para perfis de gestão */
export function ProfileHeader({ nome, sub, cor, nav }: { nome: string; sub: string; cor: string; nav: (s: ScreenId) => void }) {
  return (
    <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${cor}, ${shade(cor)})`, borderRadius: "0 0 26px 26px" }}>
      <div className="flex items-center gap-3">
        <Avatar name={nome} color="#ffffff" size={46} />
        <div className="min-w-0 flex-1"><p className="text-[12px] text-white/80">Bem-vindo(a)</p><h1 className="truncate text-[16px] font-bold">{nome}</h1><p className="truncate text-[11.5px] text-white/75">{sub}</p></div>
        <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: "#fff" }} /></button>
      </div>
    </div>
  );
}
