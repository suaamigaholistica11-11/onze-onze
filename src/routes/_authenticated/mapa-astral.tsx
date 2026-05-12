import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Star, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/mapa-astral")({
  head: () => ({
    meta: [
      { title: "Mapa Astral — onze-onze" },
      { name: "description", content: "Crie e consulte seus mapas natais salvos." },
    ],
  }),
  component: MapaAstralListPage,
});

interface ChartRow {
  id: string;
  name: string;
  birth_date: string;
  birth_place: string;
  created_at: string;
}

function MapaAstralListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [charts, setCharts] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("natal_charts")
      .select("id,name,birth_date,birth_place,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCharts((data as ChartRow[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const limiteAtingido = charts.length >= 2;

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          seus mapas
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Mapa Astral</h1>
        <p className="text-sm text-ink/60 mt-2">
          Crie até 2 mapas grátis. Eles ficam salvos aqui pra você consultar quando quiser.
        </p>
      </header>

      <section className="px-6 mb-6 animate-oo-enter [animation-delay:100ms]">
        {loading ? (
          <div className="text-center text-ink/40 py-8 italic">carregando…</div>
        ) : charts.length === 0 ? (
          <div className="bg-white/70 rounded-[28px] p-8 text-center ring-1 ring-black/5">
            <Star className="size-8 mx-auto text-lilac mb-3" />
            <p className="font-display text-lg mb-2">Nenhum mapa ainda</p>
            <p className="text-sm text-ink/60 mb-5">
              Cria seu primeiro mapa pra descobrir seu céu interior.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {charts.map((c) => (
              <li key={c.id}>
                <Link
                  to="/mapa-astral/$id"
                  params={{ id: c.id }}
                  className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex items-center gap-4 hover:bg-white hover:scale-[1.01] transition-transform"
                >
                  <div className="size-12 bg-yellow-candy rounded-2xl flex items-center justify-center font-display text-xl shrink-0">
                    ✧
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(c.birth_date).toLocaleDateString("pt-BR")} · {c.birth_place}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-6 animate-oo-enter [animation-delay:200ms]">
        {limiteAtingido ? (
          <div className="bg-lilac/40 rounded-[28px] p-6 ring-1 ring-black/5 text-center">
            <Lock className="size-6 mx-auto mb-2" />
            <p className="font-display text-lg font-bold mb-1">Limite grátis atingido</p>
            <p className="text-sm text-ink/70 mb-4">
              Você usou seus 2 mapas gratuitos. Em breve: mapas ilimitados ✨
            </p>
            <button
              type="button"
              disabled
              className="w-full bg-ink/20 text-ink/50 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] cursor-not-allowed"
            >
              Em breve
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate({ to: "/mapa-astral/novo" })}
            className="w-full bg-ink text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
          >
            <Plus className="size-4" /> Novo mapa ({2 - charts.length} restantes)
          </button>
        )}
      </section>
    </AppShell>
  );
}