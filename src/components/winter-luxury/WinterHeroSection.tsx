import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../animations/motionPresets";

/**
 * Enchanted Winter Crystal Gateway Hero (First Entry Screen of the Invitation)
 * Displays `/images/jirtiq.jpg` vividly with a dreamy GPU breathing zoom,
 * topped by a transparent crystal-glass Quranic Verse card with orbiting edge light,
 * sculpted couple names, and automatic smooth transition upward after 3 seconds.
 */
export function WinterHeroSection() {
  const { brand, event } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());

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
        <motion.img
          src="/images/jirtiq.jpg"
          alt=""
          loading="eager"
          initial={{ scale: 1.04 }}
          animate={
            prefersReduced
              ? { scale: 1.04 }
              : {
                  scale: [1.04, 1.15, 1.04],
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
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center"
      >
        {/* Luminous Crystal Basmala Pill */}
        <span className="inline-flex items-center gap-2.5 rounded-full border border-[#F2DEC0]/55 bg-[#0F1E30]/50 px-6 py-2 text-sm font-semibold tracking-[0.14em] text-[#FAF0DC] shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md sm:text-base">
          <Sparkles className="h-3.5 w-3.5 text-[#F2DEC0]" />
          <span style={{ fontFamily: '"Scheherazade New", "Amiri", serif' }}>
            بسم الله الرحمن الرحيم
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#F2DEC0]" />
        </span>

        {/* Transparent Crystal-Glass Quranic Verse Card with Orbiting Edge Light */}
        <div className="relative mt-6 w-full max-w-xl rounded-[28px] p-[2px] shadow-[0_24px_64px_rgba(6,14,24,0.45),0_0_28px_rgba(242,222,192,0.22)]">
          {/* Crisp Orbiting Light Beam Tracing the Verse Card Edges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
          >
            <div
              className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255, 255, 255, 0.24) 0deg, rgba(155, 183, 212, 0.22) 220deg, rgba(255, 255, 255, 0.95) 268deg, rgba(242, 222, 192, 0.92) 304deg, rgba(240, 54, 88, 0.58) 334deg, rgba(255, 255, 255, 0.92) 352deg, rgba(255, 255, 255, 0.24) 360deg)",
              }}
            />
          </div>

          {/* Transparent Frosted-Crystal Inner Surface */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/35 bg-[#0F1E30]/48 px-6 py-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.42)] backdrop-blur-md sm:px-10 sm:py-8">
            <div className="relative z-10 flex items-center justify-center gap-2.5 text-xs font-semibold tracking-[0.22em] text-[#F2DEC0]">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#F2DEC0]/80" />
              <span>قال تعالى</span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#F2DEC0]/80" />
            </div>

            <p
              className="relative z-10 mt-3 text-[21px] leading-[2.05] font-semibold text-[#FFFFFF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.48)] sm:text-[26px]"
              style={{ fontFamily: '"Scheherazade New", "Amiri", serif' }}
            >
              ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾
            </p>
          </div>
        </div>

        {/* Luminous Couple Names Over Jirtiq Scene */}
        <div className="relative mt-7 flex w-full max-w-md flex-col items-center sm:mt-9">
          <div className="flex flex-col items-center">
            <h1
              className="py-1 bg-gradient-to-b from-[#FFFFFF] via-[#FAF0DC] to-[#D9B982] bg-clip-text text-6xl font-bold leading-tight tracking-wide text-transparent drop-shadow-[0_6px_22px_rgba(0,0,0,0.52)] sm:text-8xl"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              {brand.groomAr}
            </h1>
            <span
              dir="ltr"
              className="-mt-1 text-xl tracking-wider text-[#F2DEC0]/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-2xl"
              style={{ fontFamily: '"Great Vibes", "Playfair Display", serif' }}
            >
              Mustafa
            </span>
          </div>

          {/* Precision Laser-Gold Ampersand Diamond Emblem */}
          <div
            aria-hidden="true"
            className="my-2.5 flex w-full max-w-[220px] items-center justify-center gap-4 sm:my-3"
          >
            <span className="h-[1px] flex-1 bg-gradient-to-l from-[#F2DEC0] to-transparent" />
            <span className="flex h-9 w-9 rotate-45 items-center justify-center border border-[#F2DEC0]/75 bg-[#0F1E30]/55 shadow-[0_0_16px_rgba(242,222,192,0.3)] backdrop-blur-md">
              <span
                className="-rotate-45 text-lg font-semibold text-[#F2DEC0]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                &amp;
              </span>
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-[#F2DEC0] to-transparent" />
          </div>

          <div className="flex flex-col items-center">
            <p
              className="py-1 bg-gradient-to-b from-[#FFFFFF] via-[#F2F7FC] to-[#C9DCF0] bg-clip-text text-6xl font-bold leading-tight tracking-wide text-transparent drop-shadow-[0_6px_22px_rgba(0,0,0,0.52)] sm:text-8xl"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              {brand.brideAr}
            </p>
            <span
              dir="ltr"
              className="-mt-1 text-xl tracking-wider text-[#DCEBFA]/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-2xl"
              style={{ fontFamily: '"Great Vibes", "Playfair Display", serif' }}
            >
              Ethar
            </span>
          </div>
        </div>

        {/* Floating Spatial Crystal Date Capsule (Bilingual) */}
        <div className="mt-6 flex flex-col items-center gap-1 rounded-[24px] border border-[#F2DEC0]/50 bg-[#0F1E30]/52 px-6 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F2DEC0] shadow-[0_0_8px_#F2DEC0]" />
            <p
              className="text-base font-bold tracking-wide text-[#FFFFFF] sm:text-lg"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              {event.dayLabelAr} {event.gregorianDisplayAr}
            </p>
            <span className="h-1.5 w-1.5 rounded-full bg-[#9BB7D4] shadow-[0_0_8px_#9BB7D4]" />
          </div>
          <p
            dir="ltr"
            className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#E4EEF7]/85 sm:text-xs"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Thursday December 3 2026
          </p>
        </div>

        {/* Warm Bilingual Editorial Tagline */}
        <p className="mt-3.5 text-sm font-medium tracking-wide text-[#EEF4FA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-base">
          يسرنا دعوتكم لمشاركتنا فرحتنا
        </p>
        <p
          dir="ltr"
          className="mt-1 text-xs italic tracking-wider text-[#F2DEC0]/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-sm"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          We are honored to invite you to share our joy
        </p>
      </motion.div>
    </section>
  );
}
