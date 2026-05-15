const MENSAGENS = [
  "Já ouviu falar que cada dia é uma tela em branco? Por aqui a gente não vê exataaameente assim. Cada dia é uma chance de continuar cultivando o que importa. Se tá meio perdida, para um pouquinho e se pergunta: o que eu quero seguir e o que já posso soltar? ✨",
  "Olha, esse negócio de 'segunda começa amanhã' já era. O recomeço acontece toda vez que você respira fundo e escolhe de novo. E pode ser agora, no meio do café, sem precisar de discurso bonito. Só o teu sim importa.",
  "Spoiler do dia: o universo não tá te testando, ele tá te treinando. Cada coisinha chata é tipo agachamento da alma. Chato no meio, mas você sai mais forte do outro lado. Bora?",
  "Sabe aquela vontade de resolver tudo de uma vez? Hoje libera ela do plantão. Faz uma coisa de cada vez, com carinho. A pressa rouba o sabor das pequenas vitórias, e você merece sentir cada uma.",
  "Hoje é oficialmente dia de torcer por você. Sim, por você mesma. Se você for a tua maior fã, fica bem mais fácil aguentar quando o mundo lá fora tiver opinião demais.",
  "A vida tá rearranjando umas peças nos bastidores, dá um voto de confiança. Às vezes o que parece atraso é só o universo ajustando o roteiro pra te entregar algo melhor do que você tava pedindo.",
  "Tá meio perdida hoje? Calma, isso também faz parte. Não é todo dia que vem com mapa. Às vezes a gente precisa só dar o próximo passo e descobrir o caminho enquanto anda. Confia.",
  "Recadinho do dia: você não precisa estar 100% pra fazer algo lindo acontecer. Faz com o que você tem hoje, do jeito que dá. Perfeição é tédio, autenticidade é magia.",
  "Olha, a tua intuição não tá te enrolando, sabia? Aquele 'sinto que é por aqui' geralmente tem mais razão que mil planilhas. Escuta com calma, ela só fala baixinho porque é educada.",
  "Permissão concedida pra hoje ser leve. Sério, leve mesmo. Não precisa carregar problema dos outros, nem cobrança que nem é tua. Devolve com amor e segue dançando.",
  "Sabe aquela coisa que você tá adiando há semanas? Hoje pode ser o dia do passinho minúsculo. Não precisa terminar, só começar. Cinco minutinhos de coragem já mudam tudo.",
  "A vida não é uma corrida, é uma playlist. Tem música pra dançar, tem pra chorar no chuveiro, tem pra olhar pela janela. Hoje deixa tocar a que combina com você, sem culpa.",
  "Lembrete carinhoso: você não tá atrasada na vida. Esse cronograma comparativo da internet é mentira. Cada uma floresce no seu tempo, e o teu tá acontecendo agora, mesmo que você não veja.",
  "Hoje a missão é simples: ser gentil contigo. Trata você como trataria uma amiga querida. Dá colo, faz uma comidinha boa, fala bonito no espelho. Você merece esse cuidado todo.",
  "Já reparou que coragem não é ausência de medo, é dar o passo com a mãozinha tremendo? Hoje, mesmo que dê friozinho na barriga, faz aquilo. Depois a gente comemora junto.",
  "A energia tá meio bagunçada por aí, mas a tua casinha interna você organiza. Respira fundo, faz uma faxina nas preocupações que não são tuas e abre espaço pra coisa boa entrar.",
  "Dica de amiga: deixa de comparar a tua cozinha bagunçada com o feed de festa dos outros. Todo mundo tem dia ruim, todo mundo tem louça acumulada. Você não tá sozinha nessa.",
  "Hoje vale soltar o que não te leva pra lugar nenhum. Pensamento velho, conversa repetida, plano que já não combina mais. Faz uma reciclagem afetiva e abre espaço pra novidade.",
  "Sabe o que é luxo? Ter calma. Em mundo de pressa, ir no teu ritmo é ato de rebeldia. Hoje se permite ser devagar quando precisar e rápida só quando fizer sentido pra você.",
  "A vida tá te mandando sinais o tempo todo, mas precisa de silêncio pra escutar. Tira 5 minutinhos hoje pra não fazer nada. Só observar. Vai ver que o recado já tava ali.",
  "Pequeno aviso do céu: o teu brilho não ofusca o de ninguém. Tem espaço pra todo mundo brilhar. Então deixa de se diminuir pra caber em ambiente que não te merece.",
  "Hoje é bom dia pra falar 'não' com amor. Sabe aquele compromisso que te suga só de pensar? Cancela. Sua energia é teu bem mais precioso, gasta com quem e com o que faz sentido.",
  "Olha, tudo que floresce primeiro foi cuidado. Você também. Lembra disso quando vier aquela sensação de que não tá rendendo. Crescer por dentro não aparece em planilha, mas conta muito.",
  "Hoje é dia de confiar no processo, mesmo sem ver o resultado. As coisas mais bonitas demoram pra ficar prontas. Você tá no meio do caminho, e isso já é motivo de orgulho.",
  "Recado do dia: não tem nada de errado em recomeçar. Pelo contrário, é o esporte oficial de quem tá viva. Cai, levanta, sacode a roupinha, segue. Com leveza e bom humor.",
  "Permissão pra ser feliz hoje, mesmo com tudo meio incompleto. Felicidade não é um troféu lá no fim, é o gostinho da xícara quentinha agora. Não espera tudo dar certo pra sentir.",
  "Sabe aquele teu jeitinho único? Mantém. O mundo tá cheio de cópia, mas só uma pessoa pensa, ri e ama do teu jeito. Não troca essa originalidade por aprovação de ninguém.",
  "Hoje deixa a tua intuição dar pitaco nas decisões. Aquele 'algo me diz que…' geralmente sabe mais do que parece. Confia, ela tá olhando por você há mais tempo do que você imagina.",
  "Plano pra hoje: fazer uma coisa só por prazer. Sem produtividade, sem justificativa, só porque te faz bem. A vida não é só lista de tarefas, viu? É também tomar sol e olhar o nada.",
  "Lembrete de hoje: você não precisa estar pronta pra começar, precisa começar pra ficar pronta. Espera demais e a vida passa. Faz com o que você tem hoje, ajeita o resto no caminho.",
  "Dose dupla de carinho hoje: pra ti e pra quem cruzar contigo. O mundo tá precisando muito de gente que escuta de verdade e abraça forte. Você pode ser essa pessoa. Já é, na real.",
];

export function getDailyMessage(date = new Date()) {
  // Mesmo dia → mesma mensagem.
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / 86400000);
  return MENSAGENS[day % MENSAGENS.length];
}