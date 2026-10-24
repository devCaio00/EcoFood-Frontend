import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050/api",
  headers: { "Content-Type": "application/json" },
});

// Extrai a mensagem de erro que a nossa API devolve no formato
// { mensagem: "..." }, com um texto de reserva quando nao houver.
export function extrairMensagemErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const mensagemApi = erro.response?.data?.mensagem;
    if (typeof mensagemApi === "string") return mensagemApi;
    if (erro.code === "ERR_NETWORK")
      return "Nao foi possivel falar com a API. Ela esta rodando em localhost:5050?";
  }
  return "Ocorreu um erro inesperado.";
}