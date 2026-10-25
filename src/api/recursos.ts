import { api } from "./client";
import type {
  Usuario, Doacao, Reserva,
  NovoUsuario, NovaDoacao, NovaReserva,
  StatusDoacao,
} from "../types";

// ---------- Usuarios ----------
export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>("/usuarios");
  return data;
}

export async function criarUsuario(payload: NovoUsuario): Promise<Usuario> {
  const { data } = await api.post<Usuario>("/usuarios", payload);
  return data;
}

// ---------- Doacoes ----------
export async function listarDoacoes(status?: StatusDoacao): Promise<Doacao[]> {
  const { data } = await api.get<Doacao[]>("/doacoes", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function criarDoacao(payload: NovaDoacao): Promise<Doacao> {
  const { data } = await api.post<Doacao>("/doacoes", payload);
  return data;
}

// ---------- Reservas ----------
export async function listarReservas(receptorId?: number): Promise<Reserva[]> {
  const { data } = await api.get<Reserva[]>("/reservas", {
    params: receptorId ? { receptorId } : undefined,
  });
  return data;
}

export async function criarReserva(payload: NovaReserva): Promise<Reserva> {
  const { data } = await api.post<Reserva>("/reservas", payload);
  return data;
}

export async function concluirReserva(id: number): Promise<void> {
  await api.put(`/reservas/${id}/concluir`);
}

export async function cancelarReserva(id: number): Promise<void> {
  await api.put(`/reservas/${id}/cancelar`);
}