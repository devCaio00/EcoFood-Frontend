import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function TelaCarregando() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center bg-ecofood-claro"
    >
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-4 border-ecofood-verde border-t-transparent"
      />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

// So deixa passar quem esta logado; guarda a pagina pedida para voltar depois.
export function RotaProtegida() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "carregando") return <TelaCarregando />;
  if (status === "anonimo")
    return <Navigate to="/entrar" replace state={{ de: location }} />;
  return <Outlet />;
}

// Telas de entrar/cadastrar: quem ja esta logado vai direto para o app.
export function RotaPublica() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "carregando") return <TelaCarregando />;
  if (status === "autenticado") {
    const de = (location.state as { de?: Location } | null)?.de;
    return <Navigate to={de ?? "/doacoes"} replace />;
  }
  return <Outlet />;
}
