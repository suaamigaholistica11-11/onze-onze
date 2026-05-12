import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Countdown } from "@/components/Countdown";
import { getNextNewMoon, RITUAL_LUA_NOVA } from "@/lib/onze-data";

export const Route = createFileRoute("/lua-nova")({
  head: () => ({
    meta: [
      { title: "Lua Nova — onze-onze" },
      {
        name: "description",
        content:
          "Contagem regressiva da próxima Lua Nova e ritual passo-a-passo seguindo a Lei da Atração.",
      },
      { property: "og:title", content: "Lua Nova — ritual de intenção" },
      {
        property: "og:description",
        content: "Prepare seu ciclo com o ritual da próxima Lua Nova.",
      },
    ],
  }),
  component: LuaNovaPage,
});

function LuaNovaPage() {
  const luaNova = getNextNewMoon();
  const [done, setDone] = useState<boolean[]>(
    () => RITUAL_LUA_NOVA.map(() => false),
  );
  const allDone = done.every(Boolean);

  const toggle = (i: number) =>
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <AppShell glyph={luaNova.sign.glyph}>
      <header className="px-6 pt-12 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/50 mb-2">
          Próximo ciclo
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
          {luaNova.title}
        </h1>
        <p className="text-sm text-ink/60 mt-2">{luaNova.subtitle}</p>
      </header>

      <section className="px-6 mb-8 animate-oo-enter [animation-delay:100ms]">
        <div className="bg-ink text-white p-6 rounded-[28px] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full" />
          <div className="absolute right-6 top-6 size-16 bg-white rounded-full shadow-inner animate-oo-float" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 mb-4">
              Falta
            </p>
            <Countdown target={luaNova.datetime} variant="dark" />
            <p className="mt-6 text-sm text-white/70 leading-relaxed max-w-[28ch]">
              Aproveite os próximos dias para limpar o que ficou. A Lua Nova
              chega para abrir portais novos.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 mb-6 animate-oo-enter [animation-delay:200ms]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold italic">
            Ritual de Intenção
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
            {done.filter(Boolean).length}/{RITUAL_LUA_NOVA.length}
          </span>
        </div>

        <ol className="space-y-3">
          {RITUAL_LUA_NOVA.map((step, i) => {
            const isDone = done[i];
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`w-full text-left flex gap-4 items-start p-4 rounded-2xl ring-1 transition-all ${
                    isDone
                      ? "bg-mint/60 ring-mint"
                      : "bg-white/70 ring-black/5 hover:bg-white"
                  }`}
                >
                  <span
                    className={`font-display text-2xl font-bold shrink-0 transition-colors ${
                      isDone ? "text-ink/30 line-through" : "text-lilac"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`text-sm leading-snug pt-1.5 transition-colors ${
                      isDone ? "text-ink/40 line-through" : "text-ink"
                    }`}
                  >
                    {step}
                  </p>
                  {isDone && (
                    <Check className="size-5 text-ink/60 shrink-0 mt-1.5" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="px-6 grid grid-cols-2 gap-3 animate-oo-enter [animation-delay:300ms]">
        <button
          type="button"
          className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex items-center gap-3 text-sm font-medium hover:scale-[1.02] transition-transform"
        >
          <div className="size-9 bg-sky rounded-xl flex items-center justify-center">
            <Calendar className="size-4" />
          </div>
          Adicionar ao Google Calendar
        </button>
        <button
          type="button"
          disabled={!allDone}
          className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            allDone
              ? "bg-ink text-white hover:scale-[1.02]"
              : "bg-ink/10 text-ink/40 cursor-not-allowed"
          }`}
        >
          <Check className="size-4" /> Marcar feito
        </button>
      </section>
    </AppShell>
  );
}