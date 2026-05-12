import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import type { NatalChartData } from "@/lib/natal.functions";
import { SIGN_GLYPHS } from "@/lib/transit-copy";

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

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <Link to="/mapa-astral" className="inline-flex items-center gap-1 text-xs text-ink/60 mb-3">
          <ArrowLeft className="size-3" /> Voltar
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight">{chart.name}</h1>
        <p className="text-sm text-ink/60 mt-2">
          {new Date(chart.birth_date).toLocaleDateString("pt-BR")} · {chart.birth_time} · {chart.birth_place}
        </p>
      </header>

      {/* Mandala */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-white rounded-[28px] p-6 ring-1 ring-black/5 flex justify-center">
          <Mandala planets={data?.planets ?? []} />
        </div>
      </section>

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

      {/* Planetas */}
      {data?.planets && data.planets.length > 0 && (
        <section className="px-6 mb-8 animate-oo-enter [animation-delay:320ms]">
          <h2 className="font-display text-2xl font-bold italic mb-3">Planetas</h2>
          <ul className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-black/5">
            {data.planets.map((p) => (
              <li key={p.name} className="flex items-center justify-between p-4">
                <span className="font-display font-bold">{p.name}</span>
                <span className="text-sm text-ink/70">
                  {p.sign} {SIGN_GLYPHS[p.sign] ?? ""} · Casa {p.house}
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

function Mandala({ planets }: { planets: Array<{ name: string; sign: string }> }) {
  const cx = 150;
  const cy = 150;
  const r = 120;
  const glyphs: Record<string, string> = {
    "Sol": "☉", "Lua": "☾", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
    "Júpiter": "♃", "Saturno": "♄", "Urano": "♅", "Netuno": "♆", "Plutão": "♇",
  };

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
      {/* outer rings */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ink)" strokeOpacity={0.15} />
      <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke="var(--ink)" strokeOpacity={0.1} />
      <circle cx={cx} cy={cy} r={40} fill="var(--lilac)" fillOpacity={0.3} />

      {/* 12 house dividers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI * 2) / 12 - Math.PI / 2;
        const x1 = cx + (r - 20) * Math.cos(a);
        const y1 = cy + (r - 20) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeOpacity={0.2} />
        );
      })}

      {/* planets distributed around */}
      {planets.slice(0, 10).map((p, i) => {
        const a = (i * Math.PI * 2) / Math.max(planets.length, 1) - Math.PI / 2;
        const x = cx + (r - 50) * Math.cos(a);
        const y = cy + (r - 50) * Math.sin(a);
        return (
          <g key={p.name}>
            <circle cx={x} cy={y} r={14} fill="white" stroke="var(--ink)" strokeOpacity={0.3} />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
              fill="var(--ink)"
            >
              {glyphs[p.name] ?? p.name[0]}
            </text>
          </g>
        );
      })}

      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="22"
        fontFamily="Fraunces, serif"
        fill="var(--ink)"
      >
        ✦
      </text>
    </svg>
  );
}