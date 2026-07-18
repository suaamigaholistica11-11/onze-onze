import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { SIGNS } from "@/lib/onze-data";
import { getCachedDailyMessage } from "@/lib/daily-message";
import { getSaudacao } from "@/lib/greeting";
import { useAuth } from "@/lib/auth";
import { glifoDoSigno } from "@/lib/signo";
import { getTransitsForToday } from "@/lib/transits.functions";
import { buildDailyEnergy } from "@/lib/daily-energy";
import {
  getCurrentMoon,
  PHASE_LABEL,
  PHASE_MEANING,
  type MoonPhaseGroup,
} from "@/lib/moon-calendar";
import moonNewImg from "@/assets/moon-new.png";
import moonCrescentImg from "@/assets/moon-crescent.png";
import moonFullImg from "@/assets/moon-full.png";
import moonWaningImg from "@/assets/moon-waning.png";
import peixesBg from "@/assets/signs/peixes.png";
import zodiacWheel from "@/assets/zodiac-wheel.png";
import { useBgDisabled } from "@/lib/bg-preference";

const SIGN_BACKGROUNDS: Record<string, string> = {
  Peixes: peixesBg,
};

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Home · onze-onze" },
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
  const [mensagem, setMensagem] = useState("");
  useEffect(() => {
    setMounted(true);
    setMensagem(getCachedDailyMessage());
  }, []);

  const [meuSigno, setMeuSigno] = useState<string | null>(null);
  useEffect(() => {
    try {
      setMeuSigno(localStorage.getItem("oo:meu-signo"));
    } catch {}
  }, []);
  const bgDisabled = useBgDisabled();
  const signoBg = bgDisabled
    ? undefined
    : meuSigno
      ? SIGN_BACKGROUNDS[meuSigno]
      : zodiacWheel;

  const signoGlifo = glifoDoSigno(profile?.signo_solar);

  const saudacao = mounted
    ? getSaudacao(nome)
    : { titulo: `Oi, ${nome}!`, subtitulo: "Lindo dia pra você!", periodo: "manhã" as const };
  const signoUsuario = SIGNS.leao;

  const fetchTransits = useServerFn(getTransitsForToday);
  const { data: transitsData } = useQuery({
    queryKey: ["transits-today"],
    queryFn: () => fetchTransits(),
    staleTime: 1000 * 60 * 60,
  });
  const energia = transitsData?.transits
    ? buildDailyEnergy(transitsData.transits)
    : null;

  const [moonPhase, setMoonPhase] = useState<ReturnType<typeof getCurrentMoon> | null>(null);
  useEffect(() => {
    setMoonPhase(getCurrentMoon());
  }, []);

  return (
    <AppShell glyph={signoUsuario.glyph}>
      {signoBg && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-15"
          style={{ backgroundImage: `url(${signoBg})` }}
        />
      )}
      {signoGlifo && (
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
          opacity="0.55"
        >
          <text
            x="200"
            y="260"
            textAnchor="middle"
            fontSize="340"
            fontFamily="Georgia, serif"
            fill="none"
            stroke="#B5652E"
            strokeWidth="1.1"
          >
            {signoGlifo}
          </text>
        </svg>
      )}
      <header className="px-6 pt-10 pb-6 animate-oo-enter">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {saudacao.titulo}
        </h1>
      </header>

      {/* Mensagem do dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-yellow-candy text-oo-offwhite p-6 rounded-[28px] ring-1 ring-black/5 relative overflow-hidden">
          <span className="absolute -right-2 -top-2 font-display text-6xl opacity-30">
            ✨
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-oo-offwhite/80 mb-3">
            Mensagem do dia
          </p>
          <p className="font-display text-lg leading-relaxed text-pretty min-h-[3rem] whitespace-pre-line">
            {mensagem || "\u00A0"}
          </p>
        </div>
      </section>

      {/* Lua */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
        <CurrentMoonCard data={moonPhase} />
      </section>

      {/* Energia do Dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:240ms]">
        <div className="bg-white p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-2 rounded-full bg-peach animate-oo-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60">
              Energia do Dia
            </span>
          </div>
          <p className="font-display text-base leading-relaxed text-pretty">
            {energia?.texto ?? "Lendo o céu de hoje…"}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {(energia?.highlights ?? []).map((h) => (
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

    </AppShell>
  );
}

const MOON_IMAGES: Record<MoonPhaseGroup, string> = {
  nova: moonNewImg,
  crescente: moonCrescentImg,
  cheia: moonFullImg,
  minguante: moonWaningImg,
};

function CurrentMoonCard({
  data,
}: {
  data: {
    fase: MoonPhaseGroup;
    signo: string;
    observacao?: string;
  } | null;
}) {
  if (!data) {
    return (
      <div className="bg-lilac p-5 rounded-[28px] ring-1 ring-black/5 h-32" />
    );
  }
  const img = MOON_IMAGES[data.fase];
  const label = PHASE_LABEL[data.fase];
  const meaning = PHASE_MEANING[data.fase];
  return (
    <div className="bg-lilac text-oo-offwhite p-5 rounded-[28px] relative overflow-hidden ring-1 ring-black/5">
      <div className="absolute -right-6 -top-8 size-40 bg-white/40 blur-2xl rounded-full" />
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 -m-4 rounded-full bg-white/50 blur-2xl" aria-hidden />
            <img
              src={img}
              alt={`Imagem realista de ${label.toLowerCase()}`}
              width={512}
              height={512}
              className="relative size-24 object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]"
            />
            <span aria-hidden className="absolute top-2 left-3 size-1.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.85)] animate-oo-twinkle-a" />
            <span aria-hidden className="absolute bottom-3 right-3 size-1 rounded-full bg-white shadow-[0_0_5px_2px_rgba(255,255,255,0.7)] animate-oo-twinkle-c" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight">
              {label} em {data.signo}
            </h3>
            <p className="text-[13px] text-oo-offwhite/90 leading-relaxed mt-2">
              {meaning}
            </p>
          </div>
        </div>
        {data.observacao && (
          <p className="text-[12px] text-oo-offwhite/85 leading-relaxed mt-3 italic">
            {data.observacao}
          </p>
        )}
        <Link
          to="/ritualzinho"
          className="mt-4 inline-flex items-center gap-2 bg-oo-offwhite text-ink px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-oo-offwhite/90 transition-colors"
        >
          <Moon className="size-3.5" />
          Ver ritualzinho
        </Link>
      </div>
    </div>
  );
}