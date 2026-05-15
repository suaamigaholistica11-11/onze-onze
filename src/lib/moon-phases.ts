// Fases da Lua, descrições no tom onze-onze (inspirado em personare e astrolink).
// Cada fase dura ~3,7 dias dentro do ciclo lunar de ~29,5 dias.

export type MoonPhaseKey =
  | "nova"
  | "crescente_iluminante"
  | "quarto_crescente"
  | "gibosa_crescente"
  | "cheia"
  | "gibosa_minguante"
  | "quarto_minguante"
  | "minguante_balsamica";

export interface MoonPhaseInfo {
  key: MoonPhaseKey;
  nome: string;
  glyph: string;
  energia: string;
  significado: string;
  pratica: string;
}

export const MOON_PHASES: MoonPhaseInfo[] = [
  {
    key: "nova",
    nome: "Lua Nova",
    glyph: "🌑",
    energia: "recomeço · semente · silêncio",
    significado:
      "A Lua Nova é o instante mais escuro do ciclo, quando o céu se aquieta pra que algo novo possa nascer. É um portal pra plantar intenções, escrever desejos e abraçar o que ainda é invisível dentro de você.",
    pratica:
      "Reserva um momentinho de silêncio. Escreve 3 intenções pros próximos 28 dias, sem cobrança, só pedindo.",
  },
  {
    key: "crescente_iluminante",
    nome: "Lua Crescente Iluminante",
    glyph: "🌒",
    energia: "impulso · coragem · primeiros passos",
    significado:
      "A luz começa a aparecer e suas intenções pedem ação. É hora do primeiro passo: pequeno, real, possível. A semente tá brotando devagar.",
    pratica:
      "Escolhe uma intenção da Lua Nova e dá uma ação concreta hoje, mesmo que mínima.",
  },
  {
    key: "quarto_crescente",
    nome: "Quarto Crescente",
    glyph: "🌓",
    energia: "decisão · ajuste · resistência",
    significado:
      "Metade do caminho até a plenitude. Aqui aparecem os primeiros desafios e dúvidas: não pra te parar, mas pra fortalecer o que tá sendo construído. É hora de ajustar a rota.",
    pratica:
      "Olha pras suas intenções: o que precisa de ajuste? Diz sim só pro que tá alinhado.",
  },
  {
    key: "gibosa_crescente",
    nome: "Lua Gibosa Crescente",
    glyph: "🌔",
    energia: "refinamento · paciência · confiança",
    significado:
      "A Lua se aproxima da Cheia e tudo amadurece. É tempo de refinar detalhes, confiar no processo e cuidar do que já tá em movimento, sem querer apressar.",
    pratica:
      "Revisa seu progresso com gentileza. Celebra o caminho, não só o destino.",
  },
  {
    key: "cheia",
    nome: "Lua Cheia",
    glyph: "🌕",
    energia: "plenitude · revelação · entrega",
    significado:
      "A Lua brilha inteira e ilumina tudo o que estava escondido: emoções, verdades, encontros. É um clímax energético, tempo de colher, agradecer e também de soltar o que não cabe mais.",
    pratica:
      "Acende uma vela. Agradece em voz alta. Solta por escrito o que precisa ir embora.",
  },
  {
    key: "gibosa_minguante",
    nome: "Lua Gibosa Minguante",
    glyph: "🌖",
    energia: "integração · partilha · sabedoria",
    significado:
      "Depois da Cheia, a Lua começa a recolher a luz. É hora de digerir o que foi vivido, integrar aprendizados e compartilhar com quem caminha junto.",
    pratica:
      "Conta pra alguém de confiança o que essa lunação te ensinou. Anota no teu caderno.",
  },
  {
    key: "quarto_minguante",
    nome: "Quarto Minguante",
    glyph: "🌗",
    energia: "soltura · perdão · limpeza",
    significado:
      "A Lua pede desapego. Tudo o que pesa, atrasa ou já cumpriu seu papel tá sendo convidado a ir embora. É um tempo fértil pra perdoar (você inclusive) e abrir espaço.",
    pratica:
      "Faz uma faxina simbólica: uma gaveta, uma conversa pendente, uma crença antiga.",
  },
  {
    key: "minguante_balsamica",
    nome: "Lua Minguante Bálsamica",
    glyph: "🌘",
    energia: "descanso · introspecção · escuta",
    significado:
      "Os últimos dias antes da próxima Lua Nova. A energia tá baixa, e isso é sagrado. É o vazio fértil que precede a semente. Descansa, escuta, sonha.",
    pratica:
      "Dorme mais. Reduz compromissos. Se permite não produzir nada hoje.",
  },
];

/**
 * Recebe o ângulo de fase lunar (0-360), onde 0 = Nova, 90 = Quarto Crescente,
 * 180 = Cheia, 270 = Quarto Minguante, e retorna a fase correspondente.
 */
export function phaseFromAngle(angle: number): MoonPhaseInfo {
  const a = ((angle % 360) + 360) % 360;
  // Janelas estreitas (~±2° ≈ ±4h) para os 4 marcos exatos.
  // Fora delas, retorna a fase de transição correspondente.
  if (a < 2 || a >= 358) return MOON_PHASES[0]; // Nova (exata)
  if (a < 88) return MOON_PHASES[1]; // Crescente Iluminante
  if (a < 92) return MOON_PHASES[2]; // Quarto Crescente (exato)
  if (a < 178) return MOON_PHASES[3]; // Gibosa Crescente
  if (a < 182) return MOON_PHASES[4]; // Cheia (exata)
  if (a < 268) return MOON_PHASES[5]; // Gibosa Minguante
  if (a < 272) return MOON_PHASES[6]; // Quarto Minguante (exato)
  return MOON_PHASES[7]; // Bálsamica
}

/** Marcos principais do ciclo: Nova, Crescente, Cheia, Minguante (em graus). */
export const PHASE_MILESTONES: Array<{ angle: number; nome: string; glyph: string }> = [
  { angle: 0, nome: "Lua Nova", glyph: "🌑" },
  { angle: 90, nome: "Quarto Crescente", glyph: "🌓" },
  { angle: 180, nome: "Lua Cheia", glyph: "🌕" },
  { angle: 270, nome: "Quarto Minguante", glyph: "🌗" },
];