import { describe, expect, it } from "vitest";
import { temErros, validarEmail, validarNovaSenha, validarObrigatorio } from "./validacao";

describe("validarEmail", () => {
  it("aceita e-mail valido (ignorando espacos nas pontas)", () => {
    expect(validarEmail("  ana@exemplo.com ")).toBeUndefined();
  });

  it.each(["", "   ", "sem-arroba", "a@b", "a b@c.com"])("rejeita %j", (valor) => {
    expect(validarEmail(valor)).toBeDefined();
  });
});

describe("validarNovaSenha", () => {
  it("exige 8 caracteres no minimo, como a API", () => {
    expect(validarNovaSenha("1234567")).toMatch(/8 caracteres/);
    expect(validarNovaSenha("12345678")).toBeUndefined();
  });

  it("rejeita senha so com espacos e acima de 128 caracteres", () => {
    expect(validarNovaSenha("        ")).toBeDefined();
    expect(validarNovaSenha("a".repeat(129))).toBeDefined();
  });
});

describe("validarObrigatorio / temErros", () => {
  it("valida obrigatoriedade e tamanho", () => {
    expect(validarObrigatorio(" ", "o nome", 150)).toBe("Informe o nome.");
    expect(validarObrigatorio("a".repeat(151), "o nome", 150)).toBeDefined();
    expect(validarObrigatorio("Ana", "o nome", 150)).toBeUndefined();
  });

  it("temErros ignora campos sem erro", () => {
    expect(temErros({ a: undefined, b: undefined })).toBe(false);
    expect(temErros({ a: undefined, b: "erro" })).toBe(true);
  });
});
