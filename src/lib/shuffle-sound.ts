// Som de baralho embaralhando, sintetizado via WebAudio (sem asset externo).
let ctx: AudioContext | null = null;
let stopFn: (() => void) | null = null;

function getCtx() {
  if (!ctx) {
    const AC = (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext);
    ctx = new AC();
  }
  return ctx;
}

// Cria um "clique" curto de papel, filtrando ruído branco.
function playClick(audio: AudioContext, when: number) {
  const dur = 0.05 + Math.random() * 0.04;
  const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2);
  }
  const src = audio.createBufferSource();
  src.buffer = buf;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000 + Math.random() * 3000;
  filter.Q.value = 0.8;
  const gain = audio.createGain();
  gain.gain.value = 0.15 + Math.random() * 0.15;
  src.connect(filter).connect(gain).connect(audio.destination);
  src.start(when);
  src.stop(when + dur);
}

export function startShuffleSound(): () => void {
  const audio = getCtx();
  if (audio.state === "suspended") void audio.resume();
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    const now = audio.currentTime;
    // agenda alguns cliques em janelas curtas
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      playClick(audio, now + Math.random() * 0.12);
    }
    setTimeout(tick, 80 + Math.random() * 80);
  };
  tick();
  stopFn = () => {
    stopped = true;
  };
  return stopFn;
}

export function stopShuffleSound() {
  if (stopFn) {
    stopFn();
    stopFn = null;
  }
}
