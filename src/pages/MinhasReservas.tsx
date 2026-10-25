import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelarReserva, concluirReserva, listarReservas } from "../api/recursos";
import { usePerfil } from "../context/PerfilContext";
import { StatusChip } from "../components/StatusChip";

export function MinhasReservas() {
  const { perfil } = usePerfil();
  const queryClient = useQueryClient();

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ["reservas", perfil?.id],
    queryFn: () => listarReservas(perfil!.id),
    enabled: !!perfil,   // so chama a API quando ha perfil selecionado
  });

  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ["reservas"] });
    queryClient.invalidateQueries({ queryKey: ["doacoes"] });
  };

  const concluir = useMutation({
    mutationFn: concluirReserva,
    onSuccess: invalidar,
  });

  const cancelar = useMutation({
    mutationFn: cancelarReserva,
    onSuccess: invalidar,
  });

  if (!perfil)
    return (
      <p className="rounded-md bg-amber-50 p-3 text-sm">
        Selecione um perfil no topo da pagina.
      </p>
    );

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-ecofood-verde">Minhas reservas</h1>

      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      {!isLoading && reservas.length === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Nenhuma reserva ainda.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {reservas.map((r) => (
          <article
            key={r.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <header className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-semibold">{r.doacaoDescricao}</h3>
              <StatusChip status={r.status} />
            </header>

            <p className="mb-1 text-sm text-gray-600">
              <span className="font-semibold">Retirar em:</span>{" "}
              {r.enderecoRetiradaSnapshot}
            </p>

            <p className="mb-3 text-xs text-gray-500">
              Reservado em {new Date(r.dataReserva).toLocaleString("pt-BR")}
            </p>

            {r.status === "Pendente" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => concluir.mutate(r.id)}
                  className="rounded-md bg-ecofood-verde px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Confirmar retirada
                </button>
                <button
                  type="button"
                  onClick={() => cancelar.mutate(r.id)}
                  className="rounded-md border border-red-400 px-3 py-1.5 text-sm text-red-700"
                >
                  Cancelar
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}