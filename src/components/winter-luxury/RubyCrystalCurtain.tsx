import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LUXURY_EASE } from "../../animations/motionPresets";

const SNOWFLAKES = [
  { left: "6%", size: 7, dur: 4.8, delay: 0.0, drift: 14 },
  { left: "12%", size: 4, dur: 3.9, delay: 0.3, drift: -10 },
  { left: "18%", size: 9, dur: 5.4, delay: 0.1, drift: 18 },
  { left: "24%", size: 5, dur: 4.2, delay: 0.5, drift: -14 },
  { left: "31%", size: 6, dur: 4.6, delay: 0.2, drift: 12 },
  { left: "37%", size: 10, dur: 5.8, delay: 0.6, drift: -16 },
  { left: "43%", size: 5, dur: 4.0, delay: 0.15, drift: 10 },
  { left: "49%", size: 7, dur: 4.9, delay: 0.4, drift: -12 },
  { left: "55%", size: 6, dur: 4.4, delay: 0.25, drift: 15 },
  { left: "62%", size: 9, dur: 5.5, delay: 0.05, drift: -18 },
  { left: "68%", size: 4, dur: 3.8, delay: 0.45, drift: 12 },
  { left: "74%", size: 8, dur: 5.1, delay: 0.2, drift: -14 },
  { left: "81%", size: 5, dur: 4.3, delay: 0.55, drift: 16 },
  { left: "87%", size: 7, dur: 4.7, delay: 0.1, drift: -12 },
  { left: "93%", size: 6, dur: 4.5, delay: 0.35, drift: 14 },
  { left: "15%", size: 5, dur: 4.1, delay: 0.7, drift: 10 },
  { left: "46%", size: 8, dur: 5.2, delay: 0.8, drift: -15 },
  { left: "78%", size: 6, dur: 4.6, delay: 0.65, drift: 13 },
];

/**
 * Transparent Fluted Crystal-Glass Curtain with Pure Snow-White Snowfall
 * - Real frosted transparent glass panes (`backdrop-filter: blur(18px)`) with luxury fluted vertical glass ribs
 * - Pure snow-white falling snowflakes & frost shimmer across the glass
 * - Displays ONLY «دعوة زفاف» in luminous pure snow-white calligraphy
 * - Opens automatically after 2 seconds with a serene crystal-glass parting glide
 */
export function RubyCrystalCurtain() {
  const prefersReduced = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    const openTimer = window.setTimeout(
      () => setPhase("opening"),
      prefersReduced ? 350 : 2000
    );
    const doneTimer = window.setTimeout(
      () => setPhase("done"),
      prefersReduced ? 950 : 3800
    );

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
    };
  }, [prefersReduced]);

  if (phase === "done") return null;

  const isOpening = phase === "opening";

  // Luxury Parisian Fluted Transparent Crystal Glass Texture
  const glassCurtainStyle = {
    backgroundImage: [
      "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.34) 0px, rgba(255, 255, 255, 0.06) 16px, rgba(210, 230, 248, 0.18) 32px, rgba(255, 255, 255, 0.28) 46px)",
      "linear-gradient(180deg, rgba(255, 255, 255, 0.42) 0%, rgba(242, 248, 255, 0.24) 48%, rgba(255, 255, 255, 0.38) 100%)",
    ].join(", "),
    backdropFilter: "blur(18px) saturate(1.15)",
    WebkitBackdropFilter: "blur(18px) saturate(1.15)",
  } as const;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[70] overflow-hidden ${
        isOpening ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* TOP TRANSPARENT FLUTED CRYSTAL-GLASS CURTAIN */}
      <motion.div
        initial={{ y: "0%" }}
        animate={
          isOpening
            ? {
                y: "-105%",
              }
            : { y: "0%" }
        }
        transition={{
          duration: prefersReduced ? 0.5 : 1.6,
          ease: LUXURY_EASE,
        }}
        style={glassCurtainStyle}
        className="absolute inset-x-0 top-0 h-1/2 border-b-2 border-white/90 shadow-[0_12px_48px_rgba(255,255,255,0.35),inset_0_-2px_24px_rgba(255,255,255,0.65)]"
      >
        {/* Crisp Pure Snow Frost Top & Seam Edge Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/50 to-transparent" />
      </motion.div>

      {/* BOTTOM TRANSPARENT FLUTED CRYSTAL-GLASS CURTAIN */}
      <motion.div
        initial={{ y: "0%" }}
        animate={
          isOpening
            ? {
                y: "105%",
              }
            : { y: "0%" }
        }
        transition={{
          duration: prefersReduced ? 0.5 : 1.6,
          ease: LUXURY_EASE,
        }}
        style={glassCurtainStyle}
        className="absolute inset-x-0 bottom-0 h-1/2 border-t-2 border-white/90 shadow-[0_-12px_48px_rgba(255,255,255,0.35),inset_0_2px_24px_rgba(255,255,255,0.65)]"
      >
        {/* Crisp Pure Snow Frost Seam & Bottom Edge Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/45 to-transparent" />
      </motion.div>

      {/* PURE SNOW-WHITE FALLING SNOWFLAKES & CRYSTAL FROST PARTICLES */}
      {!prefersReduced && (
        <motion.div
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ duration: 0.9, ease: LUXURY_EASE }}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          {SNOWFLAKES.map((flake, idx) => (
            <motion.span
              key={idx}
              initial={{ y: "-8vh", x: 0, opacity: 0 }}
              animate={{
                y: "108vh",
                x: [0, flake.drift, -flake.drift * 0.6, flake.drift * 0.5],
                opacity: [0, 0.98, 0.95, 0],
              }}
              transition={{
                duration: flake.dur,
                delay: flake.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
              }}
              className="absolute top-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.98),0_0_24px_rgba(216,236,255,0.85)]"
            />
          ))}
        </motion.div>
      )}

      {/* PURE SNOW-WHITE LUMINOUS HORIZONTAL SEAM BLOOM */}
      <motion.div
        initial={{ opacity: 0.55, scaleY: 1 }}
        animate={
          isOpening
            ? { opacity: [1, 0.85, 0], scaleY: [1, 20, 36] }
            : { opacity: [0.45, 0.85, 0.45], scaleY: 1 }
        }
        transition={
          isOpening
            ? { duration: 1.15, ease: LUXURY_EASE }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent blur-[2px]"
      />

      {/* CENTERPIECE: ONLY «دعوة زفاف» IN PURE SNOW-WHITE CRYSTAL GLOW */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            key="glass-curtain-title"
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -22,
              scale: 1.14,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.75, ease: LUXURY_EASE }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Soft Frosted Snow Halo Behind Title */}
            <div className="pointer-events-none absolute h-48 w-80 rounded-full bg-radial from-white/55 via-[#DCECF9]/25 to-transparent blur-3xl sm:h-56 sm:w-[420px]" />

            <span className="mb-5 h-[1.5px] w-32 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#FFFFFF] sm:w-44" />

            <h1
              className="relative text-6xl font-bold leading-tight tracking-wide text-white drop-shadow-[0_4px_24px_rgba(18,34,54,0.48)] sm:text-7xl"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              دعوة زفاف
            </h1>

            <span className="mt-5 h-[1.5px] w-32 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#FFFFFF] sm:w-44" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
