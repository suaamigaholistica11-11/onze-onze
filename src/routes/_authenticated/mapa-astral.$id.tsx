import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import type { NatalChartData } from "@/lib/natal.functions";
import { SIGN_GLYPHS, PLANET_GLYPHS, type PlanetPt } from "@/lib/transit-copy";
import { NatalMandala } from "@/components/NatalMandala";
import {
  calcAspects,
  dominantElement,
  ELEMENT_EMOJI,
  ELEMENT_PHRASE,
  signLongitude,
} from "@/lib/elements";

export const Route = createFileRoute("/_authenticated/mapa-astral/$id")({
  head: () => ({
    meta: [{ title: "Mapa Astral — onze-onze" }],
  }),
  component: MapaDetailPage,
});

interface ChartRecord {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  chart_data: NatalChartData | null;
  description: string | null;
}

function MapaDetailPage() {
  const { id } = useParams({ from: "/_authenticated/mapa-astral/$id" });
  const [chart, setChart] = useState<ChartRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("natal_charts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setChart(data as ChartRecord | null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AppShell glyph="✦">
        <div className="px-6 py-12 text-center text-ink/40 italic">carregando…</div>
      </AppShell>
    );
  }

  if (!chart) {
    return (
      <AppShell glyph="✦">
        <div className="px-6 py-12 text-center">
          <p className="text-ink/60">Mapa não encontrado.</p>
          <Link to="/mapa-astral" className="text-lilac underline mt-2 inline-block">
            Voltar
          </Link>
        </div>
      </AppShell>
    );
  }

  const data = chart.chart_data;

  // Format birth date without timezone drift ("2000-05-16" -> "16/05/2000")
  const [by, bm, bd] = chart.birth_date.split("-");
  const dateLabel = `${bd}/${bm}/${by}`;
  const timeLabel = chart.birth_time?.slice(0, 5) ?? "";

  const num = (v: unknown, def = 0) => {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : def;
  };

  // Build the full body list (Sun, Moon, planets) with longitudes
  const bodies = data
    ? [
        { name: "Sol", sign: data.sun.sign, degree: num(data.sun.degree), house: num(data.sun.house, 1) },
        { name: "Lua", sign: data.moon.sign, degree: num(data.moon.degree), house: num(data.moon.house, 1) },
        ...data.planets.map((p) => ({
          name: p.name,
          sign: p.sign,
          degree: num(p.degree),
          house: num(p.house, 1),
        })),
      ]
    : [];

  const aspects = data
    ? calcAspects(bodies.map((b) => ({ name: b.name, longitude: signLongitude(b.sign, b.degree) })))
    : [];

  const elementSigns = data
    ? [data.sun.sign, data.moon.sign, data.ascendant.sign, ...data.planets.map((p) => p.sign)]
    : [];
  const dom = data ? dominantElement(elementSigns) : null;

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <Link to="/mapa-astral" className="inline-flex items-center gap-1 text-xs text-ink/60 mb-3">
          <ArrowLeft className="size-3" /> Voltar
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight">{chart.name}</h1>
        <p className="text-sm text-ink/60 mt-2">
          {dateLabel} · {timeLabel} · {chart.birth_place}
        </p>
      </header>

      {/* Mandala */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-white rounded-[28px] p-6 ring-1 ring-black/5 flex justify-center">
          {data ? (
            <NatalMandala
              bodies={bodies}
              ascendantSign={data.ascendant.sign}
              ascendantDegree={num(data.ascendant.degree)}
              aspects={aspects}
            />
          ) : null}
        </div>
      </section>

      {/* Elemento dominante */}
      {dom && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:120ms]">
          <div className="bg-peach/60 p-5 rounded-[28px] ring-1 ring-black/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60 mb-2">
              elemento dominante
            </p>
            <p className="font-display text-2xl font-bold">
              {ELEMENT_EMOJI[dom.element]} {dom.element}
            </p>
            <p className="text-sm text-ink/70 mt-1 leading-snug">
              {ELEMENT_PHRASE[dom.element]}
            </p>
            <div className="flex gap-3 mt-3 text-[11px] text-ink/60">
              {(Object.keys(dom.counts) as Array<keyof typeof dom.counts>).map((el) => (
                <span key={el}>
                  {ELEMENT_EMOJI[el]} {dom.counts[el]}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personalidade */}
      {data?.personality && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
          <div className="bg-lilac/50 p-6 rounded-[28px] ring-1 ring-black/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60 mb-3">
              Sua essência
            </p>
            <p className="font-display text-base leading-relaxed text-pretty">
              {data.personality}
            </p>
          </div>
        </section>
      )}

      {/* Big 3 */}
      {data && (
        <section className="px-6 mb-6 grid gap-3 animate-oo-enter [animation-delay:240ms]">
          <BigCard label="Sol" sign={data.sun.sign} desc={data.sun.description} bg="bg-yellow-candy" />
          <BigCard label="Lua" sign={data.moon.sign} desc={data.moon.description} bg="bg-sky" />
          <BigCard label="Ascendente" sign={data.ascendant.sign} desc={data.ascendant.description} bg="bg-peach" />
        </section>
      )}

      {/* Tabela de planetas */}
      {data && bodies.length > 0 && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:320ms]">
          <h2 className="font-display text-2xl font-bold italic mb-3">Planetas em signos</h2>
          <ul className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-black/5">
            {bodies.map((p) => (
              <li key={p.name} className="flex items-center justify-between p-4">
                <span className="font-display font-bold">
                  {PLANET_GLYPHS[p.name as PlanetPt] ?? "✦"} {p.name}
                </span>
                <span className="text-sm text-ink/70">
                  {SIGN_GLYPHS[p.sign] ?? ""} {p.sign} · Casa {p.house}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tabela de aspectos */}
      {aspects.length > 0 && (
        <section className="px-6 mb-8 animate-oo-enter [animation-delay:400ms]">
          <h2 className="font-display text-2xl font-bold italic mb-3">Aspectos</h2>
          <ul className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-black/5">
            {aspects.map((a, i) => (
              <li key={i} className="flex items-center justify-between p-3 text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-display font-bold">
                    {PLANET_GLYPHS[a.a as PlanetPt] ?? a.a[0]}
                  </span>
                  <span
                    className={
                      a.tone === "harm"
                        ? "text-emerald-700"
                        : a.tone === "tens"
                          ? "text-rose-700"
                          : "text-ink/60"
                    }
                  >
                    {a.glyph}
                  </span>
                  <span className="font-display font-bold">
                    {PLANET_GLYPHS[a.b as PlanetPt] ?? a.b[0]}
                  </span>
                </span>
                <span className="text-ink/60 text-xs">
                  {a.type} · orbe {a.orb.toFixed(1)}°
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}

function BigCard({
  label,
  sign,
  desc,
  bg,
}: {
  label: string;
  sign: string;
  desc: string;
  bg: string;
}) {
  return (
    <div className={`${bg} p-5 rounded-2xl ring-1 ring-black/5`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
        {label}
      </p>
      <p className="font-display text-2xl font-bold">{sign}</p>
      {desc && <p className="text-sm text-ink/70 mt-1 leading-snug">{desc}</p>}
    </div>
  );
}