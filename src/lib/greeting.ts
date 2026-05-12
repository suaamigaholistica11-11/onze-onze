export type Periodo = "manhã" | "tarde" | "noite";

export function getPeriodo(date = new Date()): Periodo {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "manhã";
  if (h >= 12 && h < 18) return "tarde";
  return "noite";
}

export function getSaudacao(nome: string, date = new Date()) {
  const periodo = getPeriodo(date);
  const labelPeriodo: Record<Periodo, string> = {
    "manhã": "Linda manhã",
    tarde: "Linda tarde",
    noite: "Linda noite",
  };
  return {
    titulo: `Oi, ${nome}!`,
    subtitulo: `${labelPeriodo[periodo]} pra você!`,
    periodo,
  };
}