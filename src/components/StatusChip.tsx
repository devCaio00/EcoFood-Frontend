import type { StatusDoacao, StatusReserva } from "../types";

const CORES: Record<string, string> = {
  Disponivel: "bg-green-100 text-green-800",
  Reservado: "bg-amber-100 text-amber-800",
  Pendente: "bg-amber-100 text-amber-800",
  Retirado: "bg-gray-200 text-gray-700",
  Concluida: "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800",
  Cancelada: "bg-red-100 text-red-800",
  Expirado: "bg-red-100 text-red-800",
};

export function StatusChip({ status }: { status: StatusDoacao | StatusReserva }) {
  const cor = CORES[status] ?? "bg-gray-200 text-gray-700";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cor}`}>
      {status}
    </span>
  );
}