import { useEffect, useRef } from "react";

export default function SpectrogramCanvas({ isReal, animated = true }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    let running = true;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#111120";
      ctx.fillRect(0, 0, W, H);

      const cols = 80, rows = 48;
      const cw = W / cols, rh = H / rows;
      const t = frameRef.current * 0.015;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const freqNorm = 1 - r / rows;
          let energy;
          if (isReal) {
            const formant1 = Math.exp(-Math.pow(freqNorm - 0.25, 2) * 40);
            const formant2 = Math.exp(-Math.pow(freqNorm - 0.55, 2) * 30);
            const jitter = Math.sin(t * 3 + c * 0.4 + r * 0.3) * 0.12;
            const shimmer = Math.sin(t * 1.7 + c * 0.25) * 0.08;
            energy = (formant1 * 0.8 + formant2 * 0.6) * (0.7 + jitter + shimmer);
            energy += Math.random() * 0.08;
          } else {
            const base = Math.exp(-Math.pow(freqNorm - 0.3, 2) * 25);
            const synthetic = Math.sin(c * 0.35 + t) * 0.15 + 0.5;
            energy = base * synthetic;
            if (freqNorm > 0.7) energy *= 0.1;
            energy = Math.min(energy, 0.85);
          }
          energy = Math.max(0, Math.min(1, energy));

          let r2, g2, b2;
          if (energy < 0.25) {
            r2 = Math.round(energy / 0.25 * 20 + 11);
            g2 = Math.round(energy / 0.25 * 30 + 11);
            b2 = Math.round(energy / 0.25 * 80 + 32);
          } else if (energy < 0.5) {
            const f = (energy - 0.25) / 0.25;
            r2 = Math.round(f * 13);
            g2 = Math.round(30 + f * 118);
            b2 = Math.round(112 + f * 24);
          } else if (energy < 0.75) {
            const f = (energy - 0.5) / 0.25;
            r2 = Math.round(13 + f * 204);
            g2 = Math.round(148 + f * 7);
            b2 = Math.round(136 - f * 106);
          } else {
            const f = (energy - 0.75) / 0.25;
            r2 = Math.round(217 + f * 38);
            g2 = Math.round(155 + f * 100);
            b2 = Math.round(30 + f * 225);
          }

          ctx.fillStyle = `rgb(${r2},${g2},${b2})`;
          ctx.fillRect(Math.round(c * cw), Math.round(r * rh), Math.ceil(cw) - 1, Math.ceil(rh) - 1);
        }
      }

      ctx.fillStyle = "rgba(148,163,184,0.7)";
      ctx.font = "9px 'DM Mono', monospace";
      ["8k", "4k", "2k", "1k", "500", "250"].forEach((label, i) => {
        const y = (i / 5) * H;
        ctx.fillText(label, 3, y + 10);
      });

      frameRef.current += 1;
      if (animated && running) requestAnimationFrame(draw);
    }
    draw();
    return () => { running = false; };
  }, [isReal, animated]);

  return (
    <canvas
      ref={canvasRef}
      width={320} height={160}
      style={{ width: "100%", height: 160, display: "block" }}
    />
  );
}
