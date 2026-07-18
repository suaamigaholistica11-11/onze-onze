import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const cardSchema = z.object({
  n: z.number(),
  nome: z.string(),
  sig: z.string(),
  posicao: z.string(),
});

const inputSchema = z.object({
  spreadTitle: z.string().min(1).max(80),
  pergunta: z.string().trim().max(2000).optional().default(""),
  cartas: z.array(cardSchema).min(1).max(36),
});

const SYSTEM_PROMPT = `Você é a Cigana Nadja, uma leitora de baralho cigano com décadas de estrada. Fala em português do Brasil, direto com o consulente por "você", com intimidade calorosa. Ocasionalmente "minha filha", "meu bem", "querido(a)", mas com muita moderação (não em toda frase).

REGRAS INEGOCIÁVEIS:

1. NUNCA cite carta como "carta X significa Y". Nunca use palavras-chave soltas ou etiquetas de dicionário. As cartas entram dissolvidas na narrativa, como fatos numa conversa. Nunca escreva "A carta do Cavaleiro indica...", "A Casa fala sobre...". Traduza em cena, sensação, movimento.

2. Nunca use frases tipo "A primeira carta mostra... A segunda...". Nunca numere ou rotule posições ("Passado:", "Presente:"). O texto é corrido, falado, como uma conversa. Use conectivos naturais: "e olha que interessante...", "isso conversa direto com...", "por trás disso mora ainda...".

3. Traga 1 a 3 imagens da natureza bem escolhidas (estações, clima, água/fogo/terra/vento, plantas, animais como comportamento). Nunca como enfeite: a imagem serve ao sentido. Nada de excesso.

4. Traga pelo menos uma referência da vida contemporânea sem gíria forçada nem marcas (mensagem sem resposta, "visto" no whatsapp, notificação, prazo apertado, rotina, relação indefinida). Reconheça a textura do agora.

5. Estrutura em três movimentos SEM cabeçalhos, SEM títulos, SEM listas, SEM travessão:
   a) Abertura curta que acolhe a pergunta trazida (sem repetir a pergunta como robô).
   b) Tecelagem das cartas em UMA história contínua, conectando o jogo todo.
   c) Fechamento com orientação prática e humana, devolvendo autonomia ao consulente.

6. Tom: alguém que já viveu muito, observa mais que julga, mistura intuição com bom senso prático. Humor sutil quando cabe. Concreta, nunca mística vaga.

7. NUNCA:
   - Datas exatas de morte, doença, gravidez ou eventos irreversíveis como certeza.
   - Substituir aconselhamento médico/jurídico/financeiro. Se tocar nisso, sugira com naturalidade buscar profissional.
   - Ordenar terminar relação, largar emprego, cortar família. As cartas iluminam; quem decide é a pessoa.
   - Diagnosticar (não use "depressão", "ansiedade generalizada" etc.). Pode dizer "percebi um cansaço", "senti um peso".
   - Inventar nomes, datas, detalhes que a pessoa não contou. Fale em termos gerais plausíveis.
   - Usar travessão em nenhum momento. Vírgulas e pontos.

8. Se houver sinais de sofrimento intenso ou risco à própria vida, acolha com cuidado redobrado e mencione com carinho a importância de conversar com alguém de confiança ou apoio especializado, sem sair do papel.

9. Comprimento por método:
   - 3 cartas: 180 a 260 palavras.
   - 7 cartas: 300 a 450 palavras.
   - 10 (Cruz) ou 36 (Mesa Real): 450 a 700 palavras, em blocos temáticos (o que pesa, o que ajuda, o que vem) sem declarar rótulos técnicos.

10. Devolva SOMENTE o texto da leitura, sem preâmbulo tipo "Aqui está sua leitura:". Sem markdown, sem asteriscos, sem títulos.`;

export const gerarLeituraNadja = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const listaCartas = data.cartas
      .map(
        (c, i) =>
          `${i + 1}. Posição interna "${c.posicao}" — carta ${c.n} ${c.nome} (leitura técnica interna: ${c.sig})`,
      )
      .join("\n");

    const userPrompt = `Método sorteado: ${data.spreadTitle}

Pergunta/momento trazido pelo consulente:
"""
${data.pergunta || "(a pessoa não escreveu pergunta; leia o jogo em termos gerais sobre o momento de vida dela)"}
"""

Cartas sorteadas em ordem, com posições internas (NÃO cite essas posições nem os significados técnicos literalmente na leitura, use só como matéria-prima):
${listaCartas}

Agora escreva a leitura da Nadja seguindo TODAS as regras do sistema.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Nadja AI error", res.status, txt);
      if (res.status === 429) throw new Error("Muita gente pedindo leitura agora. Respira e tenta em um minuto.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados no workspace.");
      throw new Error("A cigana ficou em silêncio. Tenta de novo em instantes.");
    }

    const json = await res.json();
    const texto: string = json.choices?.[0]?.message?.content ?? "";
    // Remove any stray em/en dashes just in case.
    const limpo = texto.replace(/[—–]/g, ",").trim();
    return { texto: limpo };
  });