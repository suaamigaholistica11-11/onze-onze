import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  getTransitsForToday,
  getMoonForToday,
  type TransitItem,
  type MoonNowInfo,
} from "@/lib/transits.functions";
import { SIGN_GLYPHS } from "@/lib/transit-copy";
import solarSystem from "@/assets/solar-system.png";
import { useBgDisabled } from "@/lib/bg-preference";

export const Route = createFileRoute("/_authenticated/ceu-hoje")({
  head: () => ({
    meta: [
      { title: "O Céu Hoje · onze-onze" },
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
  const bgDisabled = useBgDisabled();
  const [transits, setTransits] = useState<TransitItem[] | null>(null);
  const [moon, setMoon] = useState<MoonNowInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getTransitsForToday(), getMoonForToday()])
      .then(([t, m]) => {
        if (cancelled) return;
        setTransits(t.transits);
        setMoon(m);
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
      {!bgDisabled && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-15"
          style={{ backgroundImage: `url(${solarSystem})` }}
        />
      )}
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

      {moon && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
          <div className="bg-gradient-to-br from-lilac/50 to-yellow-candy/40 rounded-[28px] p-5 ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{moon.fase.glyph}</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50">
                  fase da lua
                </p>
                <p className="font-display text-xl font-bold leading-tight">
                  {moon.fase.nome}
                </p>
                <p className="text-xs text-ink/60 mt-0.5">
                  em {moon.signo} {SIGN_GLYPHS[moon.signo] ?? ""} · {moon.grau}°
                </p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mb-1">
              {moon.fase.energia}
            </p>
            <p className="text-sm text-ink/80 leading-relaxed mb-3">
              {moon.fase.significado}
            </p>
            <div className="bg-white/60 rounded-2xl p-3 text-xs text-ink/70 leading-snug">
              <strong className="font-display">prática de hoje:</strong> {moon.fase.pratica}
            </div>
          </div>

          {moon.proximas.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl ring-1 ring-black/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-3">
                próximas mudanças de lua
              </p>
              <ul className="space-y-2">
                {moon.proximas.slice(0, 4).map((p) => (
                  <li key={p.nome + p.dataISO} className="flex items-center gap-3 text-sm">
                    <span className="text-xl">{p.glyph}</span>
                    <span className="font-medium flex-1">{p.nome}</span>
                    <span className="text-xs text-ink/60">
                      {new Date(p.dataISO).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span className="text-[10px] text-ink/40 w-14 text-right">
                      {p.diasRestantes === 0 ? "hoje" : `em ${p.diasRestantes}d`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="px-6 mb-8 space-y-3 animate-oo-enter [animation-delay:120ms]">
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-1">
          trânsitos planetários
        </p>
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