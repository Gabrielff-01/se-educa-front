import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TopBar } from "@/components/TopBar";
import { IconBook, IconExternal, IconGrad, IconPlay, IconShield } from "@/components/icons";
import { BLUE, BLUE_DARK, GREEN, INDIGO, INK, INK_SOFT, VIOLET } from "@/theme/colors";

export const MEC_URL = "https://www.gov.br/mec/pt-br";

export function BibliotecaVirtual({ back }: { back: () => void }) {
  const cats = [
    { l: "Livros", d: "Literatura e clássicos em domínio público", Icon: IconBook, c: BLUE },
    { l: "Didáticos", d: "Obras do PNLD por série e disciplina", Icon: IconGrad, c: GREEN },
    { l: "Vídeos", d: "Videoaulas e conteúdos educativos", Icon: IconPlay, c: VIOLET },
  ];
  return (
    <>
      <TopBar title="Biblioteca Virtual" subtitle="Acervo digital gratuito" onBack={back} accent={INDIGO} />
      <Screen>
        <div className="overflow-hidden rounded-3xl p-5 text-white" style={{ background: `linear-gradient(145deg, ${INDIGO}, ${BLUE_DARK})` }}>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><IconBook size={22} /></div>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/70">Em destaque</p>
          <h2 className="mt-1 text-[19px] font-extrabold leading-tight">Acervo digital do MEC</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/85">Livros, materiais didáticos e vídeos educativos do Ministério da Educação, gratuitos para estudantes da rede pública.</p>
          <a href={MEC_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13.5px] font-bold active:scale-[0.98] transition" style={{ color: INDIGO }}>
            Acessar biblioteca do MEC <IconExternal size={16} />
          </a>
          <p className="mt-2 text-center text-[10.5px] text-white/65">Abre em nova aba · gov.br</p>
        </div>

        <SectionHeader title="Explorar por categoria" />
        <div className="space-y-2.5">
          {cats.map(({ l, d, Icon, c }) => (
            <a key={l} href={MEC_URL} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-3.5 active:scale-[0.99] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: c + "16", color: c }}><Icon size={21} /></div>
              <div className="min-w-0 flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{l}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{d}</p></div>
              <span style={{ color: INK_SOFT }}><IconExternal size={16} /></span>
            </a>
          ))}
        </div>
        <div className="mt-4 flex gap-2.5 rounded-2xl p-3.5 text-[11.5px]" style={{ background: BLUE + "0d", color: INK_SOFT }}>
          <span style={{ color: BLUE }}><IconShield size={17} /></span>Você será direcionado a um site oficial do Governo Federal. O SE Educa não armazena seus dados de acesso.
        </div>
      </Screen>
    </>
  );
}
