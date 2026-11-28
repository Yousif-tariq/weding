import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LUXURY_EASE } from "../../animations/motionPresets";

/**
 * Ultra-lightweight Scroll-Reactive Quiet Luxury Winter Snow Ambiance
 * Seamlessly cross-fades four luminous ambient light moods as the guest scrolls:
 * 1. Bright Snow-White («دعوة فرح كريمة»)
 * 2. Serene Crystal-Blue («الوقت المتبقي للفرح»)
 * 3. Soft Warm Champagne-Gold («تفاصيل المناسبة»)
 * 4. Warm Pearlescent Rose-Ivory Glow («الخاتمة»)
 */
const SNOW_MOTES = [
  { left: "6%", size: 5, dur: 18, delay: 0 },
  { left: "14%", size: 7, dur: 22, delay: -6 },
  { left: "23%", size: 4, dur: 16, delay: -11 },
  { left: "31%", size: 6, dur: 24, delay: -3 },
  { left: "40%", size: 5, dur: 19, delay: -14 },
  { left: "48%", size: 8, dur: 26, delay: -8 },
  { left: "57%", size: 4, dur: 17, delay: -2 },
  { left: "65%", size: 6, dur: 23, delay: -15 },
  { left: "74%", size: 5, dur: 20, delay: -9 },
  { left: "82%", size: 7, dur: 25, delay: -4 },
  { left: "90%", size: 4, dur: 18, delay: -12 },
  { left: "95%", size: 6, dur: 21, delay: -7 },
];

interface WinterSnowAmbianceProps {
  active?: boolean;
}

export function WinterSnowAmbiance({ active = false }: WinterSnowAmbianceProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll();

  // Smooth GPU-composited opacity cross-fades across the 4 invitation chapters
  const snowWhiteOpacity = useTransform(scrollYProgress, [0, 0.22, 0.38], [1, 1, 0]);
  const crystalBlueOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.36, 0.52, 0.64],
    [0, 1, 1, 0]
  );
  const warmGoldOpacity = useTransform(
    scrollYProgress,
    [0.44, 0.6, 0.76, 0.88],
    [0, 1, 1, 0]
  );
  const pearlGlowOpacity = useTransform(scrollYProgress, [0.72, 0.88, 1], [0, 1, 1]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base Bright Snow-White Canvas */}
      <div className="absolute inset-0 bg-[#F8FBFF]" />

      {/* Mood 1: أبيض ثلجي مشرق — «دعوة فرح كريمة» */}
      <motion.div
        style={{
          opacity: snowWhiteOpacity,
          background:
            "radial-gradient(ellipse at 50% 24%, rgba(255, 255, 255, 0.98) 0%, rgba(240, 247, 255, 0.75) 50%, rgba(232, 242, 252, 0.45) 100%), radial-gradient(ellipse at 82% 14%, rgba(215, 232, 249, 0.48) 0%, transparent 52%), linear-gradient(180deg, #FFFFFF 0%, #F5FAFF 55%, #EEF5FC 100%)",
        }}
        className="absolute inset-0 will-change-[opacity]"
      />

      {/* Mood 2: أزرق كريستالي هادئ — «الوقت المتبقي للفرح» */}
      <motion.div
        style={{
          opacity: crystalBlueOpacity,
          background:
            "radial-gradient(ellipse at 20% 22%, rgba(155, 196, 236, 0.46) 0%, transparent 55%), radial-gradient(ellipse at 82% 72%, rgba(176, 212, 244, 0.44) 0%, transparent 55%), radial-gradient(ellipse at 50% 45%, rgba(236, 246, 255, 0.92) 0%, rgba(218, 235, 251, 0.65) 100%), linear-gradient(180deg, #EEF6FE 0%, #E3EFFB 52%, #E9F3FC 100%)",
        }}
        className="absolute inset-0 will-change-[opacity]"
      />

      {/* Mood 3: دفء ذهبي ناعم — «تفاصيل المناسبة» */}
      <motion.div
        style={{
          opacity: warmGoldOpacity,
          background:
            "radial-gradient(ellipse at 78% 20%, rgba(230, 200, 148, 0.42) 0%, transparent 55%), radial-gradient(ellipse at 22% 78%, rgba(218, 184, 128, 0.34) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(255, 251, 244, 0.92) 0%, rgba(248, 239, 223, 0.65) 100%), linear-gradient(180deg, #FCF8F0 0%, #F7EFE0 52%, #F9F3E7 100%)",
        }}
        className="absolute inset-0 will-change-[opacity]"
      />

      {/* Mood 4: وهج لؤلؤي دافئ — «الخاتمة» */}
      <motion.div
        style={{
          opacity: pearlGlowOpacity,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255, 250, 248, 0.95) 0%, transparent 60%), radial-gradient(ellipse at 20% 65%, rgba(240, 170, 184, 0.28) 0%, transparent 54%), radial-gradient(ellipse at 82% 28%, rgba(232, 203, 155, 0.38) 0%, transparent 54%), linear-gradient(180deg, #FDF8F6 0%, #F8EFF1 50%, #FBF4EC 100%)",
        }}
        className="absolute inset-0 will-change-[opacity]"
      />

      {/* Post-Open Enchanted Crystal-Card Ambient Light Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 1.4, ease: LUXURY_EASE }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Slow Rotating Conic Crystal-Light Veil (Matches the Card's Orbiting Light) */}
        <div
          className={
            prefersReduced
              ? "absolute top-1/2 left-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"
              : "orbit-light-ring absolute top-1/2 left-1/2 h-[180vmax] w-[180vmax] opacity-35 blur-3xl"
          }
          style={{
            animationDuration: "22s",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255, 255, 255, 0.72) 75deg, rgba(200, 169, 119, 0.30) 150deg, transparent 215deg, rgba(240, 54, 88, 0.14) 275deg, rgba(155, 183, 212, 0.32) 325deg, transparent 360deg)",
          }}
        />

        {/* Soft Breathing Champagne-Gold Light Orb (Top Right) */}
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : {
                  x: [0, -34, 18, 0],
                  y: [0, 26, -16, 0],
                  scale: [1, 1.12, 0.96, 1],
                  opacity: [0.35, 0.55, 0.4, 0.35],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-radial from-[#E6CFA5]/42 via-[#C8A977]/16 to-transparent blur-3xl"
        />

        {/* Soft Breathing Rose-Ruby & Frost Whisper Orb (Center-Left) */}
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : {
                  x: [0, 40, -20, 0],
                  y: [0, -30, 24, 0],
                  scale: [1, 1.15, 0.94, 1],
                  opacity: [0.22, 0.38, 0.25, 0.22],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[38%] -left-28 h-[460px] w-[460px] rounded-full bg-radial from-[#F03658]/14 via-[#D8A7A0]/18 to-transparent blur-3xl"
        />

        {/* Soft Breathing Pure Snow-White & Ice-Blue Halo (Bottom Center) */}
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : {
                  x: [0, -28, 28, 0],
                  y: [0, -22, 12, 0],
                  scale: [1, 1.08, 0.95, 1],
                  opacity: [0.42, 0.65, 0.46, 0.42],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-28 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-radial from-white/78 via-[#B6D2EC]/28 to-transparent blur-3xl"
        />

        {/* Delicate Luminous Crystal Rim Glow Around Viewport Edges */}
        <div
          className="absolute inset-0"
          style={{
            boxShadow:
              "inset 0 0 90px rgba(255, 255, 255, 0.72), inset 0 0 36px rgba(200, 169, 119, 0.14)",
          }}
        />
      </motion.div>

      {/* Ultra-Gentle Drifting Snowflakes / Frost Light Motes */}
      {SNOW_MOTES.map((m, idx) => (
        <span
          key={idx}
          className="snow-mote absolute -top-6 rounded-full"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            animationDuration: `${m.dur}s`,
            animationDelay: `${m.delay}s`,
            background:
              idx % 3 === 0
                ? "radial-gradient(circle, rgba(200, 169, 119, 0.55) 0%, rgba(255, 255, 255, 0) 75%)"
                : "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(155, 183, 212, 0.35) 60%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      ))}
    </div>
  );
}
