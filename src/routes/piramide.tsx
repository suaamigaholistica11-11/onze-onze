import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PIRAMIDE_TEMAS } from "@/lib/onze-data";

export const Route = createFileRoute("/piramide")({
  head: () => ({
    meta: [
      { title: "Pirâmide Evolutiva — onze-onze" },
      {
        name: "description",
        content:
          "Configure 3 temas, faça o check-in diário e acompanhe sua Roda Evolutiva.",
      },
      { property: "og:title", content: "Pirâmide Evolutiva — onze-onze" },
      {
        property: "og:description",
        content: "Acompanhe seu progresso em 3 áreas da vida.",
      },
    ],
  }),
  component: PiramidePage,
});

const COR_BG: Record<string, string> = {
  mint: "bg-mint",
  sky: "bg-sky",
  lilac: "bg-lilac",
};

function PiramidePage() {
  const [ativo, setAtivo] = useState(PIRAMIDE_TEMAS[0].id);
  const [rating, setRating] = useState(3);
  const [passo, setPasso] = useState("");

  const tema = PIRAMIDE_TEMAS.find((t) => t.id === ativo)!;

  return (
    <AppShell glyph="△">
      <header className="px-6 pt-12 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/50 mb-2">
          Ciclo de março
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Sua Pirâmide
        </h1>
        <p className="text-sm text-ink/60 mt-2">
          Como você está hoje em cada tema?
        </p>
      </header>

      {/* Pirâmide visual */}
      <section className="px-6 mb-8 animate-oo-enter [animation-delay:100ms]">
        <div className="bg-white p-6 rounded-[28px] ring-1 ring-black/5 flex flex-col items-center gap-2">
          {PIRAMIDE_TEMAS.map((t, i) => {
            const widths = ["w-[55%]", "w-[75%]", "w-[95%]"];
            const isActive = t.id === ativo;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setAtivo(t.id)}
                className={`${widths[i]} ${COR_BG[t.cor]} rounded-2xl py-4 px-4 flex items-center justify-between transition-all ${
                  isActive
                    ? "ring-2 ring-ink shadow-md scale-[1.02]"
                    : "ring-1 ring-black/5 opacity-80"
                }`}
              >
                <span className="flex items-center gap-2 font-display font-bold text-sm">
                  <span className="text-base">{t.emoji}</span>
                  {t.nome}
                </span>
                <span className="font-mono text-xs tabular-nums opacity-70">
                  {t.media.toFixed(1)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Check-in diário */}
      <section className="px-6 mb-8 animate-oo-enter [animation-delay:200ms]">
        <div className="bg-ink text-white p-6 rounded-[28px]">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              Check-in de hoje
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              {tema.nome}
            </span>
          </div>
          <h3 className="font-display text-xl mb-6">Como você se sente?</h3>

          <div className="relative py-4">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full appearance-none h-1 bg-white/15 rounded-full outline-none accent-peach"
              aria-label="Nota de 1 a 5"
            />
            <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <span>baixa</span>
              <span className="text-white text-base font-display normal-case tracking-normal">
                {["😞", "😕", "😌", "😊", "🤩"][rating - 1]} {rating}
              </span>
              <span>alta</span>
            </div>
          </div>

          <label className="block mt-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              Um passo de hoje
            </span>
            <input
              value={passo}
              onChange={(e) => setPasso(e.target.value)}
              placeholder="Ex: caminhei 20 min ao sol"
              maxLength={120}
              className="mt-2 w-full bg-white/10 placeholder:text-white/30 text-white text-sm py-3 px-4 rounded-2xl outline-none focus:bg-white/20 transition-colors"
            />
          </label>

          <button
            type="button"
            className="mt-5 w-full bg-white text-ink py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Salvar dia
          </button>
        </div>
      </section>

      {/* Roda preview */}
      <section className="px-6 animate-oo-enter [animation-delay:300ms]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold italic">
            Roda Evolutiva
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
            preview do mês
          </span>
        </div>
        <div className="bg-white rounded-[28px] ring-1 ring-black/5 p-6 flex justify-center">
          <RadarMini />
        </div>
      </section>
    </AppShell>
  );
}

function RadarMini() {
  // Triângulo radar simples baseado nas médias mockadas
  const cx = 110;
  const cy = 110;
  const r = 80;
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const colors = ["var(--mint)", "var(--sky)", "var(--lilac)"];

  const point = (i: number, scale: number) => {
    const a = angles[i];
    const rad = r * scale;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as const;
  };

  const dataPts = PIRAMIDE_TEMAS.map((t, i) => point(i, t.media / 5));
  const polygon = dataPts.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px]">
      {[0.33, 0.66, 1].map((s) => {
        const pts = angles
          .map((_, i) => {
            const [x, y] = point(i, s);
            return `${x},${y}`;
          })
          .join(" ");
        return (
          <polygon
            key={s}
            points={pts}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={polygon}
        fill="var(--lilac)"
        fillOpacity={0.4}
        stroke="var(--ink)"
        strokeWidth={1.5}
      />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={colors[i]} stroke="white" strokeWidth={2} />
      ))}
      {PIRAMIDE_TEMAS.map((t, i) => {
        const [x, y] = point(i, 1.18);
        return (
          <text
            key={t.id}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            fill="var(--ink)"
          >
            {t.nome}
          </text>
        );
      })}
    </svg>
  );
}