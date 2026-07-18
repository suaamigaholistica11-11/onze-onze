import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";
import { toast } from "sonner";
import { Upload, MapPin, Loader2 } from "lucide-react";
import { calcularSignoSolar, glifoDoSigno } from "@/lib/signo";

export const Route = createFileRoute("/_authenticated/completar-perfil")({
  component: CompletarPerfilPage,
});

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

function CompletarPerfilPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [signo, setSigno] = useState<string | null>(null);
  const cityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carregar perfil existente
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setName(data.display_name ?? "");
        setBirthDate(data.birth_date ?? "");
        setBirthTime(data.birth_time ?? "");
        setUnknownTime(!!data.birth_time_unknown);
        setCity(data.birth_city ?? "");
        setLat(data.birth_lat ?? null);
        setLng(data.birth_lng ?? null);
        setAvatarPreview(data.avatar_url ?? null);
        setConsent(!!data.lgpd_consent);
        setSigno(
          (data as { signo_solar?: string | null }).signo_solar ??
            (data.birth_date ? calcularSignoSolar(data.birth_date) : null),
        );
      }
    })();
  }, [user]);

  // Recalcula o signo em tempo real ao mudar a data de nascimento.
  useEffect(() => {
    if (birthDate) setSigno(calcularSignoSolar(birthDate));
    else setSigno(null);
  }, [birthDate]);

  const handleCityChange = (v: string) => {
    setCity(v);
    setLat(null);
    setLng(null);
    if (cityTimer.current) clearTimeout(cityTimer.current);
    if (v.trim().length < 3) {
      setResults([]);
      return;
    }
    cityTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=5&accept-language=pt-BR`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "pt-BR" },
        });
        const data = (await res.json()) as NominatimResult[];
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const pickResult = (r: NominatimResult) => {
    setCity(r.display_name);
    setLat(parseFloat(r.lat));
    setLng(parseFloat(r.lon));
    setResults([]);
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!consent) {
      toast.error("Você precisa aceitar a Política de Privacidade");
      return;
    }
    if (!name.trim()) {
      toast.error("Conta como você quer ser chamada");
      return;
    }
    setBusy(true);
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

      const payload = {
        user_id: user.id,
        display_name: name.trim(),
        birth_date: birthDate || null,
        birth_time: unknownTime ? "12:00:00" : birthTime || null,
        birth_time_unknown: unknownTime,
        birth_city: city || null,
        birth_lat: lat,
        birth_lng: lng,
        avatar_url: avatarUrl,
        signo_solar: birthDate ? calcularSignoSolar(birthDate) : null,
        lgpd_consent: true,
        lgpd_consent_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;

      toast.success("Perfil salvo! ✨");
      navigate({ to: "/" });
    } catch (err) {
      console.error(err);
      toast.error("Não conseguimos salvar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="px-5 py-6 space-y-5">
        <header>
          <h1 className="font-display text-2xl font-bold">
            Conta pra gente sobre você 🌟
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Esses dados ajudam a criar sua experiência personalizada.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm">
            <div className="size-20 rounded-full bg-peach overflow-hidden flex items-center justify-center text-3xl">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="size-full object-cover"
                />
              ) : (
                "✨"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 cursor-pointer">
                <Upload className="size-4" />
                {avatarPreview ? "Trocar foto" : "Escolher foto"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              {signo && (
                <p className="text-xs text-ink/60 mt-2">
                  Seu signo:{" "}
                  <span className="font-display text-base text-ink">
                    {glifoDoSigno(signo)} {signo}
                  </span>
                </p>
              )}
            </div>
          </div>

          <Field label="Como você quer ser chamada">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              required
              className="pill-input"
            />
          </Field>

          <Field label="Data de nascimento">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="pill-input"
            />
          </Field>

          <Field label="Horário de nascimento">
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={unknownTime}
              className="pill-input disabled:opacity-50"
            />
            <label className="flex items-center gap-2 mt-2 text-xs text-ink/60">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
              />
              Não sei o horário
            </label>
            {unknownTime && (
              <p className="text-xs text-ink/50 mt-1 italic">
                Usaremos 12h00. O Ascendente pode ser impreciso.
              </p>
            )}
          </Field>

          <Field label="Cidade de nascimento">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Ex.: São Paulo"
                className="pill-input pr-9"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                {searching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MapPin className="size-4" />
                )}
              </span>
              {results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white rounded-2xl shadow-lg border border-black/5 max-h-60 overflow-y-auto">
                  {results.map((r) => (
                    <li key={`${r.lat},${r.lon}`}>
                      <button
                        type="button"
                        onClick={() => pickResult(r)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-peach/30"
                      >
                        {r.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {lat && lng && (
                <p className="text-xs text-ink/50 mt-1">
                  📍 {lat.toFixed(3)}, {lng.toFixed(3)}
                </p>
              )}
            </div>
          </Field>

          {/* LGPD */}
          <label className="flex items-start gap-3 bg-lilac/20 rounded-2xl p-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-ink/80 leading-relaxed">
              Li e aceito a{" "}
              <PrivacyPolicyModal
                trigger={
                  <button
                    type="button"
                    className="underline font-medium"
                  >
                    Política de Privacidade
                  </button>
                }
              />
              . Meus dados de nascimento serão usados para gerar interpretações
              astrológicas personalizadas.
            </span>
          </label>

          <button
            type="submit"
            disabled={busy || !consent}
            className="w-full bg-ink text-white py-4 rounded-full text-sm font-bold uppercase tracking-[0.15em] disabled:opacity-50 hover:bg-ink/90 transition-colors"
          >
            {busy ? "Salvando…" : "Pronta! Vamos começar ✨"}
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-full text-center text-sm text-ink/60 underline"
          >
            Preencher depois
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-1.5 px-1">
        {label}
      </label>
      {children}
    </div>
  );
}