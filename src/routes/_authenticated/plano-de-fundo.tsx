import { createFileRoute } from "@tanstack/react-router";
import { ImageOff, Image as ImageIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { useBgDisabled, setBgDisabled } from "@/lib/bg-preference";

export const Route = createFileRoute("/_authenticated/plano-de-fundo")({
  head: () => ({
    meta: [
      { title: "Plano de fundo · onze-onze" },
      { name: "description", content: "Escolha se quer ver imagens de fundo no app." },
    ],
  }),
  component: PlanoDeFundoPage,
});

function PlanoDeFundoPage() {
  const disabled = useBgDisabled();

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter relative z-10">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          aparência
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Plano de fundo</h1>
        <p className="text-sm text-ink/60 mt-2">
          Escolha como o app vai aparecer pra você.
        </p>
      </header>

      <section className="px-6 mt-4 relative z-10 animate-oo-enter [animation-delay:80ms]">
        <div className="bg-white p-6 rounded-[28px] ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-peach/60 flex items-center justify-center shrink-0">
              {disabled ? (
                <ImageOff className="size-5 text-ink" />
              ) : (
                <ImageIcon className="size-5 text-ink" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-bold leading-tight">
                Sem imagens de fundo
              </p>
              <p className="text-sm text-ink/60 mt-1">
                Esconde a mandala e os fundos de signo em todas as abas, deixando apenas
                a cor pêssego do app.
              </p>
            </div>
            <Switch
              checked={disabled}
              onCheckedChange={(v) => setBgDisabled(Boolean(v))}
              aria-label="Desativar imagens de fundo"
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
