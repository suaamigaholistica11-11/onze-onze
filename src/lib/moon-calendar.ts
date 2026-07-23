// Calendário oficial das Luas de 2026 (Brasília, UTC-3).
// Fonte: material enviado pela usuária (Luas_2026.md).
import { Body, Ecliptic, GeoVector } from "astronomy-engine";

const SIGN_ORDER = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
] as const;

function moonSignAt(date: Date): string {
  const ecl = Ecliptic(GeoVector(Body.Moon, date, true));
  const lon = ((ecl.elon % 360) + 360) % 360;
  return SIGN_ORDER[Math.floor(lon / 30) % 12];
}

export type MoonPhaseGroup = "nova" | "crescente" | "cheia" | "minguante";

export interface MoonPhaseEvent {
  /** ISO em UTC (convertido de BRT/UTC-3). */
  date: string;
  fase: MoonPhaseGroup;
  signo: string;
  observacao?: string;
}

export interface MoonSignIngress {
  date: string;
  signo: string;
}

// BRT (UTC-3) -> ISO UTC.
function brt(y: number, m: number, d: number, hh: number, mm: number): string {
  return new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0)).toISOString();
}

function p(y: number, m: number, d: number, hh: number, mm: number, fase: MoonPhaseGroup, signo: string, observacao?: string): MoonPhaseEvent {
  return { date: brt(y, m, d, hh, mm), fase, signo, observacao };
}

function s(y: number, m: number, d: number, hh: number, mm: number, signo: string): MoonSignIngress {
  return { date: brt(y, m, d, hh, mm), signo };
}

/** Eventos de fase da Lua em 2026. */
export const MOON_PHASE_EVENTS: MoonPhaseEvent[] = [
  p(2026, 7, 7, 16, 29, "minguante", "Áries"),
  p(2026, 7, 14, 6, 43, "nova", "Câncer", "Superlua de Lua Nova em Câncer. Emoções amplificadas e intuição em alta, o signo que mais sente as fases lunares. Momento fértil pra plantar intenções ligadas ao lar, cuidado e afeto."),
  p(2026, 7, 21, 8, 5, "crescente", "Libra"),
  p(2026, 7, 29, 11, 35, "cheia", "Aquário"),
  p(2026, 8, 5, 23, 21, "minguante", "Touro"),
  p(2026, 8, 12, 14, 36, "nova", "Leão", "Eclipse Solar Total em Leão. Não inicie nada importante hoje. Dia pra recolher, respirar e recalibrar seu brilho e propósitos."),
  p(2026, 8, 19, 23, 46, "crescente", "Escorpião"),
  p(2026, 8, 28, 1, 18, "cheia", "Peixes", "Eclipse Lunar Parcial em Peixes. Emoções transbordantes. Evite discussões e busque atividades terapêuticas."),
  p(2026, 9, 4, 4, 51, "minguante", "Gêmeos"),
  p(2026, 9, 11, 0, 26, "nova", "Virgem"),
  p(2026, 9, 18, 17, 43, "crescente", "Sagitário"),
  p(2026, 9, 26, 13, 48, "cheia", "Áries"),
  p(2026, 10, 3, 10, 25, "minguante", "Câncer"),
  p(2026, 10, 10, 12, 50, "nova", "Libra"),
  p(2026, 10, 18, 13, 12, "crescente", "Capricórnio"),
  p(2026, 10, 26, 1, 11, "cheia", "Touro"),
  p(2026, 11, 1, 17, 28, "minguante", "Leão"),
  p(2026, 11, 9, 4, 2, "nova", "Escorpião"),
  p(2026, 11, 17, 8, 47, "crescente", "Aquário"),
  p(2026, 11, 24, 11, 53, "cheia", "Gêmeos", "Superlua Cheia em Gêmeos, a maior e mais brilhante Superlua de 2026. Emoções e revelações em alta."),
  p(2026, 12, 1, 3, 8, "minguante", "Virgem"),
  p(2026, 12, 8, 21, 51, "nova", "Sagitário"),
  p(2026, 12, 17, 2, 42, "crescente", "Peixes"),
  p(2026, 12, 23, 22, 28, "cheia", "Câncer"),
  p(2026, 12, 30, 15, 59, "minguante", "Libra"),
];

/** Ingressos: quando a Lua entra em cada signo (2026). */
export const MOON_SIGN_INGRESSES: MoonSignIngress[] = [
  s(2026, 7, 8, 17, 31, "Touro"),
  s(2026, 7, 10, 19, 42, "Gêmeos"),
  s(2026, 7, 12, 19, 47, "Câncer"),
  s(2026, 7, 14, 19, 35, "Leão"),
  s(2026, 7, 16, 21, 7, "Virgem"),
  s(2026, 7, 19, 1, 57, "Libra"),
  s(2026, 7, 23, 22, 7, "Sagitário"),
  s(2026, 7, 26, 10, 44, "Capricórnio"),
  s(2026, 7, 28, 22, 46, "Aquário"),
  s(2026, 7, 31, 9, 14, "Peixes"),
  s(2026, 8, 2, 17, 37, "Áries"),
  s(2026, 8, 4, 23, 36, "Touro"),
  s(2026, 8, 7, 3, 8, "Gêmeos"),
  s(2026, 8, 9, 4, 46, "Câncer"),
  s(2026, 8, 11, 5, 38, "Leão"),
  s(2026, 8, 13, 7, 18, "Virgem"),
  s(2026, 8, 15, 11, 20, "Libra"),
  s(2026, 8, 17, 18, 46, "Escorpião"),
  s(2026, 8, 20, 5, 30, "Sagitário"),
  s(2026, 8, 22, 17, 59, "Capricórnio"),
  s(2026, 8, 25, 6, 2, "Aquário"),
  s(2026, 8, 27, 16, 4, "Peixes"),
  s(2026, 8, 29, 23, 38, "Áries"),
  s(2026, 9, 1, 5, 1, "Touro"),
  s(2026, 9, 3, 8, 47, "Gêmeos"),
  s(2026, 9, 5, 11, 31, "Câncer"),
  s(2026, 9, 7, 13, 50, "Leão"),
  s(2026, 9, 9, 16, 35, "Virgem"),
  s(2026, 9, 11, 20, 52, "Libra"),
  s(2026, 9, 14, 3, 44, "Escorpião"),
  s(2026, 9, 16, 13, 42, "Sagitário"),
  s(2026, 9, 19, 1, 55, "Capricórnio"),
  s(2026, 9, 21, 14, 15, "Aquário"),
  s(2026, 9, 24, 0, 24, "Peixes"),
  s(2026, 9, 26, 7, 23, "Áries"),
  s(2026, 9, 28, 11, 40, "Touro"),
  s(2026, 9, 30, 14, 26, "Gêmeos"),
  s(2026, 10, 2, 16, 54, "Câncer"),
  s(2026, 10, 4, 19, 54, "Leão"),
  s(2026, 10, 6, 23, 53, "Virgem"),
  s(2026, 10, 9, 5, 11, "Libra"),
  s(2026, 10, 11, 12, 21, "Escorpião"),
  s(2026, 10, 13, 22, 0, "Sagitário"),
  s(2026, 10, 16, 9, 57, "Capricórnio"),
  s(2026, 10, 18, 22, 40, "Aquário"),
  s(2026, 10, 21, 9, 35, "Peixes"),
  s(2026, 10, 23, 16, 54, "Áries"),
  s(2026, 10, 25, 20, 35, "Touro"),
  s(2026, 10, 27, 22, 2, "Gêmeos"),
  s(2026, 10, 29, 23, 6, "Câncer"),
  s(2026, 11, 3, 5, 28, "Virgem"),
  s(2026, 11, 5, 11, 38, "Libra"),
  s(2026, 11, 7, 19, 40, "Escorpião"),
  s(2026, 11, 10, 5, 36, "Sagitário"),
  s(2026, 11, 12, 17, 27, "Capricórnio"),
  s(2026, 11, 15, 6, 25, "Aquário"),
  s(2026, 11, 17, 18, 20, "Peixes"),
  s(2026, 11, 20, 2, 52, "Áries"),
  s(2026, 11, 22, 7, 10, "Touro"),
  s(2026, 11, 26, 7, 51, "Câncer"),
  s(2026, 11, 28, 8, 21, "Leão"),
  s(2026, 11, 30, 11, 13, "Virgem"),
  s(2026, 12, 2, 17, 4, "Libra"),
  s(2026, 12, 5, 1, 35, "Escorpião"),
  s(2026, 12, 7, 12, 7, "Sagitário"),
  s(2026, 12, 10, 0, 9, "Capricórnio"),
  s(2026, 12, 12, 13, 6, "Aquário"),
  s(2026, 12, 15, 1, 36, "Peixes"),
  s(2026, 12, 17, 11, 35, "Áries"),
  s(2026, 12, 19, 17, 30, "Touro"),
  s(2026, 12, 21, 19, 27, "Gêmeos"),
  s(2026, 12, 23, 18, 58, "Câncer"),
  s(2026, 12, 25, 18, 12, "Leão"),
  s(2026, 12, 27, 19, 13, "Virgem"),
  s(2026, 12, 29, 23, 27, "Libra"),
];

export const PHASE_LABEL: Record<MoonPhaseGroup, string> = {
  nova: "Lua Nova",
  crescente: "Lua Crescente",
  cheia: "Lua Cheia",
  minguante: "Lua Minguante",
};

export const PHASE_MEANING: Record<MoonPhaseGroup, string> = {
  nova: "É o instante mais escuro do ciclo, tempo de silêncio e de plantar intenções pro que ainda nem tem nome.",
  crescente: "A luz começa a crescer, e com ela o impulso pra dar os primeiros passos e fortalecer o que já brotou.",
  cheia: "A Lua brilha inteira, iluminando emoções e verdades. É tempo de colher, agradecer e também soltar.",
  minguante: "A energia recolhe. Momento fértil pra desapegar, perdoar e abrir espaço pro que vem a seguir.",
};

/** Retorna a fase e o signo vigentes da Lua. */
export function getCurrentMoon(now: Date = new Date()): {
  fase: MoonPhaseGroup;
  signo: string;
  observacao?: string;
} {
  const t = now.getTime();

  let phase: MoonPhaseEvent = MOON_PHASE_EVENTS[0];
  for (const ev of MOON_PHASE_EVENTS) {
    if (new Date(ev.date).getTime() <= t) phase = ev;
    else break;
  }

  // Signo calculado por efeméride real (astronomy-engine) pra bater
  // com a Lua de verdade, independente da tabela de ingressos.
  const signo = moonSignAt(now);
  return { fase: phase.fase, signo, observacao: phase.observacao };
}

/** Próximos N dias com fase + signo da Lua vigentes ao meio-dia (BRT) daquele dia. */
export function getMoonWeek(
  start: Date = new Date(),
  days = 7,
): Array<{ date: Date; fase: MoonPhaseGroup; signo: string }> {
  const out: Array<{ date: Date; fase: MoonPhaseGroup; signo: string }> = [];
  const base = new Date(start);
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    // meio-dia local pra evitar oscilação em ingressos noturnos
    const noon = new Date(d);
    noon.setHours(12, 0, 0, 0);
    const { fase, signo } = getCurrentMoon(noon);
    out.push({ date: d, fase, signo });
  }
  return out;
}