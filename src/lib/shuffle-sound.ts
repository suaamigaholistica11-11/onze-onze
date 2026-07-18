// Som real de baralho embaralhando, usando um asset mp3 bundlado.
import shuffleUrl from "@/assets/shuffle.mp3";

let audioEl: HTMLAudioElement | null = null;

export function startShuffleSound(): () => void {
  if (typeof window === "undefined") return () => {};
  if (!audioEl) {
    audioEl = new Audio(shuffleUrl);
    audioEl.loop = true;
    audioEl.volume = 0.7;
  }
  audioEl.currentTime = 0;
  void audioEl.play().catch(() => {});
  return stopShuffleSound;
}

export function stopShuffleSound() {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
}