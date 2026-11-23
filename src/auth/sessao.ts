// Armazenamento da sessao (token Bearer + momento de expiracao).
// Fica fora do React para que o interceptor do axios possa usar sem hooks.

const CHAVE = "ecofood.sessao";

interface Sessao {
  token: string;
  expiraEm: number; // epoch em ms
}

export function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const sessao = JSON.parse(bruto) as Sessao;
    if (typeof sessao.token !== "string" || sessao.expiraEm <= Date.now()) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return sessao;
  } catch {
    // localStorage indisponivel ou JSON corrompido: trata como sem sessao
    return null;
  }
}

export function lerToken(): string | null {
  return lerSessao()?.token ?? null;
}

export function salvarSessao(token: string, expiraEmSegundos: number): void {
  try {
    const sessao: Sessao = { token, expiraEm: Date.now() + expiraEmSegundos * 1000 };
    localStorage.setItem(CHAVE, JSON.stringify(sessao));
  } catch {
    // sem storage a sessao vale so ate recarregar a pagina
  }
}

export function limparSessao(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a limpar */
  }
}

// ---------- Aviso de sessao expirada (usado pelo interceptor) ----------

type Ouvinte = () => void;
const ouvintes = new Set<Ouvinte>();

export function aoExpirarSessao(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function notificarSessaoExpirada(): void {
  ouvintes.forEach((ouvinte) => ouvinte());
}
