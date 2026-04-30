import { useState, useEffect, useRef } from "react";

export default function WaveformSVG({ animate = true, color = "rgba(99,102,241,0.6)", height = 80 }) {
  const points = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      x: i / 119,
      amp: Math.random() * 0.8 + 0.1,
      phase: Math.random() * Math.PI * 2,
      freq: Math.random() * 2 + 1,
    }))
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, [animate]);

  const t = tick * 0.04;
  const w = 900, h = height;
  const pathD = points.current.map((p, i) => {
    const y = h / 2 + Math.sin(p.phase + t * p.freq) * p.amp * (h / 2 - 4);
    return (i === 0 ? `M` : `L`) + `${p.x * w},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
