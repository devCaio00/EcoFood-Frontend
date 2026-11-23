import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erro?: string;
  dica?: string;
  /** Conteudo extra ao lado do rotulo. */
  acaoRotulo?: ReactNode;
}

const baseInput =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 " +
  "outline-none transition focus:border-ecofood-verde focus:ring-2 focus:ring-ecofood-verde/25 " +
  "disabled:cursor-not-allowed disabled:bg-gray-100";

function classeInput(comErro: boolean): string {
  return `${baseInput} ${comErro ? "border-red-400" : "border-gray-300"}`;
}

export function Campo({ rotulo, erro, dica, acaoRotulo, className, ...resto }: CampoProps) {
  const id = useId();
  const idMsg = `${id}-msg`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-gray-800">
          {rotulo}
        </label>
        {acaoRotulo}
      </div>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro || dica ? idMsg : undefined}
        className={`${classeInput(!!erro)} ${className ?? ""}`}
        {...resto}
      />
      {(erro || dica) && (
        <p id={idMsg} className={`text-xs ${erro ? "text-red-600" : "text-gray-500"}`}>
          {erro ?? dica}
        </p>
      )}
    </div>
  );
}

// Campo de senha com botao Mostrar/Ocultar. O botao entra como "acaoRotulo"
// (ao lado do rotulo), assim nao depende de posicionamento absoluto.
export function CampoSenha(props: Omit<CampoProps, "type" | "acaoRotulo">) {
  const [visivel, setVisivel] = useState(false);

  return (
    <Campo
      {...props}
      type={visivel ? "text" : "password"}
      acaoRotulo={
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-pressed={visivel}
          className="rounded px-1 text-xs font-semibold text-ecofood-verde hover:underline focus:outline-none focus:ring-2 focus:ring-ecofood-verde/40"
        >
          {visivel ? "Ocultar senha" : "Mostrar senha"}
        </button>
      }
    />
  );
}

export function AlertaErro({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
    >
      {children}
    </div>
  );
}

export function AlertaInfo({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900"
    >
      {children}
    </div>
  );
}

export function AlertaSucesso({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="rounded-lg border border-green-200 bg-ecofood-claro px-3 py-2.5 text-sm text-ecofood-escuro"
    >
      {children}
    </div>
  );
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  carregando?: boolean;
}

export function BotaoPrimario({ carregando, children, disabled, ...resto }: BotaoProps) {
  return (
    <button
      {...resto}
      disabled={carregando || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-ecofood-verde px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ecofood-escuro focus:outline-none focus:ring-2 focus:ring-ecofood-verde focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {carregando && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
