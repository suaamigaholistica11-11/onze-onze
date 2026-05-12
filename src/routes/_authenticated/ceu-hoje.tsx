import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SIGNS } from "@/lib/onze-data";

export const Route = createFileRoute("/_authenticated/ceu-hoje")({
  head: () => ({
    meta: [
      { title: "O Céu Hoje — onze-onze" },
      {
        name: "description",
        content: "Trânsitos e energias planetárias do dia.",
      },
    ],
  }),
  component: CeuHojePage,
});

const TRANSITOS = [
  { planeta: "Sol", glyph: "☉", signo: SIGNS.leao, texto: "Foco e visibilidade — é dia de se mostrar." },
  { planeta: "Lua", glyph: "☾", signo: SIGNS.cancer, texto: "Sensibilidade em alta. Ouça o que o corpo pede." },
  { planeta: "Mercúrio", glyph: "☿", signo: SIGNS.virgem, texto: "Ótimo pra organizar listas e finalizar tarefas." },
  { planeta: "Vênus", glyph: "♀", signo: SIGNS.libra, texto: "Charme natural. Hora boa pra conversas afetivas." },
  { planeta: "Marte", glyph: "♂", signo: SIGNS.escorpiao, texto: "Energia profunda. Use pra transformar, não pra brigar." },
  { planeta: "Júpiter", glyph: "♃", signo: SIGNS.gemeos, texto: "Aprenda algo novo — expande a mente." },
];

function CeuHojePage() {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

  return (
    <AppShell glyph="✦">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          {hoje}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          O Céu Hoje
        </h1>
        <p className="text-sm text-ink/60 mt-2">
          As energias planetárias que estão dançando lá em cima.
        </p>
      </header>

      <section className="px-6 mb-8 space-y-3 animate-oo-enter [animation-delay:120ms]">
        {TRANSITOS.map((t) => (
          <div
            key={t.planeta}
            className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex items-start gap-4"
          >
            <div className="size-12 bg-lilac/40 rounded-2xl flex items-center justify-center font-display text-2xl shrink-0">
              {t.glyph}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold">{t.planeta}</span>
                <span className="text-xs text-ink/50">em</span>
                <span className="text-sm font-medium">{t.signo.name}</span>
                <span className="font-display text-base text-ink/40">{t.signo.glyph}</span>
              </div>
              <p className="text-sm text-ink/70 mt-1 leading-snug">{t.texto}</p>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}