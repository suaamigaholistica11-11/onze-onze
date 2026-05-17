import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, Info, History as HistoryIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/piramide")({
  head: () => ({
    meta: [
      { title: "Pirâmide Evolutiva · onze-onze" },
      {
        name: "description",
        content: "Escolha 3 áreas para focar por 21 dias e acompanhe sua evolução.",
      },
    ],
  }),
  component: PiramidePage,
});

const TEMAS = [
  { id: "fisico", nome: "Físico", emoji: "💪", cor: "bg-mint" },
  { id: "mental", nome: "Mental", emoji: "💭", cor: "bg-sky" },
  { id: "espiritual", nome: "Espiritual", emoji: "✨", cor: "bg-lilac" },
  { id: "emocional", nome: "Emocional", emoji: "💗", cor: "bg-peach" },
  { id: "social", nome: "Social", emoji: "🫂", cor: "bg-yellow-candy" },
  { id: "criativo", nome: "Criativo", emoji: "🎨", cor: "bg-mint" },
  { id: "carreira", nome: "Carreira", emoji: "🚀", cor: "bg-sky" },
  { id: "financas", nome: "Finanças", emoji: "💰", cor: "bg-yellow-candy" },
] as const;

const COOLDOWN_DAYS = 21;

const RECOMENDACOES: Record<string, string> = {
  fisico: "fazer 20 minutos de movimento gostoso, uma caminhada, alongamento ou dancinha na sala",
  mental: "tirar pausas curtas de 5 minutos ao longo do dia pra desligar a tela e respirar",
  espiritual: "reservar 10 minutos pra meditar, respirar fundo ou só observar o silêncio",
  emocional: "escrever por 10 minutos sobre como você tá se sentindo hoje, sem filtro",
  social: "tirar 5 minutos pra mandar uma mensagem carinhosa pra alguém querido",
  criativo: "abrir 15 minutos no dia pra rabiscar, escrever ou criar algo só por prazer",
  carreira: "investir 25 minutos focada em estudar ou avançar num projeto da sua área",
  financas: "passar 10 minutos olhando seus gastos da semana e começando uma “reserva de paz”",
};

interface ChoiceRow {
  id: string;
  themes: string[];
  chosen_at: string;
}
interface ProgressRow {
  theme: string;
  value: number;
  entry_date: string;
  next_step: string | null;
  comment: string | null;
}

// Janela do ciclo: 21 dias contados a partir do dia em que a pessoa escolheu seus 3 temas.
// Depois disso, sobram 9 ou 10 dias de "modo relax" até o fim do mês em que o ciclo terminou.
const FOCUS_DAYS = 21;
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function getCycleInfo(chosenAtISO: string, now = new Date()) {
  const start = startOfDay(new Date(chosenAtISO));
  const today = startOfDay(now);
  const dayInCycle = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1; // 1-based
  // Fim do mês em que o foco termina (start + 20 dias).
  const focusEnd = new Date(start);
  focusEnd.setDate(start.getDate() + FOCUS_DAYS - 1);
  const monthLastDay = new Date(focusEnd.getFullYear(), focusEnd.getMonth() + 1, 0).getDate();
  const relaxDaysTotal = monthLastDay - focusEnd.getDate(); // 9 ou 10 normalmente
  const relaxEnd = new Date(focusEnd);
  relaxEnd.setDate(focusEnd.getDate() + relaxDaysTotal);
  const isRelax = dayInCycle > FOCUS_DAYS && today.getTime() <= relaxEnd.getTime();
  const relaxDaysLeft = Math.max(0, Math.ceil((relaxEnd.getTime() - today.getTime()) / 86400000));
  return { start, dayInCycle, isRelax, relaxDaysTotal, relaxDaysLeft };
}

const BAR_COLORS = [
  "var(--bar-1)",
  "var(--bar-2)",
  "var(--bar-3)",
  "var(--bar-4)",
  "var(--bar-5)",
] as const;
const BAR_LABELS = ["Ruim", "Pouco", "Ok", "Bom", "Ótimo"] as const;

const DICA_INTROS = [
  { texto: "Que tal", final: "?" },
  { texto: "A dica de amiga que eu posso te dar é", final: "." },
  { texto: "Pensei aqui e acho que pra você seria interessante", final: "." },
] as const;
function dicaIntroFor(themeId: string) {
  let h = 0;
  for (let i = 0; i < themeId.length; i++) h = (h * 31 + themeId.charCodeAt(i)) >>> 0;
  return DICA_INTROS[h % DICA_INTROS.length];
}

function PiramidePage() {
  const { user } = useAuth();
  const [choice, setChoice] = useState<ChoiceRow | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [selecting, setSelecting] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [checkinTheme, setCheckinTheme] = useState<string | null>(null);
  const [historyTheme, setHistoryTheme] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("pyramid_choices")
        .select("*")
        .order("chosen_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("pyramid_progress")
        .select("theme,value,entry_date,next_step,comment")
        .order("entry_date"),
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
  const cycleEnded = !!choice && cooldownLeft === 0;
  // Durante o ciclo ativo (1..21), escondemos o card de seleção pra a pessoa
  // focar só nos check-ins. Volta a aparecer depois dos 21 dias (cycleEnded)
  // ou se ainda não há escolha.
  const showSelection = !choice || cycleEnded;

  const toggle = (id: string) => {
    if (!canChange) return;
    setSelecting((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const saveChoice = async (themes?: string[]) => {
    const finalThemes = themes ?? selecting;
    if (!user || finalThemes.length !== 3) {
      toast.error("Selecione exatamente 3 temas");
      return;
    }
    const { data, error } = await supabase
      .from("pyramid_choices")
      .insert({ user_id: user.id, themes: finalThemes })
      .select("*")
      .single();
    if (error) {
      toast.error("Erro ao salvar");
      return;
    }
    setChoice(data as ChoiceRow);
    setSelecting(finalThemes);
    toast.success("Sua tríade foi atualizada ✨");
  };

  const saveCheckin = async (
    theme: string,
    value: number,
    nextStep: string,
    comment: string,
  ) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("pyramid_progress").upsert(
      {
        user_id: user.id,
        theme,
        value,
        entry_date: today,
        next_step: nextStep || null,
        comment: comment || null,
      },
      { onConflict: "user_id,theme,entry_date" },
    );
    if (error) {
      toast.error("Erro ao registrar");
      return;
    }
    setProgress((prev) => {
      const others = prev.filter((p) => !(p.theme === theme && p.entry_date === today));
      return [
        ...others,
        {
          theme,
          value,
          entry_date: today,
          next_step: nextStep || null,
          comment: comment || null,
        },
      ];
    });
    toast.success("Salvo! ✔️ Seu check-in foi registrado, nos vemos amanhã.");
    setCheckinTheme(null);
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
              tríade evolutiva
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight">Pirâmide</h1>
          </div>
          <button
            type="button"
            onClick={() => setHowItWorksOpen(true)}
            className="flex items-center gap-1.5 bg-white ring-1 ring-black/5 rounded-full px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-ink/5 transition-colors"
          >
            <Info className="size-3.5" />
            Como funciona
          </button>
        </div>
      </header>

      {/* Seleção (oculta durante os 21 dias de foco) */}
      {showSelection && (
      <section className="px-6 mb-6 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-white p-5 rounded-[28px] ring-1 ring-black/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-2">
            Suas 3 áreas
          </p>
          <p className="text-sm text-ink/70 leading-relaxed mb-4">
            Reflita com calma sobre os 3 pontos mais importantes pra você desenvolver agora. Sua
            escolha vale por <strong>21 dias</strong>, pense bem antes de confirmar.
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

          <div className="bg-cream/60 rounded-2xl p-4 mb-3">
            <p className="font-display text-base font-bold mb-1">Cresça um pouquinho todo dia ✨</p>
            <p className="text-sm text-ink/70 leading-relaxed">
              Acompanhe seu progresso nas áreas que você escolhe, com check-ins rápidos e uma roda
              mensal que mostra sua evolução.
            </p>
          </div>

          {!canChange && (
            <div className="flex items-center gap-2 bg-ink/5 rounded-2xl p-3 text-xs text-ink/70 mb-3">
              <Lock className="size-3" />
              Você poderá trocar suas opções em {cooldownLeft} dia{cooldownLeft > 1 ? "s" : ""}.
            </div>
          )}

          {canChange && !cycleEnded && (
            <button
              type="button"
              onClick={() => saveChoice()}
              disabled={selecting.length !== 3}
              className="w-full bg-ink text-white py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-40 hover:bg-ink/90 transition-colors"
            >
              Confirmar tríade ({selecting.length}/3)
            </button>
          )}
        </div>
      </section>
      )}

      {/* Fim do ciclo */}
      {cycleEnded && choice && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:120ms]">
          <div className="bg-lilac/30 p-5 rounded-[28px] ring-1 ring-black/5">
            <p className="font-display text-lg font-bold mb-1">
              Ciclo finalizado, parabéns! 🎉
            </p>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              Sua Pirâmide foi gerada. Quer manter estes 3 temas, trocar 1 ou escolher novos?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => saveChoice(choice.themes)}
                className="bg-ink text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-ink/90 transition-colors"
              >
                Manter temas
              </button>
              <button
                type="button"
                onClick={() => setSelecting(choice.themes.slice(0, 2))}
                className="bg-white ring-1 ring-black/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-ink/5 transition-colors"
              >
                Trocar 1 tema
              </button>
              <button
                type="button"
                onClick={() => setSelecting([])}
                className="bg-white ring-1 ring-black/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-ink/5 transition-colors"
              >
                Escolher 3 novos
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Check-in diário */}
      {choice && (
        <section className="px-6 mb-6 animate-oo-enter [animation-delay:160ms]">
          <h2 className="font-display text-xl font-bold italic mb-3">Check-in de hoje</h2>
          <div className="space-y-3">
            {choice.themes.map((tid) => {
              const t = TEMAS.find((x) => x.id === tid);
              if (!t) return null;
              const today = new Date().toISOString().slice(0, 10);
              const todayEntry = progress.find(
                (p) => p.theme === tid && p.entry_date === today,
              );
              return (
                <div key={tid} className="bg-white p-4 rounded-2xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckinTheme(tid)}
                      className="flex-1 flex items-center justify-between text-left"
                    >
                      <span className="font-display font-bold">
                        <span className="mr-2">{t.emoji}</span>
                        {t.nome}
                      </span>
                      {todayEntry ? (
                        <span className="text-xs text-ink/50">hoje: {todayEntry.value}/5</span>
                      ) : (
                        <span className="text-xs text-ink/40 italic">toque pra fazer</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryTheme(tid)}
                      className="p-2 rounded-full hover:bg-ink/5 transition-colors"
                      aria-label="Histórico"
                    >
                      <HistoryIcon className="size-4 text-ink/50" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pirâmide Evolutiva (radar) + Insights */}
      {choice && (
        <section className="px-6 mb-8 animate-oo-enter [animation-delay:240ms]">
          <PiramideEvolutivaIntro
            themes={choice.themes}
            progress={progress}
            chosenAt={choice.chosen_at}
          />
        </section>
      )}

      {/* Modais */}
      <HowItWorksDialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen} />
      <CheckinDialog
        themeId={checkinTheme}
        existing={
          checkinTheme
            ? progress.find(
                (p) =>
                  p.theme === checkinTheme &&
                  p.entry_date === new Date().toISOString().slice(0, 10),
              ) ?? null
            : null
        }
        onClose={() => setCheckinTheme(null)}
        onSave={saveCheckin}
      />
      <HistoryDialog
        themeId={historyTheme}
        progress={progress}
        onClose={() => setHistoryTheme(null)}
      />
    </AppShell>
  );
}

function PiramideEvolutivaIntro({
  themes,
  progress,
  chosenAt,
}: {
  themes: string[];
  progress: ProgressRow[];
  chosenAt: string;
}) {
  const mesAno = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const cycle = getCycleInfo(chosenAt);

  const averages = useMemo(
    () =>
      themes.map((tid) => {
        const vals = progress.filter((p) => p.theme === tid).map((p) => p.value);
        const avg = vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
        return { tid, avg, count: vals.length };
      }),
    [themes, progress],
  );

  return (
    <>
      <h2 className="font-display text-xl font-bold italic">
        Pirâmide Evolutiva — <span className="capitalize">{mesAno}</span>
      </h2>
      <p className="text-sm text-ink/70 mt-1 mb-1">Veja como você evoluiu nas 3 áreas do ciclo.</p>
      <p className="text-xs text-ink/50 leading-relaxed mb-4">
        Esta pirâmide mostra a média das suas avaliações diárias por tema. Quanto mais preenchido o
        setor, mais progresso. Use os insights pra escolher seu foco no próximo ciclo.
      </p>

      <div className="bg-white rounded-[28px] ring-1 ring-black/5 p-6 flex justify-center mb-4">
        <TriadeRadar themes={themes} progress={progress} />
      </div>

      {/* Gráfico em barras 1 a 21 por tema */}
      <div className="bg-white rounded-[28px] ring-1 ring-black/5 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
            Seus 21 dias de foco
          </p>
          <span className="text-[10px] text-ink/50">
            dia {Math.min(Math.max(cycle.dayInCycle, 1), FOCUS_DAYS)}/21
          </span>
        </div>
        <div className="space-y-4">
          {themes.map((tid) => {
            const t = TEMAS.find((x) => x.id === tid);
            if (!t) return null;
            return (
              <BarsForTheme
                key={tid}
                themeId={tid}
                themeName={t.nome}
                emoji={t.emoji}
                progress={progress}
                cycleStart={cycle.start}
                today={cycle.dayInCycle}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-ink/5">
          {BAR_COLORS.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="size-3 rounded-sm"
                style={{ backgroundColor: c }}
                aria-hidden
              />
              <span className="text-[10px] text-ink/60">
                {i + 1} {BAR_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modo relax depois dos 21 dias de foco, até o fim do mês */}
      {cycle.isRelax && (
        <div className="bg-gradient-to-br from-mint/40 to-sky/40 rounded-[28px] ring-1 ring-black/5 p-5 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-1">
            Modo relax desbloqueado
          </p>
          <p className="font-display text-lg font-bold mb-2">
            Você completou seus 21 dias de foco. Agora respira ✨
          </p>
          <p className="text-sm text-ink/70 leading-relaxed">
            Faltam {cycle.relaxDaysLeft} dia{cycle.relaxDaysLeft === 1 ? "" : "s"} pro próximo
            ciclo. Aproveita esses dias pra descansar do foco, rever o que floresceu e pensar com
            calma quais 3 áreas vão te mover no próximo ciclo.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {averages.map(({ tid, avg, count }) => {
          const t = TEMAS.find((x) => x.id === tid);
          if (!t) return null;
          let insight = "";
          if (count === 0) {
            insight = "Ainda sem check-ins, comece com um pequeno passo hoje.";
          } else if (avg >= 4) {
            insight = `Você tá indo super bem em ${t.nome}! Que tal manter com 1 hábito simples por semana?`;
          } else if (avg >= 3) {
            insight = `Na média em ${t.nome}, com pequenos ajustes você sai do "ok" pro "ótimo". Tente o passo sugerido abaixo.`;
          } else {
            insight = `Esse tema pediu atenção. Comece com um passo bem pequeno e celebre a constância.`;
          }
          return (
            <div key={tid} className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold">
                  <span className="mr-2">{t.emoji}</span>
                  {t.nome}
                </span>
                <span className="text-xs text-ink/50">
                  {count > 0 ? `média ${avg.toFixed(1)}/5` : "sem dados"}
                </span>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed mb-3">{insight}</p>
              <div className="bg-cream/60 rounded-xl p-3 text-xs text-ink/70 space-y-1">
                <p className="font-bold uppercase tracking-[0.15em] text-[10px] text-ink/50 mb-1">
                  Pega essa dica
                </p>
                {(() => {
                  const intro = dicaIntroFor(tid);
                  const rec = RECOMENDACOES[tid] ?? "dar um passinho pequeno hoje";
                  return (
                    <p>
                      {intro.texto} {rec}
                      {intro.final}
                    </p>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-peach/40 rounded-2xl ring-1 ring-black/5 p-4 mt-4">
        <p className="text-sm text-ink/80 leading-relaxed">
          Tá precisando melhorar em algum tema? Separa 15 minutinhos no fim de semana só pra ele.
        </p>
      </div>
    </>
  );
}

function HowItWorksDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Como a Pirâmide funciona</DialogTitle>
          <DialogDescription className="text-sm text-ink/70 leading-relaxed pt-2">
            Todo dia você responde rapidinho como anda cada tema. No final do mês a Pirâmide
            Evolutiva mostra sua média e insights pra te ajudar a focar no que importa. Simples,
            rápido e transformador.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function CheckinDialog({
  themeId,
  existing,
  onClose,
  onSave,
}: {
  themeId: string | null;
  existing: ProgressRow | null;
  onClose: () => void;
  onSave: (theme: string, value: number, nextStep: string, comment: string) => void;
}) {
  const [value, setValue] = useState(3);
  const [nextStep, setNextStep] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (themeId) {
      setValue(existing?.value ?? 3);
      setNextStep(existing?.next_step ?? "");
      setComment(existing?.comment ?? "");
    }
  }, [themeId, existing]);

  const tema = themeId ? TEMAS.find((x) => x.id === themeId) : null;

  return (
    <Dialog open={!!themeId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Check-in {tema ? `— ${tema.emoji} ${tema.nome}` : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div>
            <label className="text-sm text-ink/80 leading-relaxed block mb-3">
              Como você avalia {tema?.nome.toLowerCase()} hoje?{" "}
              <span className="text-ink/50">(1 = péssimo, 5 = ótimo)</span>
            </label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[value]}
              onValueChange={(v) => setValue(v[0])}
            />
            <div className="flex justify-between text-xs text-ink/50 mt-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <p className="text-center font-display text-2xl font-bold mt-2">{value}/5</p>
          </div>

          <div>
            <label className="text-sm text-ink/80 block mb-2">
              Um passo que posso dar amanhã
            </label>
            <Input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder='ex.: "Ligar pra pessoa X", "Andar 15 min", "Estudar 30 min"'
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-ink/80 block mb-2">Observações rápidas (opcional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Como você se sentiu hoje?"
              className="rounded-xl min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white ring-1 ring-black/10 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/5 transition-colors"
            >
              Pular
            </button>
            <button
              type="button"
              onClick={() => themeId && onSave(themeId, value, nextStep, comment)}
              className="flex-1 bg-ink text-white py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({
  themeId,
  progress,
  onClose,
}: {
  themeId: string | null;
  progress: ProgressRow[];
  onClose: () => void;
}) {
  const tema = themeId ? TEMAS.find((x) => x.id === themeId) : null;
  const items = themeId
    ? progress
        .filter((p) => p.theme === themeId)
        .sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1))
    : [];

  return (
    <Dialog open={!!themeId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-[28px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Histórico {tema ? `— ${tema.emoji} ${tema.nome}` : ""}
          </DialogTitle>
          <DialogDescription className="text-sm text-ink/70">
            Toque num dia para ver o check-in e a nota "um passo" que você deixou.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          {items.length === 0 && (
            <p className="text-sm text-ink/50 italic text-center py-6">
              Ainda sem check-ins por aqui.
            </p>
          )}
          {items.map((it) => {
            const d = new Date(it.entry_date + "T00:00:00").toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });
            return (
              <div key={it.entry_date} className="bg-cream/60 rounded-2xl p-3 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{d}</span>
                  <span className="text-ink/60">— Nota: {it.value}/5</span>
                </div>
                {it.next_step && (
                  <p className="text-ink/70 mt-1">
                    <span className="text-ink/50">Passo:</span> "{it.next_step}"
                  </p>
                )}
                {it.comment && (
                  <p className="text-ink/70 mt-1">
                    <span className="text-ink/50">Comentário:</span> "{it.comment}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TriadeRadar({ themes, progress }: { themes: string[]; progress: ProgressRow[] }) {
  return <TriadeRadarImpl themes={themes} progress={progress} />;
}

function BarsForTheme({
  themeId,
  themeName,
  emoji,
  progress,
  cycleStart,
  today,
}: {
  themeId: string;
  themeName: string;
  emoji: string;
  progress: ProgressRow[];
  cycleStart: Date;
  today: number;
}) {
  // Mapeia entradas pelo offset em dias desde o início do ciclo (1..21).
  const startMs = cycleStart.getTime();
  const byDay = new Map<number, number>();
  progress
    .filter((p) => p.theme === themeId)
    .forEach((p) => {
      const entry = new Date(p.entry_date + "T00:00:00").getTime();
      const offset = Math.floor((entry - startMs) / 86400000) + 1;
      if (offset >= 1 && offset <= FOCUS_DAYS) byDay.set(offset, p.value);
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-display font-bold">
          <span className="mr-1">{emoji}</span>
          {themeName}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: FOCUS_DAYS }, (_, i) => {
          const day = i + 1;
          const value = byDay.get(day);
          const isToday = day === today;
          const isFuture = day > today;
          const filled = !!value;
          return (
            <div
              key={day}
              className={`size-4 rounded-full transition-all ${
                isToday ? "ring-2 ring-ink/40 ring-offset-1 ring-offset-white" : ""
              }`}
              style={{
                backgroundColor: filled ? BAR_COLORS[value! - 1] : "var(--ink)",
                opacity: filled ? 1 : isFuture ? 0.1 : 0.2,
              }}
              title={
                value
                  ? `Dia ${day}: ${value}/5`
                  : isFuture
                    ? `Dia ${day}`
                    : `Dia ${day}: sem check-in`
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function TriadeRadarImpl({ themes, progress }: { themes: string[]; progress: ProgressRow[] }) {
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
