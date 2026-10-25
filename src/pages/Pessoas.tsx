import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarUsuario, listarUsuarios } from "../api/recursos";
import { extrairMensagemErro } from "../api/client";
import { usePerfil } from "../context/PerfilContext";
import type { TipoUsuario } from "../types";

export function Pessoas() {
  const { perfil, definirPerfil } = usePerfil();
  const queryClient = useQueryClient();
  const [aviso, setAviso] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState<TipoUsuario>("Receptor");
  const [endereco, setEndereco] = useState("");

  const { data: usuarios = [] } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });

  const cadastrar = useMutation({
    mutationFn: () => criarUsuario({ nome, email, tipoUsuario: tipo, endereco }),
    onSuccess: (criado) => {
      setAviso(`Perfil ${criado.nome} cadastrado e selecionado.`);
      definirPerfil(criado);
      setNome("");
      setEmail("");
      setEndereco("");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (erro) => setAviso(extrairMensagemErro(erro)),
  });

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-ecofood-verde">Pessoas</h1>

      {aviso && (
        <p className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-900">{aviso}</p>
      )}

      <h2 className="mb-2 font-semibold">Perfis cadastrados</h2>
      <ul className="mb-6 flex flex-col gap-2">
        {usuarios.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {u.nome} <span className="text-xs text-gray-500">({u.tipoUsuario})</span>
              </p>
              <p className="truncate text-xs text-gray-500">{u.endereco}</p>
            </div>
            <button
              type="button"
              onClick={() => definirPerfil(u)}
              className="shrink-0 rounded-md border border-ecofood-verde px-3 py-1 text-xs font-semibold text-ecofood-verde"
            >
              {perfil?.id === u.id ? "Em uso" : "Usar este"}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 font-semibold">Novo cadastro</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          cadastrar.mutate();
        }}
        className="flex max-w-md flex-col gap-3"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Nome
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          E-mail
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Tipo de perfil
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoUsuario)}
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          >
            <option value="Doador">Doador (estabelecimento com excedente)</option>
            <option value="Receptor">Receptor (ONG, instituicao, familia)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Endereco completo
          <input
            required
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, numero - bairro/cidade"
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <button
          type="submit"
          disabled={cadastrar.isPending}
          className="self-start rounded-md bg-ecofood-verde px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          Cadastrar e usar este perfil
        </button>
      </form>
    </section>
  );
}