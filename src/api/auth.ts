import { api } from "./client";
import type {
  AtualizarUsuario,
  LoginPayload,
  TokenResposta,
  Usuario,
} from "../types";

export async function fazerLogin(payload: LoginPayload): Promise<TokenResposta> {
  const { data } = await api.post<TokenResposta>("/auth/login", payload);
  return data;
}

export async function obterMe(): Promise<Usuario> {
  const { data } = await api.get<Usuario>("/auth/me");
  return data;
}

export async function atualizarConta(
  id: number,
  payload: AtualizarUsuario
): Promise<Usuario> {
  const { data } = await api.put<Usuario>(`/usuarios/${id}`, payload);
  return data;
}

export async function excluirConta(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
