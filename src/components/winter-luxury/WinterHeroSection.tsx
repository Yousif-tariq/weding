import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../animations/motionPresets";

/**
 * Enchanted Winter Crystal Gateway Hero (First Entry Screen of the Invitation)
 * Displays `/images/jirtiq.jpg` vividly with a serene luminous vignette,
 * topped by a transparent crystal-glass Quranic Verse card with orbiting edge light,
 * sculpted couple names, and automatic smooth transition upward after 3 seconds.
 */
export function WinterHeroSection() {
  const { brand, event } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReduced) return;
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      setParallax({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, [prefersReduced]);

  return (
    <section
      id="hero-verse"
      aria-label="المدخل الرئيسي: دعوة زفاف مصطفى وإيثار"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 py-16 text-center"
    >
      {/* Vivid Full-Bleed Jirtiq Photography Background with Dreamy Breathing Zoom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#152232]"
      >
        <div
          style={
            prefersReduced
              ? undefined
              : {
                  transform: `translate3d(${parallax.x * -0.55}px, ${parallax.y * -0.55}px, 0)`,
                }
          }
          className="h-full w-full transition-transform duration-700 ease-out"
        >
          <motion.img
            src="/images/jirtiq.jpg"
            alt=""
            loading="eager"
            initial={{ scale: 1.04 }}
            animate={
              prefersReduced
                ? { scale: 1.04 }
                : {
                    scale: [1.04, 1.16, 1.04],
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "brightness(0.66) contrast(1.06) saturate(1.02)",
              willChange: "transform",
            }}
            className="h-full w-full object-cover object-center opacity-100"
          />
        </div>

        {/* Balanced Cinema Contrast Vignette + Seamless Bottom Transition to Snow-White Page */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(16, 28, 44, 0.22) 0%, rgba(15, 27, 42, 0.54) 72%, rgba(12, 22, 34, 0.72) 100%), linear-gradient(180deg, rgba(15, 27, 42, 0.42) 0%, rgba(15, 27, 42, 0.14) 55%, rgba(247, 250, 253, 0.98) 100%)",
          }}
        />
      </div>

      {/* Centered Gateway Composition (Fade In + Up, 1.35s) */}
      <motion.div
        initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0.3 : 1.35, ease: LUXURY_EASE }}
        style={
          prefersReduced
            ? undefined
            : {
                transform: `translate3d(${parallax.x * 0.22}px, ${parallax.y * 0.22}px, 0)`,
              }
        }
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center transition-transform duration-700 ease-out"
      >
        {/* Luminous Crystal Basmala Pill */}
        <span className="inline-flex items-center gap-2.5 rounded-full border border-[#F2DEC0]/55 bg-[#0F1E30]/45 px-6 py-2 text-sm font-semibold tracking-[0.14em] text-[#FAF0DC] shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:text-base">
          <Sparkles className="h-3.5 w-3.5 text-[#F2DEC0]" />
          <span style={{ fontFamily: '"Scheherazade New", "Amiri", serif' }}>
            بسم الله الرحمن الرحيم
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#F2DEC0]" />
        </span>

        {/* Transparent Crystal-Glass Quranic Verse Card with Orbiting Edge Light */}
        <div className="relative mt-6 w-full max-w-xl rounded-[28px] p-[2px] shadow-[0_28px_72px_rgba(6,14,24,0.45)]">
          {/* Soft Outer Luminous Aura Around Verse Card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 overflow-hidden rounded-[32px] opacity-65 blur-md"
          >
            <div
              className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 225deg, rgba(255, 255, 255, 0.95) 268deg, rgba(242, 222, 192, 0.95) 300deg, rgba(240, 54, 88, 0.65) 330deg, rgba(255, 255, 255, 0.95) 352deg, transparent 360deg)",
              }}
            />
          </div>

          {/* Crisp Orbiting Light Beam Tracing the Verse Card Edges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
          >
            <div
              className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255, 255, 255, 0.28) 0deg, rgba(155, 183, 212, 0.25) 215deg, rgba(255, 255, 255, 1) 262deg, rgba(242, 222, 192, 1) 298deg, rgba(240, 54, 88, 0.8) 332deg, rgba(255, 255, 255, 1) 352deg, rgba(255, 255, 255, 0.28) 360deg)",
              }}
            />
          </div>

          {/* Transparent Frosted-Crystal Inner Surface */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/35 bg-[#0F1E30]/38 px-7 py-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_16px_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:px-10 sm:py-8">
            {/* Slow Sweeping Crystal Light Sheen */}
            {!prefersReduced && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-140%" }}
                animate={{ x: "180%" }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatDelay: 3.4,
                  ease: LUXURY_EASE,
                }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
            )}

            <div className="relative z-10 flex items-center justify-center gap-2.5 text-xs font-semibold tracking-[0.22em] text-[#F2DEC0]">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#F2DEC0]/80" />
              <span>قال تعالى</span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#F2DEC0]/80" />
            </div>

            <p
              className="relative z-10 mt-3 text-[24px] leading-[2.1] font-semibold text-[#FFFFFF] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-[30px]"
              style={{ fontFamily: '"Scheherazade New", "Amiri", serif' }}
            >
              ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا﴾
            </p>
          </div>
        </div>

        {/* Luminous Couple Names Over Jirtiq Scene */}
        <div className="relative mt-9 flex w-full max-w-md flex-col items-center sm:mt-11">
          <h1
            className="bg-gradient-to-b from-[#FFFFFF] via-[#FAF0DC] to-[#D9B982] bg-clip-text text-6xl font-bold leading-tight tracking-wide text-transparent drop-shadow-[0_6px_26px_rgba(0,0,0,0.55)] sm:text-8xl"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {brand.groomAr}
          </h1>

          {/* Precision Laser-Gold Ampersand Diamond Emblem */}
          <div
            aria-hidden="true"
            className="my-2.5 flex w-full max-w-[240px] items-center justify-center gap-4 sm:my-3"
          >
            <span className="h-[1px] flex-1 bg-gradient-to-l from-[#F2DEC0] to-transparent" />
            <span className="flex h-9 w-9 rotate-45 items-center justify-center border border-[#F2DEC0]/75 bg-[#0F1E30]/55 shadow-[0_0_20px_rgba(242,222,192,0.35)] backdrop-blur-md">
              <span
                className="-rotate-45 text-lg font-semibold text-[#F2DEC0]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                &amp;
              </span>
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-[#F2DEC0] to-transparent" />
          </div>

          <p
            className="bg-gradient-to-b from-[#FFFFFF] via-[#F2F7FC] to-[#C9DCF0] bg-clip-text text-6xl font-bold leading-tight tracking-wide text-transparent drop-shadow-[0_6px_26px_rgba(0,0,0,0.55)] sm:text-8xl"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {brand.brideAr}
          </p>
        </div>

        {/* Floating Spatial Crystal Date Capsule */}
        <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#F2DEC0]/50 bg-[#0F1E30]/48 px-6 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F2DEC0] shadow-[0_0_8px_#F2DEC0]" />
          <p
            className="text-base font-bold tracking-wide text-[#FFFFFF] sm:text-lg"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            {event.dayLabelAr} · {event.gregorianDisplayAr}
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-[#9BB7D4] shadow-[0_0_8px_#9BB7D4]" />
        </div>

        {/* Warm Editorial Tagline */}
        <p className="mt-3.5 text-sm font-medium tracking-wide text-[#EEF4FA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-base">
          يسرّنا دعوتكم لمشاركتنا فرحتنا
        </p>
      </motion.div>
    </section>
  );
}
