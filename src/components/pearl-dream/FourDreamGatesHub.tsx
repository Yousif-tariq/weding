import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../animations/motionPresets";
import { DREAM_GATES_META, type GateId } from "./PearlDreamTypes";

interface FourDreamGatesHubProps {
  onEnterGate: (gate: GateId) => void;
  onHoverGate: (gate: GateId | null) => void;
}

/**
 * THE FOUR DREAM GATES — Futuristic Spatial Holographic Portals
 * Smoked-emerald obsidian glass, liquid champagne-gold bezels, prism turquoise aura,
 * and responsive 3D depth parallax.
 */
export function FourDreamGatesHub({
  onEnterGate,
  onHoverGate,
}: FourDreamGatesHubProps) {
  const { brand, media, event, venue } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());
  const [enteringGate, setEnteringGate] = useState<GateId | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReduced) return;

    const handlePointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * -10;
      setTilt({ x: nx, y: ny });
    };

    const handleOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const nx = Math.max(-12, Math.min(12, (e.gamma / 40) * 12));
      const ny = Math.max(-9, Math.min(9, ((e.beta - 45) / 40) * -9));
      setTilt({ x: nx, y: ny });
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("deviceorientation", handleOrient, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("deviceorientation", handleOrient);
    };
  }, [prefersReduced]);

  const handleSelect = (id: GateId) => {
    if (enteringGate) return;
    setEnteringGate(id);
    onHoverGate(id);
    window.setTimeout(
      () => {
        onEnterGate(id);
      },
      prefersReduced ? 120 : 460
    );
  };

  const gateLayout: Record<
    GateId,
    {
      depth: number;
      floatY: number;
      floatDuration: number;
      offsetClass: string;
    }
  > = {
    welcome: {
      depth: 1.2,
      floatY: -7,
      floatDuration: 6.2,
      offsetClass: "translate-y-0 sm:-translate-y-4",
    },
    jirtiq: {
      depth: 0.9,
      floatY: -9,
      floatDuration: 7.0,
      offsetClass: "translate-y-5 sm:translate-y-4",
    },
    date: {
      depth: 1.05,
      floatY: -6,
      floatDuration: 6.6,
      offsetClass: "-translate-y-1 sm:-translate-y-2",
    },
    location: {
      depth: 0.85,
      floatY: -8,
      floatDuration: 7.4,
      offsetClass: "translate-y-4 sm:translate-y-6",
    },
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between px-4 pt-[max(4.4rem,calc(env(safe-area-inset-top)+3.4rem))] pb-[max(5.2rem,calc(env(safe-area-inset-bottom)+4.2rem))]">
      {/* Monumental Floating Spatial Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{
          opacity: enteringGate ? 0 : 1,
          y: enteringGate ? -18 : 0,
        }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="pointer-events-none text-center"
      >
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#F0D29C] drop-shadow-[0_1px_10px_rgba(4,24,29,0.85)]">
          <Sparkles className="h-3 w-3 text-[#5FD3CC]" />
          <span>{brand.experienceTitle}</span>
          <Sparkles className="h-3 w-3 text-[#5FD3CC]" />
        </p>
        <h1
          className="mt-1 text-3xl font-bold text-[#FDFBFF] drop-shadow-[0_3px_22px_rgba(4,24,29,0.95)] sm:text-4xl"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          {brand.groomAr}{" "}
          <span className="text-[#F0D29C]">&amp;</span>{" "}
          {brand.brideAr}
        </h1>
        <p className="mt-1 text-xs font-medium text-[#CBEAE8] drop-shadow-[0_1px_10px_rgba(4,24,29,0.85)]">
          اختر بوابة أو مرّر للدخول إلى عالمها
        </p>
      </motion.div>

      {/* THE FOUR FUTURISTIC SPATIAL PORTALS */}
      <div
        className="relative my-auto grid w-full max-w-[900px] grid-cols-2 items-center justify-items-center gap-x-5 gap-y-6 py-4 sm:gap-x-10 md:grid-cols-4"
        style={{ perspective: "1400px" }}
      >
        {DREAM_GATES_META.map((gate, idx) => {
          const layout = gateLayout[gate.id];
          const isSelected = enteringGate === gate.id;
          const isDimmed = enteringGate !== null && !isSelected;

          return (
            <motion.button
              key={gate.id}
              type="button"
              onClick={() => handleSelect(gate.id)}
              onMouseEnter={() => onHoverGate(gate.id)}
              onMouseLeave={() => onHoverGate(null)}
              onFocus={() => onHoverGate(gate.id)}
              onBlur={() => onHoverGate(null)}
              initial={{ opacity: 0, y: 28, scale: 0.9 }}
              animate={
                isSelected
                  ? {
                      opacity: 1,
                      scale: prefersReduced ? 1.05 : 1.24,
                      y: -12,
                      zIndex: 40,
                    }
                  : isDimmed
                    ? {
                        opacity: 0,
                        scale: 0.82,
                        filter: "blur(8px)",
                      }
                    : {
                        opacity: 1,
                        y: prefersReduced ? 0 : [0, layout.floatY, 0],
                        scale: 1,
                        filter: "blur(0px)",
                      }
              }
              transition={
                isSelected || isDimmed
                  ? { duration: 0.45, ease: LUXURY_EASE }
                  : {
                      opacity: { duration: 0.8, delay: idx * 0.11 },
                      scale: { duration: 0.8, delay: idx * 0.11 },
                      y: {
                        duration: layout.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.4,
                      },
                    }
              }
              style={{
                transform: prefersReduced
                  ? undefined
                  : `translate3d(${tilt.x * layout.depth}px, ${tilt.y * layout.depth}px, 0)`,
              }}
              className={`group relative flex flex-col items-center focus:outline-none ${layout.offsetClass}`}
              aria-label={`دخول بوابة ${gate.titleAr}`}
            >
              {/* Holographic Prism Back-Glow */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-4 rounded-full transition-all duration-500 ${
                  isSelected
                    ? "bg-[#5FD3CC]/55 opacity-100 blur-2xl"
                    : "bg-[#5FD3CC]/18 opacity-65 blur-xl group-hover:bg-[#F0D29C]/35 group-hover:opacity-100"
                }`}
              />

              {/* PORTAL 1: Futuristic Chamfered Crystal Monolith (Welcome) */}
              {gate.shape === "oval" && (
                <div className="future-glass-panel future-chamfer relative flex h-[182px] w-[142px] items-center justify-center overflow-hidden p-2 transition-all duration-500 group-hover:scale-[1.06] group-hover:border-[#5FD3CC]/85 sm:h-[218px] sm:w-[166px]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#5FD3CC] to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-[#5FD3CC]/35 to-transparent"
                  />
                  <div className="future-chamfer-sm relative h-full w-full overflow-hidden">
                    <img
                      src={media.receptionPhoto}
                      alt={gate.titleAr}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04181D]/72 via-transparent to-[#5FD3CC]/15" />
                  </div>
                </div>
              )}

              {/* PORTAL 2: Futuristic Chamfered Crimson-Gold Monolith (Jirtiq) */}
              {gate.shape === "arch" && (
                <div className="future-glass-panel future-chamfer relative flex h-[182px] w-[142px] items-center justify-center overflow-hidden p-2 transition-all duration-500 group-hover:scale-[1.06] group-hover:border-[#F0D29C]/85 sm:h-[218px] sm:w-[166px]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#EC5B78] to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-[#F0D29C]/35 to-transparent"
                  />
                  <div className="future-chamfer-sm relative h-full w-full overflow-hidden">
                    <img
                      src={media.jirtiqPhoto}
                      alt={gate.titleAr}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B0D1B]/72 via-transparent to-[#F0D29C]/15" />
                  </div>
                </div>
              )}

              {/* PORTAL 3: Futuristic Chamfered Chronometer Slab (Date) */}
              {gate.shape === "organic" && (
                <div className="future-glass-panel future-chamfer relative flex h-[182px] w-[142px] flex-col items-center justify-center overflow-hidden p-3 transition-all duration-500 group-hover:scale-[1.06] group-hover:border-[#5FD3CC]/85 sm:h-[218px] sm:w-[166px]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#F0D29C] to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-[#5FD3CC]/25 to-transparent"
                  />
                  <span className="relative z-10 text-[10px] font-semibold tracking-wider text-[#5FD3CC]">
                    {event.dayLabelAr}
                  </span>
                  <span
                    className="relative z-10 mt-1 bg-gradient-to-b from-[#FFFFFF] via-[#F5DBA6] to-[#D4A056] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                    style={{ fontFamily: "var(--font-display-ar)" }}
                  >
                    ٣ ديسمبر
                  </span>
                  <span className="relative z-10 mt-2 border border-[#F0D29C]/50 bg-white/10 px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#FDFBFF]">
                    ٢٠٢٦ م
                  </span>
                </div>
              )}

              {/* PORTAL 4: Futuristic Chamfered Spatial Beacon Slab (Location) */}
              {gate.shape === "circle" && (
                <div className="future-glass-panel future-chamfer relative flex h-[182px] w-[142px] flex-col items-center justify-center overflow-hidden p-3 text-center transition-all duration-500 group-hover:scale-[1.06] group-hover:border-[#F0D29C]/85 sm:h-[218px] sm:w-[166px]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#5FD3CC] to-transparent"
                  />
                  <span className="relative flex h-10 w-10 items-center justify-center border border-[#5FD3CC]/60 bg-[#5FD3CC]/15 text-[#F0D29C] shadow-[0_0_18px_rgba(95,211,204,0.35)]">
                    <Compass className="h-5 w-5" />
                  </span>
                  <span
                    className="mt-2.5 text-sm font-bold leading-tight text-[#FDFBFF] sm:text-base"
                    style={{ fontFamily: "var(--font-display-ar)" }}
                  >
                    {venue.name}
                  </span>
                  <span className="mt-1 text-[10px] font-medium text-[#5FD3CC]">
                    {venue.cityDistrict}
                  </span>
                </div>
              )}

              {/* Luminous Arabic Gate Title Beneath Each Portal */}
              <div className="relative z-10 mt-3 text-center">
                <span
                  className="block text-base font-bold text-[#FDFBFF] drop-shadow-[0_2px_14px_rgba(4,24,29,0.95)] transition-colors group-hover:text-[#F0D29C] sm:text-lg"
                  style={{ fontFamily: "var(--font-display-ar)" }}
                >
                  {gate.titleAr}
                </span>
                <span className="mt-0.5 block text-[10.5px] font-medium text-[#CBE6E4] drop-shadow-[0_1px_8px_rgba(4,24,29,0.9)]">
                  {gate.subtitleAr}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
