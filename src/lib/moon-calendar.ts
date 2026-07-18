// Calendário oficial de fases da lua até dez/2027.
// Fonte: material enviado pela usuária. Datas em horário de Brasília (BRT, UTC-3).

export type MoonPhaseGroup = "nova" | "crescente" | "cheia" | "minguante";

export interface MoonCalendarEntry {
  /** ISO date, horário local BRT (UTC-3), sem hora exata (usamos 12:00). */
  date: string;
  fase: MoonPhaseGroup;
  signo: string;
  observacao: string;
}

// Helper pra escrever entradas de forma compacta. Mês/dia em BRT, hora 12:00.
function e(y: number, m: number, d: number, fase: MoonPhaseGroup, signo: string, observacao: string): MoonCalendarEntry {
  const iso = new Date(Date.UTC(y, m - 1, d, 15, 0, 0)).toISOString(); // 12:00 BRT = 15:00 UTC
  return { date: iso, fase, signo, observacao };
}

export const MOON_CALENDAR: MoonCalendarEntry[] = [
  // 2026
  e(2026, 7, 14, "nova", "Câncer", "Superlua em Câncer. Momento fértil pra plantar intenções ligadas ao lar, família e cuidado emocional."),
  e(2026, 7, 18, "crescente", "Virgem", "A energia começa a crescer. Organize a rotina e dê os primeiros passos práticos no que você plantou."),
  e(2026, 7, 21, "crescente", "Libra", "Foque em parcerias e diplomacia nos projetos."),
  e(2026, 7, 29, "cheia", "Aquário", "Clímax em projetos coletivos e ideias inovadoras."),
  e(2026, 8, 5, "minguante", "Touro", "Silencie e desapegue de teimosias ou gastos desnecessários."),
  e(2026, 8, 12, "nova", "Leão", "Eclipse Solar Total. Não inicie coisas importantes hoje. O dia pede introspecção para recalibrar seu brilho pessoal e propósitos."),
  e(2026, 8, 19, "crescente", "Escorpião", "Agir com estratégia, profundidade e foco total."),
  e(2026, 8, 28, "cheia", "Peixes", "Eclipse Lunar Parcial (visível no BR). Emoções intensas e transbordantes. Evite discussões e busque atividades terapêuticas."),
  e(2026, 9, 4, "minguante", "Gêmeos", "Desacelere a mente. Evite fofocas e excesso de telas."),
  e(2026, 9, 11, "nova", "Virgem", "Excelente para organizar a rotina, agenda e começar dietas."),
  e(2026, 9, 18, "crescente", "Sagitário", "Expanda horizontes, estude e planeje viagens com otimismo."),
  e(2026, 9, 26, "cheia", "Áries", "Cuidado com a impulsividade. Canalize a energia em exercícios físicos."),
  e(2026, 10, 3, "minguante", "Câncer", "Recolha-se no ambiente familiar. Período de autocuidado emocional."),
  e(2026, 10, 10, "nova", "Libra", "Ótimo para plantar intenções de harmonia nos relacionamentos."),
  e(2026, 10, 18, "crescente", "Capricórnio", "Estruture suas metas profissionais com seriedade."),
  e(2026, 10, 26, "cheia", "Touro", "Desfrute do conforto, mas cuidado com a possessividade."),
  e(2026, 11, 1, "minguante", "Leão", "Hora de diminuir o ego e dar espaço para os outros brilharem."),
  e(2026, 11, 9, "nova", "Escorpião", "Momento de transformação interna e investigação emocional."),
  e(2026, 11, 17, "crescente", "Aquário", "Invista em networking e em tecnologia para seus planos."),
  e(2026, 11, 24, "cheia", "Gêmeos", "Diálogos importantes vêm à tona. Cuidado com mal-entendidos."),
  e(2026, 12, 1, "minguante", "Virgem", "Faça aquela faxina de fim de ano (física e mental)."),
  e(2026, 12, 8, "nova", "Sagitário", "Renove a fé para o próximo ano. Trace grandes metas."),
  e(2026, 12, 17, "crescente", "Peixes", "Siga a intuição e dê asas à criatividade."),
  e(2026, 12, 23, "cheia", "Câncer", "Natal de emoções à flor da pele. Foco no acolhimento familiar."),
  e(2026, 12, 30, "minguante", "Libra", "Reveja suas relações e encerre o ano em paz com as pessoas."),
  // 2027
  e(2027, 1, 7, "nova", "Capricórnio", "Excelente para traçar as metas profissionais de longo prazo do ano."),
  e(2027, 1, 15, "crescente", "Áries", "Período de muita atitude e iniciativa individual."),
  e(2027, 1, 22, "cheia", "Câncer", "Culminância de assuntos familiares e íntimos."),
  e(2027, 1, 29, "minguante", "Escorpião", "Fase de profunda eliminação de mágoas e desapego."),
  e(2027, 2, 6, "cheia", "Leão", "Período de alta visibilidade e orgulho."),
  e(2027, 2, 13, "minguante", "Sagitário", "Momento de filtrar excessos de otimismo e focar na realidade."),
  e(2027, 2, 20, "nova", "Aquário", "Eclipse Solar Anular. Cuidado com radicalismos. O momento pede silêncio sobre planos futuros e desapego de rebeldias."),
  e(2027, 3, 4, "cheia", "Virgem", "Eclipse Lunar Total (Lua de Sangue). Muita atenção à saúde física e esgotamento mental. Evite o perfeccionismo excessivo."),
  e(2027, 3, 12, "minguante", "Touro", "Desacelere o ritmo material e financeiro."),
  e(2027, 3, 18, "nova", "Peixes", "Intuição altíssima. Excelente para meditação e rituais internos."),
  e(2027, 3, 26, "crescente", "Gêmeos", "Período movimentado para vendas, comércio e estudos."),
  e(2027, 4, 2, "cheia", "Libra", "Relacionamentos em pauta. Equilíbrio entre o eu e o outro."),
  e(2027, 4, 10, "minguante", "Gêmeos", "Limpeza mental. Evite o excesso de informações."),
  e(2027, 4, 16, "nova", "Áries", "O verdadeiro Ano Novo astrológico. Hora de dar o primeiro passo em projetos ousados."),
  e(2027, 4, 24, "crescente", "Sagitário", "Expansão de projetos acadêmicos e metas ousadas."),
  e(2027, 5, 1, "cheia", "Escorpião", "Crises e revelações profundas podem surgir. Mantenha a calma."),
  e(2027, 5, 10, "minguante", "Câncer", "Proteja sua energia em casa. Minimize o contato social exaustivo."),
  e(2027, 5, 16, "nova", "Touro", "Plantar estabilidade financeira e buscar conforto prático."),
  e(2027, 5, 24, "crescente", "Aquário", "Teste novas ideias e colabore em equipe."),
  e(2027, 5, 31, "cheia", "Sagitário", "Desejo de liberdade em alta. Cuidado com o dogmatismo."),
  e(2027, 6, 8, "minguante", "Peixes", "Excelente para o descanso da mente e sono reparador."),
  e(2027, 6, 14, "nova", "Gêmeos", "Escreva, estude e planeje novas formas de se comunicar."),
  e(2027, 6, 22, "crescente", "Peixes", "Use a imaginação para resolver problemas práticos."),
  e(2027, 6, 29, "cheia", "Capricórnio", "Culminância de esforços profissionais. Colheita de trabalho duro."),
  e(2027, 7, 7, "minguante", "Áries", "Hora de recuar e controlar a agressividade gerada pelo cansaço."),
  e(2027, 7, 14, "nova", "Câncer", "Superlua. Intuição e sensibilidade aguçadas. Excelente para cuidar do lar."),
  e(2027, 7, 21, "crescente", "Escorpião", "Força total para mudar estratégias que não estavam funcionando."),
  e(2027, 7, 28, "cheia", "Aquário", "Clímax em causas sociais ou projetos com tecnologia."),
  e(2027, 8, 5, "minguante", "Touro", "Fase excelente para organizar o orçamento doméstico."),
  e(2027, 8, 12, "nova", "Leão", "Eclipse Solar Total + Superlua. Um dos momentos astrológicos mais dramáticos do século. Forte impacto na autoexpressão e liderança. Fique recolhida e evite grandes decisões."),
  e(2027, 8, 19, "crescente", "Sagitário", "Impulso de crescimento após o período tenso do eclipse."),
  e(2027, 8, 26, "cheia", "Peixes", "Grande sensibilidade. Excelente para as artes e espiritualidade."),
  e(2027, 8, 31, "nova", "Virgem", "Superlua em Virgem. Momento poderoso para reorganizar rotina e saúde."),
  e(2027, 9, 4, "minguante", "Libra", "Momento de avaliar e reajustar contratos ou concessões excessivas."),
  e(2027, 9, 11, "nova", "Virgem", "Foque no minimalismo, na limpeza prática e na rotina de exercícios."),
  e(2027, 9, 18, "crescente", "Sagitário", "Busque mentores ou cursos para alavancar sua carreira."),
  e(2027, 9, 25, "cheia", "Áries", "Energia combativa. Direcione para a liderança construtiva."),
  e(2027, 10, 3, "minguante", "Escorpião", "Descarte mágoas acumuladas e objetos antigos sem uso."),
  e(2027, 10, 10, "nova", "Libra", "Plantar intenções de novos contratos e associações justas."),
  e(2027, 10, 17, "crescente", "Capricórnio", "Execução implacável de metas profissionais."),
  e(2027, 10, 24, "cheia", "Touro", "Excelente para colher frutos de investimentos financeiros."),
  e(2027, 10, 31, "minguante", "Leão", "Desapegue da necessidade neurótica de aprovação e aplausos."),
  e(2027, 11, 8, "nova", "Escorpião", "Fase de regeneração e mergulho no autoconhecimento profundo."),
  e(2027, 11, 15, "crescente", "Aquário", "Momento de diversificar suas frentes de atuação e inovação."),
  e(2027, 11, 22, "cheia", "Gêmeos", "Grande volume de informações e notícias vindo a público."),
  e(2027, 11, 29, "minguante", "Virgem", "Triagem e organização antes da correria do fim do ano."),
  e(2027, 12, 8, "nova", "Sagitário", "Expansão mental, renovação do otimismo."),
  e(2027, 12, 15, "crescente", "Peixes", "Conecte-se com causas humanitárias ou projetos artísticos."),
  e(2027, 12, 22, "cheia", "Câncer", "Emoções fortes ligadas às tradições e memórias do passado."),
  e(2027, 12, 29, "minguante", "Libra", "Fechamento do ano buscando equilíbrio e harmonia nas relações."),
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

/** Retorna a entrada de fase vigente (a mais recente já iniciada) e a próxima. */
export function getCurrentMoonPhase(now: Date = new Date()): {
  current: MoonCalendarEntry;
  next: MoonCalendarEntry | null;
} {
  const t = now.getTime();
  let idx = -1;
  for (let i = 0; i < MOON_CALENDAR.length; i++) {
    if (new Date(MOON_CALENDAR[i].date).getTime() <= t) idx = i;
    else break;
  }
  if (idx === -1) {
    return { current: MOON_CALENDAR[0], next: MOON_CALENDAR[1] ?? null };
  }
  return {
    current: MOON_CALENDAR[idx],
    next: MOON_CALENDAR[idx + 1] ?? null,
  };
}