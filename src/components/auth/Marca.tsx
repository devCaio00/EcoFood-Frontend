export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          claro ? "bg-white/15" : "bg-ecofood-verde"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
          <path
            d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M5 19c2-4 5-7 9-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={`text-xl font-bold tracking-tight ${claro ? "text-white" : "text-ecofood-verde"}`}
      >
        EcoFood
      </span>
    </div>
  );
}
