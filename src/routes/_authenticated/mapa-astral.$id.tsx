import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import {
  generateBigThreeReading,
  type NatalChartData,
} from "@/lib/natal.functions";
import { SIGN_GLYPHS, PLANET_GLYPHS, type PlanetPt } from "@/lib/transit-copy";
import { NatalMandala } from "@/components/NatalMandala";
import {
  calcAspects,
  dominantElement,
  ELEMENT_EMOJI,
  ELEMENT_PHRASE,
  signLongitude,
  type AspectHit,
} from "@/lib/elements";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/mapa-astral/$id")({
  head: () => ({
    meta: [{ title: "Mapa Astral · onze-onze" }],
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

  // Build the full body list (Sun, Moon, planets, Ascendente) with longitudes
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

  // Aspectos: incluímos o Ascendente aqui só pra cálculo (a mandala continua sem ele).
  const aspectsAll = data
    ? calcAspects([
        ...bodies.map((b) => ({ name: b.name, longitude: signLongitude(b.sign, b.degree) })),
        {
          name: "Ascendente",
          longitude: signLongitude(data.ascendant.sign, num(data.ascendant.degree)),
        },
      ])
    : [];
  // Aspectos pra mandala (sem Ascendente, mantém o desenho original).
  const aspects = data
    ? calcAspects(bodies.map((b) => ({ name: b.name, longitude: signLongitude(b.sign, b.degree) })))
    : [];

  // Mapa nome → signo pra montar "Sol em Leão" etc.
  const signByName = useMemo(() => {
    const m = new Map<string, string>();
    if (!data) return m;
    m.set("Sol", data.sun.sign);
    m.set("Lua", data.moon.sign);
    m.set("Ascendente", data.ascendant.sign);
    for (const p of data.planets) m.set(p.name, p.sign);
    return m;
  }, [data]);

  const topAspects = useMemo(
    () => prioritizeAspects(aspectsAll).slice(0, 6),
    [aspectsAll],
  );

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
      {topAspects.length > 0 && (
        <section className="px-6 mb-8 animate-oo-enter [animation-delay:400ms]">
          <h2 className="font-display text-2xl font-bold italic mb-3">Aspectos</h2>
          <ul className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-black/5">
            {topAspects.map((a, i) => {
              const sa = signByName.get(a.a);
              const sb = signByName.get(a.b);
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 p-3 text-sm flex-wrap"
                >
                  <span className="font-display font-bold">
                    {a.a === "Ascendente" ? "⬆️" : PLANET_GLYPHS[a.a as PlanetPt] ?? "✦"}{" "}
                    {a.a} {sa ? `em ${sa}` : ""}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
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
                    {a.b === "Ascendente" ? "⬆️" : PLANET_GLYPHS[a.b as PlanetPt] ?? "✦"}{" "}
                    {a.b} {sb ? `em ${sb}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Me conta mais sobre mim — interpretação Sol/Lua/Ascendente */}
      {data && (
        <BigThreeReading
          chartId={chart.id}
          data={data}
          aspects={topAspects}
          signByName={signByName}
          onSaved={(text, key) => {
            setChart((prev) =>
              prev && prev.chart_data
                ? {
                    ...prev,
                    chart_data: {
                      ...prev.chart_data,
                      interpretation: {
                        text,
                        cacheKey: key,
                        generatedAt: new Date().toISOString(),
                      },
                    },
                  }
                : prev,
            );
          }}
        />
      )}
    </AppShell>
  );
}

// Prioriza aspectos: 1) Sol/Lua/Asc entre si; 2) Sol+pessoal/social;
// 3) Lua+pessoal/social; 4) Asc+pessoal/social; 5) demais. Tiebreak: orbe menor.
const LUMINARIES = new Set(["Sol", "Lua", "Ascendente"]);
const PERSONAL_SOCIAL = new Set([
  "Mercúrio",
  "Vênus",
  "Marte",
  "Júpiter",
  "Saturno",
]);
function aspectPriority(h: AspectHit): number {
  const aL = LUMINARIES.has(h.a);
  const bL = LUMINARIES.has(h.b);
  if (aL && bL) return 0;
  const lum = aL ? h.a : bL ? h.b : null;
  const other = aL ? h.b : bL ? h.a : null;
  if (lum && other && PERSONAL_SOCIAL.has(other)) {
    if (lum === "Sol") return 1;
    if (lum === "Lua") return 2;
    if (lum === "Ascendente") return 3;
  }
  return 4;
}
function prioritizeAspects(list: AspectHit[]): AspectHit[] {
  return [...list].sort((x, y) => {
    const px = aspectPriority(x);
    const py = aspectPriority(y);
    if (px !== py) return px - py;
    return x.orb - y.orb;
  });
}

function BigThreeReading({
  chartId,
  data,
  aspects,
  signByName,
  onSaved,
}: {
  chartId: string;
  data: NatalChartData;
  aspects: AspectHit[];
  signByName: Map<string, string>;
  onSaved: (text: string, cacheKey: string) => void;
}) {
  const generate = useServerFn(generateBigThreeReading);
  const aspectStrings = aspects.map((a) => {
    const sa = signByName.get(a.a) ?? "";
    const sb = signByName.get(a.b) ?? "";
    return `${a.a}${sa ? ` em ${sa}` : ""} ${a.type.toLowerCase()} ${a.b}${sb ? ` em ${sb}` : ""}`;
  });
  const cacheKey = [
    data.sun.sign,
    String(data.sun.house),
    data.moon.sign,
    String(data.moon.house),
    data.ascendant.sign,
    aspectStrings.join("|"),
  ].join("::");

  const cached = data.interpretation?.cacheKey === cacheKey ? data.interpretation : null;
  const [open, setOpen] = useState(!!cached);
  const [text, setText] = useState<string | null>(cached?.text ?? null);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (text) {
      setOpen((v) => !v);
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const res = await generate({
        data: {
          sunSign: data.sun.sign,
          sunHouse: String(data.sun.house),
          moonSign: data.moon.sign,
          moonHouse: String(data.moon.house),
          ascSign: data.ascendant.sign,
          aspects: aspectStrings,
        },
      });
      const generated = res.text;
      setText(generated);
      // Cache no próprio chart_data pra não chamar IA de novo.
      const newChartData: NatalChartData = {
        ...data,
        interpretation: {
          text: generated,
          cacheKey,
          generatedAt: new Date().toISOString(),
        },
      };
      const { error } = await supabase
        .from("natal_charts")
        .update({ chart_data: newChartData })
        .eq("id", chartId);
      if (error) console.error("cache update failed", error);
      onSaved(generated, cacheKey);
    } catch (err) {
      console.error(err);
      toast.error("Não rolou agora. Tenta de novo em instantes.");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 mb-10 animate-oo-enter [animation-delay:480ms]">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-ink text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
      >
        <Sparkles className="size-4" />
        {loading
          ? "Lendo seu mapa…"
          : text
            ? open
              ? "Esconder leitura"
              : "Me conta mais sobre mim"
            : "Me conta mais sobre mim"}
      </button>

      {open && (
        <div className="mt-4 bg-lilac/40 rounded-[28px] ring-1 ring-black/5 p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60 mb-3">
            Suas principais energias
          </p>
          <div className="grid gap-1 text-sm mb-4">
            <p>
              <span className="mr-1">☀️</span>
              <strong>Sol:</strong> {data.sun.sign} · Casa {data.sun.house}
            </p>
            <p>
              <span className="mr-1">🌙</span>
              <strong>Lua:</strong> {data.moon.sign} · Casa {data.moon.house}
            </p>
            <p>
              <span className="mr-1">⬆️</span>
              <strong>Ascendente:</strong> {data.ascendant.sign}
            </p>
          </div>
          {loading && !text && (
            <p className="text-sm text-ink/60 italic">consultando o céu…</p>
          )}
          {text && (
            <div className="font-display text-base leading-relaxed text-pretty whitespace-pre-line">
              {text}
            </div>
          )}
        </div>
      )}
    </section>
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