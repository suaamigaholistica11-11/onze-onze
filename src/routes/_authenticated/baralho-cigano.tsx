import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Shuffle,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Trash2,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CIGANO_CARDS, shuffle, type CiganoCard } from "@/lib/cigano-cards";
import { startShuffleSound, stopShuffleSound } from "@/lib/shuffle-sound";
import {
  gerarLeituraNadja,
  listNadjaReadings,
  deleteNadjaReading,
} from "@/lib/nadja.functions";
import ciganaImg from "@/assets/cigana.png";

export const Route = createFileRoute("/_authenticated/baralho-cigano")({
  head: () => ({
    meta: [
      { title: "Cigana Nadja · onze-onze" },
      {
        name: "description",
        content: "Escolha suas cartas e leia com os métodos clássicos do baralho cigano.",
      },
    ],
  }),
  component: BaralhoCiganoPage,
});

type SpreadId = "3" | "7" | "cruz" | "mesa";

type Spread = {
  id: SpreadId;
  titulo: string;
  qtd: number;
  resumo: string;
  posicoes: string[];
};

const SPREADS: Spread[] = [
  {
    id: "3",
    titulo: "3 Cartas",
    qtd: 3,
    resumo: "Leitura direta pra ver o fio da situação.",
    posicoes: ["Passado", "Presente", "Futuro"],
  },
  {
    id: "7",
    titulo: "7 Cartas",
    qtd: 7,
    resumo: "Um panorama com entorno, desejos e conselho.",
    posicoes: [
      "Você agora",
      "Ao seu redor",
      "O que deseja",
      "O que não espera",
      "Amor",
      "Trabalho",
      "Conselho",
    ],
  },
  {
    id: "cruz",
    titulo: "Cruz (10 Cartas)",
    qtd: 10,
    resumo: "Postura, desejo e desdobramento.",
    posicoes: [
      "Passado 1",
      "Passado 2",
      "Presente",
      "O que ainda não percebe",
      "Melhor postura",
      "Aspiração 1",
      "Aspiração 2",
      "O desejo se realiza?",
      "Será bom pra você?",
      "Conselho final",
    ],
  },
  {
    id: "mesa",
    titulo: "Mesa Real (36)",
    qtd: 36,
    resumo: "A leitura mais completa, todas as cartas em jogo.",
    posicoes: Array.from({ length: 36 }, (_, i) => `Casa ${i + 1}`),
  },
];

function BaralhoCiganoPage() {
  const [spread, setSpread] = useState<Spread | null>(null);
  const [deck, setDeck] = useState<CiganoCard[]>(() => shuffle(CIGANO_CARDS));
  const [picked, setPicked] = useState<number[]>([]); // índices no deck
  const [shuffling, setShuffling] = useState(false);
  const shuffleTimer = useRef<number | null>(null);
  const [pergunta, setPergunta] = useState("");
  const [leitura, setLeitura] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erroLeitura, setErroLeitura] = useState<string | null>(null);
  const [view, setView] = useState<"jogar" | "historico">("jogar");
  const [openReadingId, setOpenReadingId] = useState<string | null>(null);

  const listFn = useServerFn(listNadjaReadings);
  const deleteFn = useServerFn(deleteNadjaReading);
  const qc = useQueryClient();
  const historyQ = useQuery({
    queryKey: ["nadja-readings"],
    queryFn: () => listFn(),
    staleTime: 30_000,
  });

  useEffect(() => () => stopShuffleSound(), []);

  const startShuffle = () => {
    setPicked([]);
    setShuffling(true);
    startShuffleSound();
    // embaralha várias vezes com sons
    const rounds = 6;
    let i = 0;
    const step = () => {
      setDeck((d) => shuffle(d));
      i++;
      if (i < rounds) {
        shuffleTimer.current = window.setTimeout(step, 220);
      } else {
        stopShuffleSound();
        setShuffling(false);
      }
    };
    shuffleTimer.current = window.setTimeout(step, 220);
  };

  const pickCard = (idx: number) => {
    if (!spread || shuffling) return;
    if (picked.includes(idx)) return;
    if (picked.length >= spread.qtd) return;
    setPicked((p) => [...p, idx]);
  };

  const reset = () => {
    if (shuffleTimer.current) window.clearTimeout(shuffleTimer.current);
    stopShuffleSound();
    setShuffling(false);
    setPicked([]);
    setDeck(shuffle(CIGANO_CARDS));
    setLeitura(null);
    setErroLeitura(null);
  };

  const completo = spread ? picked.length === spread.qtd : false;

  const pedirLeitura = async () => {
    if (!spread || !completo || gerando) return;
    setGerando(true);
    setErroLeitura(null);
    try {
      const cartas = picked.map((deckIdx, i) => {
        const c = deck[deckIdx];
        return {
          n: c.n,
          nome: c.nome,
          sig: c.sig,
          posicao: spread.posicoes[i] ?? `Posição ${i + 1}`,
        };
      });
      const res = await gerarLeituraNadja({
        data: { spreadId: spread.id, spreadTitle: spread.titulo, pergunta, cartas },
      });
      setLeitura(res.texto);
      qc.invalidateQueries({ queryKey: ["nadja-readings"] });
    } catch (err: any) {
      setErroLeitura(err?.message ?? "Algo travou. Tenta de novo em instantes.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <AppShell glyph="✧" className="dark bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <h1 className="font-display text-4xl font-bold tracking-tight text-oo-gold">
          Cigana Nadja
        </h1>
        <p className="text-sm text-oo-offwhite mt-3 leading-relaxed">
          Escolha o método, embaralha respirando fundo com a sua pergunta em mente
          e toca nas cartas que te chamarem.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setView("jogar")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] ${
              view === "jogar"
                ? "bg-oo-gold text-oo-burgundy"
                : "bg-oo-burgundy ring-1 ring-white/10 text-oo-offwhite"
            }`}
          >
            <Sparkles className="size-3.5" />
            nova leitura
          </button>
          <button
            type="button"
            onClick={() => setView("historico")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] ${
              view === "historico"
                ? "bg-oo-gold text-oo-burgundy"
                : "bg-oo-burgundy ring-1 ring-white/10 text-oo-offwhite"
            }`}
          >
            <BookOpen className="size-3.5" />
            minhas leituras
            {historyQ.data?.readings?.length ? (
              <span className="ml-1 opacity-70">({historyQ.data.readings.length})</span>
            ) : null}
          </button>
        </div>
      </header>

      {view === "historico" ? (
        <HistoricoLeituras
          loading={historyQ.isLoading}
          readings={historyQ.data?.readings ?? []}
          openId={openReadingId}
          setOpenId={setOpenReadingId}
          onDelete={async (id) => {
            await deleteFn({ data: { id } });
            if (openReadingId === id) setOpenReadingId(null);
            qc.invalidateQueries({ queryKey: ["nadja-readings"] });
          }}
          onNew={() => setView("jogar")}
        />
      ) : (
        <>
      <section className="px-6 pb-6 animate-oo-enter">
        <div className="mx-auto w-40 h-40 rounded-full overflow-hidden ring-2 ring-oo-gold/40 shadow-[0_0_40px_-8px_rgba(234,179,8,0.35)] bg-slate-900/50">
          <img
            src={ciganaImg}
            alt="A Cigana"
            width={160}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-sm font-display text-oo-gold/90 mt-3">
          Receba a leitura da Cigana Nadja
        </p>
      </section>

      {!spread && (
        <section className="px-6 pb-4 space-y-3 animate-oo-enter">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-oo-offwhite/60">
            escolhe seu método
          </p>
          {SPREADS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSpread(s);
                setDeck(shuffle(CIGANO_CARDS));
                setPicked([]);
              }}
              className="w-full text-left bg-oo-burgundy rounded-[24px] ring-1 ring-white/10 p-5 hover:brightness-110 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center text-oo-gold">
                  <Layers className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-base leading-tight text-oo-gold">
                    {s.titulo}
                  </p>
                  <p className="text-[11px] text-oo-offwhite/70 mt-0.5">{s.resumo}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-oo-gold/70">
                  {s.qtd} cartas
                </span>
              </div>
            </button>
          ))}
        </section>
      )}

      {spread && (
        <section className="px-6 pb-10 animate-oo-enter">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-oo-offwhite/60">
                método
              </p>
              <p className="font-display font-bold text-lg leading-tight text-oo-gold">
                {spread.titulo}
              </p>
              <p className="text-[11px] text-oo-offwhite/70 mt-0.5">
                {picked.length}/{spread.qtd} escolhidas
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={startShuffle}
                disabled={shuffling}
                className="inline-flex items-center gap-1.5 bg-oo-gold text-oo-burgundy px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] disabled:opacity-50"
              >
                <Shuffle className="size-3.5" />
                {shuffling ? "embaralhando…" : "embaralhar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.history.back();
                }}
                className="inline-flex items-center gap-1.5 bg-oo-burgundy ring-1 ring-white/10 text-oo-offwhite px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.18em]"
              >
                <ArrowLeft className="size-3.5" />
                voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpread(null);
                  setPicked([]);
                }}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-oo-offwhite/50 px-2"
              >
                método
              </button>
            </div>
          </div>

          {!completo && (
            <>
              <div className="bg-oo-burgundy rounded-[20px] ring-1 ring-white/10 p-4 mb-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-oo-gold/80 block mb-2">
                  conta pra Nadja o que te trouxe aqui (opcional)
                </label>
                <textarea
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Ex: estou naquela situação indefinida com alguém e não sei se espero mais ou sigo…"
                  className="w-full bg-slate-950/60 text-oo-offwhite placeholder:text-oo-offwhite/40 text-sm rounded-xl p-3 ring-1 ring-white/10 focus:ring-oo-gold/50 outline-none resize-none"
                />
              </div>
              <p className="text-sm text-oo-offwhite/80 leading-relaxed mb-3">
                {picked.length === 0
                  ? "Antes de tirar, respira. Formula a pergunta com calma e toca nas cartas que te chamarem."
                  : `Escolhe mais ${spread.qtd - picked.length} carta${
                      spread.qtd - picked.length > 1 ? "s" : ""
                    }.`}
              </p>
              <div className="relative rounded-[32px] bg-gradient-to-br from-purple-950/90 via-indigo-950/90 to-slate-950/90 p-5 border border-purple-300/20 shadow-[0_0_60px_-12px_rgba(139,92,246,0.25)] backdrop-blur-sm">
                <div className="rounded-[24px] bg-slate-950/60 border border-oo-gold/20 p-4 shadow-inner">
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-oo-gold/60 mb-3">
                    área das cartas
                  </p>
                  <div
                    className={`grid gap-2 ${
                      shuffling ? "animate-pulse" : ""
                    } grid-cols-6 sm:grid-cols-8`}
                  >
                    {deck.map((card, idx) => {
                      const chosen = picked.includes(idx);
                      const disabled = shuffling || chosen;
                      return (
                        <button
                          key={`${card.n}-${idx}`}
                          type="button"
                          onClick={() => pickCard(idx)}
                          disabled={disabled}
                          aria-label={chosen ? `Carta escolhida` : "Carta virada"}
                          className={`aspect-[2/3] rounded-lg ring-1 ring-black/10 transition-all ${
                            chosen
                              ? "opacity-30 scale-95"
                              : "hover:-translate-y-1 hover:ring-lilac"
                          } ${shuffling ? "animate-oo-shuffle" : ""}`}
                          style={{
                            background:
                              "repeating-linear-gradient(45deg, #6b4a8b 0 6px, #8863a8 6px 12px), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 60%)",
                            backgroundBlendMode: "overlay",
                            animationDelay: `${(idx % 8) * 30}ms`,
                          }}
                        >
                        <span className="block w-full h-full rounded-lg border border-white/25 flex items-center justify-center text-white/70 text-[10px] font-display">
                          ✦
                        </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {completo && (
            <div className="animate-oo-enter">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-oo-gold" />
                <p className="font-display font-bold text-lg text-oo-gold">
                  Sua leitura
                </p>
              </div>
              <ul className="space-y-2 mb-4">
                {picked.map((deckIdx, i) => {
                  const c = deck[deckIdx];
                  return (
                    <li
                      key={i}
                      className="bg-oo-burgundy/70 rounded-2xl ring-1 ring-white/10 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
                          style={{
                            background:
                              "linear-gradient(135deg, #b48ad4, #7a4fa0)",
                          }}
                        >
                          {c.n}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-oo-offwhite/60">
                            {spread.posicoes[i] ?? `Posição ${i + 1}`}
                          </p>
                          <p className="font-display font-bold text-sm leading-tight mt-0.5 text-oo-gold">
                            {c.nome}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {!leitura && (
                <div className="bg-oo-burgundy rounded-[20px] ring-1 ring-white/10 p-4 mb-3">
                  <button
                    type="button"
                    onClick={pedirLeitura}
                    disabled={gerando}
                    className="w-full inline-flex items-center justify-center gap-2 bg-oo-gold text-oo-burgundy py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] disabled:opacity-60"
                  >
                    {gerando ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        a Nadja está lendo…
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        pedir leitura da Nadja
                      </>
                    )}
                  </button>
                  {erroLeitura && (
                    <p className="text-xs text-red-300/90 mt-2 leading-relaxed">{erroLeitura}</p>
                  )}
                </div>
              )}

              {leitura && (
                <div className="bg-oo-burgundy rounded-[24px] ring-1 ring-oo-gold/30 p-5 mb-3 shadow-[0_0_40px_-12px_rgba(234,179,8,0.35)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-oo-gold/80 mb-3">
                    a Nadja diz
                  </p>
                  <div className="text-oo-offwhite text-[15px] leading-[1.75] font-display whitespace-pre-wrap">
                    {leitura}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={reset}
                className="mt-4 w-full bg-oo-gold text-oo-burgundy py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                Nova leitura
              </button>
            </div>
          )}
        </section>
      )}

        </>
      )}
    </AppShell>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type ReadingRow = {
  id: string;
  spread_id: string;
  spread_title: string;
  pergunta: string | null;
  cartas: Array<{ n: number; nome: string; sig: string; posicao: string }> | any;
  texto: string;
  created_at: string;
};

function HistoricoLeituras({
  loading,
  readings,
  openId,
  setOpenId,
  onDelete,
  onNew,
}: {
  loading: boolean;
  readings: ReadingRow[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onDelete: (id: string) => Promise<void>;
  onNew: () => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const copy = async (r: ReadingRow) => {
    try {
      await navigator.clipboard.writeText(r.texto);
      setCopiedId(r.id);
      setTimeout(() => setCopiedId((v) => (v === r.id ? null : v)), 2000);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <section className="px-6 pb-16 animate-oo-enter">
        <div className="flex items-center gap-2 text-oo-offwhite/70 text-sm">
          <Loader2 className="size-4 animate-spin" /> buscando suas leituras…
        </div>
      </section>
    );
  }

  if (readings.length === 0) {
    return (
      <section className="px-6 pb-16 animate-oo-enter">
        <div className="bg-oo-burgundy rounded-[24px] ring-1 ring-white/10 p-6 text-center">
          <BookOpen className="size-6 text-oo-gold mx-auto mb-3" />
          <p className="font-display text-lg text-oo-gold mb-1">Nenhuma leitura ainda</p>
          <p className="text-sm text-oo-offwhite/70 mb-4 leading-relaxed">
            Assim que a Nadja fizer sua primeira leitura, ela fica guardada aqui pra você revisitar.
          </p>
          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-2 bg-oo-gold text-oo-burgundy px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles className="size-4" />
            tirar uma leitura
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-16 animate-oo-enter space-y-3">
      {readings.map((r) => {
        const open = openId === r.id;
        return (
          <div
            key={r.id}
            className="bg-oo-burgundy rounded-[20px] ring-1 ring-white/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : r.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center text-oo-gold shrink-0">
                <Layers className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm leading-tight text-oo-gold truncate">
                  {r.spread_title}
                </p>
                <p className="text-[11px] text-oo-offwhite/60 mt-0.5">
                  {formatDate(r.created_at)}
                </p>
                {r.pergunta ? (
                  <p className="text-[12px] text-oo-offwhite/80 mt-1 line-clamp-1 italic">
                    “{r.pergunta}”
                  </p>
                ) : null}
              </div>
              {open ? (
                <ChevronUp className="size-4 text-oo-gold/70 shrink-0" />
              ) : (
                <ChevronDown className="size-4 text-oo-gold/70 shrink-0" />
              )}
            </button>

            {open && (
              <div className="px-4 pb-4 animate-oo-enter">
                {Array.isArray(r.cartas) && r.cartas.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 mb-3">
                    {r.cartas.map((c: any, i: number) => (
                      <li
                        key={i}
                        className="text-[10px] font-bold uppercase tracking-[0.15em] bg-white/5 ring-1 ring-white/10 text-oo-offwhite/80 px-2 py-1 rounded-full"
                      >
                        {c.n}. {c.nome}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="bg-slate-950/50 rounded-2xl p-4 ring-1 ring-oo-gold/20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-oo-gold/80 mb-2">
                    a Nadja disse
                  </p>
                  <div className="text-oo-offwhite text-[14px] leading-[1.7] font-display whitespace-pre-wrap">
                    {r.texto}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(r)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-oo-gold text-oo-burgundy py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    {copiedId === r.id ? (
                      <>
                        <Check className="size-3.5" />
                        copiado
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        copiar texto
                      </>
                    )}
                  </button>
                  {confirmDelete === r.id ? (
                    <>
                      <button
                        type="button"
                        onClick={async () => {
                          setConfirmDelete(null);
                          await onDelete(r.id);
                        }}
                        className="inline-flex items-center gap-1.5 bg-red-500/90 text-white py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
                      >
                        <Trash2 className="size-3.5" /> apagar mesmo
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="inline-flex items-center gap-1.5 bg-white/10 text-oo-offwhite py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
                      >
                        <ArrowLeft className="size-3.5" /> cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(r.id)}
                      className="inline-flex items-center gap-1.5 bg-white/10 ring-1 ring-white/10 text-oo-offwhite py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
                    >
                      <Trash2 className="size-3.5" />
                      apagar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function MetodosDetalhados() {
  const [open, setOpen] = useState(false);
  return (
    <section className="px-6 pb-16 animate-oo-enter">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-oo-burgundy rounded-2xl px-4 py-3 ring-1 ring-white/10"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-oo-gold">
          como ler cada método
        </span>
        {open ? (
          <ChevronUp className="size-4 text-oo-gold/70" />
        ) : (
          <ChevronDown className="size-4 text-oo-gold/70" />
        )}
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {SPREADS.map((s) => (
            <div
              key={s.id}
              className="bg-oo-burgundy rounded-2xl ring-1 ring-white/10 p-4"
            >
              <p className="font-display font-bold text-base mb-1 text-oo-gold">{s.titulo}</p>
              <p className="text-sm text-oo-offwhite/70 mb-2">{s.resumo}</p>
              <ol className="text-sm text-oo-offwhite space-y-1 list-decimal list-inside">
                {s.posicoes.slice(0, 10).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
                {s.posicoes.length > 10 && (
                  <li className="list-none text-oo-offwhite/50 italic">
                    … e mais {s.posicoes.length - 10} casas.
                  </li>
                )}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
