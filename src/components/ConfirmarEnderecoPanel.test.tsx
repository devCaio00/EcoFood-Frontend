import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { ConfirmarEnderecoPanel } from "./ConfirmarEnderecoPanel";

// Limpa o ecrã virtual após cada teste
afterEach(() => {
  cleanup();
});

const ENDERECO = "R. das Flores, 100 - Contagem/MG";

describe("ConfirmarEnderecoPanel", () => {
  it("mostra o endereco de retirada para o receptor conferir", () => {
    render(
      <ConfirmarEnderecoPanel
        endereco={ENDERECO}
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.getByText(ENDERECO)).toBeInTheDocument();
  });

  it("comeca com o botao de confirmar desabilitado", () => {
    render(
      <ConfirmarEnderecoPanel
        endereco={ENDERECO}
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    const botao = screen.getByRole("button", { name: /confirmar reserva/i });
    expect(botao).toBeDisabled();
  });

  it("habilita o botao somente depois de marcar a confirmacao", async () => {
    const usuario = userEvent.setup();
    render(
      <ConfirmarEnderecoPanel
        endereco={ENDERECO}
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    const botao = screen.getByRole("button", { name: /confirmar reserva/i });
    expect(botao).toBeDisabled();

    await usuario.click(screen.getByRole("checkbox"));
    expect(botao).toBeEnabled();
  });

  it("nao chama onConfirmar enquanto a confirmacao nao for marcada", async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn(); 

    render(
      <ConfirmarEnderecoPanel
        endereco={ENDERECO}
        onConfirmar={onConfirmar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.click(screen.getByRole("button", { name: /confirmar reserva/i }));
    expect(onConfirmar).not.toHaveBeenCalled();
  });

  it("chama onConfirmar uma vez quando confirmado e clicado", async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn();

    render(
      <ConfirmarEnderecoPanel
        endereco={ENDERECO}
        onConfirmar={onConfirmar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.click(screen.getByRole("checkbox"));
    await usuario.click(screen.getByRole("button", { name: /confirmar reserva/i }));

    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});