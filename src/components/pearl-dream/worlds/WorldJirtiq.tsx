import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../../animations/motionPresets";

/**
 * WORLD 02: زفة العمر وبركة الجرتق — Futuristic Royal Sudanese Heritage Fusion
 */
export function WorldJirtiq() {
  const { media, chapters } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());

  return (
    <section
      aria-label="عالم زفة العمر وبركة الجرتق"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="future-glass-panel future-chamfer relative z-10 flex w-full max-w-[420px] flex-col items-center overflow-hidden border-[#EC5B78]/40 px-6 py-7 sm:px-8 sm:py-8"
      >
        {!prefersReduced && (
          <span
            aria-hidden="true"
            className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#F0D29C]/22 to-transparent"
          />
        )}

        <span aria-hidden="true" className="pointer-events-none absolute top-0 inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-[#EC5B78] to-transparent" />

        <span className="inline-flex items-center gap-1.5 border border-[#EC5B78]/45 bg-[#EC5B78]/15 px-3.5 py-1 text-[10.5px] font-semibold text-[#FFBAC8]">
          <Sparkles className="h-3 w-3 text-[#F0D29C]" />
          <span>الأصالة السودانية · الزفة والجرتق</span>
        </span>

        <h2
          className="mt-2 bg-gradient-to-b from-[#FFFFFF] via-[#F7E3B8] to-[#D4A056] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          {chapters.jirtiq.title}
        </h2>

        {/* Dual Futuristic Chamfered Glass Frames (Non-Circular) */}
        <div className="mt-5 grid w-full grid-cols-2 gap-3.5">
          <div className="flex flex-col items-center">
            <div className="future-chamfer-sm relative h-40 w-full overflow-hidden border border-[#F0D29C]/60 bg-white/8 p-1.5 shadow-[0_14px_36px_rgba(2,14,18,0.55)] sm:h-44">
              <div className="future-chamfer-sm h-full w-full overflow-hidden">
                <img
                  src={media.zaffaPhoto}
                  alt="الزفة الملكية"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <span
              className="mt-2 text-xs font-bold text-[#FDFBFF] sm:text-sm"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              الزفة الملكية
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="future-chamfer-sm relative h-40 w-full overflow-hidden border border-[#EC5B78]/70 bg-white/8 p-1.5 shadow-[0_0_32px_rgba(236,91,120,0.28)] sm:h-44">
              <div className="future-chamfer-sm h-full w-full overflow-hidden">
                <img
                  src={media.jirtiqPhoto}
                  alt="الجرتق السوداني الأصيل"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <span
              className="mt-2 text-xs font-bold text-[#FFBAC8] sm:text-sm"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              بركة الجرتق
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 text-xs leading-relaxed font-medium text-[#DDF0EE] sm:text-sm">
          <p>{chapters.jirtiq.zaffaCopy}</p>
          <p>{chapters.jirtiq.jirtiqCopy}</p>
        </div>

        {/* Luminous Smoked-Crystal Epigraph */}
        <blockquote
          className="mt-4 w-full rounded-2xl border border-[#F0D29C]/40 bg-gradient-to-l from-[#EC5B78]/18 via-white/8 to-[#F0D29C]/15 px-4 py-2.5 text-sm font-bold text-[#FFF4DC] sm:text-base"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          {chapters.jirtiq.traditionalCheer}
        </blockquote>
      </motion.div>
    </section>
  );
}
