import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  getTransitsForToday,
  getMoonForToday,
  type TransitItem,
  type MoonNowInfo,
} from "@/lib/transits.functions";
import { SIGN_GLYPHS, longMeaning, type PlanetPt } from "@/lib/transit-copy";
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
            <p className="text-sm text-ink/80 leading-relaxed">
              {moon.fase.significado}
            </p>
          </div>
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
        {transits?.map((t) => <TransitCard key={t.planeta} t={t} />)}
      </section>
    </AppShell>
  );
}

function TransitCard({ t }: { t: TransitItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-ink/5 transition-colors"
        aria-expanded={open}
      >
        <div className="size-12 bg-lilac/40 rounded-2xl flex items-center justify-center font-display text-2xl shrink-0">
          {t.glyph}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap">
            <span className="font-display font-bold text-base">{t.planeta}</span>
            <span className="text-xs text-ink/50">em</span>
            <span className="text-base font-medium">{t.signo}</span>
            <span className="font-display text-lg text-ink/40">
              {SIGN_GLYPHS[t.signo] ?? ""}
            </span>
            <span className="text-[11px] text-ink/40">{t.grau}°</span>
            {t.retrograde && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-peach/60 text-ink/70 font-medium">
                ℞ retrógrado
              </span>
            )}
          </div>
          <p className="text-[15px] text-ink/80 mt-1.5 leading-relaxed break-words">
            {t.texto}
          </p>
        </div>
        <ChevronDown
          className={`size-4 text-ink/50 shrink-0 mt-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-[4.5rem]">
          <p className="text-[15px] text-ink/85 leading-relaxed">
            {longMeaning(t.planeta as PlanetPt, t.signo, t.retrograde)}
          </p>
        </div>
      )}
    </div>
  );
}