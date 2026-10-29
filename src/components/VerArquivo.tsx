/* Janela que mostra um documento enviado (PDF ou foto) por cima da tela, com o botão de baixar.
   O arquivo vem de /api/documentos/ID/arquivo/, que precisa do login: por isso não dá pra usar
   o endereço direto num <img>. A função baixar() busca com o crachá e devolve um endereço "blob:". */

import { useEffect, useState } from "react";
import { AvisoErro } from "@/components/Form";
import { IconX } from "@/components/icons";
import { baixar } from "@/lib/api";
import type { ErroApi } from "@/lib/api";
import { tamanhoBR } from "@/lib/documentos";
import type { Documento } from "@/lib/tipos";
import { BLUE, INK, INK_SOFT } from "@/theme/colors";

export function VerArquivo({ documento, fechar }: { documento: Documento; fechar: () => void }) {
  const [endereco, setEndereco] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let local: string | null = null;
    let cancelado = false;
    baixar(`/api/documentos/${documento.id}/arquivo/`)
      .then((url) => { local = url; if (cancelado) URL.revokeObjectURL(url); else setEndereco(url); })
      .catch((e: ErroApi) => { if (!cancelado) setErro(e.message); });
    // Ao fechar, libera a memória do arquivo
    return () => { cancelado = true; if (local) URL.revokeObjectURL(local); };
  }, [documento.id]);

  // Esc fecha a janela
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [fechar]);

  const ehPdf = documento.tipo_arquivo === "application/pdf";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3" onClick={fechar}>
      <div className="flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "#e2e8f0" }}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{documento.tipo_nome} · {documento.aluno_nome}</p>
            <p className="truncate text-[11.5px]" style={{ color: INK_SOFT }}>{documento.nome_arquivo} · {tamanhoBR(documento.tamanho)}</p>
          </div>
          {endereco && <a href={endereco} download={documento.nome_arquivo} className="rounded-xl px-3 py-2 text-[12.5px] font-semibold text-white" style={{ background: BLUE }}>Baixar</a>}
          <button onClick={fechar} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full" style={{ color: INK_SOFT }}><IconX size={20} /></button>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-100">
          {erro ? <div className="p-4"><AvisoErro texto={erro} /></div>
            : !endereco ? <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Abrindo o arquivo...</p>
            : ehPdf ? <iframe src={endereco} title={documento.nome_arquivo} className="h-full w-full border-0" />
            : <img src={endereco} alt={`${documento.tipo_nome} de ${documento.aluno_nome}`} className="max-h-full max-w-full object-contain" />}
        </div>
      </div>
    </div>
  );
}
