import { useEffect, useRef } from "react";

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

const SPARKLE_COLORS = ["#D4A056", "#F0D29C", "#FFFFFF", "#F8D4E4"];

/**
 * Tactile Pearl & Champagne-Gold Touch Sparkle Overlay
 * Emits 6 delicate star sparkles on every tap/click, drifting softly upward and fading out.
 * Automatically disabled when `prefers-reduced-motion` is enabled; runs zero frames when idle.
 */
export function PearlTouchSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: SparkleParticle[] = [];
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.015; // gentle float upward
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        drawStar(p.x, p.y, p.size, p.color, p.alpha);
      }

      if (particles.length > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
        const speed = 0.45 + Math.random() * 1.1;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 3 + Math.random() * 4.5,
          alpha: 0.9,
          decay: 0.018 + Math.random() * 0.012,
          color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
        });
      }
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
