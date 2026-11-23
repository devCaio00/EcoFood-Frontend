import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./contextoAuth";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}

// Para paginas protegidas: o perfil sempre existe (a rota garante o login).
export function usePerfil() {
  const { perfil } = useAuth();
  if (!perfil) throw new Error("usePerfil so pode ser usado em rotas protegidas");
  return {
    perfil,
    ehDoador: perfil.tipoUsuario === "Doador",
    ehReceptor: perfil.tipoUsuario === "Receptor",
  };
}
