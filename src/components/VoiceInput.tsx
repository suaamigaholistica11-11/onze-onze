import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WavRecorder, transcribeBlob } from "@/lib/audio-recorder";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export function VoiceInput({ value, onChange, placeholder, multiline, className }: Props) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const recRef = useRef<WavRecorder | null>(null);

  async function startRec() {
    try {
      const rec = new WavRecorder();
      await rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Preciso de acesso ao microfone pra gravar.");
    }
  }

  async function stopRec() {
    const rec = recRef.current;
    if (!rec) return;
    setRecording(false);
    setTranscribing(true);
    try {
      const blob = await rec.stop();
      if (blob.size < 2048) {
        toast.error("Não peguei sua voz. Tenta gravar de novo?");
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      const text = await transcribeBlob(blob, session?.access_token ?? null);
      if (!text.trim()) {
        toast.error("Não consegui entender o áudio. Tenta de novo?");
        return;
      }
      setPreview(text.trim());
    } catch (e) {
      toast.error(
        e instanceof Error && e.message
          ? "Não rolou de transcrever agora. Tenta de novo?"
          : "Erro ao transcrever.",
      );
    } finally {
      setTranscribing(false);
      recRef.current = null;
    }
  }

  function acceptPreview() {
    if (preview == null) return;
    const next = value.trim() ? `${value.trim()} ${preview}` : preview;
    onChange(next);
    setPreview(null);
  }

  function discardPreview() {
    setPreview(null);
  }

  const Field: typeof Input = (multiline ? Textarea : Input) as typeof Input;

  return (
    <div className={className}>
      <div className="relative">
        <Field
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={
            multiline
              ? "rounded-xl min-h-[80px] pr-12"
              : "rounded-xl pr-12"
          }
        />
        <button
          type="button"
          onClick={recording ? stopRec : startRec}
          disabled={transcribing}
          className={`absolute top-2 right-2 size-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
            recording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-ink/5 text-ink/60 hover:bg-ink/10"
          }`}
          aria-label={recording ? "Parar gravação" : "Gravar áudio"}
          title={recording ? "Parar gravação" : "Gravar áudio"}
        >
          {transcribing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : recording ? (
            <Square className="size-3.5" />
          ) : (
            <Mic className="size-3.5" />
          )}
        </button>
      </div>

      {recording && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
          gravando... toque no quadradinho pra parar
        </p>
      )}
      {transcribing && (
        <p className="text-xs text-ink/50 mt-1.5 italic">Transcrevendo seu áudio...</p>
      )}

      {preview !== null && (
        <div className="mt-2 bg-cream/70 rounded-xl p-3 ring-1 ring-black/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/50 mb-2">
            Confere se ficou certinho antes de enviar
          </p>
          <Textarea
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            className="rounded-lg text-sm bg-white min-h-[60px]"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={discardPreview}
              className="flex-1 text-xs font-medium px-3 py-2 rounded-full bg-white ring-1 ring-black/10 hover:bg-ink/5"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={acceptPreview}
              className="flex-1 text-xs font-bold px-3 py-2 rounded-full bg-ink text-white hover:bg-ink/90"
            >
              Usar texto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}