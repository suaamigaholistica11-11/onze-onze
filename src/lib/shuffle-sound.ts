import shuffleUrl from "@/assets/shuffle.mp3";

let audioEl: HTMLAudioElement | null = null;

function getShuffleAudio() {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio(shuffleUrl);
    audioEl.loop = true;
    audioEl.volume = 1;
    audioEl.preload = "auto";
  }
  return audioEl;
}

export function preloadShuffleSound() {
  const audio = getShuffleAudio();
  if (!audio) return;
  try {
    audio.load();
  } catch {
    // o navegador pode adiar o carregamento até o toque da pessoa
  }
}

export function startShuffleSound(): () => void {
  const audio = getShuffleAudio();
  if (!audio) return () => {};

  audio.loop = true;
  audio.volume = 1;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // segue mesmo se o navegador ainda não liberou metadata
  }

  const p = audio.play();
  if (p && typeof p.catch === "function") {
    p.catch((err) => {
      console.warn("Som do baralho bloqueado pelo navegador até o próximo toque.", err);
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