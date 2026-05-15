import type { TransitItem } from "./transits.functions";
import { SIGN_GLYPHS } from "./transit-copy";

type Modo = "agir" | "pensar" | "planejar" | "sentir";

const SIGN_MODO: Record<string, Modo> = {
  "Áries": "agir", "Leão": "agir", "Sagitário": "agir",
  "Gêmeos": "pensar", "Libra": "pensar", "Aquário": "pensar",
  "Touro": "planejar", "Virgem": "planejar", "Capricórnio": "planejar",
  "Câncer": "sentir", "Escorpião": "sentir", "Peixes": "sentir",
};

const SIGN_VIBE: Record<string, string> = {
  "Áries": "coragem", "Touro": "calma", "Gêmeos": "leveza",
  "Câncer": "afeto", "Leão": "brilho", "Virgem": "foco",
  "Libra": "harmonia", "Escorpião": "intensidade", "Sagitário": "expansão",
  "Capricórnio": "estrutura", "Aquário": "originalidade", "Peixes": "intuição",
};

// Frases pra cada planeta em cada signo, no tom de amiga.
const SOL: Record<string, string> = {
  "Áries": "te chama pra agir e encarar o que tava parado",
  "Touro": "te convida a ir devagar, sentir o ritmo e cuidar do que já é teu",
  "Gêmeos": "deixa o dia mais leve, com vontade de conversar e trocar ideia",
  "Câncer": "puxa o tom afetivo: casa, família e tudo que aquece",
  "Leão": "acende teu brilho e pede que você apareça sem pedir licença",
  "Virgem": "te convida a organizar, resolver pendência e cuidar dos detalhes",
  "Libra": "pede equilíbrio nas relações e escolhas mais conscientes",
  "Escorpião": "te leva pra dentro, pra olhar o que tá embaixo do tapete com coragem",
  "Sagitário": "abre o horizonte e dá vontade de aprender e expandir",
  "Capricórnio": "te lembra de construir passo a passo, com pé no chão",
  "Aquário": "convida a pensar fora da caixinha e fazer do teu jeito",
  "Peixes": "deixa o dia mais sensível, pede pausa, arte e escuta da intuição",
};

const LUA: Record<string, string> = {
  "Áries": "a vontade de agir por impulso vai estar muito à tona",
  "Touro": "o emocional pede colo, comida boa e um ritmo bem mais lento",
  "Gêmeos": "a cabeça vai estar fervilhando, com mil ideias ao mesmo tempo",
  "Câncer": "as emoções vão estar à flor da pele, é dia de se permitir sentir",
  "Leão": "o coração quer holofote e momentos que te façam sentir especial",
  "Virgem": "o emocional pede ordem, é fácil ficar travada no detalhe",
  "Libra": "a vibe pede paz, qualquer ruído vai pesar mais do que o normal",
  "Escorpião": "as emoções vão profundas, é dia de verdade crua e de soltar",
  "Sagitário": "bate uma vontade de liberdade e de escapar da rotina",
  "Capricórnio": "o humor fica mais sério, com vontade de resolver e botar ordem",
  "Aquário": "vem uma sensação de querer espaço e observar tudo de longe",
  "Peixes": "a sensibilidade dispara, vai ser fácil absorver o clima dos outros",
};

const MERCURIO: Record<string, string> = {
  "Áries": "tua mente tá afiada e direta, só cuida pra não atropelar nas palavras",
  "Touro": "o pensamento tá mais lento e prático, ótimo pra decidir com calma",
  "Gêmeos": "a comunicação flui solta, dia bom pra escrever e trocar ideia",
  "Câncer": "as conversas tendem a ser mais afetivas, fala do que tá sentindo",
  "Leão": "as ideias saem grandiosas, ótimo pra apresentar algo teu",
  "Virgem": "tua cabeça tá precisa, dia perfeito pra listas e finalizar tarefa",
  "Libra": "o papo vira ponte, bom pra negociar e alinhar com alguém",
  "Escorpião": "tua mente investiga, lê entrelinhas e enxerga o que tá oculto",
  "Sagitário": "vontade de aprender algo novo e ampliar a visão",
  "Capricórnio": "pensamento estratégico, dia rendoso pra planejar a longo prazo",
  "Aquário": "insights vêm rápidos e do nada, anota tudo",
  "Peixes": "a intuição comunica mais do que palavra, escuta antes de falar",
};

const VENUS: Record<string, string> = {
  "Áries": "no afeto, o clima é de paixão e iniciativa",
  "Touro": "o coração pede prazer simples: comida, toque, beleza",
  "Gêmeos": "charme leve e papo solto nas relações",
  "Câncer": "afeto que aconchega, família e quem é casa entram em foco",
  "Leão": "romance com brilho, vontade de aparecer e ser visto",
  "Virgem": "amor nos detalhes e nos gestos pequenos do dia",
  "Libra": "as relações fluem, é dia bom pra encontros e harmonia",
  "Escorpião": "desejo profundo, vínculo intenso e nada de superficialidade",
  "Sagitário": "paixão por descoberta, vontade de viver junto algo novo",
  "Capricórnio": "amor maduro, com peso de compromisso real",
  "Aquário": "liberdade no afeto, ninguém quer se sentir preso hoje",
  "Peixes": "romance de filme, se entrega com cuidado pra não se perder",
};

const MARTE: Record<string, string> = {
  "Áries": "energia turbinada pra ação, canaliza em algo concreto",
  "Touro": "força constante, persistência rende mais do que pressa",
  "Gêmeos": "várias frentes ao mesmo tempo, escolhe uma pra terminar",
  "Câncer": "vai defender o que importa, não engole sapo hoje",
  "Leão": "coragem brilhante, é dia de liderar com presença",
  "Virgem": "energia pra organizar e executar, ótimo pra resolver lista",
  "Libra": "age com elegância, parceria abre porta",
  "Escorpião": "energia profunda, transforma em vez de brigar",
  "Sagitário": "vontade de movimento, sair da rotina cura",
  "Capricórnio": "disciplina move montanha hoje",
  "Aquário": "age por uma causa maior do que você",
  "Peixes": "movimento sutil mas certeiro, confia na intuição",
};

const FECHAMENTO: Record<Modo, Record<Modo, string>> = {
  agir: {
    agir: "Bora canalizar essa energia toda em uma ação que faça sentido, sem atropelar o caminho.",
    pensar: "Antes de sair fazendo, dá um respiro e pensa um pouco mais. Equilibra a vontade de agir com um plano, mesmo que pequeno.",
    planejar: "A vontade de agir vai estar alta, mas o dia pede que você planeje um passo de cada vez antes de se jogar.",
    sentir: "A energia pede ação, mas o coração pede cuidado. Age com intenção, não no automático.",
  },
  pensar: {
    agir: "O dia te convida a pensar e o emocional quer ação. Bora equilibrar entre refletir e dar o primeiro passo, sem ficar só na cabeça.",
    pensar: "Tem espaço de sobra pra pensar e conversar hoje. Só cuidado pra não ficar só na ideia, escolhe uma e leva pra frente.",
    planejar: "Combinação ótima pra organizar pensamento e transformar em plano. Aproveita pra desenhar os próximos passos.",
    sentir: "A mente quer entender, o coração quer sentir. Escuta os dois antes de tirar conclusão.",
  },
  planejar: {
    agir: "O Sol te convida a pensar um pouco mais sobre tuas atitudes, e a Lua quer agir. Equilibra: planeja antes, age depois.",
    pensar: "Dia perfeito pra parar, pensar e desenhar um plano com calma. Anota tudo que vier.",
    planejar: "Tudo conspira pra organizar. Aproveita pra colocar a casa em ordem, literal e simbólica.",
    sentir: "A cabeça pede plano, o coração pede pausa. Faz devagar, com carinho.",
  },
  sentir: {
    agir: "O dia pede que você sinta, mas o emocional vai querer agir. Pausa, escuta o que tá vivo aí dentro antes de reagir.",
    pensar: "Tem muito pra sentir e muito pra pensar. Equilibra entre escutar a intuição e dar nome pro que aparecer.",
    planejar: "É dia de sentir com pé no chão. Usa o que aparecer pra ajustar o caminho, sem cobrança.",
    sentir: "Tudo vai estar mais profundo hoje. Se permite sentir sem precisar resolver tudo de uma vez.",
  },
};

function frase(planeta: string, signo: string, mapa: Record<string, string>) {
  return mapa[signo] ?? `tá em ${signo} e mexe com a vibe do dia`;
}

export function buildDailyEnergy(transits: TransitItem[]) {
  const get = (n: string) => transits.find((t) => t.planeta === n);
  const sol = get("Sol");
  const lua = get("Lua");
  const mer = get("Mercúrio");
  const ven = get("Vênus");
  const mar = get("Marte");

  if (!sol || !lua) {
    return {
      texto: "Hoje o céu pede que você respire fundo e siga no teu tempo ✨",
      highlights: ["leveza", "presença", "respiro", "intuição"],
    };
  }

  // Abertura: pano de fundo do dia (Sol e Lua), sem glifos no corpo do texto.
  const abertura = `Hoje o céu tá com Sol em ${sol.signo} e a Lua em ${lua.signo}.`;
  const corpo = `O Sol em ${sol.signo} ${frase("Sol", sol.signo, SOL)}, enquanto a Lua em ${lua.signo} traz uma coisa importante: ${frase("Lua", lua.signo, LUA)}.`;

  // Camada extra: pega o planeta pessoal mais "presente" (preferindo retrógrados, depois Mercúrio/Vênus/Marte).
  const extras: string[] = [];
  const candidatos: Array<{ planeta: TransitItem | undefined; mapa: Record<string, string>; nome: string }> = [
    { planeta: mer, mapa: MERCURIO, nome: "Mercúrio" },
    { planeta: ven, mapa: VENUS, nome: "Vênus" },
    { planeta: mar, mapa: MARTE, nome: "Marte" },
  ];

  // Sempre cita o que tá retrógrado (revisitar é o tema).
  const retrogrados = candidatos
    .filter((c) => c.planeta?.retrograde)
    .map((c) => c.nome);

  // Escolhe um planeta pra dar contexto extra: prioriza retrógrado, senão Mercúrio.
  const destaque =
    candidatos.find((c) => c.planeta?.retrograde) ?? candidatos[0];
  if (destaque?.planeta) {
    const p = destaque.planeta;
    extras.push(
      `${destaque.nome} tá em ${p.signo}: ${frase(destaque.nome, p.signo, destaque.mapa)}.`,
    );
  }

  // Aviso extra de retrógrados (se houver mais de um além do destaque).
  if (retrogrados.length > 0) {
    const lista =
      retrogrados.length === 1
        ? retrogrados[0]
        : retrogrados.slice(0, -1).join(", ") + " e " + retrogrados.slice(-1);
    extras.push(
      `Lembra que ${lista} tá em retrógrado, então é tempo de revisitar e ajustar, não de começar do zero nessa área.`,
    );
  }

  const fechamento =
    FECHAMENTO[SIGN_MODO[sol.signo]]?.[SIGN_MODO[lua.signo]] ??
    "Bora equilibrar entre pensar, planejar e agir hoje.";

  const texto = [abertura, corpo, ...extras, fechamento].join(" ");

  // Destaque: glifos dos signos + 4 palavras-chave do dia.
  const MODO_PALAVRA: Record<Modo, string> = {
    agir: "ação",
    pensar: "reflexão",
    planejar: "plano",
    sentir: "escuta",
  };
  const palavraDestaque = destaque?.planeta
    ? SIGN_VIBE[destaque.planeta.signo]
    : undefined;
  const palavras = Array.from(
    new Set(
      [
        SIGN_VIBE[sol.signo],
        SIGN_VIBE[lua.signo],
        palavraDestaque,
        MODO_PALAVRA[SIGN_MODO[sol.signo]],
        MODO_PALAVRA[SIGN_MODO[lua.signo]],
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 4);

  const solGlyphChip = `${SIGN_GLYPHS[sol.signo] ?? "☉"} ${sol.signo}`;
  const luaGlyphChip = `${SIGN_GLYPHS[lua.signo] ?? "☾"} ${lua.signo}`;
  const highlights = [solGlyphChip, luaGlyphChip, ...palavras];

  return { texto, highlights };
}
