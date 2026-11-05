/* Logo da página de cadastro: círculo azul com o capelo, "SE Educa" e um subtítulo. */

import { IconGrad } from "@/components/icons";

export function Logo({ subtitulo }: { subtitulo: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: "#1a6ce5" }}>
        <IconGrad size={32} strokeWidth={2} />
      </div>
      <h1 className="mb-1 text-[24px] font-bold" style={{ color: "#1e293b" }}><span style={{ color: "#00a65a" }}>SE</span> Educa</h1>
      <p className="text-[14px]" style={{ color: "#64748b" }}>{subtitulo}</p>
    </div>
  );
}
