import { useEffect, useRef, useState } from "react";
import { useSoundEnabled, setSoundEnabled } from "@/lib/bg-preference";

const TRACK_ID = "0DxnNG6GGQqzfFUV08OQLG";
const EMBED_SRC = `https://open.spotify.com/embed/track/${TRACK_ID}?utm_source=generator&autoplay=1`;
const ARMED_KEY = "oo:music-armed";

/**
 * Player oculto do Spotify + prompt de boas-vindas. Como o navegador
 * bloqueia autoplay sem gesto do usuário, na primeira abertura exibimos
 * um overlay convidando a tocar. Depois disso, qualquer nova abertura do
 * app já entra tocando sozinha (o gesto original fica registrado no
 * sessionStorage / localStorage, e qualquer clique subsequente rearma).
 */
export function HiddenPlayer() {
  const soundOn = useSoundEnabled();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [armed, setArmed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!soundOn) {
      setShowPrompt(false);
      return;
    }

    // Tenta armar automaticamente já na abertura (funciona em PWA instalado
    // e em alguns navegadores que herdam gesto da navegação/instalação).
    const previouslyArmed =
      window.localStorage.getItem(ARMED_KEY) === "1" ||
      window.sessionStorage.getItem(ARMED_KEY) === "1";
    if (previouslyArmed) {
      setArmed(true);
    }

    const arm = () => {
      try {
        window.localStorage.setItem(ARMED_KEY, "1");
        window.sessionStorage.setItem(ARMED_KEY, "1");
      } catch {}
      setArmed(true);
      setShowPrompt(false);
    };

    // Qualquer gesto do usuário arma o player.
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("touchstart", arm, { once: true });

    // Se após um instante ainda não armou, mostra o prompt de boas-vindas.
    const timer = window.setTimeout(() => {
      if (
        window.localStorage.getItem(ARMED_KEY) !== "1" &&
        window.sessionStorage.getItem(ARMED_KEY) !== "1"
      ) {
        setShowPrompt(true);
      }
    }, 400);

    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("touchstart", arm);
      window.clearTimeout(timer);
    };
  }, [soundOn]);

  const handleStart = () => {
    try {
      window.localStorage.setItem(ARMED_KEY, "1");
      window.sessionStorage.setItem(ARMED_KEY, "1");
    } catch {}
    setArmed(true);
    setShowPrompt(false);
  };

  const handleSkip = () => {
    setSoundEnabled(false);
    setShowPrompt(false);
  };

  const shouldMount = armed && soundOn;

  return (
    <>
      {shouldMount && (
        <iframe
          ref={iframeRef}
          title="onze-onze background music"
          aria-hidden
          src={EMBED_SRC}
          allow="autoplay; encrypted-media; clipboard-write"
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            width: 1,
            height: 1,
            border: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {showPrompt && soundOn && !armed && (
        <div
          role="dialog"
          aria-label="Ativar trilha sonora"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            background: "rgba(20, 12, 30, 0.72)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              maxWidth: 320,
              width: "100%",
              borderRadius: 20,
              padding: "1.75rem 1.5rem",
              background:
                "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
              color: "hsl(var(--foreground))",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎶</div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Vamos entrar no clima?
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.5,
                opacity: 0.85,
                marginBottom: 20,
              }}
            >
              Preparamos uma trilha suave pra te acompanhar. Toca pra começar,
              você pode desligar depois em Configurações.
            </p>
            <button
              type="button"
              onClick={handleStart}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                border: "none",
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              Tocar trilha
            </button>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                color: "hsl(var(--foreground))",
                opacity: 0.7,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Agora não
            </button>
          </div>
        </div>
      )}
    </>
  );
}