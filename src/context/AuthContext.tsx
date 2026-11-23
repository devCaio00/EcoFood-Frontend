import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fazerLogin, obterMe } from "../api/auth";
import { criarUsuario } from "../api/recursos";
import { ehErroHttp } from "../api/client";
import {
  aoExpirarSessao,
  lerSessao,
  limparSessao,
  salvarSessao,
} from "../auth/sessao";
import type { NovoUsuario, Usuario } from "../types";
import { AuthContext, type AuthContextValue, type StatusAuth } from "./contextoAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  // Se ha token salvo, a sessao precisa ser validada na API antes de liberar
  const [status, setStatus] = useState<StatusAuth>(() =>
    lerSessao() ? "carregando" : "anonimo"
  );
  const [sessaoExpirada, setSessaoExpirada] = useState(false);

  const encerrar = useCallback(
    (expirada: boolean) => {
      limparSessao();
      setPerfil(null);
      setStatus("anonimo");
      setSessaoExpirada(expirada);
      // Nada de dados de um usuario pode sobrar para o proximo
      queryClient.clear();
    },
    [queryClient]
  );

  // Interceptor avisa quando a API respondeu 401 com token
  useEffect(() => aoExpirarSessao(() => encerrar(true)), [encerrar]);

  // Valida a sessao salva ao abrir o app
  useEffect(() => {
    if (status !== "carregando") return;
    let cancelado = false;

    obterMe()
      .then((usuario) => {
        if (cancelado) return;
        setPerfil(usuario);
        setStatus("autenticado");
      })
      .catch((erro) => {
        if (cancelado) return;
        // 401 ja foi tratado pelo interceptor; outros erros (API fora do ar)
        // levam ao login sem apagar a sessao.
        if (!ehErroHttp(erro, 401)) setStatus("anonimo");
      });

    return () => {
      cancelado = true;
    };
    // roda so na montagem: status inicial define se ha o que validar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derruba a sessao no horario de expiracao do token, sem esperar um 401
  useEffect(() => {
    if (status !== "autenticado") return;
    const sessao = lerSessao();
    if (!sessao) return;
    const restante = Math.max(sessao.expiraEm - Date.now(), 0);
    const timer = setTimeout(() => encerrar(true), restante);
    return () => clearTimeout(timer);
  }, [status, perfil?.id, encerrar]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const token = await fazerLogin({ email: email.trim(), senha });
    salvarSessao(token.accessToken, token.expiresIn);
    try {
      const usuario = await obterMe();
      setPerfil(usuario);
      setStatus("autenticado");
      setSessaoExpirada(false);
    } catch (erro) {
      limparSessao();
      throw erro;
    }
  }, []);

  const cadastrar = useCallback(
    async (dados: NovoUsuario & { senha: string }) => {
      await criarUsuario(dados);
      await entrar(dados.email, dados.senha);
    },
    [entrar]
  );

  const sair = useCallback(() => encerrar(false), [encerrar]);

  const value = useMemo<AuthContextValue>(
    () => ({
      perfil,
      status,
      sessaoExpirada,
      entrar,
      cadastrar,
      sair,
      atualizarPerfil: setPerfil,
    }),
    [perfil, status, sessaoExpirada, entrar, cadastrar, sair]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

