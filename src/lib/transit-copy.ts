// Frases curtas no tom Capricho holístico, 12 signos × 10 planetas
// Mapeamento estático para zero custo de IA e instantaneidade.

export const PLANETS_PT = [
  "Sol",
  "Lua",
  "Mercúrio",
  "Vênus",
  "Marte",
  "Júpiter",
  "Saturno",
  "Urano",
  "Netuno",
  "Plutão",
] as const;

export type PlanetPt = (typeof PLANETS_PT)[number];

export const PLANET_GLYPHS: Record<PlanetPt, string> = {
  Sol: "☉",
  Lua: "☾",
  Mercúrio: "☿",
  Vênus: "♀",
  Marte: "♂",
  Júpiter: "♃",
  Saturno: "♄",
  Urano: "♅",
  Netuno: "♆",
  Plutão: "♇",
};

export const SIGN_GLYPHS: Record<string, string> = {
  "Áries": "♈",
  "Touro": "♉",
  "Gêmeos": "♊",
  "Câncer": "♋",
  "Leão": "♌",
  "Virgem": "♍",
  "Libra": "♎",
  "Escorpião": "♏",
  "Sagitário": "♐",
  "Capricórnio": "♑",
  "Aquário": "♒",
  "Peixes": "♓",
};

export const SIGNS_ORDER = [
  "Áries",
  "Touro",
  "Gêmeos",
  "Câncer",
  "Leão",
  "Virgem",
  "Libra",
  "Escorpião",
  "Sagitário",
  "Capricórnio",
  "Aquário",
  "Peixes",
] as const;

type CopyMap = Record<PlanetPt, Record<string, string>>;

export const TRANSIT_COPY: CopyMap = {
  Sol: {
    "Áries": "Energia de recomeço: abre espaço pra coragem.",
    "Touro": "Foco no que dá raiz: corpo, dinheiro, prazer.",
    "Gêmeos": "Curiosidade em alta. Uma boa conversa cura.",
    "Câncer": "Hora de cuidar do ninho e dos seus.",
    "Leão": "Brilha sem pedir licença. O palco é seu.",
    "Virgem": "Dia bom pra organizar e cuidar de detalhes.",
    "Libra": "Beleza e diplomacia te abrem portas.",
    "Escorpião": "Mergulha fundo. Verdade é o tema.",
    "Sagitário": "Expanda horizontes, mesmo que só na cabeça.",
    "Capricórnio": "Construa devagar e bonito.",
    "Aquário": "Pensa fora da caixinha, tua mente tá elétrica.",
    "Peixes": "Sensibilidade vira superpoder hoje.",
  },
  Lua: {
    "Áries": "Emoção crua. Respira antes de reagir.",
    "Touro": "Calmaria emocional. Aproveite pra desacelerar.",
    "Gêmeos": "Mente inquieta. Escreve pra organizar.",
    "Câncer": "Casa e afeto pedem atenção.",
    "Leão": "O coração pede holofote, se mostra.",
    "Virgem": "Limpeza interna combina com limpeza física.",
    "Libra": "Busca por harmonia em tudo.",
    "Escorpião": "Sentimentos intensos. Não foge.",
    "Sagitário": "Vontade de liberdade. Se permita.",
    "Capricórnio": "Emoção contida pede maturidade.",
    "Aquário": "Distância afetiva. Observa sem julgar.",
    "Peixes": "Sonhos pedem espaço. Anote tudo.",
  },
  Mercúrio: {
    "Áries": "Fala direta. Cuidado com a impulsividade.",
    "Touro": "Pensamento prático e firme.",
    "Gêmeos": "Mente afiada pra trocas e ideias.",
    "Câncer": "Conversas afetivas curam.",
    "Leão": "Ideias grandiosas. Ótimo pra pitches.",
    "Virgem": "Ótimo pra listas e finalizar tarefas.",
    "Libra": "Diálogo como ponte. Negocie.",
    "Escorpião": "Investigação rende. Boa pra ler entrelinhas.",
    "Sagitário": "Mente quer aprender algo novo.",
    "Capricórnio": "Foco e estratégia rendem hoje.",
    "Aquário": "Insights vêm rápidos. Anota tudo.",
    "Peixes": "Intuição comunica mais que palavra.",
  },
  Vênus: {
    "Áries": "Amor com fogo. Paixão à vista.",
    "Touro": "Sensualidade e prazer dos sentidos.",
    "Gêmeos": "Charme leve e papo solto.",
    "Câncer": "Afeto que aconchega. Família em foco.",
    "Leão": "Romance com brilho. Apareça.",
    "Virgem": "Amor nos detalhes e gestos pequenos.",
    "Libra": "Charme natural. As relações fluem.",
    "Escorpião": "Desejo profundo, vínculo intenso.",
    "Sagitário": "Paixão por aventuras e descobertas.",
    "Capricórnio": "Amor maduro, compromisso real.",
    "Aquário": "Liberdade no afeto. Não prende.",
    "Peixes": "Romance de filme. Se entrega com cuidado.",
  },
  Marte: {
    "Áries": "Energia turbinada. Canaliza em ação.",
    "Touro": "Força constante. Persistência paga.",
    "Gêmeos": "Várias frentes ao mesmo tempo.",
    "Câncer": "Defesa do que importa. Não engula sapo.",
    "Leão": "Coragem brilhante. Lidere.",
    "Virgem": "Energia pra organizar e executar.",
    "Libra": "Aja com elegância e parceria.",
    "Escorpião": "Energia profunda: transforma em vez de brigar.",
    "Sagitário": "Vontade de movimento e liberdade.",
    "Capricórnio": "Disciplina move montanhas hoje.",
    "Aquário": "Aja por uma causa maior.",
    "Peixes": "Movimento sutil, mas certeiro.",
  },
  Júpiter: {
    "Áries": "Sorte com ousadia.",
    "Touro": "Expansão financeira e material.",
    "Gêmeos": "Aprende algo novo. Isso expande a mente.",
    "Câncer": "Família e lar crescem em afeto.",
    "Leão": "Reconhecimento à vista.",
    "Virgem": "Cresça pelo serviço e pela rotina sã.",
    "Libra": "Parcerias trazem oportunidade.",
    "Escorpião": "Crescimento pela transformação.",
    "Sagitário": "Em casa: expansão total.",
    "Capricórnio": "Crescimento com base sólida.",
    "Aquário": "Inovação abre caminhos.",
    "Peixes": "Espiritualidade expande horizontes.",
  },
  Saturno: {
    "Áries": "Aprenda a equilibrar impulso e maturidade.",
    "Touro": "Construa com paciência.",
    "Gêmeos": "Disciplina mental rende.",
    "Câncer": "Estruture suas raízes emocionais.",
    "Leão": "Maturidade no brilhar.",
    "Virgem": "Rotina é o caminho.",
    "Libra": "Compromissos pedem clareza.",
    "Escorpião": "Lições profundas. Honre o processo.",
    "Sagitário": "Filosofia de vida em revisão.",
    "Capricórnio": "Estrutura é seu poder.",
    "Aquário": "Reinvente seus grupos e ideais.",
    "Peixes": "Aprenda limites pra sonhar melhor.",
  },
  Urano: {
    "Áries": "Mudança chega pra agitar.",
    "Touro": "Reinvente sua relação com o material.",
    "Gêmeos": "Ideias revolucionárias.",
    "Câncer": "Quebra de padrões familiares.",
    "Leão": "Reinvente como você se mostra.",
    "Virgem": "Nova forma de organizar a vida.",
    "Libra": "Relações mudam de forma.",
    "Escorpião": "Transformação radical.",
    "Sagitário": "Liberdade vira urgência.",
    "Capricórnio": "Estruturas antigas caem.",
    "Aquário": "Em casa: inovação plena.",
    "Peixes": "Despertar espiritual.",
  },
  Netuno: {
    "Áries": "Inspiração move a ação.",
    "Touro": "Beleza vira refúgio.",
    "Gêmeos": "Cuidado com confusão mental.",
    "Câncer": "Sensibilidade nas raízes.",
    "Leão": "Sonhe grande, mas com pé no chão.",
    "Virgem": "Cuidar dos outros vira missão.",
    "Libra": "Idealize relações com lucidez.",
    "Escorpião": "Mergulhe na alma sem se perder.",
    "Sagitário": "Espiritualidade expande visão.",
    "Capricórnio": "Sonhos pedem estrutura.",
    "Aquário": "Causa coletiva inspira.",
    "Peixes": "Em casa: intuição máxima.",
  },
  Plutão: {
    "Áries": "Renascimento pela coragem.",
    "Touro": "Transformação no que valoriza.",
    "Gêmeos": "Mude o jeito de pensar.",
    "Câncer": "Cure padrões familiares.",
    "Leão": "Poder pessoal em transformação.",
    "Virgem": "Renove rotina e corpo.",
    "Libra": "Transformação nas relações.",
    "Escorpião": "Em casa: alquimia pura.",
    "Sagitário": "Crenças se reinventam.",
    "Capricórnio": "Estruturas se transformam profundamente.",
    "Aquário": "Revolução coletiva em curso.",
    "Peixes": "Cura espiritual profunda.",
  },
};

export function copyFor(planet: PlanetPt, sign: string, retrograde: boolean): string {
  const base = TRANSIT_COPY[planet]?.[sign] ?? "Energia em movimento.";
  return retrograde ? `${base} (em retrógrado: revisitar é a vibe)` : base;
}

// Explicação longa por planeta + signo — usada quando a pessoa clica pra abrir
// o card do trânsito no Céu Hoje.
export const PLANET_ROLE: Record<PlanetPt, string> = {
  Sol: "O Sol fala de identidade, propósito e de onde você brilha no mundo.",
  Lua: "A Lua rege emoção, memória e o que te faz sentir em casa.",
  Mercúrio: "Mercúrio comanda pensamento, fala e a forma como você troca ideia.",
  Vênus: "Vênus mostra como você ama, o que te dá prazer e o que acha bonito.",
  Marte: "Marte é ação, coragem e a forma como você vai atrás do que quer.",
  Júpiter: "Júpiter traz expansão, sorte e as áreas onde a vida pede pra crescer.",
  Saturno: "Saturno é maturidade, tempo e onde a vida pede estrutura.",
  Urano: "Urano é liberdade, ruptura e o que precisa mudar de repente.",
  Netuno: "Netuno é sonho, sensibilidade e conexão com algo maior.",
  Plutão: "Plutão é transformação profunda, poder e o que precisa morrer pra renascer.",
};

export function longMeaning(planet: PlanetPt, sign: string, retrograde: boolean): string {
  const role = PLANET_ROLE[planet];
  const short = TRANSIT_COPY[planet]?.[sign] ?? "";
  const retro = retrograde
    ? ` Como está retrógrado, é hora de revisitar temas de ${planet.toLowerCase()} em vez de acelerar: volta, revê, refaz.`
    : "";
  return `${role} Com ${planet} em ${sign}, essa energia ganha o tempero do signo: ${short.toLowerCase()} Observe onde na sua vida esse tema aparece hoje, é ali que o céu está pedindo atenção.${retro}`;
}
