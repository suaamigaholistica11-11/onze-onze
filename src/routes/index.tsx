import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Triangle, Map, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Countdown } from "@/components/Countdown";
import {
  ENERGIA_DO_DIA,
  getNextNewMoon,
  SIGNS,
} from "@/lib/onze-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "onze-onze — sua dose diária de astrologia" },
      {
        name: "description",
        content:
          "Energia do dia, contador da próxima Lua Nova e Pirâmide Evolutiva. Astrologia leve e divertida em pt-BR.",
      },
      { property: "og:title", content: "onze-onze — astrologia leve e divertida" },
      {
        property: "og:description",
        content: "Energia do dia, ritual da Lua Nova e Pirâmide Evolutiva.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const signoUsuario = SIGNS.leao; // mock — depois vem do perfil
  const luaNova = getNextNewMoon();
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });

  return (
    <AppShell glyph={signoUsuario.glyph}>
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-end animate-oo-enter">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/50 mb-1">
            {hoje}
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Olá, Lari{" "}
            <span className="text-lilac italic">✧</span>
          </h1>
        </div>
        <Link
          to="/perfil"
          className={`size-11 rounded-full bg-yellow-candy border-2 border-white shadow-sm flex items-center justify-center font-display text-xl hover:scale-105 transition-transform`}
          aria-label="Perfil"
        >
          {signoUsuario.glyph}
        </Link>
      </header>

      {/* Energia do Dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:100ms]">
        <div className="bg-white p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-2 rounded-full bg-peach animate-oo-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60">
              Energia do Dia
            </span>
          </div>
          <p className="font-display text-xl leading-relaxed text-pretty">
            {ENERGIA_DO_DIA.texto.split("brilho próprio").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="italic text-peach underline decoration-2 underline-offset-4">
                    brilho próprio
                  </span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {ENERGIA_DO_DIA.highlights.map((h) => (
              <span
                key={h}
                className="text-[11px] px-3 py-1 rounded-full bg-mint/60 text-ink/70 font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Próxima Lua Nova */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:200ms]">
        <div className="bg-lilac/60 p-6 rounded-[28px] relative overflow-hidden ring-1 ring-black/5">
          <div className="absolute -right-6 -top-8 size-32 bg-white/40 blur-2xl rounded-full" />
          <div className="relative z-10">
            <h3 className="font-display text-lg font-bold mb-1">
              {luaNova.title}
            </h3>
            <p className="text-xs text-ink/60 mb-5">{luaNova.subtitle}</p>
            <Countdown target={luaNova.datetime} />
            <Link
              to="/lua-nova"
              className="mt-6 w-full bg-ink text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center transition-transform active:scale-95 hover:bg-ink/90"
            >
              Ver Ritual
            </Link>
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="px-6 grid grid-cols-2 gap-3 mb-6 animate-oo-enter [animation-delay:300ms]">
        <Shortcut to="/lua-nova" bg="sky" label="Trânsitos" Icon={Sparkles} />
        <Shortcut to="/piramide" bg="mint" label="Pirâmide" Icon={Triangle} />
        <Shortcut to="/perfil" bg="yellow-candy" label="Mapa Natal" Icon={Map} />
        <Shortcut to="/perfil" bg="peach" label="Perfil" Icon={UserIcon} />
      </section>

      <p className="px-6 text-center text-[11px] text-ink/40 mt-8 italic">
        Conteúdo para entretenimento e autoconhecimento ✨
      </p>
    </AppShell>
  );
}

type ShortcutBg = "sky" | "mint" | "yellow-candy" | "peach";

function Shortcut({
  to,
  bg,
  label,
  Icon,
}: {
  to: string;
  bg: ShortcutBg;
  label: string;
  Icon: typeof Sparkles;
}) {
  const bgClass: Record<ShortcutBg, string> = {
    sky: "bg-sky",
    mint: "bg-mint",
    "yellow-candy": "bg-yellow-candy",
    peach: "bg-peach",
  };
  return (
    <Link
      to={to}
      className={`${bgClass[bg]} p-4 rounded-3xl aspect-square flex flex-col justify-between ring-1 ring-black/5 hover:scale-[1.02] transition-transform`}
    >
      <div className="size-9 bg-white/70 rounded-xl flex items-center justify-center">
        <Icon className="size-4 text-ink" />
      </div>
      <span className="font-display font-bold text-base">{label}</span>
    </Link>
  );
}