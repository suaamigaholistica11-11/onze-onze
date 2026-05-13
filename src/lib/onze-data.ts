// Mock data + helpers para a primeira versão do onze-onze.
// Quando o backend de astrologia estiver pronto, basta substituir essas
// funções por chamadas reais (ex.: createServerFn -> /api/v1/sky).
import { Body, Ecliptic, GeoVector, SearchMoonPhase } from "astronomy-engine";

export type SignKey =
  | "aries" | "touro" | "gemeos" | "cancer" | "leao" | "virgem"
  | "libra" | "escorpiao" | "sagitario" | "capricornio" | "aquario" | "peixes";

export interface SignInfo {
  key: SignKey;
  name: string;
  glyph: string;
  ruler: string;
  bg: "peach" | "lilac" | "mint" | "sky" | "yellow-candy";
}

export const SIGNS: Record<SignKey, SignInfo> = {
  aries:       { key: "aries",       name: "Áries",       glyph: "♈︎", ruler: "Marte",   bg: "peach" },
  touro:       { key: "touro",       name: "Touro",       glyph: "♉︎", ruler: "Vênus",   bg: "mint" },
  gemeos:      { key: "gemeos",      name: "Gêmeos",      glyph: "♊︎", ruler: "Mercúrio", bg: "yellow-candy" },
  cancer:      { key: "cancer",      name: "Câncer",      glyph: "♋︎", ruler: "Lua",     bg: "sky" },
  leao:        { key: "leao",        name: "Leão",        glyph: "♌︎", ruler: "Sol",     bg: "yellow-candy" },
  virgem:      { key: "virgem",      name: "Virgem",      glyph: "♍︎", ruler: "Mercúrio", bg: "mint" },
  libra:       { key: "libra",       name: "Libra",       glyph: "♎︎", ruler: "Vênus",   bg: "lilac" },
  escorpiao:   { key: "escorpiao",   name: "Escorpião",   glyph: "♏︎", ruler: "Plutão",  bg: "lilac" },
  sagitario:   { key: "sagitario",   name: "Sagitário",   glyph: "♐︎", ruler: "Júpiter", bg: "peach" },
  capricornio: { key: "capricornio", name: "Capricórnio", glyph: "♑︎", ruler: "Saturno", bg: "sky" },
  aquario:     { key: "aquario",     name: "Aquário",     glyph: "♒︎", ruler: "Urano",   bg: "sky" },
  peixes:      { key: "peixes",      name: "Peixes",      glyph: "♓︎", ruler: "Netuno",  bg: "lilac" },
};

// Ordem dos signos a partir de 0° de Áries.
const SIGN_ORDER: SignKey[] = [
  "aries", "touro", "gemeos", "cancer", "leao", "virgem",
  "libra", "escorpiao", "sagitario", "capricornio", "aquario", "peixes",
];

const SUBTITLES: Record<SignKey, string> = {
  aries: "O recomeço de tudo",
  touro: "Plantar com pés no chão",
  gemeos: "Novas conversas, novas ideias",
  cancer: "Acolher o que importa",
  leao: "Brilhar de dentro pra fora",
  virgem: "Organizar pra florescer",
  libra: "Recomeçar em harmonia",
  escorpiao: "Mergulhar fundo, renascer",
  sagitario: "Expandir horizontes",
  capricornio: "Construir com intenção",
  aquario: "Inventar o futuro",
  peixes: "Sonhar e se entregar",
};

function moonSignAt(date: Date): SignKey {
  const ecl = Ecliptic(GeoVector(Body.Moon, date, true));
  const lon = ((ecl.elon % 360) + 360) % 360;
  return SIGN_ORDER[Math.floor(lon / 30) % 12];
}

// Próxima Lua Nova calculada com astronomy-engine.
export function getNextNewMoon() {
  const now = new Date();
  const found = SearchMoonPhase(0, now, 40);
  const datetime = found ? found.date : new Date(now.getTime() + 4 * 86400000);
  const signKey = moonSignAt(datetime);
  const sign = SIGNS[signKey];
  return {
    datetime,
    sign,
    title: `Lua Nova em ${sign.name}`,
    subtitle: SUBTITLES[signKey],
  };
}

export function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const dias = Math.floor(ms / 86400000);
  const horas = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const segs = Math.floor((ms % 60000) / 1000);
  return { dias, horas, mins, segs };
}

export const ENERGIA_DO_DIA = {
  signo: SIGNS.leao,
  texto:
    "Vibes de hoje: foco total no seu brilho próprio. A Lua em Leão te chama pra arrasar, mas cuidado com o drama, viu?",
  highlights: ["criatividade ++", "ego em alta", "foco --"],
};

export const RITUAL_LUA_NOVA = [
  "Acenda uma vela branca e respire fundo três vezes, conectando-se com sua base.",
  "Escreva em um papel tudo o que você deseja manifestar neste novo ciclo de Áries.",
  "Releia em voz alta, como se já fosse verdade. Sinta no corpo.",
  "Guarde o papel num lugar especial até a próxima Lua Cheia.",
];

export const PIRAMIDE_TEMAS = [
  { id: "fisico",    nome: "Físico",    cor: "mint",         emoji: "🌿", media: 4.2 },
  { id: "mental",    nome: "Mental",    cor: "sky",          emoji: "💭", media: 3.8 },
  { id: "espiritual", nome: "Espiritual", cor: "lilac",      emoji: "✨", media: 4.6 },
] as const;