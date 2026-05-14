import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar · onze-onze" },
      {
        name: "description",
        content:
          "Entre no onze-onze para acessar sua energia diária, mapa astral e Pirâmide Evolutiva.",
      },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
  name: z.string().trim().min(1, "Diz teu nome").max(60).optional(),
});

function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/" });
  }, [loading, session, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const parsed = schema.safeParse({
        email,
        password,
        name: mode === "signup" ? name : undefined,
      });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: parsed.data.name },
          },
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Conta criada! ✨");
          navigate({ to: "/completar-perfil" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) toast.error("E-mail ou senha incorretos");
      }
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não conseguimos te autenticar. Tenta de novo.");
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      toast.error("Digite seu e-mail acima primeiro");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error("Não conseguimos enviar o e-mail. Tenta de novo.");
    } else {
      toast.success("Enviamos um link de recuperação pro seu e-mail 💛");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[color-mix(in_oklab,var(--peach)_30%,white)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <span className="font-display text-[60vh] opacity-[0.05] leading-none select-none">
          ✧
        </span>
      </div>

      <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-md p-8 rounded-[28px] ring-1 ring-black/5 shadow-xl">
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-ink/40 mb-1">
            bem-vinda
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            onze<span className="text-lilac">·</span>onze
          </h1>
          <p className="text-sm text-ink/60 mt-2">
            {mode === "signin"
              ? "Entra pra ver sua energia do dia ✨"
              : "Cria sua conta e descubra seu céu ✨"}
          </p>
        </div>

        <div className="flex bg-ink/5 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all ${
              mode === "signin" ? "bg-white shadow text-ink" : "text-ink/50"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all ${
              mode === "signup" ? "bg-white shadow text-ink" : "text-ink/50"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              required
              className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-lilac"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-50 hover:bg-ink/90 transition-colors"
          >
            {mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            onClick={handleForgot}
            className="w-full text-center text-xs text-ink/60 underline mt-3"
          >
            Esqueci minha senha
          </button>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink/40">
            ou
          </span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => oauth("google")}
            disabled={busy}
            className="w-full bg-white border border-black/10 py-3 rounded-full text-sm font-medium hover:bg-ink/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <GoogleIcon /> Continuar com Google
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2.1-6.9 2.1-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.8 39.2 16.4 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.4l6 5c-.4.4 6.5-4.7 6.5-14.4 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}