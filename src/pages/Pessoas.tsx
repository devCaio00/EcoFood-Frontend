import { useQuery } from "@tanstack/react-query";
import { listarUsuarios } from "../api/recursos";
import { usePerfil } from "../context/useAuth";

export function Pessoas() {
  const { perfil } = usePerfil();

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-ecofood-verde">Pessoas</h1>

      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      <ul className="flex flex-col gap-2">
        {usuarios.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {u.nome} <span className="text-xs text-gray-500">({u.tipoUsuario})</span>
              </p>
              <p className="truncate text-xs text-gray-500">{u.endereco}</p>
            </div>
            {perfil.id === u.id && (
              <span className="shrink-0 rounded-full bg-ecofood-claro px-2.5 py-1 text-xs font-semibold text-ecofood-verde">
                Voce
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
