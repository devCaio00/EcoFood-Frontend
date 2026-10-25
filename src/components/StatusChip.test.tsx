import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { StatusChip } from "./StatusChip";


afterEach(() => {
  cleanup();
});

describe("StatusChip", () => {
  it("exibe o texto do status", () => {
    render(<StatusChip status="Disponivel" />);
    expect(screen.getByText("Disponivel")).toBeInTheDocument();
  });

  it("nao quebra com um status desconhecido", () => {
    // @ts-expect-error: simulando um status novo vindo do backend
    render(<StatusChip status="StatusNovo" />);
    expect(screen.getByText("StatusNovo")).toBeInTheDocument();
  });
});