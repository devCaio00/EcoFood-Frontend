import { useState } from "react";
import type { Doacao } from "../types";
import { StatusChip } from "./StatusChip";
import { ConfirmarEnderecoPanel } from "./ConfirmarEnderecoPanel";

interface Props {
  doacao: Doacao;
  podeReservar: boolean;
  reservando: boolean;
  onReservar: (doacaoId: number) => void;
}

function formatarData(iso: string | null): string {
  if (!iso) return "sem validade informada";
  const [ano, mes, dia] = iso.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export function DoacaoCard({ doacao, podeReservar, reservando, onReservar }: Props) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
      <header className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ecofood-ambar">{doacao.descricao}</h3>
        <StatusChip status={doacao.status} />
      </header>

      <dl className="text-sm text-gray-600">
        <div className="flex gap-1">
          <dt className="font-semibold">Doador:</dt>
          <dd>{doacao.doadorNome}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-semibold">Quantidade:</dt>
          <dd>
            {doacao.quantidade} {doacao.unidadeMedida}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-semibold">Validade:</dt>
          <dd>{formatarData(doacao.validadeAlimento)}</dd>
        </div>
      </dl>

      {doacao.observacoes && (
        <p className="text-sm text-gray-500">{doacao.observacoes}</p>
      )}

      {confirmando ? (
        <ConfirmarEnderecoPanel
          endereco={doacao.doadorEndereco}
          carregando={reservando}
          onConfirmar={() => onReservar(doacao.id)}
          onCancelar={() => setConfirmando(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          disabled={!podeReservar}
          className="self-start rounded-md bg-ecofood-verde px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          Reservar
        </button>
      )}
    </article>
  );
}