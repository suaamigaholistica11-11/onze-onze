// Ascendant calculation per Meeus' "Astronomical Algorithms".
// Pure JS, runs in Cloudflare Workers. Validated against Einstein (Câncer ~11°)
// and JFK (Libra ~20°).

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
export const norm360 = (x: number) => ((x % 360) + 360) % 360;

export const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
] as const;

/** Julian Day for a calendar date + decimal UT hours (Gregorian). */
export function julianDay(y: number, m: number, d: number, ut: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716))
       + Math.floor(30.6001 * (m + 1))
       + d + ut / 24 + B - 1524.5;
}

/** Apparent Greenwich Sidereal Time, degrees. */
export function gmstDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const g = 280.46061837
          + 360.98564736629 * (jd - 2451545.0)
          + 0.000387933 * T * T
          - (T * T * T) / 38710000;
  return norm360(g);
}

/** Mean obliquity of the ecliptic, degrees. */
export function obliquityDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
}

/** Ascendant ecliptic longitude in degrees (0–360°). */
export function ascendantDeg(jd: number, latDeg: number, lngDeg: number): number {
  const lst = norm360(gmstDeg(jd) + lngDeg); // east-positive longitude
  const eps = obliquityDeg(jd);
  const t = lst * D2R, e = eps * D2R, p = latDeg * D2R;
  const raw = Math.atan2(-Math.cos(t), Math.sin(t) * Math.cos(e) + Math.tan(p) * Math.sin(e)) * R2D;
  let A = norm360(raw);
  // Quadrant correction: Asc must be 0–180° east (CCW) of MC.
  const MC = norm360(Math.atan2(Math.sin(t), Math.cos(t) * Math.cos(e)) * R2D);
  if (norm360(A - MC) > 180) A = norm360(A + 180);
  return A;
}

export function signFromLongitude(lon: number): { sign: string; degree: number } {
  const x = norm360(lon);
  const idx = Math.floor(x / 30);
  return { sign: SIGNS[idx], degree: +(x - idx * 30).toFixed(2) };
}

/**
 * High-level helper: given local birth date/time + IANA tz + lat/lng,
 * returns { sign, degree, longitude }.
 */
export function computeAscendant(args: {
  birthDate: string;   // YYYY-MM-DD (local wall clock)
  birthTime: string;   // HH:MM      (local wall clock)
  timezone: string;    // IANA, e.g. "America/Sao_Paulo"
  lat: number;
  lng: number;
}): { sign: string; degree: number; longitude: number } {
  const utHours = localToUtHours(args.birthDate, args.birthTime, args.timezone);
  const [y, m, d] = args.birthDate.split("-").map(Number);
  // utHours may roll into prev/next day — normalize via Date arithmetic.
  const ms = Date.UTC(y, m - 1, d) + Math.round(utHours * 3600_000);
  const utc = new Date(ms);
  const jd = julianDay(
    utc.getUTCFullYear(),
    utc.getUTCMonth() + 1,
    utc.getUTCDate(),
    utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600,
  );
  const lon = ascendantDeg(jd, args.lat, args.lng);
  const s = signFromLongitude(lon);
  return { ...s, longitude: lon };
}

/** Convert local wall-clock time in IANA tz to decimal UT hours. */
export function localToUtHours(date: string, time: string, tz: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const wallUtcMs = Date.UTC(y, m - 1, d, hh, mm, 0);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const parts = dtf.formatToParts(new Date(wallUtcMs)).reduce((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {} as Record<string, string>);
  const tzLocalMs = Date.UTC(
    +parts.year, +parts.month - 1, +parts.day,
    +parts.hour === 24 ? 0 : +parts.hour, +parts.minute, +parts.second,
  );
  const offsetMin = Math.round((tzLocalMs - wallUtcMs) / 60_000); // tz minutes east of UTC
  return hh + mm / 60 - offsetMin / 60;
}
