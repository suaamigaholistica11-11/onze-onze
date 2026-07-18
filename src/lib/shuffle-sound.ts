// Som real de baralho embaralhando, usando um asset mp3 bundlado.
import shuffleUrl from "@/assets/shuffle.mp3";

let audioEl: HTMLAudioElement | null = null;

export function startShuffleSound(): () => void {
  if (typeof window === "undefined") return () => {};
  if (!audioEl) {
    audioEl = new Audio(shuffleUrl);
    audioEl.loop = true;
    audioEl.volume = 0.75;
    audioEl.preload = "auto";
    // força a carga do arquivo
    try { audioEl.load(); } catch {}
  }
  try { audioEl.currentTime = 0; } catch {}
  const p = audioEl.play();
  if (p && typeof p.catch === "function") {
    p.catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("[shuffle-sound] play falhou:", err);
    });
  }
  return stopShuffleSound;
}

export function stopShuffleSound() {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
}