import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SkipForward, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { cinemaSound } from "../../utils/cinemaSoundEngine";
import { LUXURY_EASE } from "../../animations/motionPresets";

interface CinematicIntroProps {
  onComplete: () => void;
}

type IntroBeat = "quote" | "invite-line" | "couple-card";

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [beat, setBeat] = useState<IntroBeat>("quote");
  const [typedCount, setTypedCount] = useState(0);
  const prefersReduced = useReducedMotion();
  const quote = WHITE_JOY_CONFIG.intro.poeticLine;

  // Step 1: Type «بعض الليالي لا تشبه سواها... لأنها تُكتب في القلب إلى الأبد.» FIRST
  useEffect(() => {
    if (beat !== "quote") return;

    if (prefersReduced) {
      setTypedCount(quote.length);
      const t = window.setTimeout(() => setBeat("invite-line"), 700);
      return () => window.clearTimeout(t);
    }

    let idx = 0;
    let timer = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (idx >= quote.length) {
        timer = window.setTimeout(() => {
          if (!cancelled) setBeat("invite-line");
        }, 950);
        return;
      }
      const ch = quote[idx];
      idx += 1;
      setTypedCount(idx);
      if (ch !== " " && ch !== ".") {
        cinemaSound.playTypingClick();
      }
      timer = window.setTimeout(step, ch === " " ? 34 : 48);
    };

    timer = window.setTimeout(step, 320);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [beat, quote, prefersReduced]);

  // Step 2 -> Step 3 -> Direct Transition to Envelope
  useEffect(() => {
    if (beat === "invite-line") {
      const t = window.setTimeout(
        () => setBeat("couple-card"),
        prefersReduced ? 500 : 1550
      );
      return () => window.clearTimeout(t);
    }

    if (beat === "couple-card") {
      const t = window.setTimeout(
        onComplete,
        prefersReduced ? 1200 : 3000
      );
      return () => window.clearTimeout(t);
    }

    return undefined;
  }, [beat, onComplete, prefersReduced]);

  const showInviteLine = beat === "invite-line" || beat === "couple-card";
  const showCard = beat === "couple-card";

  return (
    <section
      aria-label="المشهد الافتتاحي: ليلة الفرح الأبيض"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Skip Button (Top-Right RTL) */}
      <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#F0D29C]/45 bg-[#062228]/80 px-3.5 py-1.5 text-xs font-semibold text-[#FDFBFF] shadow-[0_8px_24px_rgba(2,14,18,0.45)] backdrop-blur-xl transition hover:border-[#5FD3CC] hover:bg-[#092F38]/90"
        >
          <span>{WHITE_JOY_CONFIG.intro.skipLabel}</span>
          <SkipForward className="h-3.5 w-3.5 text-[#F0D29C]" />
        </button>
      </div>

      {/* Soft Luminous Champagne-Turquoise Aura */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.35, opacity: 0 }}
        animate={{ scale: showCard ? 1.45 : 0.95, opacity: 0.55 }}
        transition={{ duration: 1.4, ease: LUXURY_EASE }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-[#F0D29C]/35 via-[#5FD3CC]/18 to-transparent blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* BEAT 1: Poetic Typewriter Line FIRST */}
          {beat === "quote" && (
            <motion.div
              key="beat-quote"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: LUXURY_EASE }}
              className="flex max-w-sm flex-col items-center px-2"
            >
              <Sparkles className="mb-4 h-5 w-5 text-[#F0D29C] opacity-85" />
              <p
                className="min-h-[84px] text-2xl leading-relaxed font-semibold text-[#FDFBFF] drop-shadow-[0_3px_18px_rgba(4,24,29,0.95)] sm:text-3xl"
                style={{ fontFamily: "var(--font-display-ar)" }}
                aria-live="polite"
              >
                «{quote.slice(0, typedCount)}»
                {typedCount < quote.length && (
                  <span className="mr-1 inline-block h-[1em] w-[2px] translate-y-1 animate-pulse bg-[#F0D29C]" />
                )}
              </p>
            </motion.div>
          )}

          {/* BEAT 2 & 3: «نتشرّف بدعوتكم لزواج» THEN Haute-Couture Smoked-Emerald Crystal Card */}
          {showInviteLine && (
            <motion.div
              key="beat-invite-and-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: LUXURY_EASE }}
              className="flex w-full flex-col items-center"
            >
              {/* «نتشرّف بدعوتكم لزواج» */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: showCard ? -8 : 0,
                  scale: showCard ? 0.95 : 1.05,
                }}
                transition={{ duration: 0.9, ease: LUXURY_EASE }}
                className="flex flex-col items-center"
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#F0D29C] drop-shadow-[0_2px_10px_rgba(4,24,29,0.9)]">
                  <Sparkles className="h-3.5 w-3.5 text-[#F0D29C]" />
                  <span>{WHITE_JOY_CONFIG.brand.experienceTitle}</span>
                  <Sparkles className="h-3.5 w-3.5 text-[#F0D29C]" />
                </span>

                <h2
                  className="mt-2 text-3xl font-bold text-[#FDFBFF] drop-shadow-[0_3px_20px_rgba(4,24,29,0.95)] sm:text-4xl"
                  style={{ fontFamily: "var(--font-display-ar)" }}
                >
                  نتشرّف بدعوتكم لزواج
                </h2>
              </motion.div>

              {/* Haute-Couture Smoked-Emerald Crystal Glass & Liquid-Gold Card */}
              <motion.div
                initial={{ opacity: 0, y: 38, scale: 0.9, filter: "blur(10px)" }}
                animate={
                  showCard
                    ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, y: 38, scale: 0.9, filter: "blur(10px)" }
                }
                transition={{ duration: 1.05, ease: LUXURY_EASE }}
                className="relative mt-5 w-full max-w-[310px] overflow-hidden rounded-[28px] border border-[#F0D29C]/45 bg-gradient-to-b from-[#0E363E]/78 via-[#072329]/86 to-[#041519]/92 px-8 py-10 shadow-[0_32px_80px_rgba(2,14,18,0.68),inset_0_1px_1px_rgba(255,255,255,0.28)] backdrop-blur-2xl sm:max-w-[340px]"
              >
                {/* Slow Diagonal Liquid-Gold Shimmer Sweep */}
                {!prefersReduced && showCard && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: "-140%", opacity: 0 }}
                    animate={{ x: "160%", opacity: [0, 0.32, 0] }}
                    transition={{ duration: 1.9, delay: 0.25, ease: LUXURY_EASE }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#F5DBA6]/45 to-transparent"
                  />
                )}

                {/* Subtle Top Radial Specular Light Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-radial from-[#5FD3CC]/22 via-[#F0D29C]/12 to-transparent blur-2xl"
                />

                {/* Architectural Parisian Luxury Hairline Corner Brackets */}
                <span aria-hidden="true" className="pointer-events-none absolute top-4 right-4 h-5 w-5 border-t border-r border-[#F0D29C]/65" />
                <span aria-hidden="true" className="pointer-events-none absolute top-4 left-4 h-5 w-5 border-t border-l border-[#F0D29C]/65" />
                <span aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 h-5 w-5 border-r border-b border-[#F0D29C]/65" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-[#F0D29C]/65" />

                {/* Inner Subtle Hairline Frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-[18px] border border-white/10"
                />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Top Golden Monogram Crest */}
                  <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#F0D29C]/50 bg-[#F0D29C]/10 text-xs text-[#F5DBA6]">
                    ✦
                  </span>

                  {/* Groom Name: «مصطفى» in Liquid Champagne Gold */}
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.85, delay: 0.16, ease: LUXURY_EASE }}
                    className="bg-gradient-to-b from-[#FFF8E6] via-[#F2D59B] to-[#C99245] bg-clip-text text-6xl font-bold leading-tight text-transparent drop-shadow-[0_4px_20px_rgba(240,210,156,0.28)] sm:text-7xl"
                    style={{ fontFamily: "var(--font-calligraphy)" }}
                  >
                    {WHITE_JOY_CONFIG.brand.groomAr}
                  </motion.h1>

                  {/* Ultra-Fine Golden Ampersand Medallion Divider */}
                  <div
                    aria-hidden="true"
                    className="my-3 flex w-full items-center justify-center gap-3"
                  >
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-[#F0D29C]/75 to-transparent" />
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#F0D29C]/50 text-xs font-semibold text-[#F5DBA6]">
                      &amp;
                    </span>
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-[#F0D29C]/75 to-transparent" />
                  </div>

                  {/* Bride Name: «إيثار» in Pure Luminous Pearl White */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.85, delay: 0.28, ease: LUXURY_EASE }}
                    className="text-6xl font-bold leading-tight text-[#FFFFFF] drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)] sm:text-7xl"
                    style={{ fontFamily: "var(--font-calligraphy)" }}
                  >
                    {WHITE_JOY_CONFIG.brand.brideAr}
                  </motion.p>

                  {/* Engraved Bottom Date Line */}
                  <div className="mt-6 flex items-center gap-2 rounded-full border border-[#F0D29C]/35 bg-white/8 px-4 py-1.5 text-[11px] font-medium tracking-wider text-[#D9F0EE]">
                    <span>{WHITE_JOY_CONFIG.event.dayLabelAr}</span>
                    <span className="text-[#F0D29C]">·</span>
                    <span>{WHITE_JOY_CONFIG.event.gregorianDisplayAr}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
