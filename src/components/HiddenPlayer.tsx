import { useEffect, useRef, useState } from "react";
import { useSoundEnabled } from "@/lib/bg-preference";

const TRACK_ID = "0DxnNG6GGQqzfFUV08OQLG";
const EMBED_SRC = `https://open.spotify.com/embed/track/${TRACK_ID}?utm_source=generator&autoplay=1`;

/**
 * Player oculto do Spotify. Carrega uma playlist curada e toca em segundo
 * plano assim que o usuário interage com o app (política de autoplay dos
 * navegadores). O iframe é invisível, então o usuário não vê qual música
 * está tocando. Liga/desliga em Configurações > Som.
 */
export function HiddenPlayer() {
  const soundOn = useSoundEnabled();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // O autoplay do navegador exige um gesto do usuário. Só montamos o
    // iframe depois da primeira interação para maximizar a chance de tocar.
    const arm = () => setArmed(true);
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("touchstart", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("touchstart", arm);
    };
  }, []);

  // Ao desligar o som, remove o iframe (pausa o áudio). Ao ligar de novo,
  // remonta e toca a próxima música da playlist.
  const shouldMount = armed && soundOn;

  if (!shouldMount) return null;

  return (
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
  );
}