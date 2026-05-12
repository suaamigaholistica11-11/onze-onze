import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SIGNS = [
  "Capricórnio", "Aquário", "Peixes", "Áries", "Touro", "Gêmeos",
  "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário",
] as const;

function sunSign(date: Date): string {
  // Approximate sun sign cutoffs
  const md = (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
  const cuts = [120, 219, 320, 420, 521, 621, 722, 823, 923, 1023, 1122, 1222];
  const names = ["Capricórnio","Aquário","Peixes","Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário"];
  for (let i = 0; i < cuts.length; i++) if (md <= cuts[i]) return names[i];
  return "Capricórnio";
}

const inputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  birthDate: z.string().min(8),
  birthTime: z.string().min(4),
  birthPlace: z.string().trim().min(1).max(120),
});

export const generateNatalChart = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY missing");
    }

    const date = new Date(`${data.birthDate}T${data.birthTime}:00`);
    const sun = sunSign(date);

    const prompt = `Você é uma astróloga acolhedora que escreve em português do Brasil com tom inspirador e leve (estilo revista Capricho), sem ser infantil.

Dados de nascimento:
- Nome: ${data.name}
- Data: ${data.birthDate}
- Hora: ${data.birthTime}
- Local: ${data.birthPlace}
- Signo solar (já calculado): ${sun}

Gere um JSON com a estrutura exata:
{
  "sun": { "sign": "${sun}", "house": "<número de casa, 1-12>", "description": "<frase curta sobre o Sol>" },
  "moon": { "sign": "<signo>", "house": "<1-12>", "description": "<frase curta>" },
  "ascendant": { "sign": "<signo>", "description": "<frase curta>" },
  "planets": [
    { "name": "Mercúrio", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Vênus", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Marte", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Júpiter", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Saturno", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Urano", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Netuno", "sign": "<signo>", "house": "<1-12>" },
    { "name": "Plutão", "sign": "<signo>", "house": "<1-12>" }
  ],
  "personality": "<texto curto de 3-4 frases descrevendo a pessoa com profundidade usando as energias do Sol, Lua e Ascendente combinadas>"
}

Seja precisa nas posições baseando-se nos dados (não invente — use seu conhecimento astrológico). Se a hora ou local exatos forem ambíguos, faça a melhor estimativa.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("AI error", res.status, txt);
      throw new Error(`AI gateway error ${res.status}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON");
    }
    return parsed;
  });

export type NatalChartData = {
  sun: { sign: string; house: string; description: string };
  moon: { sign: string; house: string; description: string };
  ascendant: { sign: string; description: string };
  planets: Array<{ name: string; sign: string; house: string }>;
  personality: string;
};