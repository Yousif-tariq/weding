import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Ultra-lightweight Scroll-Reactive Quiet Luxury Winter Snow Ambiance
 * Pure GPU opacity cross-fade across 4 luminous ambient light moods (zero blur-3xl overhead):
 * 1. Bright Snow-White («دعوة فرح كريمة»)
 * 2. Serene Crystal-Blue («الوقت المتبقي للفرح»)
 * 3. Soft Warm Champagne-Gold («تفاصيل المناسبة»)
 * 4. Warm Pearlescent Rose-Ivory Glow («الخاتمة»)
 */
const SNOW_MOTES = [
  { left: "8%", size: 5, dur: 19, delay: 0 },
  { left: "21%", size: 7, dur: 23, delay: -6 },
  { left: "35%", size: 4, dur: 17, delay: -11 },
  { left: "49%", size: 6, dur: 25, delay: -3 },
  { left: "63%", size: 5, dur: 20, delay: -14 },
  { left: "77%", size: 7, dur: 24, delay: -8 },
  { left: "90%", size: 5, dur: 18, delay: -4 },
];

interface WinterSnowAmbianceProps {
  active?: boolean;
}

export function WinterSnowAmbiance({ active = false }: WinterSnowAmbianceProps) {
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden contain-strict"
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

      {/* Lightweight Zero-Blur Radial Ambient Light Halo (Matches Card Glow) */}
      {active && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 86% 12%, rgba(230, 207, 165, 0.28) 0%, transparent 44%), radial-gradient(circle at 12% 48%, rgba(240, 54, 88, 0.08) 0%, transparent 46%), radial-gradient(circle at 50% 92%, rgba(255, 255, 255, 0.72) 0%, transparent 52%)",
            boxShadow:
              "inset 0 0 70px rgba(255, 255, 255, 0.68), inset 0 0 28px rgba(200, 169, 119, 0.12)",
          }}
        />
      )}

      {/* Ultra-Gentle GPU-Only Drifting Snowflakes */}
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
