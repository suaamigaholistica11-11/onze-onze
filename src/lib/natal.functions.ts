import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchProkeralaNatal } from "./prokerala.server";
import { geocodePlace, lookupTimezone } from "./prokerala.server";
import { computeAscendant } from "./ascendant";
import { computeBodies } from "./planets";

const SIGNS = [
  "Capricórnio", "Aquário", "Peixes", "Áries", "Touro", "Gêmeos",
  "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário",
] as const;

function sunSign(date: Date): string {
  // Approximate sun sign cutoffs (use local date, matches user input)
  const md = (date.getMonth() + 1) * 100 + date.getDate();
  const cuts = [120, 219, 320, 420, 521, 621, 722, 823, 923, 1023, 1122, 1222];
  const names = ["Capricórnio","Aquário","Peixes","Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário"];
  for (let i = 0; i < cuts.length; i++) if (md <= cuts[i]) return names[i];
  return "Capricórnio";
}

const inputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  birthDate: z.string().min(8),
  birthTime: z.string().min(4),
  birthPlace: z.string().trim().min(1).max(300),
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

    const prompt = `Você é uma astróloga sensível e moderna que escreve em português do Brasil. O tom é o do app onze-onze: leve, íntimo, inspirador, holístico e sério (sem ser infantil, sem clichê de horóscopo de revista barata). Fale direto com a pessoa usando "você", como uma amiga mais velha que entende de astrologia de verdade.

Dados de nascimento:
- Nome: ${data.name}
- Data: ${data.birthDate}
- Hora: ${data.birthTime}
- Local: ${data.birthPlace}
- Signo solar (já calculado, use exatamente): ${sun}

Calcule (com base no seu conhecimento astrológico real e na data/hora/local) as posições dos demais planetas, signo lunar, ascendente e casas. Não invente — se a hora for ambígua, faça a melhor estimativa silenciosamente.

Retorne EXATAMENTE este JSON, sem texto extra:
{
  "sun": { "sign": "${sun}", "house": "<1-12>", "degree": "<0-29.99>", "description": "<1 frase curta e poética sobre como esse Sol se manifesta>" },
  "moon": { "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>", "description": "<1 frase curta sobre essa Lua>" },
  "ascendant": { "sign": "<signo>", "degree": "<0-29.99>", "description": "<1 frase curta sobre essa Ascendente>" },
  "planets": [
    { "name": "Mercúrio", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Vênus", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Marte", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Júpiter", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Saturno", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Urano", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Netuno", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" },
    { "name": "Plutão", "sign": "<signo>", "house": "<1-12>", "degree": "<0-29.99>" }
  ],
  "personality": "<texto profundo de 5 a 7 frases costurando Sol, Lua e Ascendente. Mostre como essas três energias conversam entre si na pessoa: o que ela mostra pro mundo, o que sente por dentro, e como reage. Use linguagem afetiva, evocativa, com imagens leves (água, fogo, raiz, brisa). Sem listas, sem 'você é assim', prefira 'em você existe…', 'há uma…', 'sua forma de…'. Evite jargão técnico astrológico pesado.>"
}`;

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

    // Override the AI-guessed ascendant with a real astronomical calculation.
    // Requires geocoding + timezone lookup; degrades gracefully on failure.
    try {
      const geo = await geocodePlace(data.birthPlace);
      if (geo) {
        const tz = await lookupTimezone(geo.lat, geo.lng);
        const asc = computeAscendant({
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          timezone: tz,
          lat: geo.lat,
          lng: geo.lng,
        });
        parsed.ascendant = {
          sign: asc.sign,
          degree: asc.degree.toFixed(2),
          description: parsed.ascendant?.description ?? "",
        };
        parsed.ascendantMeta = {
          longitude: asc.longitude,
          lat: geo.lat,
          lng: geo.lng,
          timezone: tz,
        };

        // Override AI-guessed planet positions with real ephemeris computation.
        // Tropical zodiac, equal-house from Ascendant.
        try {
          const bodies = computeBodies({
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            timezone: tz,
            ascendantLongitude: asc.longitude,
          });
          parsed.sun = {
            sign: bodies.sun.sign,
            house: String(bodies.sun.house),
            degree: bodies.sun.degree.toFixed(2),
            description: parsed.sun?.description ?? "",
          };
          parsed.moon = {
            sign: bodies.moon.sign,
            house: String(bodies.moon.house),
            degree: bodies.moon.degree.toFixed(2),
            description: parsed.moon?.description ?? "",
          };
          parsed.planets = bodies.planets.map((p) => ({
            name: p.name,
            sign: p.sign,
            house: String(p.house),
            degree: p.degree.toFixed(2),
          }));
        } catch (err) {
          console.error("Local planet calc failed:", err);
        }
      }
    } catch (err) {
      console.error("Local ascendant calc failed:", err);
    }

    // Augment with Prokerala (accurate ephemeris + SVG mandala). Degrade gracefully.
    try {
      const pk = await fetchProkeralaNatal({
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
      });
      if (pk) {
        parsed.prokerala = {
          chartSvg: pk.chartSvg,
          aspectChartSvg: pk.aspectChartSvg,
          planetPositions: pk.planetPositions,
          coordinates: pk.coordinates,
          timezone: pk.timezone,
          datetime: pk.datetime,
        };
      }
    } catch (err) {
      console.error("Prokerala augmentation failed:", err);
    }

    return parsed;
  });

export type NatalChartData = {
  sun: { sign: string; house: string; degree?: string | number; description: string };
  moon: { sign: string; house: string; degree?: string | number; description: string };
  ascendant: { sign: string; degree?: string | number; description: string };
  planets: Array<{ name: string; sign: string; house: string; degree?: string | number }>;
  personality: string;
  prokerala?: {
    chartSvg: string | null;
    aspectChartSvg: string | null;
    planetPositions: any | null;
    coordinates: { lat: number; lng: number; displayName: string };
    timezone: string;
    datetime: string;
  };
  interpretation?: {
    text: string;
    cacheKey: string;
    generatedAt: string;
  };
};

const interpInputSchema = z.object({
  sunSign: z.string().min(1).max(40),
  sunHouse: z.string().min(1).max(4),
  moonSign: z.string().min(1).max(40),
  moonHouse: z.string().min(1).max(4),
  ascSign: z.string().min(1).max(40),
  aspects: z.array(z.string().min(1).max(120)).max(8),
});

export const generateBigThreeReading = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => interpInputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const aspectsLine = data.aspects.length
      ? data.aspects.join("; ")
      : "nenhum aspecto principal relevante";

    const prompt = `Você é uma redatora de astrologia para um app jovem de autoconhecimento, com tom leve, acolhedor, divertido e simples, parecido com uma revista jovem brasileira (estilo Capricho). Gere uma interpretação personalizada entre 250 e 300 palavras, em português do Brasil, usando linguagem próxima e sem termos técnicos difíceis. Não use travessão (—, –) em nenhum momento.

Dados do mapa:
Sol em: ${data.sunSign}
Casa do Sol: ${data.sunHouse}
Lua em: ${data.moonSign}
Casa da Lua: ${data.moonHouse}
Ascendente em: ${data.ascSign}
Aspectos principais: ${aspectsLine}

Regras:
- Texto entre 250 e 300 palavras, em 4 parágrafos curtos, sem listas e sem tópicos.
- Não use linguagem técnica demais nem mística pesada.
- Não faça previsões, não seja fatalista, não diga que algo é bom ou ruim.
- Fale de tendências, potenciais, desafios e autoconhecimento.
- Evite "você sempre", "você nunca", "seu destino é", "isso vai acontecer", "essa posição é ruim/negativa".
- Use construções como "você tende a", "seu mapa mostra", "essa energia pode aparecer como", "seu coração precisa de", "seu desafio é", "quando essa energia está bem vivida".
- Parágrafo 1: Sol no signo e na casa (essência, brilho, identidade, vitalidade, caminho de crescimento).
- Parágrafo 2: Lua no signo e na casa (emoções, segurança emocional, necessidades afetivas, jeito de reagir).
- Parágrafo 3: Ascendente no signo (primeira impressão, jeito de chegar no mundo).
- Parágrafo 4: Conecte Sol, Lua e Ascendente; cite os aspectos principais de forma simples se forem relevantes; termine com uma frase positiva e acolhedora.
- O texto deve soar como uma amiga explicando o mapa da pessoa.

Retorne APENAS o texto interpretativo, sem títulos, sem JSON, sem aspas ao redor.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("AI error", res.status, txt);
      throw new Error(`AI gateway error ${res.status}`);
    }
    const json = await res.json();
    const text: string = (json.choices?.[0]?.message?.content ?? "").trim();
    return { text };
  });