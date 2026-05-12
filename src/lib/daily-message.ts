const MENSAGENS = [
  "Confie no tempo das coisas — o que é seu chega no momento certo.",
  "Hoje é um bom dia pra plantar uma semente do seu futuro.",
  "Você é a única pessoa que pode dar permissão pra brilhar do seu jeito.",
  "A vida tá rearranjando peças pra te entregar algo melhor.",
  "Pequenos passos diários constroem grandes mudanças. Continue.",
  "O universo conspira a favor de quem se move com intenção.",
  "Permita-se ser surpreendida pela própria coragem hoje.",
  "Seu único trabalho hoje é se cuidar com gentileza.",
  "Tudo o que você precisa já mora dentro de você. Só lembre.",
  "Respira. Confia. Recomeça quantas vezes precisar.",
  "A magia tá nos detalhes que ninguém vê — mas você sente.",
  "Você não tá atrasada. Tá no seu tempo. E ele é perfeito.",
  "Faz hoje o que o teu eu de amanhã vai agradecer.",
  "O sim que você precisa pode começar com um não pra outra coisa.",
  "Sua intuição não mente. Escuta com calma.",
  "Cada dia é uma página em branco — escreve com intenção.",
  "Você é maior que o pior dos seus dias. Sempre foi.",
  "Hoje, sorri por você. Sem motivo. Só porque você merece.",
  "Energia limpa atrai vida limpa. Faz uma faxina interna.",
  "Acredita: o melhor de você ainda tá por vir.",
  "Coragem é dar um passo mesmo com a voz tremendo.",
  "Quem confia no próprio brilho não compete com ninguém.",
  "Hoje é dia de soltar o que não te leva pra lugar nenhum.",
  "Você tem permissão pra ser feliz exatamente como é.",
  "Tudo o que floresce, primeiro foi cuidado. Inclusive você.",
  "O presente é o único lugar onde a vida acontece. Volta pra ele.",
  "Diga sim pra si mesma com a mesma facilidade que diz aos outros.",
  "A leveza não é ausência de problemas — é confiança no caminho.",
  "Você não precisa de tudo pronto pra começar. Começa.",
  "Te desejo um dia bonito por dentro. O fora vem depois.",
];

export function getDailyMessage(date = new Date()) {
  // Mesmo dia → mesma mensagem.
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / 86400000);
  return MENSAGENS[day % MENSAGENS.length];
}