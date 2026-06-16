"use client";

import { useEffect, useState } from "react";

export default function Gauge({ value, grade }: { value: number; grade: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const r = 64;
  const c = 2 * Math.PI * r;
  const off = c - (v / 100) * c;

  const color =
    value < 40 ? "var(--severity-critical)" :
    value < 60 ? "var(--severity-major)" :
    value < 80 ? "var(--severity-minor)" :
    "var(--pass)";

  return (
    <div className="gauge-wrap">
      <div
        className="gauge"
        role="img"
        aria-label={`Overall accessibility score ${value} of 100, grade ${grade}`}
      >
        <svg viewBox="0 0 160 160">
          <circle
            className="gauge-track"
            cx="80"
            cy="80"
            r={r}
            strokeWidth={10}
            fill="none"
          />
          <circle
            className="gauge-arc"
            cx="80"
            cy="80"
            r={r}
            strokeWidth={10}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={off}
            style={{ stroke: color }}
          />
        </svg>
        <div className="gauge-center">
          <div className="gauge-num" style={{ color }}>{value}</div>
          <div className="gauge-unit">of 100</div>
        </div>
      </div>
      <div className="gauge-grade" style={{ color }}>
        {grade}
        <span className="sub">Grade</span>
      </div>
    </div>
  );
}
