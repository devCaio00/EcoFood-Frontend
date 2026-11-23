import type { ReactNode } from "react";
import { Marca } from "./Marca";

const BENEFICIOS = [
  "Doadores publicam o excedente em poucos cliques.",
  "ONGs e familias reservam e confirmam o local de retirada.",
  "Menos desperdicio, mais comida chegando a quem precisa.",
];

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  rodape: ReactNode;
}

export function AuthLayout({ titulo, subtitulo, children, rodape }: Props) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_1.1fr]">
      {/* Painel da marca (desktop) */}
      <aside className="relative hidden overflow-hidden bg-ecofood-verde text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-ecofood-escuro/60"
        />
        <div
          aria-hidden
          className="absolute bottom-24 right-12 h-24 w-24 rounded-full bg-ecofood-ambar/80"
        />

        <div className="relative">
          <Marca claro />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Comida boa nao deveria ir para o lixo.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {BENEFICIOS.map((texto) => (
              <li key={texto} className="flex items-start gap-3 text-sm text-white/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" aria-hidden>
                    <path
                      d="M4 10.5l4 4 8-9"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          EcoFood - conectando excedente de alimentos a quem precisa.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Cabecalho compacto (mobile) */}
        <div className="bg-ecofood-verde px-6 py-4 lg:hidden">
          <Marca claro />
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
            <p className="mb-6 mt-1 text-sm text-gray-600">{subtitulo}</p>
            {children}
            <div className="mt-6 text-center text-sm text-gray-600">{rodape}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
