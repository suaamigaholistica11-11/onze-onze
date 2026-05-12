import { createServerFn } from "@tanstack/react-start";
import {
  Body,
  Ecliptic,
  GeoVector,
  MoonPhase,
  SearchMoonPhase,
} from "astronomy-engine";
import {
  PLANETS_PT,
  PLANET_GLYPHS,
  SIGNS_ORDER,
  copyFor,
  type PlanetPt,
} from "./transit-copy";
import { phaseFromAngle, PHASE_MILESTONES, type MoonPhaseInfo } from "./moon-phases";

const BODY_MAP: Record<PlanetPt, Body> = {
  Sol: Body.Sun,
  Lua: Body.Moon,
  Mercúrio: Body.Mercury,
  Vênus: Body.Venus,
  Marte: Body.Mars,
  Júpiter: Body.Jupiter,
  Saturno: Body.Saturn,
  Urano: Body.Uranus,
  Netuno: Body.Neptune,
  Plutão: Body.Pluto,
};

function eclipticLongitude(body: Body, date: Date): number {
  const vec = GeoVector(body, date, true);
  const ecl = Ecliptic(vec);
  // ecl.elon in [0, 360)
  return ((ecl.elon % 360) + 360) % 360;
}

function signFromLongitude(lon: number): { sign: string; degree: number } {
  const idx = Math.floor(lon / 30) % 12;
  const degree = lon - idx * 30;
  return { sign: SIGNS_ORDER[idx], degree };
}

export type TransitItem = {
  planeta: PlanetPt;
  glyph: string;
  signo: string;
  grau: number;
  retrograde: boolean;
  texto: string;
};

export const getTransitsForToday = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ date: string; transits: TransitItem[] }> => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const transits: TransitItem[] = PLANETS_PT.map((planeta) => {
      const body = BODY_MAP[planeta];
      const lonNow = eclipticLongitude(body, now);
      const lonPrev = eclipticLongitude(body, yesterday);
      // diff wrapped to [-180, 180] to detect retro motion
      let delta = lonNow - lonPrev;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const retrograde = planeta !== "Sol" && planeta !== "Lua" && delta < 0;
      const { sign, degree } = signFromLongitude(lonNow);
      return {
        planeta,
        glyph: PLANET_GLYPHS[planeta],
        signo: sign,
        grau: Math.round(degree),
        retrograde,
        texto: copyFor(planeta, sign, retrograde),
      };
    });

    return { date: now.toISOString(), transits };
  }
);

export type MoonNowInfo = {
  date: string;
  faseAngulo: number;
  fase: MoonPhaseInfo;
  signo: string;
  grau: number;
  proximas: Array<{
    nome: string;
    glyph: string;
    dataISO: string;
    diasRestantes: number;
  }>;
};

export const getMoonForToday = createServerFn({ method: "GET" }).handler(
  async (): Promise<MoonNowInfo> => {
    const now = new Date();
    const angle = MoonPhase(now); // 0..360
    const fase = phaseFromAngle(angle);

    const moonLon = eclipticLongitude(Body.Moon, now);
    const { sign, degree } = signFromLongitude(moonLon);

    // Próximas 4 mudanças de fase (Nova/Crescente/Cheia/Minguante)
    const proximas = PHASE_MILESTONES.map((m) => {
      const found = SearchMoonPhase(m.angle, now, 40);
      if (!found) return null;
      const data = found.date;
      const dias = Math.max(
        0,
        Math.round((data.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );
      return { nome: m.nome, glyph: m.glyph, dataISO: data.toISOString(), diasRestantes: dias };
    }).filter(Boolean) as MoonNowInfo["proximas"];

    proximas.sort((a, b) => a.dataISO.localeCompare(b.dataISO));

    return {
      date: now.toISOString(),
      faseAngulo: angle,
      fase,
      signo: sign,
      grau: Math.round(degree),
      proximas,
    };
  },
);
