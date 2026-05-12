import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { generateNatalChart } from "@/lib/natal.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/mapa-astral/novo")({
  head: () => ({
    meta: [
      { title: "Novo Mapa — onze-onze" },
      { name: "description", content: "Cadastre os dados de nascimento pra gerar seu mapa natal." },
    ],
  }),
  component: NovoMapaPage,
});

function NovoMapaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name || !birthDate || !birthTime || !birthPlace) {
      toast.error("Preencha todos os campos");
      return;
    }
    setBusy(true);
    try {
      // Check limit
      const { count } = await supabase
        .from("natal_charts")
        .select("id", { count: "exact", head: true });
      if ((count ?? 0) >= 2) {
        toast.error("Você atingiu o limite de 2 mapas grátis");
        navigate({ to: "/mapa-astral" });
        return;
      }
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
        <Link to="/mapa-astral" className="inline-flex items-center gap-1 text-xs text-ink/60 mb-3">
          <ArrowLeft className="size-3" /> Voltar
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight">Novo mapa</h1>
        <p className="text-sm text-ink/60 mt-2">
          Pra calcular com precisão, precisamos dos seus dados de nascimento.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="px-6 space-y-4 animate-oo-enter [animation-delay:120ms]"
      >
        <Field label="Nome">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Larissa"
            maxLength={60}
            required
            className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
          />
        </Field>
        <Field label="Data de nascimento">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
          />
        </Field>
        <Field label="Hora de nascimento">
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            required
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
            className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
          />
        </Field>

        <div className="bg-yellow-candy/60 rounded-2xl p-4 text-xs text-ink/70 leading-relaxed">
          <strong className="font-display">Não tem alguma dessas informações?</strong>{" "}
          Veja sua certidão de nascimento. Lá tem tudo o que precisamos pra fazer o seu mapa.
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="size-4" />
          {busy ? "Consultando o céu…" : "Gerar mapa"}
        </button>
      </form>
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