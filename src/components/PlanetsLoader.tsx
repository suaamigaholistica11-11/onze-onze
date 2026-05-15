export function PlanetsLoader({ label = "carregando…" }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-lilac/30 via-sky/20 to-peach/20">
      <div className="relative size-56 flex items-center justify-center">
        {/* Estrelinhas piscando ao fundo */}
        <span aria-hidden className="absolute top-2 left-6 size-1 rounded-full bg-ink/60 animate-oo-twinkle-a" />
        <span aria-hidden className="absolute bottom-4 right-4 size-1 rounded-full bg-ink/60 animate-oo-twinkle-b" />
        <span aria-hidden className="absolute top-10 right-2 size-1 rounded-full bg-ink/60 animate-oo-twinkle-c" />
        <span aria-hidden className="absolute bottom-8 left-2 size-1 rounded-full bg-ink/60 animate-oo-twinkle-d" />

        {/* Sol no centro */}
        <span
          aria-hidden
          className="absolute size-7 rounded-full bg-yellow-candy animate-oo-sun-glow"
        />

        {/* Órbita 1 (interna) */}
        <div className="absolute size-28 rounded-full border border-dashed border-ink/15" />
        <div className="absolute size-28 animate-oo-orbit">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-peach shadow-[0_0_10px_rgba(0,0,0,0.08)]" />
        </div>

        {/* Órbita 2 (média, sentido contrário) */}
        <div className="absolute size-40 rounded-full border border-dashed border-ink/12" />
        <div className="absolute size-40 animate-oo-orbit-rev">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 size-5 rounded-full bg-mint shadow-[0_0_10px_rgba(0,0,0,0.08)]" />
        </div>

        {/* Órbita 3 (externa) */}
        <div className="absolute size-52 rounded-full border border-dashed border-ink/10" />
        <div className="absolute size-52 animate-oo-orbit" style={{ animationDuration: "12s" }}>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 size-6 rounded-full bg-lilac shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            {/* mini lua acompanhando o planeta externo */}
            <span className="absolute -right-3 top-1 size-2 rounded-full bg-sky" />
          </span>
        </div>
      </div>

      <span className="font-display text-xl italic text-ink/70 animate-pulse">
        {label}
      </span>
    </div>
  );
}