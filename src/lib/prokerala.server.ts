// Server-only Prokerala API helpers. Never import from client code.

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const id = process.env.PROKERALA_CLIENT_ID;
  const secret = process.env.PROKERALA_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Prokerala credentials missing");

  const res = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Prokerala token error ${res.status}: ${txt.slice(0, 200)}`);
  }
  const j = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = {
    token: j.access_token,
    expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

async function prokeralaGet(
  path: string,
  params: Record<string, string | number | boolean>,
): Promise<any> {
  const token = await getToken();
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
  const url = `https://api.prokerala.com/${path}?${qs.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Prokerala ${path} ${res.status}: ${txt.slice(0, 300)}`);
  }
  return res.json();
}

export async function geocodePlace(
  place: string,
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "onze-onze/1.0 (astrology app)" },
  });
  if (!res.ok) return null;
  const arr = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!arr?.[0]) return null;
  return {
    lat: parseFloat(arr[0].lat),
    lng: parseFloat(arr[0].lon),
    displayName: arr[0].display_name,
  };
}

export async function lookupTimezone(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`,
    );
    if (!res.ok) return "UTC";
    const j = (await res.json()) as { timeZone?: string };
    return j.timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Build an ISO8601 timestamp with the correct UTC offset for the given wall-clock time in tz. */
export function buildIsoWithOffset(
  birthDate: string, // YYYY-MM-DD
  birthTime: string, // HH:MM
  tz: string,
): string {
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm] = birthTime.split(":").map(Number);
  // The wall-clock instant interpreted as if it were UTC:
  const wallUtcMs = Date.UTC(y, m - 1, d, hh, mm, 0);

  // What does tz call that UTC instant?
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date(wallUtcMs)).reduce(
    (acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    },
    {} as Record<string, string>,
  );
  const tzLocalMs = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour === 24 ? 0 : +parts.hour,
    +parts.minute,
    +parts.second,
  );
  // tz offset = how far tz is ahead of UTC at that instant, in minutes
  const offsetMin = Math.round((tzLocalMs - wallUtcMs) / 60_000);

  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${birthDate}T${pad(hh)}:${pad(mm)}:00${sign}${oh}:${om}`;
}

export interface ProkeralaResult {
  chartSvg: string | null;
  aspectChartSvg: string | null;
  planetPositions: any | null;
  coordinates: { lat: number; lng: number; displayName: string };
  timezone: string;
  datetime: string;
}

export async function fetchProkeralaNatal(args: {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}): Promise<ProkeralaResult | null> {
  const geo = await geocodePlace(args.birthPlace);
  if (!geo) return null;
  const tz = await lookupTimezone(geo.lat, geo.lng);
  const datetime = buildIsoWithOffset(args.birthDate, args.birthTime, tz);
  const coords = `${geo.lat},${geo.lng}`;

  const baseParams = {
    "profile[datetime]": datetime,
    "profile[coordinates]": coords,
    house_system: "placidus",
    orb: "default",
    birth_time_unknown: "false",
    birth_time_rectification: "flat-chart",
    aspect_filter: "major",
    la: "en",
  };

  const safe = async <T>(p: Promise<T>): Promise<T | null> => {
    try {
      return await p;
    } catch (err) {
      console.error("Prokerala call failed:", err);
      return null;
    }
  };

  const [chart, aspectChart, planets] = await Promise.all([
    safe(prokeralaGet("v2/astrology/natal-chart", baseParams)),
    safe(prokeralaGet("v2/astrology/natal-aspect-chart", baseParams)),
    safe(prokeralaGet("v2/astrology/natal-planet-position", baseParams)),
  ]);

  // Prokerala wraps responses in { status, data: { chart: "<svg…" } } typically.
  const extractSvg = (resp: any): string | null => {
    if (!resp) return null;
    const d = resp.data ?? resp;
    if (typeof d === "string" && d.includes("<svg")) return d;
    if (typeof d?.chart === "string") return d.chart;
    if (typeof d?.svg === "string") return d.svg;
    return null;
  };

  return {
    chartSvg: extractSvg(chart),
    aspectChartSvg: extractSvg(aspectChart),
    planetPositions: planets?.data ?? planets ?? null,
    coordinates: geo,
    timezone: tz,
    datetime,
  };
}