import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Palette,
  Volume2,
  Image as ImageIcon,
  Lock,
  LogOut,
  Info,
  Camera,
  ChevronRight,
  Sun,
  MoonStar,
  Monitor,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getTheme,
  setTheme,
  getBgDisabled,
  setBgDisabled,
  getSoundEnabled,
  setSoundEnabled,
  type Theme,
} from "@/lib/bg-preference";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações · onze-onze" },
      {
        name: "description",
        content: "Ajuste seu perfil, tema, som e preferências do app.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

type Gender = "Feminino" | "Masculino" | "Outro" | "Prefiro não dizer";

const GENDERS: Gender[] = [
  "Feminino",
  "Masculino",
  "Outro",
  "Prefiro não dizer",
];

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: MoonStar },
  { value: "system", label: "Sistema", icon: Monitor },
];

function ConfiguracoesPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.display_name ?? "");
  const [gender, setGender] = useState<Gender>("Prefiro não dizer");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [theme, setThemeState] = useState<Theme>("system");
  const [soundOn, setSoundOn] = useState(true);
  const [bgOn, setBgOn] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    setSoundOn(getSoundEnabled());
    setBgOn(!getBgDisabled());
    setName(profile?.display_name ?? "");
    setAvatarPreview(profile?.avatar_url ?? null);
  }, [profile?.display_name, profile?.avatar_url]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Máximo 2MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let avatarUrl: string | null = avatarPreview;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/avatar.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = `${pub.publicUrl}?v=${Date.now()}`;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: name.trim(),
          avatar_url: avatarUrl,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Perfil salvo ✨");
    } catch {
      toast.error("Não conseguimos salvar. Tenta de novo.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      toast.error("Não conseguimos enviar o e-mail. Tenta de novo.");
      return;
    }
    toast.success("Enviamos um link no seu e-mail.");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const initial = (name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <AppShell>
      <div className="px-5 py-6 space-y-6">
        <header>
          <h1 className="font-display text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste seu perfil e como você quer sentir o app.
          </p>
        </header>

        {/* 1. Perfil */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5 space-y-5">
          <div className="flex items-center gap-3">
            <User className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Perfil</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative size-20 rounded-full bg-peach overflow-hidden flex items-center justify-center text-2xl ring-2 ring-border hover:ring-primary transition-all"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Foto do perfil"
                  className="size-full object-cover"
                />
              ) : (
                initial
              )}
              <span className="absolute bottom-0 right-0 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center ring-2 ring-card">
                <Camera className="size-3.5" />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="Como você quer ser chamada"
                className="w-full bg-background rounded-xl px-4 py-2.5 text-sm ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Gênero
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-full text-xs font-medium ring-1 transition-colors ${
                    gender === g
                      ? "bg-primary text-primary-foreground ring-primary"
                      : "bg-background text-foreground ring-border hover:bg-accent"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Nome e gênero definem como o app se dirige a você.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full bg-ink text-white py-3 rounded-full text-sm font-bold uppercase tracking-[0.12em] disabled:opacity-50 hover:bg-ink/90 transition-colors"
          >
            {saving ? "Salvando…" : "Salvar perfil"}
          </button>
        </section>

        {/* 2. Tema */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Tema</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setThemeState(opt.value);
                    setTheme(opt.value);
                  }}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-2xl text-xs font-medium ring-1 transition-all ${
                    theme === opt.value
                      ? "bg-primary text-primary-foreground ring-primary"
                      : "bg-background text-foreground ring-border hover:bg-accent"
                  }`}
                >
                  <Icon className="size-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Som */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="size-5 text-primary" />
              <div>
                <h2 className="font-display text-lg font-semibold">Som</h2>
                <p className="text-[11px] text-muted-foreground">
                  Efeitos sonoros no app
                </p>
              </div>
            </div>
            <Switch
              checked={soundOn}
              onCheckedChange={(checked) => {
                setSoundOn(checked);
                setSoundEnabled(checked);
              }}
            />
          </div>
        </section>

        {/* 4. Imagem de fundo */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="size-5 text-primary" />
              <div>
                <h2 className="font-display text-lg font-semibold">
                  Imagem de fundo
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Mostrar imagens decorativas nas abas
                </p>
              </div>
            </div>
            <Switch
              checked={bgOn}
              onCheckedChange={(checked) => {
                setBgOn(checked);
                setBgDisabled(!checked);
              }}
            />
          </div>
        </section>

        {/* 6. Conta */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Conta</h2>
          </div>
          <button
            type="button"
            onClick={handleChangePassword}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-background ring-1 ring-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <span>Trocar senha</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-background ring-1 ring-border text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <span>Sair da conta</span>
            <LogOut className="size-4" />
          </button>
        </section>

        {/* 7. Sobre */}
        <section className="bg-card rounded-[24px] ring-1 ring-border p-5 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Info className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Sobre</h2>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">Versão</span>
            <span className="text-sm font-medium">4.0</span>
          </div>
          <a
            href="/termos"
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-background ring-1 ring-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <span>Termos de uso e privacidade</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </a>
        </section>
      </div>
    </AppShell>
  );
}
