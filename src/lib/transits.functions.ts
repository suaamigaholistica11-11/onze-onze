import { createServerFn } from "@tanstack/react-start";
import {
  Body,
  Ecliptic,
  GeoVector,
} from "astronomy-engine";
import {
  PLANETS_PT,
  PLANET_GLYPHS,
  SIGNS_ORDER,
  copyFor,
  type PlanetPt,
} from "./transit-copy";

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
