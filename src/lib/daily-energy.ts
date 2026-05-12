import type { TransitItem } from "./transits.functions";
import { SIGN_GLYPHS } from "./transit-copy";

const SIGN_VIBE: Record<string, string> = {
  "Áries": "coragem",
  "Touro": "calma",
  "Gêmeos": "leveza",
  "Câncer": "afeto",
  "Leão": "brilho",
  "Virgem": "foco",
  "Libra": "harmonia",
  "Escorpião": "intensidade",
  "Sagitário": "expansão",
  "Capricórnio": "estrutura",
  "Aquário": "originalidade",
  "Peixes": "intuição",
};

const SIGN_SOL: Record<string, string> = {
  "Áries": "te chama pra agir sem medo",
  "Touro": "pede ritmo lento e prazer simples",
  "Gêmeos": "convida pra trocar ideia e rir",
  "Câncer": "acende o cuidado com quem você ama",
  "Leão": "ilumina seu palco — brilha sem culpa",
  "Virgem": "organiza tudo com carinho",
  "Libra": "pede beleza e bons encontros",
  "Escorpião": "vai fundo no que importa",
  "Sagitário": "quer aventura e uma boa risada",
  "Capricórnio": "constrói passo a passo",
  "Aquário": "te lembra de ser você sem caixinha",
  "Peixes": "convida pra sentir e sonhar",
};

const SIGN_LUA: Record<string, string> = {
  "Áries": "energia inquieta",
  "Touro": "vontade de colo e aconchego",
  "Gêmeos": "cabeça fervilhando",
  "Câncer": "coração mais sensível",
  "Leão": "humor solar e dramático",
  "Virgem": "necessidade de organizar",
  "Libra": "vontade de paz",
  "Escorpião": "emoções profundas",
  "Sagitário": "alma livre",
  "Capricórnio": "foco no que é sério",
  "Aquário": "humor independente",
  "Peixes": "sensibilidade nas alturas",
};

export function buildDailyEnergy(transits: TransitItem[]) {
  const sol = transits.find((t) => t.planeta === "Sol");
  const lua = transits.find((t) => t.planeta === "Lua");
  if (!sol || !lua) {
    return {
      texto: "Hoje o céu pede que você respire fundo e siga no seu tempo ✨",
      highlights: ["leveza", "presença"],
    };
  }
  const solGlyph = SIGN_GLYPHS[sol.signo] ?? "";
  const luaGlyph = SIGN_GLYPHS[lua.signo] ?? "";
  const texto = `Sol em ${solGlyph} ${sol.signo} ${SIGN_SOL[sol.signo] ?? "te inspira hoje"}, e a Lua em ${luaGlyph} ${lua.signo} traz ${SIGN_LUA[lua.signo] ?? "um clima especial"}. Aproveita ✨`;
  const highlights = [
    `Sol em ${sol.signo}`,
    `Lua em ${lua.signo}`,
    SIGN_VIBE[lua.signo] ?? "presença",
  ];
  return { texto, highlights };
}