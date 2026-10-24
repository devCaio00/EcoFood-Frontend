import { NavLink, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listarUsuarios } from "./api/recursos";
import { usePerfil } from "./context/PerfilContext";
import { Doacoes } from "./pages/Doacoes";
import { NovaDoacao } from "./pages/NovaDoacao";
import { MinhasReservas } from "./pages/MinhasReservas";
import { Pessoas } from "./pages/Pessoas";

function SeletorPerfil() {
  const { perfil, definirPerfil } = usePerfil();

  const { data: usuarios = [] } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });

  return (
    <select
      value={perfil?.id ?? ""}
      onChange={(e) => {
        const id = Number(e.target.value);
        definirPerfil(usuarios.find((u) => u.id === id) ?? null);
      }}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
      aria-label="Perfil em uso"
    >
      <option value="">— selecione um perfil —</option>
      {usuarios.map((u) => (
        <option key={u.id} value={u.id}>
          {u.nome} ({u.tipoUsuario})
        </option>
      ))}
    </select>
  );
}

const LINKS = [
  { to: "/doacoes", label: "Doacoes" },
  { to: "/nova-doacao", label: "Doar alimentos" },
  { to: "/minhas-reservas", label: "Minhas reservas" },
  { to: "/pessoas", label: "Pessoas" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ecofood-verde px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-bold text-white">EcoFood</span>
          <SeletorPerfil />
        </div>
      </header>

      <nav className="bg-ecofood-claro px-4 py-2">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-2">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1 text-sm font-medium ${
                  isActive
                    ? "bg-ecofood-verde text-white"
                    : "text-ecofood-verde hover:bg-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Doacoes />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/nova-doacao" element={<NovaDoacao />} />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/pessoas" element={<Pessoas />} />
        </Routes>
      </main>
    </div>
  );
}