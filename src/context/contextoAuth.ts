import { createContext } from "react";
import type { NovoUsuario, Usuario } from "../types";

export type StatusAuth = "carregando" | "autenticado" | "anonimo";

export interface AuthContextValue {
  perfil: Usuario | null;
  status: StatusAuth;
  /** true quando a sessao caiu sozinha (token expirado/invalidado). */
  sessaoExpirada: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: NovoUsuario & { senha: string }) => Promise<void>;
  sair: () => void;
  /** Atualiza o perfil em memoria depois de editar a conta. */
  atualizarPerfil: (usuario: Usuario) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
