import type { MoonPhaseKey } from "./moon-phases";
import { SIGN_ELEMENT, type Element } from "./elements";

export type RitualPhaseGroup = "nova" | "crescente" | "cheia" | "minguante";

export function groupFromPhase(key: MoonPhaseKey): RitualPhaseGroup {
  if (key === "nova") return "nova";
  if (key === "cheia") return "cheia";
  if (key === "crescente_iluminante" || key === "quarto_crescente" || key === "gibosa_crescente")
    return "crescente";
  return "minguante";
}

export const PHASE_GROUP_LABEL: Record<RitualPhaseGroup, string> = {
  nova: "Lua Nova",
  crescente: "Lua Crescente",
  cheia: "Lua Cheia",
  minguante: "Lua Minguante",
};

export const PHASE_ENERGY: Record<RitualPhaseGroup, string> = {
  nova: "novos ciclos e a chance de plantar intenções pro que ainda nem tem nome",
  crescente: "crescimento e expansão do que já tá brotando aí na sua vida",
  cheia: "magnetismo, abundância e intuição em alta",
  minguante: "limpeza, desapego e o encerramento gostoso de tudo que já cumpriu seu papel",
};

export const ELEMENT_FOCUS: Record<Element, string> = {
  Fogo: "ação, coragem e criatividade",
  Terra: "estabilidade, segurança, prosperidade material e cuidado com o corpo",
  Ar: "pensamentos, comunicação e clareza mental",
  Água: "emoções, intuição, cura e sensibilidade",
};

export const ELEMENT_PROJECT_HINT: Record<Element, string> = {
  Fogo: "que pedem coragem e atitude",
  Terra: "de médio prazo, pra dar tempo de executar com calma e persistência",
  Ar: "que envolvam estudo, conversas importantes e organização de ideias",
  Água: "que mexam com o emocional e fortaleçam vínculos",
};

export interface Banho {
  nome: string;
  ingredientes: string;
  afirmacao: string;
  sensacao: string;
  substituicoes?: string;
}

export const BANHOS: Record<RitualPhaseGroup, Banho[]> = {
  nova: [
    {
      nome: "Banho de Renovação",
      ingredientes: "alecrim + hortelã + 1L de água",
      afirmacao: "Abro espaço para o novo e atraio boas oportunidades.",
      sensacao: "frescor, clareza e motivação",
      substituicoes: "alecrim por hortelã, manjericão por orégano fresco",
    },
    {
      nome: "Banho de Intenções",
      ingredientes: "3 folhas de louro + manjericão + 1L de água",
      afirmacao: "Minhas intenções estão firmes. O universo conspira ao meu favor.",
      sensacao: "esperança, foco e direcionamento",
    },
  ],
  crescente: [
    {
      nome: "Banho de Prosperidade",
      ingredientes: "1 pau de canela + 3 folhas de louro + 1L de água",
      afirmacao: "Tudo o que planto cresce com abundância.",
      sensacao: "confiança e expansão",
      substituicoes: "canela por noz-moscada, louro por alecrim",
    },
    {
      nome: "Banho de Expansão",
      ingredientes: "pétalas de girassol + 1 pau de canela + 1L de água",
      afirmacao: "Minha vida se expande em todas as direções.",
      sensacao: "entusiasmo e abertura de caminhos",
      substituicoes: "girassol por calêndula",
    },
  ],
  cheia: [
    {
      nome: "Banho de Abundância",
      ingredientes: "pétalas de rosas vermelhas ou amarelas + 1 colher de mel + 1L de água",
      afirmacao: "Sou abundância. Atraio prosperidade e alegria.",
      sensacao: "magnetismo e plenitude",
      substituicoes: "rosas por hibisco, mel por açúcar mascavo",
    },
    {
      nome: "Banho de Amor",
      ingredientes: "pétalas de rosas vermelhas + alfazema + 1L de água",
      afirmacao: "Eu sou amor. Atraio conexões verdadeiras.",
      sensacao: "autoestima elevada e equilíbrio emocional",
      substituicoes: "rosas por hibisco, alfazema por lavanda",
    },
    {
      nome: "Banho de Prosperidade Lunar",
      ingredientes: "pétalas de girassol + 1 colher de mel + 1L de água",
      afirmacao: "Celebro a vida e recebo prosperidade em plenitude.",
      sensacao: "fartura, confiança e brilho pessoal",
    },
  ],
  minguante: [
    {
      nome: "Banho de Limpeza",
      ingredientes: "arruda + 2 colheres de sal grosso + 1L de água",
      afirmacao: "Minha energia está limpa, leve e protegida.",
      sensacao: "alívio e limpeza profunda",
      substituicoes: "arruda por levante, sal grosso por sal marinho",
    },
    {
      nome: "Banho de Desapego",
      ingredientes: "guiné + folhas de sálvia + 1L de água",
      afirmacao: "Eu solto o que não me serve.",
      sensacao: "leveza e liberdade emocional",
      substituicoes: "guiné por espada-de-são-jorge, sálvia por alecrim",
    },
  ],
};

export function buildContextMessage(group: RitualPhaseGroup, signo: string): string {
  const element = SIGN_ELEMENT[signo] ?? "Terra";
  const fase = PHASE_GROUP_LABEL[group];
  const energia = PHASE_ENERGY[group];
  const focoEl = ELEMENT_FOCUS[element];
  const projHint = ELEMENT_PROJECT_HINT[element];

  return (
    `A ${fase} em ${signo} chegou e com ela a vontade de fazer um ritualzinho gostoso, né? ` +
    `Essa fase traz ${energia}, e ${signo}, sendo um signo do elemento ${element}, ` +
    `indica que você pode focar em projetos ${projHint}. ` +
    `Como ${element} pede ${focoEl}, aproveita pra escolher uma intenção pra essa área, ` +
    `seja amor, trabalho, corpo ou finanças. Escolhe uma intenção e vem comigo, amiga!`
  );
}