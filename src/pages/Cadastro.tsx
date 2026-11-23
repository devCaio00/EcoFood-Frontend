import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { extrairMensagemErro } from "../api/client";
import { useAuth } from "../context/useAuth";
import {
  temErros,
  validarEmail,
  validarNovaSenha,
  validarObrigatorio,
  type Erros,
} from "../auth/validacao";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AlertaErro, BotaoPrimario, Campo, CampoSenha } from "../components/auth/Campo";
import type { TipoUsuario } from "../types";

type CampoForm = "nome" | "email" | "telefone" | "endereco" | "senha" | "confirmacao";

const TIPOS: { valor: Extract<TipoUsuario, "Doador" | "Receptor">; titulo: string; texto: string }[] = [
  { valor: "Receptor", titulo: "Receptor", texto: "ONG, instituicao ou familia que recebe alimentos." },
  { valor: "Doador", titulo: "Doador", texto: "Estabelecimento com excedente para doar." },
];

export function Cadastro() {
  const { cadastrar } = useAuth();
  const [tipo, setTipo] = useState<"Doador" | "Receptor">("Receptor");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<Erros<CampoForm>>({});

  // Cria a conta e ja entra (AuthContext.cadastrar faz as duas chamadas)
  const registro = useMutation({
    mutationFn: () =>
      cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
        tipoUsuario: tipo,
        endereco: endereco.trim(),
        senha,
      }),
  });

  function limpar(campo: CampoForm) {
    setErros((x) => ({ ...x, [campo]: undefined }));
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    const novos: Erros<CampoForm> = {
      nome: validarObrigatorio(nome, "o nome", 150),
      email: validarEmail(email),
      telefone: telefone.length > 20 ? "Use no maximo 20 caracteres." : undefined,
      endereco: validarObrigatorio(endereco, "o endereco", 255),
      senha: validarNovaSenha(senha),
      confirmacao: senha !== confirmacao ? "As senhas nao conferem." : undefined,
    };
    setErros(novos);
    if (!temErros(novos)) registro.mutate();
  }

  return (
    <AuthLayout
      titulo="Criar conta"
      subtitulo="Leva menos de um minuto. Depois e so entrar e comecar."
      rodape={
        <>
          Ja tem conta?{" "}
          <Link to="/entrar" className="font-semibold text-ecofood-verde hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-4">
        {registro.isError && <AlertaErro>{extrairMensagemErro(registro.error)}</AlertaErro>}

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm font-semibold text-gray-800">Eu sou</legend>
          <div className="grid grid-cols-2 gap-3">
            {TIPOS.map((t) => {
              const ativo = tipo === t.valor;
              return (
                <label
                  key={t.valor}
                  className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm transition focus-within:ring-2 focus-within:ring-ecofood-verde/40 ${
                    ativo
                      ? "border-ecofood-verde bg-ecofood-claro"
                      : "border-gray-300 bg-white hover:border-ecofood-verde/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={t.valor}
                    checked={ativo}
                    onChange={() => setTipo(t.valor)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-900">{t.titulo}</span>
                  <span className="text-xs text-gray-600">{t.texto}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Campo
          rotulo={tipo === "Doador" ? "Nome do estabelecimento" : "Nome ou instituicao"}
          autoComplete="name"
          value={nome}
          erro={erros.nome}
          onChange={(e) => {
            setNome(e.target.value);
            limpar("nome");
          }}
        />

        <Campo
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          value={email}
          erro={erros.email}
          onChange={(e) => {
            setEmail(e.target.value);
            limpar("email");
          }}
        />

        <Campo
          rotulo="Telefone (opcional)"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={telefone}
          erro={erros.telefone}
          onChange={(e) => {
            setTelefone(e.target.value);
            limpar("telefone");
          }}
        />

        <Campo
          rotulo="Endereco completo"
          autoComplete="street-address"
          placeholder="Rua, numero - bairro/cidade"
          dica={
            tipo === "Doador"
              ? "E o local onde os receptores vao retirar os alimentos."
              : undefined
          }
          value={endereco}
          erro={erros.endereco}
          onChange={(e) => {
            setEndereco(e.target.value);
            limpar("endereco");
          }}
        />

        <CampoSenha
          rotulo="Senha"
          autoComplete="new-password"
          dica="Minimo de 8 caracteres."
          value={senha}
          erro={erros.senha}
          onChange={(e) => {
            setSenha(e.target.value);
            limpar("senha");
          }}
        />

        <CampoSenha
          rotulo="Confirmar senha"
          autoComplete="new-password"
          value={confirmacao}
          erro={erros.confirmacao}
          onChange={(e) => {
            setConfirmacao(e.target.value);
            limpar("confirmacao");
          }}
        />

        <BotaoPrimario type="submit" carregando={registro.isPending}>
          {registro.isPending ? "Criando conta..." : "Criar conta"}
        </BotaoPrimario>
      </form>
    </AuthLayout>
  );
}
