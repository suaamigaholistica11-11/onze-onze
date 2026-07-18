// Gravador de áudio simples: captura PCM via Web Audio API e devolve um WAV
// mono 16 kHz, formato aceito pelos modelos de STT.

export class WavRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private node: ScriptProcessorNode | null = null;
  private chunks: Float32Array[] = [];
  private sampleRate = 0;

  async start(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microfone não disponível neste dispositivo.");
    }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor: typeof AudioContext = (window as any).AudioContext ?? (window as any).webkitAudioContext;
    this.ctx = new Ctor();
    this.sampleRate = this.ctx.sampleRate;
    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.node = this.ctx.createScriptProcessor(4096, 1, 1);
    this.node.onaudioprocess = (e) => {
      const src = e.inputBuffer.getChannelData(0);
      this.chunks.push(new Float32Array(src));
    };
    this.source.connect(this.node);
    this.node.connect(this.ctx.destination);
  }

  async stop(): Promise<Blob> {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.node?.disconnect();
    this.source?.disconnect();
    const rate = this.sampleRate;
    const chunks = this.chunks;
    this.chunks = [];
    try {
      await this.ctx?.close();
    } catch {
      // ignore
    }
    return encodeWav(chunks, rate, 16000);
  }

  cancel(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.node?.disconnect();
    this.source?.disconnect();
    this.chunks = [];
    try {
      void this.ctx?.close();
    } catch {
      // ignore
    }
  }
}

function encodeWav(chunks: Float32Array[], srcRate: number, targetRate = 16000): Blob {
  let total = 0;
  for (const c of chunks) total += c.length;
  const flat = new Float32Array(total);
  let off = 0;
  for (const c of chunks) {
    flat.set(c, off);
    off += c.length;
  }

  // Downsample linear pra ~16 kHz.
  const ratio = srcRate / targetRate;
  const outLen = Math.max(1, Math.floor(flat.length / ratio));
  const down = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    down[i] = flat[Math.min(flat.length - 1, Math.floor(i * ratio))] ?? 0;
  }

  const buffer = new ArrayBuffer(44 + down.length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + down.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, down.length * 2, true);

  let p = 44;
  for (let i = 0; i < down.length; i++) {
    const s = Math.max(-1, Math.min(1, down[i]));
    view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    p += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export async function transcribeBlob(blob: Blob, accessToken: string | null): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "recording.wav");
  const headers: HeadersInit = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: form,
    headers,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `Erro ${res.status}`);
  }
  const json = (await res.json()) as { text?: string };
  return json.text ?? "";
}