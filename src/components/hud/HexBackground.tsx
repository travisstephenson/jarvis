"use client";

import { useEffect, useRef } from "react";

export function HexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const rings = Array.from({ length: 3 }, (_, i) => ({
      radius: 80 + i * 30,
      speed: 0.0025 + i * 0.0008,
      phase: i * 1.4,
    }));

    const draw = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      ctx.strokeStyle = "rgba(91, 227, 255, 0.45)";
      ctx.lineWidth = 1.5 * window.devicePixelRatio;
      rings.forEach((r) => {
        const angle = t * r.speed + r.phase;
        const segments = 6;
        ctx.beginPath();
        for (let s = 0; s < segments; s++) {
          const a0 = (s / segments) * Math.PI * 2 + angle;
          const a1 = a0 + (Math.PI * 2) / segments / 2;
          ctx.moveTo(cx + Math.cos(a0) * r.radius * window.devicePixelRatio, cy + Math.sin(a0) * r.radius * window.devicePixelRatio);
          ctx.arc(cx, cy, r.radius * window.devicePixelRatio, a0, a1);
        }
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 36 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(91, 227, 255, 0.18)";
      ctx.fill();
      ctx.strokeStyle = "rgba(91, 227, 255, 0.85)";
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
