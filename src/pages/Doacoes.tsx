import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarReserva, listarDoacoes } from "../api/recursos";
import { extrairMensagemErro } from "../api/client";
import { usePerfil } from "../context/PerfilContext";
import { DoacaoCard } from "../components/DoacaoCard";

export function Doacoes() {
  const { perfil, ehReceptor } = usePerfil();
  const queryClient = useQueryClient();
  const [aviso, setAviso] = useState<string | null>(null);

  const { data: doacoes = [], isLoading } = useQuery({
    queryKey: ["doacoes", "Disponivel"],
    queryFn: () => listarDoacoes("Disponivel"),
  });

  const reserva = useMutation({
    mutationFn: (doacaoId: number) =>
      criarReserva({
        doacaoId,
        receptorId: perfil!.id,
        // Sempre true aqui: esta funcao so e chamada depois que o
        // ConfirmarEnderecoPanel liberou o botao.
        enderecoConfirmado: true,
      }),
    onSuccess: (criada) => {
      setAviso(`Reserva confirmada. Retirar em: ${criada.enderecoRetiradaSnapshot}`);
      // Recarrega as listas afetadas pela mudanca
      queryClient.invalidateQueries({ queryKey: ["doacoes"] });
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
    onError: (erro) => setAviso(extrairMensagemErro(erro)),
  });

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-ecofood-verde">
        Doacoes disponiveis
      </h1>

      {!perfil && (
        <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm">
          Selecione um perfil no topo da pagina para reservar.
        </p>
      )}

      {perfil && !ehReceptor && (
        <p className="mb-4 rounded-md bg-gray-100 p-3 text-sm">
          Apenas perfis Receptor podem reservar. Perfil atual: {perfil.tipoUsuario}.
        </p>
      )}

      {aviso && (
        <p className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-900">{aviso}</p>
      )}

      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      {!isLoading && doacoes.length === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Nenhuma doacao disponivel no momento.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {doacoes.map((d) => (
          <DoacaoCard
            key={d.id}
            doacao={d}
            podeReservar={ehReceptor}
            reservando={reserva.isPending}
            onReservar={(id) => reserva.mutate(id)}
          />
        ))}
      </div>
    </section>
  );
}