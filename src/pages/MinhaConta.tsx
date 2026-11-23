import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atualizarConta, excluirConta } from "../api/auth";
import { extrairMensagemErro } from "../api/client";
import { useAuth, usePerfil } from "../context/useAuth";
import {
  temErros,
  validarEmail,
  validarNovaSenha,
  validarObrigatorio,
  type Erros,
} from "../auth/validacao";
import {
  AlertaErro,
  AlertaSucesso,
  BotaoPrimario,
  Campo,
  CampoSenha,
} from "../components/auth/Campo";

type CampoForm = "nome" | "email" | "telefone" | "endereco" | "senhaAtual" | "novaSenha";

export function MinhaConta() {
  const { perfil } = usePerfil();
  const { atualizarPerfil, entrar, sair } = useAuth();
  const queryClient = useQueryClient();

  const [nome, setNome] = useState(perfil.nome);
  const [email, setEmail] = useState(perfil.email);
  const [telefone, setTelefone] = useState(perfil.telefone ?? "");
  const [endereco, setEndereco] = useState(perfil.endereco);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erros, setErros] = useState<Erros<CampoForm>>({});
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const mudouEmail = email.trim().toLowerCase() !== perfil.email.toLowerCase();
  const precisaSenhaAtual = mudouEmail || novaSenha.length > 0;

  const salvar = useMutation({
    mutationFn: async () => {
      const novoEmail = email.trim();
      const atualizado = await atualizarConta(perfil.id, {
        nome: nome.trim(),
        email: novoEmail,
        telefone: telefone.trim() || null,
        endereco: endereco.trim(),
        senhaAtual: precisaSenhaAtual ? senhaAtual : undefined,
        novaSenha: novaSenha || undefined,
      });
      // Trocar a senha invalida os tokens antigos: entra de novo em silencio
      // com a senha nova para a pessoa nao ser deslogada.
      if (novaSenha) await entrar(atualizado.email, novaSenha);
      return atualizado;
    },
    onSuccess: (atualizado) => {
      atualizarPerfil(atualizado);
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setSenhaAtual("");
      setNovaSenha("");
      setSucesso(novaSenha ? "Dados e senha atualizados." : "Dados atualizados.");
    },
    onError: () => setSucesso(null),
  });

  const excluir = useMutation({
    mutationFn: () => excluirConta(perfil.id),
    onSuccess: () => sair(),
    onError: () => setConfirmandoExclusao(false),
  });

  function limpar(campo: CampoForm) {
    setErros((x) => ({ ...x, [campo]: undefined }));
    setSucesso(null);
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    const novos: Erros<CampoForm> = {
      nome: validarObrigatorio(nome, "o nome", 150),
      email: validarEmail(email),
      telefone: telefone.length > 20 ? "Use no maximo 20 caracteres." : undefined,
      endereco: validarObrigatorio(endereco, "o endereco", 255),
      senhaAtual: precisaSenhaAtual && !senhaAtual ? "Informe a senha atual." : undefined,
      novaSenha: novaSenha ? validarNovaSenha(novaSenha) : undefined,
    };
    setErros(novos);
    if (!temErros(novos)) salvar.mutate();
  }

  return (
    <section className="max-w-xl">
      <h1 className="mb-1 text-xl font-bold text-ecofood-verde">Minha conta</h1>
      <p className="mb-6 text-sm text-gray-600">
        Perfil {perfil.tipoUsuario}. Cadastrada em{" "}
        {new Date(perfil.dataCadastro).toLocaleDateString("pt-BR")}.
      </p>

      <form
        onSubmit={aoEnviar}
        noValidate
        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5"
      >
        {salvar.isError && <AlertaErro>{extrairMensagemErro(salvar.error)}</AlertaErro>}
        {sucesso && <AlertaSucesso>{sucesso}</AlertaSucesso>}

        <Campo
          rotulo="Nome"
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
          value={email}
          erro={erros.email}
          dica={mudouEmail ? "Para trocar o e-mail, confirme sua senha atual abaixo." : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            limpar("email");
          }}
        />
        <Campo
          rotulo="Telefone (opcional)"
          type="tel"
          autoComplete="tel"
          value={telefone}
          erro={erros.telefone}
          onChange={(e) => {
            setTelefone(e.target.value);
            limpar("telefone");
          }}
        />
        <Campo
          rotulo="Endereco"
          autoComplete="street-address"
          value={endereco}
          erro={erros.endereco}
          onChange={(e) => {
            setEndereco(e.target.value);
            limpar("endereco");
          }}
        />

        <hr className="border-gray-200" />
        <h2 className="text-sm font-bold text-gray-900">Alterar senha</h2>

        <CampoSenha
          rotulo="Nova senha"
          autoComplete="new-password"
          dica="Deixe em branco para manter a senha atual."
          value={novaSenha}
          erro={erros.novaSenha}
          onChange={(e) => {
            setNovaSenha(e.target.value);
            limpar("novaSenha");
          }}
        />

        {precisaSenhaAtual && (
          <CampoSenha
            rotulo="Senha atual"
            autoComplete="current-password"
            value={senhaAtual}
            erro={erros.senhaAtual}
            onChange={(e) => {
              setSenhaAtual(e.target.value);
              limpar("senhaAtual");
            }}
          />
        )}

        <div className="sm:w-56">
          <BotaoPrimario type="submit" carregando={salvar.isPending}>
            {salvar.isPending ? "Salvando..." : "Salvar alteracoes"}
          </BotaoPrimario>
        </div>
      </form>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-sm font-bold text-red-800">Excluir conta</h2>
        <p className="mt-1 text-sm text-gray-700">
          A exclusao e definitiva. Contas com doacoes ou reservas vinculadas nao podem ser
          excluidas.
        </p>

        {excluir.isError && (
          <div className="mt-3">
            <AlertaErro>{extrairMensagemErro(excluir.error)}</AlertaErro>
          </div>
        )}

        {confirmandoExclusao ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-red-800">Tem certeza?</span>
            <button
              type="button"
              onClick={() => excluir.mutate()}
              disabled={excluir.isPending}
              className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {excluir.isPending ? "Excluindo..." : "Sim, excluir minha conta"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoExclusao(false)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoExclusao(true)}
            className="mt-3 rounded-lg border border-red-400 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Excluir minha conta
          </button>
        )}
      </div>
    </section>
  );
}
