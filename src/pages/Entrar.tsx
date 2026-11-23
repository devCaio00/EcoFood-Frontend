import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { extrairMensagemErro } from "../api/client";
import { useAuth } from "../context/useAuth";
import { validarEmail, temErros, type Erros } from "../auth/validacao";
import { AuthLayout } from "../components/auth/AuthLayout";
import {
  AlertaErro,
  AlertaInfo,
  BotaoPrimario,
  Campo,
  CampoSenha,
} from "../components/auth/Campo";

export function Entrar() {
  const { entrar, sessaoExpirada } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Erros<"email" | "senha">>({});

  // Em caso de sucesso o AuthContext vira "autenticado" e a RotaPublica
  // leva o usuario para a pagina que ele tentou abrir (ou /doacoes).
  const login = useMutation({ mutationFn: () => entrar(email, senha) });

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    const novos: Erros<"email" | "senha"> = {
      email: validarEmail(email),
      senha: senha ? undefined : "Informe a senha.",
    };
    setErros(novos);
    if (!temErros(novos)) login.mutate();
  }

  return (
    <AuthLayout
      titulo="Entrar"
      subtitulo="Acesse sua conta para doar ou reservar alimentos."
      rodape={
        <>
          Ainda nao tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-ecofood-verde hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-4">
        {sessaoExpirada && !login.isError && (
          <AlertaInfo>Sua sessao expirou. Entre novamente para continuar.</AlertaInfo>
        )}
        {login.isError && <AlertaErro>{extrairMensagemErro(login.error)}</AlertaErro>}

        <Campo
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          placeholder="voce@exemplo.com"
          value={email}
          erro={erros.email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErros((x) => ({ ...x, email: undefined }));
          }}
        />

        <CampoSenha
          rotulo="Senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={senha}
          erro={erros.senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setErros((x) => ({ ...x, senha: undefined }));
          }}
        />

        <BotaoPrimario type="submit" carregando={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </BotaoPrimario>
      </form>
    </AuthLayout>
  );
}
