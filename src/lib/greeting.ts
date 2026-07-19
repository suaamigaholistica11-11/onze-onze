export type Periodo = "manhã" | "tarde" | "noite";
export type Gender = "Feminino" | "Masculino" | "Outro" | "Prefiro não dizer" | null | undefined;

// Retorna a terminação de adjetivo/particípio conforme o gênero.
// Feminino: "a" · Masculino: "o" · Outro / não dizer: "e" (linguagem neutra).
export function gTerm(gender: Gender): "a" | "o" | "e" {
  if (gender === "Masculino") return "o";
  if (gender === "Outro") return "e";
  return "a";
}

// "amiga" / "amigo" / "amigue"
export function vocativo(gender: Gender): string {
  const t = gTerm(gender);
  return t === "e" ? "amigue" : t === "o" ? "amigo" : "amiga";
}

export function getPeriodo(date = new Date()): Periodo {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "manhã";
  if (h >= 12 && h < 18) return "tarde";
  return "noite";
}

export function getSaudacao(nome: string, date = new Date(), gender: Gender = null) {
  const periodo = getPeriodo(date);
  const labelPeriodo: Record<Periodo, string> = {
    "manhã": "Linda manhã",
    tarde: "Linda tarde",
    noite: "Linda noite",
  };
  const t = gTerm(gender);
  const prep =
    t === "o" ? "Preparado" : t === "e" ? "Preparade" : "Preparada";
  return {
    titulo: `Oi, ${nome}!`,
    subtitulo: `${labelPeriodo[periodo]} pra você, ${prep.toLowerCase()} pro dia?`,
    periodo,
  };
}