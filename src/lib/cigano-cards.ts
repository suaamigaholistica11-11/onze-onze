// 36 cartas do baralho cigano (Lenormand tradicional) com significados curtos.
export type CiganoCard = { n: number; nome: string; sig: string };

export const CIGANO_CARDS: CiganoCard[] = [
  { n: 1, nome: "Cavaleiro", sig: "Notícia chegando, movimento novo." },
  { n: 2, nome: "Trevo", sig: "Sorte pequena, alegria breve." },
  { n: 3, nome: "Navio", sig: "Viagem, mudança, longa distância." },
  { n: 4, nome: "Casa", sig: "Lar, estabilidade, família." },
  { n: 5, nome: "Árvore", sig: "Saúde, raízes, tempo." },
  { n: 6, nome: "Nuvens", sig: "Confusão, dúvida passageira." },
  { n: 7, nome: "Cobra", sig: "Cuidado, alguém age nos bastidores." },
  { n: 8, nome: "Caixão", sig: "Fim de ciclo, transformação." },
  { n: 9, nome: "Buquê", sig: "Presente, gentileza, sim." },
  { n: 10, nome: "Foice", sig: "Corte necessário, decisão firme." },
  { n: 11, nome: "Chicote", sig: "Discussão, atrito, repetição." },
  { n: 12, nome: "Pássaros", sig: "Conversas, ansiedade, dupla." },
  { n: 13, nome: "Criança", sig: "Começo, ingenuidade, novidade." },
  { n: 14, nome: "Raposa", sig: "Esperteza, atenção ao trabalho." },
  { n: 15, nome: "Urso", sig: "Força, autoridade, dinheiro." },
  { n: 16, nome: "Estrelas", sig: "Esperança, inspiração, sucesso." },
  { n: 17, nome: "Cegonha", sig: "Mudança boa, chegada." },
  { n: 18, nome: "Cão", sig: "Amizade fiel, lealdade." },
  { n: 19, nome: "Torre", sig: "Solidão, instituição, distância." },
  { n: 20, nome: "Jardim", sig: "Público, encontro, redes." },
  { n: 21, nome: "Montanha", sig: "Bloqueio, atraso, obstáculo." },
  { n: 22, nome: "Caminhos", sig: "Escolha, dois lados." },
  { n: 23, nome: "Ratos", sig: "Perda, desgaste, corrosão." },
  { n: 24, nome: "Coração", sig: "Amor, afeto, alegria sincera." },
  { n: 25, nome: "Anel", sig: "Compromisso, acordo, ciclo." },
  { n: 26, nome: "Livro", sig: "Segredo, estudo, mistério." },
  { n: 27, nome: "Carta", sig: "Mensagem, documento, aviso." },
  { n: 28, nome: "Homem", sig: "Figura masculina, o consulente ele." },
  { n: 29, nome: "Mulher", sig: "Figura feminina, a consulente ela." },
  { n: 30, nome: "Lírios", sig: "Paz, maturidade, harmonia." },
  { n: 31, nome: "Sol", sig: "Vitória, luz, sim brilhante." },
  { n: 32, nome: "Lua", sig: "Emoção, reconhecimento, intuição." },
  { n: 33, nome: "Chave", sig: "Solução, certeza, abertura." },
  { n: 34, nome: "Peixes", sig: "Fluxo, dinheiro, abundância." },
  { n: 35, nome: "Âncora", sig: "Firmeza, trabalho, estabilidade." },
  { n: 36, nome: "Cruz", sig: "Provação, fé, karma." },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
