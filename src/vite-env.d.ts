/// <reference types="vite/client" />

/* Variáveis de ambiente do Vite (só as que começam com VITE_ chegam no navegador). */
interface ImportMetaEnv {
  /** Endereço da API Django. Ex.: https://se-educa-api.onrender.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
