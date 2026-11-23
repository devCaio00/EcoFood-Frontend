import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aoExpirarSessao,
  lerSessao,
  lerToken,
  limparSessao,
  notificarSessaoExpirada,
  salvarSessao,
} from "./sessao";

afterEach(() => {
  limparSessao();
  vi.useRealTimers();
});

describe("sessao", () => {
  it("guarda e le o token", () => {
    salvarSessao("abc", 3600);
    expect(lerToken()).toBe("abc");
  });

  it("descarta a sessao depois que o token expira", () => {
    vi.useFakeTimers();
    salvarSessao("abc", 60);
    vi.advanceTimersByTime(61_000);
    expect(lerSessao()).toBeNull();
    expect(localStorage.getItem("ecofood.sessao")).toBeNull();
  });

  it("trata JSON corrompido como sem sessao", () => {
    localStorage.setItem("ecofood.sessao", "{nao-e-json");
    expect(lerToken()).toBeNull();
  });

  it("limparSessao remove o token", () => {
    salvarSessao("abc", 3600);
    limparSessao();
    expect(lerToken()).toBeNull();
  });

  it("avisa os ouvintes quando a sessao expira e permite cancelar", () => {
    const ouvinte = vi.fn();
    const cancelar = aoExpirarSessao(ouvinte);

    notificarSessaoExpirada();
    expect(ouvinte).toHaveBeenCalledTimes(1);

    cancelar();
    notificarSessaoExpirada();
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });
});
