/* Quem está logado, disponível em qualquer tela sem precisar passar por props.

   const usuario = useUsuario();   // null se ninguém entrou (ex.: galeria "Todas as telas")

   O App coloca o usuário aqui com <UsuarioContext.Provider value={usuario}>. */

import { createContext, useContext } from "react";
import type { Usuario } from "@/lib/tipos";

export const UsuarioContext = createContext<Usuario | null>(null);

export function useUsuario() {
  return useContext(UsuarioContext);
}
