import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sun, Moon, ArrowUpRight, Sparkles, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { NatalChartData } from "@/lib/natal.functions";
import { SIGN_GLYPHS, PLANET_GLYPHS, type PlanetPt } from "@/lib/transit-copy";
import {
  calcAspects,
  signLongitude,
  type AspectHit,
} from "@/lib/elements";
import { SUN_TEXTS, MOON_TEXTS, ASC_TEXTS, ASPECT_GLOSS } from "@/lib/big-three-texts";

export const Route = createFileRoute("/_authenticated/meu-trio")({
  head: () => ({
    meta: [
      { title: "Meu trio · onze-onze" },
      { name: "description", content: "Sol, Lua e Ascendente: o trio que conta sua essência." },
    ],
  }),
  component: MeuTrioPage,
});

interface ChartRow {
  id: string;
  name: string;
  chart_data: NatalChartData | null;
  created_at: string;
}

function num(v: unknown, def = 0) {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : def;
}

function MeuTrioPage() {
  const { user } = useAuth();
  const [charts, setCharts] = useState<ChartRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("natal_charts")
      .select("id,name,chart_data,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = (data as ChartRow[] | null) ?? [];
        setCharts(rows);
        // Tenta casar com o signo "reivindicado" no app
        let chosen: ChartRow | null = null;
        try {
          const meuSigno = localStorage.getItem("oo:meu-signo");
          if (meuSigno) {
            chosen = rows.find((c) => c.chart_data?.sun?.sign === meuSigno) ?? null;
          }
        } catch {}
        if (!chosen && rows.length > 0) chosen = rows[0];
        setSelectedId(chosen?.id ?? null);
        setLoading(false);
      });
  }, [user]);

  const chart = useMemo(
    () => charts.find((c) => c.id === selectedId) ?? null,
    [charts, selectedId],
  );
  const data = chart?.chart_data ?? null;

  const topAspects: AspectHit[] = useMemo(() => {
    if (!data) return [];
    const bodies = [
      { name: "Sol", longitude: signLongitude(data.sun.sign, num(data.sun.degree)) },
      { name: "Lua", longitude: signLongitude(data.moon.sign, num(data.moon.degree)) },
      ...data.planets.map((p) => ({
        name: p.name,
        longitude: signLongitude(p.sign, num(p.degree)),
      })),
      {
        name: "Ascendente",
        longitude: signLongitude(data.ascendant.sign, num(data.ascendant.degree)),
      },
    ];
    const all = calcAspects(bodies);
    // Prioriza aspectos envolvendo Sol, Lua ou Ascendente, ordena por orbe
    const LUM = new Set(["Sol", "Lua", "Ascendente"]);
    return all
      .filter((a) => LUM.has(a.a) || LUM.has(a.b))
      .sort((x, y) => x.orb - y.orb)
      .slice(0, 5);
  }, [data]);

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <Link
          to="/mapa-astral"
          className="inline-flex items-center gap-1 text-xs text-ink/60 mb-3"
        >
          <ArrowLeft className="size-3" /> Mapa Astral
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          a sua essência
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Meu trio</h1>
        <p className="text-sm text-ink/60 mt-2">
          Sol, Lua e Ascendente: as três energias que mais contam a sua história.
        </p>
      </header>

      {loading && (
        <p className="px-6 py-8 text-center text-ink/40 italic">carregando…</p>
      )}

      {!loading && !data && (
        <section className="px-6 py-10 animate-oo-enter">
          <div className="bg-lilac/40 rounded-[28px] p-6 ring-1 ring-black/5 text-center">
            <p className="font-display text-lg font-bold mb-2">
              Você ainda não tem um mapa salvo
            </p>
            <p className="text-sm text-ink/70 mb-4">
              Crie seu mapa astral pra ver seu trio aparecer aqui.
            </p>
            <Link
              to="/mapa-astral"
              className="inline-flex items-center justify-center gap-2 bg-ink text-white px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              <Sparkles className="size-4" /> Criar meu mapa
            </Link>
          </div>
        </section>
      )}

      {!loading && data && charts.length > 1 && (
        <section className="px-6 mb-4 animate-oo-enter">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-2">
            qual mapa você quer ler
          </p>
          <div className="flex gap-2 flex-wrap">
            {charts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  c.id === selectedId
                    ? "bg-ink text-white"
                    : "bg-white text-ink/70 ring-1 ring-black/10"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {!loading && data && (
        <section className="px-6 mb-6 grid gap-4 animate-oo-enter [animation-delay:80ms]">
          <TrioCard
            label="Sol"
            sign={data.sun.sign}
            text={SUN_TEXTS[data.sun.sign] ?? data.sun.description}
            icon={<Sun className="size-5" />}
            bg="bg-yellow-candy"
            sublabel="quem você está aprendendo a ser"
          />
          <TrioCard
            label="Lua"
            sign={data.moon.sign}
            text={MOON_TEXTS[data.moon.sign] ?? data.moon.description}
            icon={<Moon className="size-5" />}
            bg="bg-sky"
            sublabel="como você sente o mundo"
          />
          <TrioCard
            label="Ascendente"
            sign={data.ascendant.sign}
            text={ASC_TEXTS[data.ascendant.sign] ?? data.ascendant.description}
            icon={<ArrowUpRight className="size-5" />}
            bg="bg-peach"
            sublabel="como o mundo te percebe"
          />
        </section>
      )}

      {!loading && data && topAspects.length > 0 && (
        <section className="px-6 mb-10 animate-oo-enter [animation-delay:160ms]">
          <h2 className="font-display text-2xl font-bold italic mb-3">
            Diálogos do seu mapa
          </h2>
          <p className="text-sm text-ink/60 mb-4">
            Os aspectos mostram como o seu Sol, sua Lua e seu Ascendente
            conversam com o resto da sua energia.
          </p>
          <ul className="space-y-3">
            {topAspects.map((a, i) => (
              <li
                key={i}
                className="bg-white rounded-2xl ring-1 ring-black/5 p-4"
              >
                <div className="flex items-center gap-2 text-sm flex-wrap mb-2">
                  <span className="font-display font-bold">
                    {a.a === "Ascendente"
                      ? "⬆️"
                      : PLANET_GLYPHS[a.a as PlanetPt] ?? "✦"}{" "}
                    {a.a}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      a.tone === "harm"
                        ? "bg-mint/60 text-emerald-900"
                        : a.tone === "tens"
                          ? "bg-peach/60 text-rose-900"
                          : "bg-ink/5 text-ink/60"
                    }`}
                  >
                    {a.glyph} {a.type.toLowerCase()}
                  </span>
                  <span className="font-display font-bold">
                    {a.b === "Ascendente"
                      ? "⬆️"
                      : PLANET_GLYPHS[a.b as PlanetPt] ?? "✦"}{" "}
                    {a.b}
                  </span>
                </div>
                <p className="text-sm text-ink/70 leading-snug">
                  {ASPECT_GLOSS[a.type] ??
                    "essas energias dialogam de um jeito único dentro de você."}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}

function TrioCard({
  label,
  sign,
  text,
  icon,
  bg,
  sublabel,
}: {
  label: string;
  sign: string;
  text: string;
  icon: React.ReactNode;
  bg: string;
  sublabel: string;
}) {
  return (
    <div className={`${bg} p-6 rounded-[28px] ring-1 ring-black/5`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-full bg-white/70 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60">
            {label}
          </p>
          <p className="font-display text-2xl font-bold leading-none mt-0.5">
            {SIGN_GLYPHS[sign] ?? "✦"} {sign}
          </p>
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-ink/50 mb-2">
        {sublabel}
      </p>
      <p className="font-display text-[15px] leading-relaxed text-pretty">
        {text}
      </p>
    </div>
  );
}
