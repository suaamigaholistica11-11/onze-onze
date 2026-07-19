import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getCurrentMoon, type MoonPhaseGroup } from "@/lib/moon-calendar";
import {
  BANHOS,
  PHASE_GROUP_LABEL,
  buildContextMessage,
  type Banho,
} from "@/lib/rituals";

export const Route = createFileRoute("/_authenticated/ritualzinho")({
  head: () => ({
    meta: [
      { title: "Ritualzinho · onze-onze" },
      {
        name: "description",
        content: "Banhos e intenções pra cada fase da lua, no signo de hoje.",
      },
    ],
  }),
  component: RitualzinhoPage,
});

function RitualzinhoPage() {
  const [data, setData] = useState<ReturnType<typeof getCurrentMoon> | null>(null);
  useEffect(() => {
    setData(getCurrentMoon());
  }, []);

  return (
    <AppShell glyph="🌙">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-ink/60 hover:text-ink mb-3"
        >
          <ArrowLeft className="size-3.5" /> voltar
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          ritualzinho
        </p>
        {!data ? (
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink/40 italic">
            lendo o céu…
          </h1>
        ) : (
          <Content group={data.fase} signo={data.signo} />
        )}
      </header>
    </AppShell>
  );
}

function Content({ group, signo }: { group: MoonPhaseGroup; signo: string }) {
  const fase = PHASE_GROUP_LABEL[group];
  const banhos = BANHOS[group];
  const mensagem = buildContextMessage(group, signo);

  return (
    <>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        {fase} em {signo}
      </h1>

      <section className="mt-6 bg-lilac/40 p-5 rounded-[28px] ring-1 ring-black/5 animate-oo-enter [animation-delay:80ms]">
        <p className="font-display text-base leading-relaxed text-pretty whitespace-pre-line">
          {mensagem}
        </p>
      </section>

      <section className="mt-4 bg-cream/70 p-5 rounded-[28px] ring-1 ring-black/5 animate-oo-enter [animation-delay:140ms]">
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Antes de escolher seu banho, que tal anotar sua intenção? Um caderninho só pros seus
          ritualzinhos faz toda a diferença, é onde a mágica começa a tomar forma. 📓✨
        </p>
        <a
          href="https://collshp.com/lojinjaonzeonze?view=storefront"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-ink/70 underline underline-offset-4 hover:text-ink"
        >
          <ShoppingBag className="size-3.5" />
          Conhece a Lojinha 11:11
        </a>
      </section>

      <section className="mt-6 mb-10 animate-oo-enter [animation-delay:200ms]">
        <h2 className="font-display text-xl font-bold italic mb-3">
          Banhos pra essa fase
        </h2>
        <div className="space-y-3">
          {banhos.map((b) => (
            <BanhoCard key={b.nome} banho={b} />
          ))}
        </div>
      </section>
    </>
  );
}

function BanhoCard({ banho }: { banho: Banho }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-[24px] ring-1 ring-black/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-ink/5 transition-colors"
      >
        <span className="font-display font-bold text-base">{banho.nome}</span>
        {open ? (
          <ChevronUp className="size-4 text-ink/60 shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-ink/60 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm text-ink/80">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
              Ingredientes
            </p>
            <p className="leading-relaxed">{banho.ingredientes}</p>
          </div>
          <div className="bg-yellow-candy/40 rounded-2xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
              Afirmação
            </p>
            <p className="font-display italic leading-relaxed">"{banho.afirmacao}"</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
              Sensação esperada
            </p>
            <p className="leading-relaxed">{banho.sensacao}</p>
          </div>
          {banho.substituicoes && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
                Substituições
              </p>
              <p className="leading-relaxed">{banho.substituicoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}