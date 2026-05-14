// Geocentric tropical (Sayana) ecliptic longitudes for Sun, Moon and the
// classical/modern planets, computed locally with astronomy-engine. Returns
// each body's sign + degree-in-sign + equal-house number relative to the
// Ascendant longitude. No external API call. No AI guess.

import * as Astro from "astronomy-engine";
import { localToUtHours, signFromLongitude, norm360 } from "./ascendant";

export interface PlanetPos {
  name: string;
  sign: string;
  degree: number;   // 0-29.99 within the sign
  house: number;    // 1-12, equal-house from Ascendant
  longitude: number;
}

const BODIES: Array<{ name: string; key: Astro.Body | "Sun" | "Moon" }> = [
  { name: "Mercúrio", key: "Mercury" as Astro.Body },
  { name: "Vênus", key: "Venus" as Astro.Body },
  { name: "Marte", key: "Mars" as Astro.Body },
  { name: "Júpiter", key: "Jupiter" as Astro.Body },
  { name: "Saturno", key: "Saturn" as Astro.Body },
  { name: "Urano", key: "Uranus" as Astro.Body },
  { name: "Netuno", key: "Neptune" as Astro.Body },
  { name: "Plutão", key: "Pluto" as Astro.Body },
];

function utcDateFromLocal(birthDate: string, birthTime: string, tz: string): Date {
  const utHours = localToUtHours(birthDate, birthTime, tz);
  const [y, m, d] = birthDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + Math.round(utHours * 3600_000));
}

function houseOf(longitude: number, ascLongitude: number): number {
  const offset = norm360(longitude - ascLongitude);
  return Math.floor(offset / 30) + 1;
}

export interface ComputeBodiesArgs {
  birthDate: string;
  birthTime: string;
  timezone: string;
  ascendantLongitude: number;
}

export function computeBodies(args: ComputeBodiesArgs): {
  sun: PlanetPos;
  moon: PlanetPos;
  planets: PlanetPos[];
} {
  const date = utcDateFromLocal(args.birthDate, args.birthTime, args.timezone);
  const t = new Astro.AstroTime(date);

  const sunLon = norm360(Astro.SunPosition(t).elon);
  const moonLon = norm360(Astro.EclipticGeoMoon(t).lon);

  const make = (name: string, lon: number): PlanetPos => {
    const s = signFromLongitude(lon);
    return {
      name,
      sign: s.sign,
      degree: s.degree,
      house: houseOf(lon, args.ascendantLongitude),
      longitude: lon,
    };
  };

  return {
    sun: make("Sol", sunLon),
    moon: make("Lua", moonLon),
    planets: BODIES.map((b) => make(b.name, norm360(Astro.EclipticLongitude(b.key as Astro.Body, t)))),
  };
}