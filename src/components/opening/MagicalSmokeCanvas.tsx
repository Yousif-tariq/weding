import { useEffect, useRef } from "react";

interface MagicalSmokeCanvasProps {
  intensity?: "car" | "envelope";
}

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  isSpark: boolean;
}

const SMOKE_COLORS = [
  "244, 154, 180", // Soft Rose-Blush Smoke
  "248, 198, 134", // Warm Peach-Gold Vapor
  "156, 200, 242", // Celestial Sky-Blue Mist
  "255, 250, 244", // Luminous Pearl Cloud
];

/**
 * Dreamy, continuous colored silk-smoke & glowing pollen mist swirling around
 * the transparent floral wedding car and floating floral envelope.
 */
export function MagicalSmokeCanvas({
  intensity = "envelope",
}: MagicalSmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const puffs: SmokePuff[] = [];
    let frame = 0;
    let rafId = 0;

    const spawnPuff = () => {
      const cx = width * 0.5;
      const cy = intensity === "car" ? height * 0.6 : height * 0.48;
      const spreadX = intensity === "car" ? width * 0.38 : width * 0.28;
      const spreadY = intensity === "car" ? height * 0.24 : height * 0.22;
      const angle = Math.random() * Math.PI * 2;
      const isSpark = Math.random() > 0.8;

      puffs.push({
        x: cx + (Math.random() - 0.5) * spreadX * 2,
        y: cy + (Math.random() - 0.5) * spreadY * 2,
        vx: Math.cos(angle) * (isSpark ? 0.45 : 0.35),
        vy: -(0.22 + Math.random() * 0.42),
        radius: isSpark ? 1.6 + Math.random() * 1.4 : 24 + Math.random() * 22,
        maxRadius: isSpark ? 3 : 66 + Math.random() * 44,
        alpha: 0,
        life: 0,
        maxLife: isSpark ? 90 + Math.random() * 50 : 120 + Math.random() * 75,
        color: SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)],
        isSpark,
      });
    };

    // Pre-seed soft puffs so the smoke is visible immediately
    for (let i = 0; i < 18; i++) {
      spawnPuff();
      puffs[i].life = Math.random() * puffs[i].maxLife * 0.7;
    }

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      if (frame % 4 === 0 && puffs.length < 36) {
        spawnPuff();
      }

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          puffs.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife;
        // Smooth bell curve fade in and fade out
        const fade = Math.sin(t * Math.PI);
        p.x += p.vx + Math.sin(frame * 0.015 + i) * 0.22;
        p.y += p.vy;
        p.radius += (p.maxRadius - p.radius) * 0.018;

        ctx.save();
        if (p.isSpark) {
          ctx.globalAlpha = fade * 0.85;
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const peakAlpha = fade * 0.32;
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius
          );
          grad.addColorStop(0, `rgba(${p.color}, ${peakAlpha.toFixed(3)})`);
          grad.addColorStop(
            0.55,
            `rgba(${p.color}, ${(peakAlpha * 0.45).toFixed(3)})`
          );
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
