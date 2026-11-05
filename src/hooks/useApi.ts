/* Hook pra buscar dados da API numa tela.

   const { dados, carregando, erro, recarregar } = useApi<Escola[]>("/api/escolas/");

   - Busca quando a tela abre e sempre que o "caminho" muda (ex.: mudou o filtro).
   - caminho = null: não busca nada (útil enquanto falta escolher um filtro).
   - recarregar(): busca de novo (ex.: depois de salvar um cadastro).
   - { publica: true }: busca sem login (ex.: as escolas da matrícula pela internet). */

import { useCallback, useEffect, useState } from "react";
import { api, apiPublica, ErroApi } from "@/lib/api";

export function useApi<T>(caminho: string | null, { publica = false }: { publica?: boolean } = {}) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<ErroApi | null>(null);
  const [carregando, setCarregando] = useState(caminho !== null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    if (caminho === null) { setDados(null); setCarregando(false); return; }
    let cancelado = false; // se a tela fechar antes da resposta, ignoramos o resultado
    setCarregando(true);
    setErro(null);
    (publica ? apiPublica<T>(caminho) : api<T>(caminho))
      .then((resposta) => { if (!cancelado) setDados(resposta); })
      .catch((e: ErroApi) => { if (!cancelado) setErro(e); })
      .finally(() => { if (!cancelado) setCarregando(false); });
    return () => { cancelado = true; };
  }, [caminho, versao, publica]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  return { dados, erro, carregando, recarregar };
}
