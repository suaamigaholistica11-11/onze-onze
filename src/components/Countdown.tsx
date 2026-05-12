import { useEffect, useState } from "react";
import { diffParts } from "@/lib/onze-data";

interface Props {
  target: Date;
  variant?: "light" | "dark";
}

export function Countdown({ target, variant = "light" }: Props) {
  const [parts, setParts] = useState(() => diffParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(diffParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items: Array<[number, string]> = [
    [parts.dias, "Dias"],
    [parts.horas, "Horas"],
    [parts.mins, "Mins"],
    [parts.segs, "Segs"],
  ];

  const numColor = variant === "dark" ? "text-white" : "text-ink";
  const labelColor = variant === "dark" ? "text-white/60" : "text-ink/50";
  const sepColor = variant === "dark" ? "text-white/30" : "text-ink/30";

  return (
    <div className="flex justify-between items-center">
      {items.map(([n, label], i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center min-w-[44px]">
            <span
              className={`font-mono text-3xl font-medium tracking-tighter tabular-nums ${numColor} ${
                label === "Segs" ? "animate-oo-pulse" : ""
              }`}
            >
              {String(n).padStart(2, "0")}
            </span>
            <span
              className={`text-[9px] uppercase tracking-[0.2em] mt-1 ${labelColor}`}
            >
              {label}
            </span>
          </div>
          {i < items.length - 1 && (
            <span className={`text-2xl font-mono ${sepColor} mx-1`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}