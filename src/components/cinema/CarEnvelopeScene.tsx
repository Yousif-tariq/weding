import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { MailOpen, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { MagicalSmokeCanvas } from "../opening/MagicalSmokeCanvas";
import { LUXURY_EASE } from "../../animations/motionPresets";

interface CarEnvelopeSceneProps {
  onOpenInvitation: () => void;
}

/**
 * Enchanted Direct Envelope Reveal Scene (No Car)
 * Immediately presents the floating floral wedding envelope with embossed golden wax seal
 * and the 3D Ruby Mechanical Keycap CTA button («اضغط هنا لفتح الدعوة»).
 */
export function CarEnvelopeScene({ onOpenInvitation }: CarEnvelopeSceneProps) {
  const [isCracking, setIsCracking] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleOpenClick = () => {
    if (isCracking) return;
    setIsCracking(true);

    try {
      confetti({
        particleCount: 72,
        spread: 74,
        origin: { y: 0.62 },
        colors: ["#F0D29C", "#FFFFFF", "#5FD3CC", "#EC3052"],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore if canvas unavailable
    }

    window.setTimeout(
      () => {
        onOpenInvitation();
      },
      prefersReduced ? 180 : 950
    );
  };

  return (
    <section
      aria-label="المشهد السينمائي: ظرف دعوة الزفاف"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-10 text-center"
    >
      {/* Radiant Golden Light Flash when Wax Seal Cracks */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          isCracking
            ? { opacity: [0, 0.85, 0], scale: [0.6, 1.5, 1.9] }
            : { opacity: 0 }
        }
        transition={{ duration: 0.9, ease: LUXURY_EASE }}
        className="pointer-events-none fixed inset-0 z-40 bg-radial from-white via-[#F6E4BE]/70 to-transparent"
      />

      <div className="relative flex min-h-[420px] w-full max-w-lg flex-col items-center justify-center">
        {/* Ethereal Swirling Pearl & Gold Mist Behind Envelope */}
        <MagicalSmokeCanvas intensity="envelope" />

        {/* Enchanted Direct Floating Ivory Envelope with Golden Wax Seal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.86, filter: "blur(10px)" }}
          animate={
            isCracking
              ? { opacity: 1, y: -18, scale: 1.12, filter: "blur(0px)" }
              : { opacity: 1, y: 0, scale: 1.04, filter: "blur(0px)" }
          }
          transition={{ duration: 1.05, ease: LUXURY_EASE }}
          className="relative z-20 flex flex-col items-center justify-center"
        >
          {/* Warm Champagne & Soft Turquoise Aura Behind Envelope */}
          <motion.div
            aria-hidden="true"
            animate={{ scale: [0.94, 1.1, 0.94], opacity: [0.48, 0.82, 0.48] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-8 rounded-full bg-radial from-[#F0D29C]/45 via-[#5FD3CC]/22 to-transparent blur-2xl"
          />

          {/* Orbiting Hairline Halo Around Envelope */}
          <div
            aria-hidden="true"
            className="animate-orbit-slow pointer-events-none absolute -inset-6 rounded-full border border-dashed border-[#F0D29C]/30"
          />

          {/* Envelope Asset */}
          <div className="relative">
            <motion.img
              src={WHITE_JOY_CONFIG.media.envelopeImage}
              alt="ظرف دعوة زفاف مصطفى وإيثار"
              animate={
                !isCracking && !prefersReduced ? { y: [0, -8, 0] } : undefined
              }
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-60 object-contain drop-shadow-[0_26px_48px_rgba(2,14,18,0.58)] sm:w-72"
            />

            {/* Interactive Golden Wax Seal Medallion over Envelope */}
            <motion.div
              animate={
                isCracking
                  ? { scale: 1.65, opacity: 0, rotate: 24, filter: "blur(6px)" }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ duration: 0.65, ease: LUXURY_EASE }}
              className="pointer-events-none absolute top-[54%] left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#FFF4D6] bg-gradient-to-br from-[#F2D59B] via-[#D4A056] to-[#9E6E29] text-xs font-bold text-[#192044] shadow-[0_8px_22px_rgba(212,160,86,0.55)]"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              {WHITE_JOY_CONFIG.brand.monogramAr}
            </motion.div>
          </div>
        </motion.div>

        {/* Enchanted Couple Name & 3D Ruby Mechanical Keycap Button */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.35, ease: LUXURY_EASE }}
          className="relative z-30 mt-7 flex flex-col items-center gap-3"
        >
          <p
            className="text-2xl font-bold text-[#FDFBFF] drop-shadow-[0_2px_16px_rgba(4,24,29,0.92)] sm:text-3xl"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {WHITE_JOY_CONFIG.brand.groomAr}{" "}
            <span className="text-[#F0D29C]">&amp;</span>{" "}
            {WHITE_JOY_CONFIG.brand.brideAr}
          </p>

          <motion.button
            type="button"
            onClick={handleOpenClick}
            whileHover={prefersReduced ? undefined : { scale: 1.03 }}
            className="ruby-keycap-btn group relative mt-1 inline-flex items-center gap-2.5 overflow-hidden px-9 py-3.5 text-sm font-bold tracking-wide"
          >
            {/* Enchanted Sweeping Light Sheen Inside Red Keycap */}
            {!prefersReduced && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-130%" }}
                animate={{ x: "160%" }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 2.6,
                  ease: LUXURY_EASE,
                }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}
            <MailOpen className="relative z-10 h-4 w-4 text-[#FFE3E8]" />
            <span className="relative z-10">اضغط هنا لفتح الدعوة</span>
            <Sparkles className="relative z-10 h-4 w-4 text-[#FFE3E8]" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
