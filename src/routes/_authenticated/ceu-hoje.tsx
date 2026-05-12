import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getTransitsForToday, type TransitItem } from "@/lib/transits.functions";
import { SIGN_GLYPHS } from "@/lib/transit-copy";

export const Route = createFileRoute("/_authenticated/ceu-hoje")({
  head: () => ({
    meta: [
      { title: "O Céu Hoje — onze-onze" },
      {
        name: "description",
        content: "Trânsitos e energias planetárias do dia.",
      },
    ],
  }),
  component: CeuHojePage,
});

function CeuHojePage() {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  const [transits, setTransits] = useState<TransitItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTransitsForToday()
      .then((res) => {
        if (!cancelled) setTransits(res.transits);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) setError("Não conseguimos consultar o céu agora.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          {hoje}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          O Céu Hoje
        </h1>
        <p className="text-sm text-ink/60 mt-2">
          As energias planetárias que estão dançando lá em cima.
        </p>
      </header>

      <section className="px-6 mb-8 space-y-3 animate-oo-enter [animation-delay:120ms]">
        {error && (
          <div className="text-sm text-ink/60 italic text-center py-6">{error}</div>
        )}
        {!transits && !error && (
          <div className="text-sm text-ink/40 italic text-center py-6">
            consultando o céu…
          </div>
        )}
        {transits?.map((t) => (
          <div
            key={t.planeta}
            className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex items-start gap-4"
          >
            <div className="size-12 bg-lilac/40 rounded-2xl flex items-center justify-center font-display text-2xl shrink-0">
              {t.glyph}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold">{t.planeta}</span>
                <span className="text-xs text-ink/50">em</span>
                <span className="text-sm font-medium">{t.signo}</span>
                <span className="font-display text-base text-ink/40">
                  {SIGN_GLYPHS[t.signo] ?? ""}
                </span>
                <span className="text-[10px] text-ink/40">{t.grau}°</span>
                {t.retrograde && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-peach/60 text-ink/70 font-medium ml-auto">
                    ℞ retrógrado
                  </span>
                )}
              </div>
              <p className="text-sm text-ink/70 mt-1 leading-snug">{t.texto}</p>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}