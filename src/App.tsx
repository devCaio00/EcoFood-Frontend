import { Navigate, NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth, usePerfil } from "./context/useAuth";
import { RotaProtegida, RotaPublica } from "./auth/Rotas";
import { Entrar } from "./pages/Entrar";
import { Cadastro } from "./pages/Cadastro";
import { MinhaConta } from "./pages/MinhaConta";
import { Doacoes } from "./pages/Doacoes";
import { NovaDoacao } from "./pages/NovaDoacao";
import { MinhasReservas } from "./pages/MinhasReservas";
import { Pessoas } from "./pages/Pessoas";
import { Marca } from "./components/auth/Marca";

function Estrutura() {
  const { perfil, ehDoador, ehReceptor } = usePerfil();
  const { sair } = useAuth();
  const navigate = useNavigate();

  // Cada perfil ve so o que pode usar
  const links = [
    { to: "/doacoes", label: "Doacoes", visivel: true },
    { to: "/nova-doacao", label: "Doar alimentos", visivel: ehDoador },
    { to: "/minhas-reservas", label: "Minhas reservas", visivel: ehReceptor },
    { to: "/pessoas", label: "Pessoas", visivel: true },
  ].filter((l) => l.visivel);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ecofood-verde px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <Marca claro />
          <div className="flex items-center gap-3 text-sm text-white">
            <NavLink
              to="/minha-conta"
              className="flex flex-col items-end leading-tight hover:underline"
            >
              <span className="font-semibold">{perfil.nome}</span>
              <span className="text-xs text-white/75">{perfil.tipoUsuario}</span>
            </NavLink>
            <button
              type="button"
              onClick={() => {
                sair();
                navigate("/entrar", { replace: true });
              }}
              className="rounded-md border border-white/40 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-ecofood-claro px-4 py-2">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1 text-sm font-medium ${
                  isActive ? "bg-ecofood-verde text-white" : "text-ecofood-verde hover:bg-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route element={<RotaProtegida />}>
        <Route element={<Estrutura />}>
          <Route path="/" element={<Navigate to="/doacoes" replace />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/nova-doacao" element={<NovaDoacao />} />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
