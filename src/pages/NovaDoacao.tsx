import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarDoacao } from "../api/recursos";
import { extrairMensagemErro } from "../api/client";
import { usePerfil } from "../context/PerfilContext";

export function NovaDoacao() {
  const { perfil, ehDoador } = usePerfil();
  const queryClient = useQueryClient();
  const [aviso, setAviso] = useState<string | null>(null);

  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState("kg");
  const [validade, setValidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const publicar = useMutation({
    mutationFn: () =>
      criarDoacao({
        doadorId: perfil!.id,
        descricao,
        categoria: categoria || undefined,
        quantidade,
        unidadeMedida: unidade,
        validadeAlimento: validade || null,
        observacoes: observacoes || undefined,
      }),
    onSuccess: () => {
      setAviso("Doacao publicada. Ela ja aparece para os receptores.");
      setDescricao("");
      setCategoria("");
      setQuantidade(1);
      setValidade("");
      setObservacoes("");
      queryClient.invalidateQueries({ queryKey: ["doacoes"] });
    },
    onError: (erro) => setAviso(extrairMensagemErro(erro)),
  });

  if (!perfil)
    return (
      <p className="rounded-md bg-amber-50 p-3 text-sm">
        Selecione um perfil no topo da pagina.
      </p>
    );

  if (!ehDoador)
    return (
      <p className="rounded-md bg-amber-50 p-3 text-sm">
        Apenas perfis Doador podem publicar doacoes. Perfil atual: {perfil.tipoUsuario}.
      </p>
    );

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-ecofood-verde">Nova doacao</h1>

      {aviso && (
        <p className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-900">{aviso}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();   // impede o recarregamento padrao do navegador
          publicar.mutate();
        }}
        className="flex max-w-md flex-col gap-3"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Descricao
          <input
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Paes e bisnagas do dia"
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Categoria
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex: Panificados"
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
            Quantidade
            <input
              required
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
            />
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
            Unidade
            <input
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Validade do alimento
          <input
            type="date"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Observacoes
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: retirar ate as 19h"
            className="min-h-20 rounded-md border border-gray-300 px-2 py-1.5 font-normal"
          />
        </label>

        <button
          type="submit"
          disabled={publicar.isPending}
          className="self-start rounded-md bg-ecofood-verde px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          {publicar.isPending ? "Publicando..." : "Publicar doacao"}
        </button>
      </form>
    </section>
  );
}