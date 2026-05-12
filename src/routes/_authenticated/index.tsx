import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Triangle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Countdown } from "@/components/Countdown";
import { ENERGIA_DO_DIA, getNextNewMoon, SIGNS } from "@/lib/onze-data";
import { getDailyMessage } from "@/lib/daily-message";
import { getSaudacao } from "@/lib/greeting";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Home — onze-onze" },
      {
        name: "description",
        content:
          "Sua dose diária de astrologia: saudação personalizada, mensagem do dia e Lua Nova.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { profile, user } = useAuth();
  const nome =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "amiga";

  // Hydration safety: compute time-sensitive values only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const saudacao = mounted
    ? getSaudacao(nome)
    : { titulo: `Oi, ${nome}!`, subtitulo: "Lindo dia pra você!", periodo: "manhã" as const };
  const mensagem = mounted ? getDailyMessage() : "";
  const luaNova = getNextNewMoon();
  const signoUsuario = SIGNS.leao;

  return (
    <AppShell glyph={signoUsuario.glyph}>
      <header className="px-6 pt-10 pb-6 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          {saudacao.periodo}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {saudacao.titulo}
        </h1>
        <p className="font-display text-2xl italic text-ink/70 mt-1">
          {saudacao.subtitulo}
        </p>
      </header>

      {/* Mensagem do dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-yellow-candy/70 p-6 rounded-[28px] ring-1 ring-black/5 relative overflow-hidden">
          <span className="absolute -right-2 -top-2 font-display text-6xl opacity-20">
            ✨
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-3">
            Mensagem do dia
          </p>
          <p className="font-display text-lg leading-relaxed text-pretty min-h-[3rem]">
            {mensagem || "\u00A0"}
          </p>
        </div>
      </section>

      {/* Energia do Dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
        <div className="bg-white p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-2 rounded-full bg-peach animate-oo-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60">
              Energia do Dia
            </span>
          </div>
          <p className="font-display text-base leading-relaxed text-pretty">
            {ENERGIA_DO_DIA.texto}
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

      {/* Lua Nova */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:240ms]">
        <div className="bg-lilac/60 p-6 rounded-[28px] relative overflow-hidden ring-1 ring-black/5">
          <div className="absolute -right-6 -top-8 size-32 bg-white/40 blur-2xl rounded-full" />
          <div className="relative z-10">
            <h3 className="font-display text-lg font-bold mb-1">
              {luaNova.title}
            </h3>
            <p className="text-xs text-ink/60 mb-5">{luaNova.subtitle}</p>
            <Countdown target={luaNova.datetime} />
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="px-6 grid grid-cols-2 gap-3 animate-oo-enter [animation-delay:320ms]">
        <Shortcut to="/mapa-astral" bg="sky" label="Mapa Astral" Icon={Star} />
        <Shortcut to="/ceu-hoje" bg="peach" label="O Céu Hoje" Icon={Sparkles} />
        <Shortcut to="/piramide" bg="mint" label="Pirâmide" Icon={Triangle} />
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