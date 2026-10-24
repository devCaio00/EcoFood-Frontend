import { useState } from "react";

interface Props {
  endereco: string;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmarEnderecoPanel({
  endereco,
  carregando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  // Estado local: comeca FALSE. O usuario precisa marcar ativamente.
  const [confirmado, setConfirmado] = useState(false);

  return (
    <div className="rounded-lg bg-ecofood-claro p-3 text-sm">
      <p className="mb-2">
        <span className="font-semibold">Local de retirada:</span>
        <br />
        {endereco || "Endereco nao informado pelo doador."}
      </p>

      <label className="mb-3 flex items-start gap-2">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(e) => setConfirmado(e.target.checked)}
          className="mt-1"
        />
        <span>Confirmo que vou retirar este alimento neste endereco.</span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirmar}
          disabled={!confirmado || carregando}
          className="rounded-md bg-ecofood-verde px-3 py-1.5 font-semibold text-white disabled:opacity-40"
        >
          {carregando ? "Reservando..." : "Confirmar reserva"}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-gray-400 px-3 py-1.5"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}