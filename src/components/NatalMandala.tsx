import { SIGNS_ORDER, SIGN_GLYPHS, PLANET_GLYPHS, type PlanetPt } from "@/lib/transit-copy";
import { SIGN_ELEMENT, signLongitude, type AspectHit } from "@/lib/elements";

interface Body {
  name: string;
  sign: string;
  degree: number;
  house: number;
}

interface Props {
  bodies: Body[];
  ascendantSign: string;
  ascendantDegree: number;
  aspects: AspectHit[];
}

const ELEMENT_FILL: Record<string, string> = {
  Fogo: "rgba(255, 170, 120, 0.18)",
  Terra: "rgba(180, 220, 170, 0.18)",
  Ar: "rgba(190, 210, 240, 0.20)",
  Água: "rgba(170, 195, 235, 0.22)",
};

const ASPECT_COLOR: Record<AspectHit["tone"], string> = {
  harm: "#5b9d6e",
  tens: "#c45c5c",
  neut: "rgba(0,0,0,0.35)",
};

// Convert ecliptic longitude to screen angle.
// Asc longitude is fixed at 9 o'clock (180° on screen) with degrees increasing CCW.
function toAngle(longitude: number, ascLongitude: number): number {
  // angle in radians; 0 = 3 o'clock (right), increases CCW (math convention).
  // We want Asc on left (180°), so:
  const deg = 180 + (longitude - ascLongitude);
  return (deg * Math.PI) / 180;
}

function pointAt(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

export function NatalMandala({ bodies, ascendantSign, ascendantDegree, aspects }: Props) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 170;
  const rSign = 145; // sign band inner
  const rHouse = 110; // house band inner
  const rPlanet = 95; // where planet glyphs sit
  const rAspect = 80; // aspect lines hub

  const ascLong = signLongitude(ascendantSign, ascendantDegree);

  // Sign sectors: each 30° starting at Áries=0
  const signSectors = SIGNS_ORDER.map((sign, i) => {
    const startLong = i * 30;
    const endLong = (i + 1) * 30;
    const a1 = toAngle(startLong, ascLong);
    const a2 = toAngle(endLong, ascLong);
    const p1 = pointAt(cx, cy, rOuter, a1);
    const p2 = pointAt(cx, cy, rOuter, a2);
    const p3 = pointAt(cx, cy, rSign, a2);
    const p4 = pointAt(cx, cy, rSign, a1);
    const midLong = startLong + 15;
    const midAngle = toAngle(midLong, ascLong);
    const labelP = pointAt(cx, cy, (rOuter + rSign) / 2, midAngle);
    return {
      sign,
      d: `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rSign} ${rSign} 0 0 1 ${p4.x} ${p4.y} Z`,
      fill: ELEMENT_FILL[SIGN_ELEMENT[sign]] ?? "rgba(0,0,0,0.04)",
      labelX: labelP.x,
      labelY: labelP.y,
    };
  });

  // Houses: 12 sectors of 30° starting at Asc longitude (equal house system)
  const houseSectors = Array.from({ length: 12 }, (_, i) => {
    const startLong = ascLong + i * 30;
    const midLong = startLong + 15;
    const midAngle = toAngle(midLong, ascLong);
    const labelP = pointAt(cx, cy, (rSign + rHouse) / 2 - 5, midAngle);
    return { house: i + 1, x: labelP.x, y: labelP.y };
  });

  // House divider lines
  const houseLines = Array.from({ length: 12 }, (_, i) => {
    const a = toAngle(ascLong + i * 30, ascLong);
    const inner = pointAt(cx, cy, rAspect, a);
    const outer = pointAt(cx, cy, rSign, a);
    return { ...inner, x2: outer.x, y2: outer.y, key: `h${i}` };
  });

  // Planet positions (with simple anti-collision: nudge if too close)
  const planetPositions: Array<Body & { x: number; y: number; longitude: number }> = [];
  const sortedBodies = [...bodies].sort(
    (a, b) => signLongitude(a.sign, a.degree) - signLongitude(b.sign, b.degree),
  );
  let lastAngleDeg = -999;
  for (const b of sortedBodies) {
    const long = signLongitude(b.sign, b.degree);
    let r = rPlanet;
    let displayLong = long;
    // simple anti-collision: nudge radially if too close to previous
    if (Math.abs(long - lastAngleDeg) < 6) r = rPlanet - 18;
    lastAngleDeg = long;
    const ang = toAngle(displayLong, ascLong);
    const p = pointAt(cx, cy, r, ang);
    planetPositions.push({ ...b, longitude: long, x: p.x, y: p.y });
  }
  const posByName: Record<string, { x: number; y: number; longitude: number }> = {};
  planetPositions.forEach((p) => (posByName[p.name] = p));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[360px]">
      {/* Sign sectors */}
      {signSectors.map((s) => (
        <g key={s.sign}>
          <path d={s.d} fill={s.fill} stroke="rgba(0,0,0,0.18)" strokeWidth={0.5} />
          <text
            x={s.labelX}
            y={s.labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fill="var(--ink)"
          >
            {SIGN_GLYPHS[s.sign]}
          </text>
        </g>
      ))}

      {/* House circle */}
      <circle cx={cx} cy={cy} r={rSign} fill="white" stroke="rgba(0,0,0,0.15)" />
      <circle cx={cx} cy={cy} r={rHouse} fill="none" stroke="rgba(0,0,0,0.1)" />
      <circle cx={cx} cy={cy} r={rAspect} fill="rgba(180, 160, 220, 0.15)" stroke="rgba(0,0,0,0.1)" />

      {/* House dividers */}
      {houseLines.map((l) => (
        <line
          key={l.key}
          x1={l.x}
          y1={l.y}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={0.5}
        />
      ))}

      {/* House numbers */}
      {houseSectors.map((h) => (
        <text
          key={`hn${h.house}`}
          x={h.x}
          y={h.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill="rgba(0,0,0,0.5)"
        >
          {h.house}
        </text>
      ))}

      {/* Aspect lines */}
      {aspects.map((asp, i) => {
        const pa = posByName[asp.a];
        const pb = posByName[asp.b];
        if (!pa || !pb) return null;
        // draw chord through center area
        const a1 = toAngle(pa.longitude, ascLong);
        const a2 = toAngle(pb.longitude, ascLong);
        const p1 = pointAt(cx, cy, rAspect, a1);
        const p2 = pointAt(cx, cy, rAspect, a2);
        return (
          <line
            key={`asp${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={ASPECT_COLOR[asp.tone]}
            strokeWidth={asp.tone === "neut" ? 0.6 : 1}
            strokeOpacity={0.7}
          />
        );
      })}

      {/* Ascendant marker */}
      <line
        x1={pointAt(cx, cy, rAspect, Math.PI).x}
        y1={pointAt(cx, cy, rAspect, Math.PI).y}
        x2={pointAt(cx, cy, rOuter, Math.PI).x}
        y2={pointAt(cx, cy, rOuter, Math.PI).y}
        stroke="var(--ink)"
        strokeWidth={1.2}
      />
      <text
        x={pointAt(cx, cy, rOuter + 12, Math.PI).x}
        y={pointAt(cx, cy, rOuter + 12, Math.PI).y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fill="var(--ink)"
      >
        ASC
      </text>

      {/* Planet glyphs */}
      {planetPositions.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r={11} fill="white" stroke="rgba(0,0,0,0.3)" />
          <text
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill="var(--ink)"
          >
            {PLANET_GLYPHS[p.name as PlanetPt] ?? p.name[0]}
          </text>
        </g>
      ))}
    </svg>
  );
}