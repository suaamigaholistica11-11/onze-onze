import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/baralho-cigano")({
  head: () => ({
    meta: [
      { title: "Baralho Cigano · onze-onze" },
      {
        name: "description",
        content:
          "Métodos de leitura do baralho cigano: 3 cartas, 7 cartas, Cruz e Mesa Real.",
      },
    ],
  }),
  component: BaralhoCiganoPage,
});

type Metodo = {
  id: string;
  titulo: string;
  resumo: string;
  posicoes: { n: string; texto: string }[];
  extras?: { titulo: string; itens: string[] };
};

const METODOS: Metodo[] = [
  {
    id: "3-cartas",
    titulo: "3 Cartas",
    resumo:
      "A leitura mais simples e direta. Ótima pra bater o olho num tema e entender o fio do que está acontecendo.",
    posicoes: [
      { n: "1", texto: "Passado. O que gerou a situação." },
      { n: "2", texto: "Presente. O que está acontecendo agora." },
      { n: "3", texto: "Futuro. O que tende a se desenrolar." },
    ],
  },
  {
    id: "7-cartas",
    titulo: "7 Cartas",
    resumo:
      "Um panorama mais completo, com espaço pra olhar o entorno, os desejos e o conselho final.",
    posicoes: [
      { n: "1", texto: "O consulente e a situação atual." },
      { n: "2", texto: "O que o cerca, influências externas." },
      { n: "3", texto: "O que deseja e aspira." },
      { n: "4", texto: "O que não espera, a surpresa." },
      { n: "5", texto: "Amor e relacionamentos." },
      { n: "6", texto: "Trabalho e finanças." },
      { n: "7", texto: "O conselho, a mensagem final." },
    ],
  },
  {
    id: "cruz",
    titulo: "Método da Cruz (10 Cartas)",
    resumo:
      "Uma leitura mais profunda, boa quando o tema pede clareza sobre postura, desejo e desdobramento.",
    posicoes: [
      { n: "1+2", texto: "O passado, o que gerou a situação." },
      { n: "3", texto: "O presente." },
      { n: "4", texto: "O que o consulente ainda não está percebendo." },
      { n: "5", texto: "A melhor postura a tomar." },
      { n: "6+7", texto: "Aspirações e desejos." },
      { n: "8", texto: "Se o desejo se realiza." },
      { n: "9", texto: "Se será bom pro consulente." },
      { n: "10", texto: "O conselho final." },
    ],
  },
  {
    id: "mesa-real",
    titulo: "Mesa Real (36 Cartas)",
    resumo:
      "A leitura mais completa. Grade de 9 colunas por 4 linhas, casas de 1 a 36. Cada carta tem sua própria casa correspondente e, quando cai nela, amplifica o significado. Cartas à esquerda contam passado e causa, à direita futuro e resultado.",
    posicoes: [],
    extras: {
      titulo: "Técnicas de leitura",
      itens: [
        "T1 Somas. A carta oculta é o número da carta somado ao da casa onde caiu. Se passar de 36, some os dígitos.",
        "T2 Laterais. Leia as posições 1 e 36 juntas, 9 e 28 juntas, e cruze as casas 12 e 21 e 13 e 20 pra ler as preocupações centrais.",
        "T3 Primeira mensagem. As cartas nas casas 1, 2 e 3 formam a primeira mensagem do jogo.",
        "T4 Posição do consulente. Divida a mesa em colunas: esquerda é passado, centro é presente, direita é futuro.",
        "T8 Espelhamentos. Cruze cartas em posições simétricas pra confirmar tendências.",
      ],
    },
  },
];

function BaralhoCiganoPage() {
  return (
    <AppShell glyph="✧">
      <header className="px-6 pt-10 pb-4 animate-oo-enter">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink/40 mb-2">
          leitura oracular
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Baralho Cigano
        </h1>
        <p className="text-sm text-ink/60 mt-3 leading-relaxed">
          O baralho cigano é um oráculo cheio de imagens vivas. Cada carta tem
          uma lâmina e um arquétipo, e a leitura acontece na conversa entre elas.
          Aqui embaixo estão os quatro métodos clássicos, escolhe o que mais
          combina com a pergunta do momento.
        </p>
      </header>

      <section className="px-6 pb-10 space-y-3 animate-oo-enter [animation-delay:80ms]">
        {METODOS.map((m) => (
          <MetodoCard key={m.id} metodo={m} />
        ))}

        <div className="bg-yellow-candy/60 rounded-[24px] p-5 ring-1 ring-black/5 mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60 mb-2">
            dica de amiga
          </p>
          <p className="font-display text-base leading-relaxed">
            Antes de embaralhar, respira fundo e formula a pergunta com calma.
            O oráculo responde melhor pra quem chega inteira. E lembra: carta
            nenhuma decide por você, ela só ilumina o caminho pra sua escolha
            ficar mais consciente.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function MetodoCard({ metodo }: { metodo: Metodo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-[24px] ring-1 ring-black/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-ink/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-lilac/40 flex items-center justify-center">
            <Layers className="size-4" />
          </div>
          <div>
            <p className="font-display font-bold text-base leading-tight">
              {metodo.titulo}
            </p>
            <p className="text-[11px] text-ink/50 mt-0.5">
              {open ? "toque pra fechar" : "toque pra abrir"}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="size-4 text-ink/60 shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-ink/60 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          <p className="text-sm text-ink/70 leading-relaxed">{metodo.resumo}</p>
          {metodo.posicoes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-2">
                posições
              </p>
              <ul className="space-y-2">
                {metodo.posicoes.map((p) => (
                  <li
                    key={p.n}
                    className="flex gap-3 bg-cream/60 rounded-2xl p-3"
                  >
                    <span className="font-display font-bold text-sm shrink-0 min-w-8">
                      {p.n}.
                    </span>
                    <span className="text-sm text-ink/80 leading-relaxed">
                      {p.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {metodo.extras && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-2">
                {metodo.extras.titulo}
              </p>
              <ul className="space-y-2">
                {metodo.extras.itens.map((t, i) => (
                  <li
                    key={i}
                    className="bg-lilac/20 rounded-2xl p-3 text-sm text-ink/80 leading-relaxed"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}