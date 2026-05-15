const MENSAGENS = [
  "Hoje é dia de abrir espaço para coisas boas chegarem sem pedir licença. Que sua energia atraia encontros leves, ideias lindas e motivos bobos para sorrir.\nIntenção do dia: eu recebo com alegria tudo que combina com a minha melhor versão.",
  "Amiga, coloca uma música, ajeita a postura e lembra: sua energia também conversa com o universo. Vai para o dia como quem sabe que coisa boa pode acontecer a qualquer momento.\nIntenção do dia: eu atraio boas notícias, boas trocas e caminhos mais leves.",
  "Hoje, não espera a felicidade ficar gigante para comemorar. Celebra o cafezinho gostoso, a mensagem fofa, o sol entrando pela janela e cada microvitória.\nIntenção do dia: quanto mais eu agradeço, mais motivos lindos eu atraio.",
  "Seu brilho não precisa de permissão para aparecer. Vai com leveza, charme e aquela fé gostosa de quem sabe que merece viver dias melhores.\nIntenção do dia: eu sou um ímã para oportunidades que me fazem crescer e sorrir.",
  "Que hoje a vida te encontre disponível para o bom, o bonito e o inesperado. Respira fundo e entra no dia como quem abre a porta para uma fase mais leve.\nIntenção do dia: eu me alinho com alegrias simples, abundância e boas surpresas.",
  "Sabe aquele friozinho gostoso de quando algo bom tá pra acontecer? Carrega ele com você hoje, mesmo sem motivo aparente.\nIntenção do dia: eu confio que coisas lindas estão a caminho de mim.",
  "Acorda devagarinho, se espreguiça e fala bonito com você no espelho. O dia responde no mesmo tom em que a gente o cumprimenta.\nIntenção do dia: eu trato a mim mesma com o carinho que mereço receber do mundo.",
  "Hoje vale colocar a roupa que te faz sentir gostosa, mesmo se for só pra ficar em casa. A vibe muda quando a gente se escolhe primeiro.\nIntenção do dia: eu honro minha autoestima em cada pequeno gesto.",
  "Tem dia que a missão é só sorrir mais e cobrar menos. Solta a tensão dos ombros e deixa a vida fluir um pouquinho sem tanta planilha mental.\nIntenção do dia: eu me permito viver hoje com leveza e curiosidade.",
  "Olha em volta e percebe quanta coisa boa já é tua. Quanto mais você nota, mais o universo quer te mostrar.\nIntenção do dia: eu enxergo abundância em todos os cantinhos da minha vida.",
  "Que bom seria começar o dia escolhendo uma palavrinha boa pra repetir. Pode ser leveza, coragem, alegria, paz. Escolhe a tua e segue.\nIntenção do dia: minha energia hoje é alinhada com aquilo que eu quero atrair.",
  "Sabe aquela ideia que ficou cochichando no teu ouvido? Hoje dá um passinho pequeno em direção a ela, só pra mostrar que tu acredita.\nIntenção do dia: eu confio nas faíscas que nascem dentro de mim.",
  "Hoje a regra é: menos cobrança, mais admiração por você mesma. Olha o tanto que você já caminhou e ainda tem energia pra mais.\nIntenção do dia: eu reconheço minhas conquistas, mesmo as silenciosas.",
  "Bora deixar o dia te surpreender? Solta um pouquinho do controle e fica curiosa pra ver o que pode chegar de bonito.\nIntenção do dia: eu fico aberta a surpresas que vão me fazer sorrir.",
  "Respira gostoso, sente seus pés no chão e lembra: você é maior que qualquer preocupação que esteja no ar agora.\nIntenção do dia: eu volto pra mim sempre que precisar e sigo em paz.",
  "Que hoje seu coração vá leve, suas palavras sejam doces e suas escolhas combinem com a vida que você quer construir.\nIntenção do dia: eu escolho pensamentos e atitudes que me aproximam dos meus sonhos.",
  "Olha que linda essa chance de recomeçar sem precisar de virada de ano. Hoje pode ser teu marco zero, se você quiser.\nIntenção do dia: eu inicio agora um ciclo mais alinhado com o meu brilho.",
  "Tem alegria escondida nas pequenas coisas: o cheiro do café, uma risada inesperada, o céu mudando de cor. Repara mais hoje.\nIntenção do dia: eu colho beleza nos detalhes do meu dia.",
  "Você merece um dia em que dizer sim pra você não pareça egoísmo. Hoje pode ser esse dia.\nIntenção do dia: eu me coloco no topo da minha lista, com amor.",
  "Carrega no bolso a certeza de que tem espaço sim na sua vida pra mais coisa boa. O universo gosta de coração que sabe receber.\nIntenção do dia: eu acolho a abundância que vem na minha direção.",
  "Que hoje você seja tua melhor companhia. Da hora do banho ao café da tarde, fica de mãos dadas contigo mesma.\nIntenção do dia: eu sou meu lugar mais seguro e isso me deixa livre pra sonhar.",
  "Sabe quando a gente acorda e tudo parece um pouquinho mais possível? Hoje é convite pra esse estado.\nIntenção do dia: eu acredito que coisas lindas cabem na minha realidade.",
  "Dá pra ser delicada com você hoje? Menos voz dura, mais voz de amiga querida ali no fundo da tua mente.\nIntenção do dia: eu me trato com gentileza em todos os momentos.",
  "Hoje a meta é simples: deixar o dia ser bonito. Sem precisar resolver tudo, sem precisar provar nada.\nIntenção do dia: eu desfruto do agora e confio no que está por vir.",
  "Coloca um sorrisinho discreto no rosto, mesmo sem motivo. Você vai ver como o dia começa a te responder diferente.\nIntenção do dia: minha alegria abre portas por onde eu passo.",
  "Tem dia que pedir pouco também é pedir bonito. Hoje basta um momento gostoso, uma boa notícia, um respiro de paz.\nIntenção do dia: eu me alinho com momentos que enchem minha alma.",
  "Você pode até não saber qual é o próximo passo, mas saber se cuidar enquanto descobre já é um superpoder.\nIntenção do dia: eu confio no meu tempo e no meu caminho.",
  "Que tal hoje agradecer pelo que ainda nem chegou, mas você sente vindo? Esse é dos truques mais lindos da vida.\nIntenção do dia: eu agradeço antecipado pelas bênçãos que estão a caminho.",
  "Olha pra ti com mais carinho hoje. Você tá fazendo o melhor que consegue com o que tem, e isso já é muita coisa.\nIntenção do dia: eu honro o meu esforço e celebro a minha caminhada.",
  "Hoje deixa a vida te oferecer pequenas alegrias e tu aceita todas. Cafezinho, abraço, mensagem fofa, tudo conta.\nIntenção do dia: eu me permito receber alegria em qualquer formato.",
  "Que hoje você ouça menos a pressa e mais o teu ritmo. Florescer no tempo certo é luxo.\nIntenção do dia: eu confio no meu florescer e sigo em paz com o meu tempo.",
];

export function getDailyMessage(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / 86400000);
  return MENSAGENS[day % MENSAGENS.length];
}
