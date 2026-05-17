import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Triangle, Star, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Countdown } from "@/components/Countdown";
import { SIGNS } from "@/lib/onze-data";
import { getCachedDailyMessage } from "@/lib/daily-message";
import { getSaudacao } from "@/lib/greeting";
import { useAuth } from "@/lib/auth";
import { getTransitsForToday, getMoonForToday } from "@/lib/transits.functions";
import { buildDailyEnergy } from "@/lib/daily-energy";
import { groupFromPhase, PHASE_GROUP_LABEL } from "@/lib/rituals";
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

  const fetchMoon = useServerFn(getMoonForToday);
  const { data: moonData } = useQuery({
    queryKey: ["moon-today"],
    queryFn: () => fetchMoon(),
    staleTime: 1000 * 60 * 60,
  });

  // Banner de notificação quando entramos em Lua Nova ou Lua Cheia.
  const [showRitualBanner, setShowRitualBanner] = useState(false);
  const [ritualBannerText, setRitualBannerText] = useState("");
  useEffect(() => {
    if (!moonData) return;
    const group = groupFromPhase(moonData.fase.key);
    if (group !== "nova" && group !== "cheia") return;
    const sig = `${group}:${moonData.signo}`;
    try {
      const seen = localStorage.getItem("oo:ritual-phase-notif");
      if (seen === sig) return;
      setRitualBannerText(
        `${PHASE_GROUP_LABEL[group]} em ${moonData.signo} chegou! Tem ritualzinho novo esperando por você 🌙`,
      );
      setShowRitualBanner(true);
    } catch {}
  }, [moonData]);
  const dismissRitualBanner = () => {
    if (!moonData) return;
    const group = groupFromPhase(moonData.fase.key);
    try {
      localStorage.setItem("oo:ritual-phase-notif", `${group}:${moonData.signo}`);
    } catch {}
    setShowRitualBanner(false);
  };

  return (
    <AppShell glyph={signoUsuario.glyph}>
      {signoBg && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-15"
          style={{ backgroundImage: `url(${signoBg})` }}
        />
      )}
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

      {showRitualBanner && (
        <section className="px-6 mb-4 animate-oo-enter">
          <div className="bg-gradient-to-br from-lilac/70 to-peach/60 p-4 rounded-[24px] ring-1 ring-black/5 flex items-start gap-3">
            <div className="size-9 rounded-full bg-white/70 flex items-center justify-center shrink-0">
              <Moon className="size-4 text-ink" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed text-ink/90 mb-2">{ritualBannerText}</p>
              <Link
                to="/ritualzinho"
                onClick={dismissRitualBanner}
                className="inline-flex items-center gap-1.5 bg-ink text-white px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-ink/90 transition-colors"
              >
                Ver ritual
              </Link>
            </div>
            <button
              type="button"
              onClick={dismissRitualBanner}
              className="p-1 rounded-full hover:bg-white/40 transition-colors shrink-0"
              aria-label="Dispensar"
            >
              <X className="size-4 text-ink/60" />
            </button>
          </div>
        </section>
      )}

      {/* Mensagem do dia */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-yellow-candy/70 p-6 rounded-[28px] ring-1 ring-black/5 relative overflow-hidden">
          <span className="absolute -right-2 -top-2 font-display text-6xl opacity-20">
            ✨
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-3">
            Mensagem do dia
          </p>
          <p className="font-display text-lg leading-relaxed text-pretty min-h-[3rem] whitespace-pre-line">
            {mensagem || "\u00A0"}
          </p>
        </div>
      </section>

      {/* Lua */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
        <MoonPanel proximas={moonData?.proximas ?? null} />
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

      {/* Atalhos */}
      <section className="px-6 grid grid-cols-2 gap-3 animate-oo-enter [animation-delay:320ms]">
        <Shortcut to="/mapa-astral" bg="sky" label="Mapa Astral" Icon={Star} />
        <Shortcut to="/ceu-hoje" bg="peach" label="O Céu Hoje" Icon={Sparkles} />
        <Shortcut to="/piramide" bg="mint" label="Pirâmide" Icon={Triangle} />
        <Shortcut to="/ritualzinho" bg="yellow-candy" label="Bora de ritualzinho?" Icon={Moon} />
      </section>
    </AppShell>
  );
}

type ShortcutBg = "sky" | "mint" | "yellow-candy" | "peach";

type MoonPhaseKey = "Lua Nova" | "Quarto Crescente" | "Lua Cheia" | "Quarto Minguante";

const MOON_IMAGES: Record<MoonPhaseKey, string> = {
  "Lua Nova": moonNewImg,
  "Quarto Crescente": moonCrescentImg,
  "Lua Cheia": moonFullImg,
  "Quarto Minguante": moonWaningImg,
};

function MoonPanel({
  proximas,
}: {
  proximas:
    | Array<{ nome: string; glyph: string; dataISO: string; diasRestantes: number }>
    | null;
}) {
  // A próxima fase é a mais próxima em dias restantes.
  const next = proximas
    ? [...proximas].sort((a, b) => a.diasRestantes - b.diasRestantes)[0]
    : null;
  const img = next ? MOON_IMAGES[next.nome as MoonPhaseKey] : null;

  return (
    <div className="bg-gradient-to-br from-lilac/60 to-sky/40 p-5 rounded-[28px] relative overflow-hidden ring-1 ring-black/5">
      <div className="absolute -right-6 -top-8 size-40 bg-white/40 blur-2xl rounded-full" />
      <div className="relative z-10 flex items-center gap-4">
        {img && (
          <div className="relative shrink-0">
            <div className="absolute inset-0 -m-4 rounded-full bg-white/50 blur-2xl" aria-hidden />
            <img
              src={img}
              alt={`Imagem realista de ${next!.nome.toLowerCase()}`}
              width={512}
              height={512}
              className="relative size-24 object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]"
            />
            <span aria-hidden className="absolute top-2 left-3 size-1.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.85)] animate-oo-twinkle-a" />
            <span aria-hidden className="absolute bottom-3 right-3 size-1 rounded-full bg-white shadow-[0_0_5px_2px_rgba(255,255,255,0.7)] animate-oo-twinkle-c" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-1">
            Próxima lunação
          </p>
          <h3 className="font-display text-base font-bold leading-tight mb-2">
            {next ? next.nome : "Ciclo lunar"}
          </h3>
          {next && (
            <>
              <Countdown target={new Date(next.dataISO)} />
              <p className="text-[11px] text-ink/60 mt-2">
                {new Date(next.dataISO).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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