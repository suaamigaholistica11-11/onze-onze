import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { generateNatalChart } from "@/lib/natal.functions";
import { toast } from "sonner";

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
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletions24h, setDeletions24h] = useState(0);

  const refreshDeletions = async () => {
    if (!user) return;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("natal_chart_deletions")
      .select("id", { count: "exact", head: true })
      .gte("deleted_at", since);
    setDeletions24h(count ?? 0);
  };

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
    refreshDeletions();
  }, [user]);

  const limiteAtingido = charts.length >= 2;
  const bloqueado24h = deletions24h >= 5;

  const onDelete = async (chart: ChartRow) => {
    if (!user) return;
    if (!confirm(`Excluir o mapa de ${chart.name}?`)) return;
    const { error } = await supabase.from("natal_charts").delete().eq("id", chart.id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    await supabase.from("natal_chart_deletions").insert({ user_id: user.id });
    setCharts((prev) => prev.filter((c) => c.id !== chart.id));
    await refreshDeletions();
    toast.success("Mapa excluído");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (bloqueado24h) {
      toast.error("Bloqueado por 24h");
      return;
    }
    if (!name || !birthDate || !birthTime || !birthPlace) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (limiteAtingido) {
      toast.error("Você já tem seus 2 mapas salvos");
      return;
    }
    setBusy(true);
    try {
      const chartData = await generateNatalChart({
        data: { name, birthDate, birthTime, birthPlace },
      });
      const { data: inserted, error } = await supabase
        .from("natal_charts")
        .insert({
          user_id: user.id,
          name,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace,
          chart_data: chartData,
          description: chartData?.personality ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Mapa criado ✨");
      navigate({ to: "/mapa-astral/$id", params: { id: inserted.id } });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar o mapa. Tenta de novo em instantes.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          seus mapas
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Mapa Astral</h1>
        <p className="text-sm text-ink/60 mt-2">
          Preencha os dados de nascimento pra gerar seu mapa. Você pode salvar até 2 mapas.
        </p>
      </header>

      {!loading && charts.length > 0 && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-2">
            seus mapas salvos
          </p>
          <ul className="space-y-2">
            {charts.map((c) => (
              <li key={c.id} className="bg-white p-3 rounded-2xl ring-1 ring-black/5 flex items-center gap-3">
                <Link
                  to="/mapa-astral/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="size-10 bg-yellow-candy rounded-2xl flex items-center justify-center font-display text-lg shrink-0">
                    ✧
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold truncate">{c.name}</p>
                    <p className="text-xs text-ink/50 truncate">
                      {new Date(c.birth_date).toLocaleDateString("pt-BR")} · {c.birth_place}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(c)}
                  className="size-9 rounded-xl flex items-center justify-center text-ink/50 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  aria-label="Excluir mapa"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="px-6 pb-10 animate-oo-enter [animation-delay:160ms]">
        {bloqueado24h ? (
          <div className="bg-lilac/40 rounded-[28px] p-6 ring-1 ring-black/5 text-center">
            <Lock className="size-6 mx-auto mb-2" />
            <p className="font-display text-lg font-bold leading-snug">
              ops! Acho que você já criou e excluiu muito mapas por aqui. Amanhã tem mais.
            </p>
          </div>
        ) : limiteAtingido ? (
          <div className="bg-lilac/40 rounded-[28px] p-6 ring-1 ring-black/5 text-center">
            <Lock className="size-6 mx-auto mb-2" />
            <p className="font-display text-lg font-bold mb-1">Você já tem seus 2 mapas ✨</p>
            <p className="text-sm text-ink/70">
              Toque em um mapa acima pra revisitar a leitura completa, ou exclua um pra abrir espaço.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Nome">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Larissa"
                maxLength={60}
                required
                disabled={busy}
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
              />
            </Field>
            <Field label="Data de nascimento">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                disabled={busy}
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
              />
            </Field>
            <Field label="Hora de nascimento">
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                required
                disabled={busy}
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
              />
            </Field>
            <Field label="Local de nascimento">
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="Ex: São Paulo, Brasil"
                maxLength={120}
                required
                disabled={busy}
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
              />
            </Field>

            <div className="bg-yellow-candy/60 rounded-2xl p-4 text-xs text-ink/70 leading-relaxed">
              <strong className="font-display">Não tem alguma dessas informações?</strong>{" "}
              Olha sua certidão de nascimento — lá tem tudo o que precisamos.
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-ink/90 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="size-4" />
              {busy ? "Consultando o céu…" : `Gerar mapa (${2 - charts.length} restante${charts.length === 1 ? "" : "s"})`}
            </button>
          </form>
        )}
      </section>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}