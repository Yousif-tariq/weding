import { motion, useReducedMotion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../../animations/motionPresets";

/**
 * WORLD 01: بحضوركم يزدان فرحنا — Futuristic Spatial Holographic Sanctuary
 */
export function WorldWelcome() {
  const { brand, media, chapters, event } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());

  return (
    <section
      aria-label="عالم بحضوركم يزدان فرحنا"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-28 text-center"
    >
      {/* Main Futuristic Spatial Module */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="future-glass-panel future-chamfer relative z-10 flex w-full max-w-[410px] flex-col items-center overflow-hidden px-6 py-7 sm:px-8 sm:py-8"
      >
        {/* Holographic Sweep Beam */}
        {!prefersReduced && (
          <span
            aria-hidden="true"
            className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#5FD3CC]/22 to-transparent"
          />
        )}

        {/* Top Luminous Prism Edge */}
        <span aria-hidden="true" className="pointer-events-none absolute top-0 inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-[#5FD3CC] to-transparent" />

        {/* Wide Futuristic Chamfered Display Frame (Non-Circular) */}
        <div className="future-chamfer-sm relative h-44 w-full border border-[#F0D29C]/55 bg-white/5 p-1.5 shadow-[0_0_32px_rgba(95,211,204,0.18)] sm:h-48">
          <div className="future-chamfer-sm relative h-full w-full overflow-hidden">
            <img
              src={media.receptionPhoto}
              alt="استقبال الضيوف الكرام"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04181D]/82 via-transparent to-[#5FD3CC]/12" />
            <span
              className="absolute inset-x-0 bottom-2.5 text-center text-2xl font-bold text-[#FFF7E6] drop-shadow-md"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              {brand.groomAr} &amp; {brand.brideAr}
            </span>
          </div>
        </div>

        {/* Floating Editorial Heading */}
        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.18em] text-[#5FD3CC]">
            <Sparkles className="h-3 w-3 text-[#F0D29C]" />
            <span>استقبال الضيوف الكرام</span>
          </span>
          <h2
            className="mt-1 bg-gradient-to-b from-[#FFFFFF] via-[#F7E3B8] to-[#D4A056] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            بحضوركم يزدان فرحنا
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed font-medium text-[#DDF0EE] sm:text-sm">
            {chapters.welcome.message}
          </p>
        </div>

        {/* Futuristic Honored Families Glass Bar */}
        <div className="mt-5 w-full rounded-2xl border border-[#F0D29C]/35 bg-white/8 px-5 py-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-md">
          <p
            className="text-base font-bold text-[#FDFBFF] sm:text-lg"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            {brand.families[0]}
          </p>
          <span className="my-0.5 block text-xs font-bold text-[#F0D29C]">و</span>
          <p
            className="text-base font-bold text-[#FDFBFF] sm:text-lg"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            {brand.families[1]}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#5FD3CC]/35 bg-[#5FD3CC]/12 px-3.5 py-0.5 text-[11px] font-semibold text-[#5FD3CC]">
            <Clock className="h-3 w-3 text-[#F0D29C]" />
            <span>{event.receptionTimeAr}</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
