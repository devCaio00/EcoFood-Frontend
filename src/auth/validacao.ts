// Regras de validacao espelham as da API (UsuarioCreateDto / UsuarioUpdateDto).

export const SENHA_MIN = 8;
export const SENHA_MAX = 128;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(valor: string): string | undefined {
  const email = valor.trim();
  if (!email) return "Informe o e-mail.";
  if (email.length > 150 || !EMAIL.test(email)) return "Informe um e-mail valido.";
}

export function validarNovaSenha(valor: string): string | undefined {
  if (!valor.trim()) return "Informe a senha.";
  if (valor.length < SENHA_MIN) return `A senha precisa ter pelo menos ${SENHA_MIN} caracteres.`;
  if (valor.length > SENHA_MAX) return `A senha pode ter no maximo ${SENHA_MAX} caracteres.`;
}

export function validarObrigatorio(valor: string, nomeCampo: string, max: number): string | undefined {
  const texto = valor.trim();
  if (!texto) return `Informe ${nomeCampo}.`;
  if (texto.length > max) return `Use no maximo ${max} caracteres.`;
}

export type Erros<T extends string> = Partial<Record<T, string>>;

export function temErros(erros: object): boolean {
  return Object.values(erros).some(Boolean);
}
