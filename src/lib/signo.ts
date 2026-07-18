// Signo solar (calendário ocidental tropical).
// Recebe data no formato "YYYY-MM-DD" e devolve o nome do signo em português.
const SIGN_GLYPHS: Record<string, string> = {
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

export function calcularSignoSolar(dataISO: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dataISO);
  if (!m) return null;
  const mes = parseInt(m[2], 10);
  const dia = parseInt(m[3], 10);
  const md = mes * 100 + dia;
  if (md >= 321 && md <= 419) return "Áries";
  if (md >= 420 && md <= 520) return "Touro";
  if (md >= 521 && md <= 620) return "Gêmeos";
  if (md >= 621 && md <= 722) return "Câncer";
  if (md >= 723 && md <= 822) return "Leão";
  if (md >= 823 && md <= 922) return "Virgem";
  if (md >= 923 && md <= 1022) return "Libra";
  if (md >= 1023 && md <= 1121) return "Escorpião";
  if (md >= 1122 && md <= 1221) return "Sagitário";
  if (md >= 1222 || md <= 119) return "Capricórnio";
  if (md >= 120 && md <= 218) return "Aquário";
  if (md >= 219 && md <= 320) return "Peixes";
  return null;
}

export function glifoDoSigno(signo: string | null | undefined): string | null {
  if (!signo) return null;
  return SIGN_GLYPHS[signo] ?? null;
}