import type { TransitItem } from "./transits.functions";
import { SIGN_GLYPHS } from "./transit-copy";

type Modo = "agir" | "pensar" | "planejar" | "sentir";

const SIGN_MODO: Record<string, Modo> = {
  "Áries": "agir",
  "Leão": "agir",
  "Sagitário": "agir",
  "Gêmeos": "pensar",
  "Libra": "pensar",
  "Aquário": "pensar",
  "Touro": "planejar",
  "Virgem": "planejar",
  "Capricórnio": "planejar",
  "Câncer": "sentir",
  "Escorpião": "sentir",
  "Peixes": "sentir",
};

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

// O Sol mostra o tom geral do dia (o que ele te convida a fazer).
const SOL_FRASE: Record<string, string> = {
  "Áries": "te chama pra agir, encarar o que tava parado e começar logo",
  "Touro": "te convida a ir mais devagar, sentir o ritmo e cuidar do que já é seu",
  "Gêmeos": "deixa o dia mais leve, com vontade de conversar, escrever e trocar ideia",
  "Câncer": "puxa o tom afetivo, casa, família, colo, tudo que aquece",
  "Leão": "acende seu brilho, pede que você apareça e ocupe seu lugar sem pedir licença",
  "Virgem": "te convida a organizar a vida, resolver pendência e cuidar dos detalhes com carinho",
  "Libra": "pede equilíbrio nas relações, conversas bonitas e escolhas mais conscientes",
  "Escorpião": "te leva pra dentro, pra olhar o que tá embaixo do tapete com coragem",
  "Sagitário": "abre o horizonte, dá vontade de aprender, viajar e expandir",
  "Capricórnio": "te lembra de construir passo a passo, com pé no chão e responsabilidade",
  "Aquário": "convida a pensar fora da caixinha e fazer do seu jeito, sem se moldar",
  "Peixes": "deixa o dia mais sensível, pede pausa, arte e escuta da intuição",
};

// A Lua diz como o clima emocional vai te puxar.
const LUA_FRASE: Record<string, string> = {
  "Áries": "vontade de tomar decisões impulsivas vai estar muito à tona, essa Lua provoca pra agir já",
  "Touro": "o emocional pede colo, comida boa e um ritmo bem mais lento",
  "Gêmeos": "a cabeça vai estar fervilhando, com mil ideias querendo sair ao mesmo tempo",
  "Câncer": "as emoções vão estar à flor da pele, é dia de se permitir sentir sem julgar",
  "Leão": "o coração quer holofote, atenção e momentos que façam você se sentir especial",
  "Virgem": "o emocional pede ordem, é fácil ficar travada no detalhe e querer controlar tudo",
  "Libra": "a vibe pede paz e harmonia, qualquer ruído vai pesar mais do que o normal",
  "Escorpião": "as emoções vão profundas, é dia de verdade crua e de soltar o que tá guardado",
  "Sagitário": "bate uma vontade de liberdade, de escapar da rotina e respirar ar novo",
  "Capricórnio": "o humor fica mais sério e contido, com vontade de resolver e botar ordem",
  "Aquário": "vem uma sensação de querer espaço, de observar tudo de longe antes de se envolver",
  "Peixes": "a sensibilidade dispara, vai ser fácil absorver o clima dos outros sem perceber",
};

const FECHAMENTO: Record<Modo, Record<Modo, string>> = {
  agir: {
    agir: "Bora canalizar essa energia toda em uma ação que faça sentido, sem atropelar o caminho.",
    pensar: "Antes de sair fazendo, dá um respiro e pensa um pouquinho mais. Equilibra a vontade de agir com um plano, mesmo que pequeno.",
    planejar: "A vontade de agir vai estar alta, mas o dia pede que você planeje um passo de cada vez antes de se jogar.",
    sentir: "A energia pede ação, mas o coração pede cuidado. Age com intenção, não no automático.",
  },
  pensar: {
    agir: "O dia te convida a pensar e o emocional quer ação. Bora equilibrar entre refletir e dar o primeiro passo, sem ficar só na cabeça.",
    pensar: "Tem espaço de sobra pra pensar e conversar hoje. Só cuidado pra não ficar só na ideia, escolhe uma e leva pra frente.",
    planejar: "Combinação ótima pra organizar pensamentos e transformar em plano. Aproveita pra desenhar os próximos passos.",
    sentir: "A mente quer entender, o coração quer sentir. Escuta os dois antes de tirar conclusão.",
  },
  planejar: {
    agir: "O Sol te convida a pensar um pouquinho mais sobre as suas atitudes, e a Lua quer agir. Equilibra: planeja antes, age depois.",
    pensar: "Dia perfeito pra parar, pensar e desenhar um plano com calma. Anota tudo que vier.",
    planejar: "Tudo conspira pra organizar. Aproveita pra colocar a casa em ordem, literal e simbólica.",
    sentir: "A cabeça pede plano, o coração pede pausa. Faz devagar, com carinho.",
  },
  sentir: {
    agir: "O dia pede que você sinta, mas o emocional vai querer agir. Pausa, escuta o que tá vivo aí dentro antes de reagir.",
    pensar: "Tem muito pra sentir e muito pra pensar. Equilibra entre escutar a intuição e dar nome pro que aparecer.",
    planejar: "É dia de sentir com pé no chão. Use o que aparecer pra ajustar o caminho, sem cobrança.",
    sentir: "Tudo vai estar mais profundo hoje. Se permite sentir sem precisar resolver tudo de uma vez.",
  },
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
  const solFrase = SOL_FRASE[sol.signo] ?? "te inspira hoje";
  const luaFrase = LUA_FRASE[lua.signo] ?? "traz um clima especial";
  const fechamento =
    FECHAMENTO[SIGN_MODO[sol.signo]]?.[SIGN_MODO[lua.signo]] ??
    "Bora equilibrar entre pensar, planejar e agir hoje.";

  const texto = `Hoje o dia está com Sol em ${solGlyph} ${sol.signo} e a Lua em ${luaGlyph} ${lua.signo}. O Sol em ${sol.signo} ${solFrase}, enquanto a Lua em ${lua.signo} traz uma coisa importante: ${luaFrase}. ${fechamento}`;

  const highlights = [
    `Sol em ${sol.signo}`,
    `Lua em ${lua.signo}`,
    SIGN_VIBE[lua.signo] ?? "presença",
  ];
  return { texto, highlights };
}
