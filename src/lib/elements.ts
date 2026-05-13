import { SIGNS_ORDER } from "./transit-copy";

export type Element = "Fogo" | "Terra" | "Ar" | "Água";

export const SIGN_ELEMENT: Record<string, Element> = {
  "Áries": "Fogo", "Leão": "Fogo", "Sagitário": "Fogo",
  "Touro": "Terra", "Virgem": "Terra", "Capricórnio": "Terra",
  "Gêmeos": "Ar", "Libra": "Ar", "Aquário": "Ar",
  "Câncer": "Água", "Escorpião": "Água", "Peixes": "Água",
};

export const ELEMENT_EMOJI: Record<Element, string> = {
  Fogo: "🔥",
  Terra: "🌱",
  Ar: "🌬️",
  Água: "💧",
};

export const ELEMENT_PHRASE: Record<Element, string> = {
  Fogo: "você age primeiro, sente o mundo pela coragem e pelo movimento.",
  Terra: "você firma o pé, constrói com calma e confia no que pode tocar.",
  Ar: "você pensa antes de tudo — ideias e troca são seu oxigênio.",
  Água: "você sente antes de pensar e atravessa o mundo pela emoção.",
};

export function dominantElement(signs: string[]): { element: Element; counts: Record<Element, number> } {
  const counts: Record<Element, number> = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
  for (const s of signs) {
    const el = SIGN_ELEMENT[s];
    if (el) counts[el]++;
  }
  let top: Element = "Fogo";
  let max = -1;
  (Object.keys(counts) as Element[]).forEach((e) => {
    if (counts[e] > max) { max = counts[e]; top = e; }
  });
  return { element: top, counts };
}

export function signLongitude(sign: string, degree: number): number {
  const idx = SIGNS_ORDER.indexOf(sign as (typeof SIGNS_ORDER)[number]);
  if (idx < 0) return 0;
  return idx * 30 + degree;
}

export type AspectType = "Conjunção" | "Sextil" | "Quadratura" | "Trígono" | "Oposição";

const ASPECTS: Array<{ name: AspectType; angle: number; glyph: string; tone: "harm" | "tens" | "neut" }> = [
  { name: "Conjunção", angle: 0, glyph: "☌", tone: "neut" },
  { name: "Sextil", angle: 60, glyph: "⚹", tone: "harm" },
  { name: "Quadratura", angle: 90, glyph: "□", tone: "tens" },
  { name: "Trígono", angle: 120, glyph: "△", tone: "harm" },
  { name: "Oposição", angle: 180, glyph: "☍", tone: "tens" },
];

export interface AspectHit {
  a: string;
  b: string;
  type: AspectType;
  glyph: string;
  tone: "harm" | "tens" | "neut";
  orb: number;
}

export function calcAspects(
  bodies: Array<{ name: string; longitude: number }>,
): AspectHit[] {
  const hits: AspectHit[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      let diff = Math.abs(a.longitude - b.longitude) % 360;
      if (diff > 180) diff = 360 - diff;
      const isLuminary = ["Sol", "Lua"].includes(a.name) || ["Sol", "Lua"].includes(b.name);
      const orbLimit = isLuminary ? 8 : 6;
      for (const asp of ASPECTS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= orbLimit) {
          hits.push({ a: a.name, b: b.name, type: asp.name, glyph: asp.glyph, tone: asp.tone, orb });
          break;
        }
      }
    }
  }
  return hits;
}