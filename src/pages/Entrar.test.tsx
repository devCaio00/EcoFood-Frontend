import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import type { Usuario } from "../types";

vi.mock("../api/auth", () => ({
  fazerLogin: vi.fn(),
  obterMe: vi.fn(),
}));

import { fazerLogin, obterMe } from "../api/auth";
import { AuthProvider } from "../context/AuthContext";
import { RotaProtegida, RotaPublica } from "../auth/Rotas";
import { limparSessao, lerToken } from "../auth/sessao";
import { Entrar } from "./Entrar";

const usuario: Usuario = {
  id: 1,
  nome: "Ana",
  email: "ana@exemplo.com",
  telefone: null,
  tipoUsuario: "Receptor",
  endereco: "Rua A, 1",
  dataCadastro: "2026-01-01T00:00:00",
};

function montar(rotaInicial = "/doacoes") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rotaInicial]}>
        <AuthProvider>
          <Routes>
            <Route element={<RotaPublica />}>
              <Route path="/entrar" element={<Entrar />} />
            </Route>
            <Route element={<RotaProtegida />}>
              <Route path="/doacoes" element={<p>Area logada</p>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function erroApi(status: number, data: unknown) {
  return new AxiosError("falhou", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    data,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });
}

beforeEach(() => {
  vi.mocked(fazerLogin).mockReset();
  vi.mocked(obterMe).mockReset();
});

afterEach(() => {
  cleanup();
  limparSessao();
});

describe("fluxo de login", () => {
  it("visitante e levado ao login ao abrir uma rota protegida", async () => {
    montar("/doacoes");
    expect(await screen.findByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });

  it("valida os campos antes de chamar a API", async () => {
    montar("/entrar");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe o e-mail.")).toBeInTheDocument();
    expect(screen.getByText("Informe a senha.")).toBeInTheDocument();
    expect(fazerLogin).not.toHaveBeenCalled();
  });

  it("entra, guarda a sessao e libera a area logada", async () => {
    vi.mocked(fazerLogin).mockResolvedValue({ accessToken: "tok", expiresIn: 3600 });
    vi.mocked(obterMe).mockResolvedValue(usuario);

    montar("/entrar");
    await userEvent.type(screen.getByLabelText("E-mail"), "  ana@exemplo.com ");
    await userEvent.type(screen.getByLabelText("Senha"), "senha12345");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Area logada")).toBeInTheDocument();
    expect(fazerLogin).toHaveBeenCalledWith({ email: "ana@exemplo.com", senha: "senha12345" });
    expect(lerToken()).toBe("tok");
  });

  it("mostra a mensagem da API quando as credenciais falham", async () => {
    vi.mocked(fazerLogin).mockRejectedValue(
      erroApi(401, { mensagem: "E-mail ou senha invalidos." })
    );

    montar("/entrar");
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@exemplo.com");
    await userEvent.type(screen.getByLabelText("Senha"), "errada123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha invalidos.");
    expect(lerToken()).toBeNull();
  });

  it("mostra aviso claro no limite de tentativas (429)", async () => {
    vi.mocked(fazerLogin).mockRejectedValue(erroApi(429, null));

    montar("/entrar");
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@exemplo.com");
    await userEvent.type(screen.getByLabelText("Senha"), "qualquer1");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Muitas tentativas");
  });

  it("restaura a sessao salva ao abrir o app (valida via /auth/me)", async () => {
    localStorage.setItem(
      "ecofood.sessao",
      JSON.stringify({ token: "salvo", expiraEm: Date.now() + 60_000 })
    );
    vi.mocked(obterMe).mockResolvedValue(usuario);

    montar("/doacoes");

    expect(await screen.findByText("Area logada")).toBeInTheDocument();
    await waitFor(() => expect(obterMe).toHaveBeenCalledTimes(1));
  });

  it("alterna a visibilidade da senha", async () => {
    montar("/entrar");
    const campo = screen.getByLabelText("Senha");
    expect(campo).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(campo).toHaveAttribute("type", "text");
  });
});
