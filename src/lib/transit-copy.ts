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
    "Áries": "Vontade de começar aquilo que tava travado. Manda o primeiro e-mail, marca a consulta, dá o passo.",
    "Touro": "Dia pra cuidar da grana, do corpo e do que te dá prazer real, comida boa, banho demorado, contas em dia.",
    "Gêmeos": "Papo bom resolve mais que planilha hoje. Liga pra quem te faz pensar diferente.",
    "Câncer": "Foco na família, amigos mais chegados e no que te faz sentir seguro. Casa arrumada acalma a cabeça.",
    "Leão": "Aparece. Poste, mande o portfólio, use a roupa que tava guardando. Hoje é seu.",
    "Virgem": "Dia perfeito pra colocar a rotina em ordem, agenda, geladeira, caixa de entrada.",
    "Libra": "Charme e jogo de cintura abrem portas, use na reunião e no date.",
    "Escorpião": "Conversa difícil pede a verdade nua. Vai fundo sem drama.",
    "Sagitário": "Sai da bolha, um curso, um lugar novo, um livro fora do teu tema, já muda o dia.",
    "Capricórnio": "Constrói tijolo por tijolo. Uma tarefa chata resolvida hoje vale por dez semana que vem.",
    "Aquário": "Ideia doida que aparece agora, anota, semana que vem faz sentido.",
    "Peixes": "Tua sensibilidade tá lendo o ambiente melhor que qualquer análise. Confia no que sente.",
  },
  Lua: {
    "Áries": "Pavio curto. Respira fundo antes de responder aquela mensagem.",
    "Touro": "Corpo pedindo sofá, cobertor e comida gostosa. Se possível, atenda.",
    "Gêmeos": "Cabeça acelerada com mil abas abertas. Abre o bloco de notas e joga tudo fora.",
    "Câncer": "Coração puxando pra casa, família, amigos mais chegados. Liga pra quem tá na saudade.",
    "Leão": "Vontade de ser vista, elogiada, notada. Pode pedir, tá tudo bem.",
    "Virgem": "Faxina no armário, no celular ou nas conversas antigas. Tudo junto se possível.",
    "Libra": "Não aguenta briga hoje. Busca o meio termo, mas sem se anular.",
    "Escorpião": "Sente tudo em alto volume. Não empurra pra baixo do tapete.",
    "Sagitário": "Precisa de ar. Uma caminhada, um role sem hora pra voltar.",
    "Capricórnio": "Segura a emoção pra dar conta, mas depois se dá o espaço de sentir.",
    "Aquário": "Olha os próprios sentimentos meio de fora, sem drama. Ajuda a entender.",
    "Peixes": "Sonho da madrugada tá te dizendo algo. Anota assim que acordar.",
  },
  Mercúrio: {
    "Áries": "Fala reta, sem enrolar, só relê antes de mandar aquele áudio quente.",
    "Touro": "Pensa devagar, mas o que decide hoje fica de pé.",
    "Gêmeos": "Ótimo dia pra networking, entrevista, aula, tudo que envolve trocar ideia.",
    "Câncer": "Ligação pra mãe, pai, irmão, aquela amiga da vida, é o que ajusta o dia.",
    "Leão": "Boa pra apresentar projeto, pitch, aula. Se ouve bem no palco.",
    "Virgem": "Termina o que ficou pela metade, e-mail, planilha, texto parado no rascunho.",
    "Libra": "Renegocia prazo, valor, combinado, com jeitinho tudo se ajusta.",
    "Escorpião": "Lê nas entrelinhas do WhatsApp e do contrato. Percebe o que não foi dito.",
    "Sagitário": "Curiosidade puxa pra fora, tenta um assunto totalmente novo.",
    "Capricórnio": "Cabeça em modo estratégia. Planeja o mês, não só o dia.",
    "Aquário": "Sacadas vêm no banho ou dirigindo. Deixa o celular perto pra anotar.",
    "Peixes": "Escuta o silêncio, muita coisa se comunica sem palavra.",
  },
  Vênus: {
    "Áries": "Vontade de dar o primeiro passo no amor, chama pra sair, manda a mensagem.",
    "Touro": "Toque, cheiro, comida, música boa. Amor entra pelos sentidos hoje.",
    "Gêmeos": "Flerte de texto, papo gostoso, aquela troca leve que faz o dia render.",
    "Câncer": "Afeto de família, amigos mais chegados, jantar em casa vale mais que balada.",
    "Leão": "Se produz, se mostra, pede o elogio. Amor com um pouco de teatro é gostoso.",
    "Virgem": "Amor aparece no bilhetinho, no café pronto, no detalhe que ninguém mais nota.",
    "Libra": "Relações fluem. Bom dia pra DR, casamento, sociedade, tudo que envolve dois.",
    "Escorpião": "Vínculo intenso. Ou aprofunda, ou percebe o que já não cabe mais.",
    "Sagitário": "Amor com liberdade, viagem, aventura, gente de outro país, outro estilo.",
    "Capricórnio": "Compromisso real, DR madura, o \"vamos combinar direito\" pede pra acontecer.",
    "Aquário": "Amor que respeita espaço. Não segura ninguém pela mão à força.",
    "Peixes": "Romantiza tudo, só cuida pra não perder o pé da realidade.",
  },
  Marte: {
    "Áries": "Pilha total. Boa pra treino pesado, começar projeto, resolver o que tava enrolado.",
    "Touro": "Não vai rápido, mas não para. Persistência hoje é a arma.",
    "Gêmeos": "Faz três coisas ao mesmo tempo e ainda sobra fôlego. Só cuida pra não dispersar.",
    "Câncer": "Defende família, amigos mais chegados, sua casa. Não engole sapo por educação.",
    "Leão": "Lidera o grupo, chama pra reunião, toma a frente. As pessoas te seguem hoje.",
    "Virgem": "Foco laser em execução. Lista de tarefas some numa manhã.",
    "Libra": "Age em dupla. Sozinha rende metade, com alguém rende dobrado.",
    "Escorpião": "Energia pra transformar, não pra brigar. Guarda o pavio, usa a estratégia.",
    "Sagitário": "Corpo pedindo movimento, corre, viaja, sai da cadeira.",
    "Capricórnio": "Disciplina rendendo. Aquilo que exige constância anda hoje.",
    "Aquário": "Age por uma causa, um coletivo, uma ideia maior que você.",
    "Peixes": "Movimento suave, mas certeiro. Nada de força bruta hoje.",
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
