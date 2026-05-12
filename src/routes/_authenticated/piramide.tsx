import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/piramide")({
  head: () => ({
    meta: [
      { title: "Pirâmide Evolutiva — onze-onze" },
      { name: "description", content: "Escolha 3 áreas para desenvolver e acompanhe sua evolução." },
    ],
  }),
  component: PiramidePage,
});

const TEMAS = [
  { id: "fisico", nome: "Físico", emoji: "🌿", cor: "bg-mint" },
  { id: "mental", nome: "Mental", emoji: "💭", cor: "bg-sky" },
  { id: "espiritual", nome: "Espiritual", emoji: "✨", cor: "bg-lilac" },
  { id: "emocional", nome: "Emocional", emoji: "💗", cor: "bg-peach" },
  { id: "social", nome: "Social", emoji: "🫂", cor: "bg-yellow-candy" },
  { id: "criativo", nome: "Criativo", emoji: "🎨", cor: "bg-mint" },
  { id: "carreira", nome: "Carreira", emoji: "🚀", cor: "bg-sky" },
  { id: "financas", nome: "Finanças", emoji: "💰", cor: "bg-yellow-candy" },
] as const;

const COOLDOWN_DAYS = 3;

interface ChoiceRow {
  id: string;
  themes: string[];
  chosen_at: string;
}
interface ProgressRow {
  theme: string;
  value: number;
  entry_date: string;
}

function PiramidePage() {
  const { user } = useAuth();
  const [choice, setChoice] = useState<ChoiceRow | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [selecting, setSelecting] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("pyramid_choices")
        .select("*")
        .order("chosen_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("pyramid_progress").select("theme,value,entry_date").order("entry_date"),
    ]).then(([c, p]) => {
      const cur = c.data as ChoiceRow | null;
      setChoice(cur);
      if (cur) setSelecting(cur.themes);
      setProgress((p.data as ProgressRow[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  const cooldownLeft = (() => {
    if (!choice) return 0;
    const next = new Date(choice.chosen_at).getTime() + COOLDOWN_DAYS * 86400000;
    return Math.max(0, Math.ceil((next - Date.now()) / 86400000));
  })();
  const canChange = !choice || cooldownLeft === 0;

  const toggle = (id: string) => {
    if (!canChange) return;
    setSelecting((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const saveChoice = async () => {
    if (!user || selecting.length !== 3) {
      toast.error("Selecione exatamente 3 temas");
      return;
    }
    const { data, error } = await supabase
      .from("pyramid_choices")
      .insert({ user_id: user.id, themes: selecting })
      .select("*")
      .single();
    if (error) {
      toast.error("Erro ao salvar");
      return;
    }
    setChoice(data as ChoiceRow);
    toast.success("Sua tríade foi atualizada ✨");
  };

  const logProgress = async (theme: string, value: number) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase
      .from("pyramid_progress")
      .upsert(
        { user_id: user.id, theme, value, entry_date: today },
        { onConflict: "user_id,theme,entry_date" },
      );
    if (error) {
      toast.error("Erro ao registrar");
      return;
    }
    setProgress((prev) => {
      const others = prev.filter((p) => !(p.theme === theme && p.entry_date === today));
      return [...others, { theme, value, entry_date: today }];
    });
    toast.success("Registrado!");
  };

  if (loading) {
    return (
      <AppShell glyph="△">
        <div className="px-6 py-12 text-center text-ink/40 italic">carregando…</div>
      </AppShell>
    );
  }

  return (
    <AppShell glyph="△">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          tríade evolutiva
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Pirâmide</h1>
      </header>

      {/* Seleção */}
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-white p-5 rounded-[28px] ring-1 ring-black/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-2">
            Suas 3 áreas
          </p>
          <p className="text-sm text-ink/70 leading-relaxed mb-4">
            Reflita com calma sobre os 3 pontos mais importantes pra você desenvolver agora.
            Sua escolha vale por <strong>{COOLDOWN_DAYS} dias</strong> — pense bem antes de confirmar.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {TEMAS.map((t) => {
              const selected = selecting.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggle(t.id)}
                  disabled={!canChange}
                  className={`px-4 py-2 rounded-full text-sm font-medium ring-1 transition-all ${
                    selected
                      ? `${t.cor} ring-ink shadow scale-105`
                      : "bg-white ring-black/10 hover:bg-ink/5 disabled:opacity-50"
                  }`}
                >
                  <span className="mr-1">{t.emoji}</span>
                  {t.nome}
                </button>
              );
            })}
          </div>

          {!canChange && (
            <div className="flex items-center gap-2 bg-ink/5 rounded-2xl p-3 text-xs text-ink/70 mb-3">
              <Lock className="size-3" />
              Você poderá trocar suas opções em {cooldownLeft} dia{cooldownLeft > 1 ? "s" : ""}.
            </div>
          )}

          {canChange && (
            <button
              type="button"
              onClick={saveChoice}
              disabled={selecting.length !== 3}
              className="w-full bg-ink text-white py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-40 hover:bg-ink/90 transition-colors"
            >
              Confirmar tríade ({selecting.length}/3)
            </button>
          )}
        </div>
      </section>

      {/* Check-in */}
      {choice && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
          <h2 className="font-display text-xl font-bold italic mb-3">Check-in de hoje</h2>
          <div className="space-y-3">
            {choice.themes.map((tid) => {
              const t = TEMAS.find((x) => x.id === tid);
              if (!t) return null;
              const today = new Date().toISOString().slice(0, 10);
              const todayVal = progress.find(
                (p) => p.theme === tid && p.entry_date === today,
              )?.value;
              return (
                <div key={tid} className="bg-white p-4 rounded-2xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-bold">
                      <span className="mr-2">{t.emoji}</span>
                      {t.nome}
                    </span>
                    {todayVal && (
                      <span className="text-xs text-ink/50">hoje: {todayVal}/5</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => logProgress(tid, n)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                          todayVal === n
                            ? "bg-ink text-white"
                            : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tríade radar */}
      {choice && (
        <section className="px-6 mb-8 animate-oo-enter [animation-delay:240ms]">
          <h2 className="font-display text-xl font-bold italic mb-3">Tríade Evolutiva</h2>
          <div className="bg-white rounded-[28px] ring-1 ring-black/5 p-6 flex justify-center">
            <TriadeRadar themes={choice.themes} progress={progress} />
          </div>
        </section>
      )}
    </AppShell>
  );
}

function TriadeRadar({
  themes,
  progress,
}: {
  themes: string[];
  progress: ProgressRow[];
}) {
  const cx = 120;
  const cy = 120;
  const r = 80;
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const colors = ["var(--mint)", "var(--sky)", "var(--lilac)"];

  const averages = themes.map((tid) => {
    const vals = progress.filter((p) => p.theme === tid).map((p) => p.value);
    return vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
  });

  const point = (i: number, scale: number) => {
    const a = angles[i];
    const rad = r * scale;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as const;
  };

  const dataPts = averages.map((avg, i) => point(i, Math.max(avg / 5, 0.05)));
  const polygon = dataPts.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px]">
      {[0.33, 0.66, 1].map((s) => {
        const pts = angles
          .map((_, i) => {
            const [x, y] = point(i, s);
            return `${x},${y}`;
          })
          .join(" ");
        return (
          <polygon key={s} points={pts} fill="none" stroke="var(--ink)" strokeOpacity={0.08} />
        );
      })}
      <polygon
        points={polygon}
        fill="var(--lilac)"
        fillOpacity={0.4}
        stroke="var(--ink)"
        strokeWidth={1.5}
      />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={colors[i]} stroke="white" strokeWidth={2} />
      ))}
      {themes.map((tid, i) => {
        const t = TEMAS.find((x) => x.id === tid);
        const [x, y] = point(i, 1.25);
        return (
          <text
            key={tid}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            fill="var(--ink)"
          >
            {t?.nome ?? tid}
          </text>
        );
      })}
    </svg>
  );
}