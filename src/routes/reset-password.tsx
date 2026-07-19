import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Redefinir senha · onze-onze" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Supabase coloca os tokens no hash da URL no fluxo de recovery
  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const errCode = params.get("error_code") || params.get("error");
    if (errCode) {
      if (/otp_expired|expired/i.test(errCode)) {
        setLinkError("Esse link de recuperação expirou. Pede um novo lá no login 💛");
      } else {
        setLinkError("Esse link é inválido ou já foi usado. Pede um novo lá no login.");
      }
      return;
    }
    if (params.get("type") === "recovery" || params.get("access_token")) {
      setReady(true);
      return;
    }
    // Deep link com sessão de recovery já ativa
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setLinkError("Esse link parece inválido ou expirado. Pede um novo lá no login.");
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Senha precisa ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha atualizada! ✨");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[color-mix(in_oklab,var(--peach)_30%,white)]">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="font-display text-2xl font-bold mb-2">
          Redefinir senha
        </h1>
        {linkError ? (
          <div className="space-y-4">
            <p className="text-sm text-ink/70">{linkError}</p>
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="w-full bg-ink text-white py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            >
              Voltar pro login
            </button>
          </div>
        ) : !ready ? (
          <p className="text-sm text-ink/60">Carregando…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-ink/60 mb-3">
              Crie uma nova senha pra sua conta.
            </p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="pill-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-3 flex items-center text-ink/50 hover:text-ink"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                required
                className="pill-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-3 flex items-center text-ink/50 hover:text-ink"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {busy ? "Atualizando…" : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}