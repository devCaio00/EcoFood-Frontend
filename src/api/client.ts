import axios from "axios";
import { lerToken, limparSessao, notificarSessaoExpirada } from "../auth/sessao";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050/api",
  headers: { "Content-Type": "application/json" },
});

// Anexa o token Bearer em toda chamada quando existe sessao.
api.interceptors.request.use((config) => {
  const token = lerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 fora do login = token expirado/invalidado (ex.: senha trocada em
// outro lugar). Limpa a sessao e avisa a aplicacao para voltar ao login.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (axios.isAxiosError(erro) && erro.response?.status === 401) {
      const ehLogin = erro.config?.url?.includes("/auth/login");
      if (!ehLogin) {
        limparSessao();
        notificarSessaoExpirada();
      }
    }
    return Promise.reject(erro);
  }
);

// Extrai a mensagem de erro que a nossa API devolve no formato
// { mensagem: "..." }, com um texto de reserva quando nao houver.
export function extrairMensagemErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const data = erro.response?.data;
    if (typeof data?.mensagem === "string") return data.mensagem;
    if (erro.response?.status === 429)
      return "Muitas tentativas seguidas. Aguarde um minuto e tente novamente.";
    // Validacao automatica do ASP.NET: { errors: { Campo: ["msg"] } }
    if (data?.errors && typeof data.errors === "object") {
      const primeira = Object.values(data.errors).flat()[0];
      if (typeof primeira === "string") return primeira;
    }
    if (erro.code === "ERR_NETWORK")
      return "Nao foi possivel falar com a API. Ela esta rodando em localhost:5050?";
  }
  return "Ocorreu um erro inesperado.";
}

export function ehErroHttp(erro: unknown, status: number): boolean {
  return axios.isAxiosError(erro) && erro.response?.status === status;
}
