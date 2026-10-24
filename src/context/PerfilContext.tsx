import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../types";

interface PerfilContextValue {
  perfil: Usuario | null;
  definirPerfil: (usuario: Usuario | null) => void;
  ehDoador: boolean;
  ehReceptor: boolean;
}

const PerfilContext = createContext<PerfilContextValue | undefined>(undefined);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Usuario | null>(null);

  const value: PerfilContextValue = {
    perfil,
    definirPerfil: setPerfil,
    ehDoador: perfil?.tipoUsuario === "Doador",
    ehReceptor: perfil?.tipoUsuario === "Receptor",
  };

  return <PerfilContext.Provider value={value}>{children}</PerfilContext.Provider>;
}

// Hook de acesso: falha alto e claro se alguem usar fora do Provider
export function usePerfil(): PerfilContextValue {
  const ctx = useContext(PerfilContext);
  if (!ctx) throw new Error("usePerfil precisa estar dentro de <PerfilProvider>");
  return ctx;
}