import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { MailOpen, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../animations/motionPresets";

interface WinterCoverCardProps {
  onOpen: () => void;
}

/**
 * Enchanted Quiet-Luxury Winter Snow Cover Card (Presentation Entry)
 * Clearly introduces the wedding invitation on first open; tapping anywhere on the card
 * unlocks the full invitation with a delicate frost-gold opening transition (and naturally
 * enables the ambient soundtrack on mobile browsers).
 */
export function WinterCoverCard({ onOpen }: WinterCoverCardProps) {
  const { brand, event } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    try {
      confetti({
        particleCount: 38,
        spread: 64,
        startVelocity: 26,
        gravity: 0.65,
        origin: { y: 0.56 },
        colors: ["#FFFFFF", "#C8A977", "#E4EEF7", "#D8A7A0"],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore if canvas unavailable
    }

    window.setTimeout(
      () => {
        onOpen();
      },
      prefersReduced ? 120 : 680
    );
  };

  return (
    <section
      aria-label="بطاقة افتتاح دعوة زفاف مصطفى وإيثار"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 py-10 text-center"
    >
      {/* Expanding Frosted Snow-Gold Light Veil on Open */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          opening
            ? { opacity: [0, 0.85, 0], scale: [0.65, 1.5, 1.8] }
            : { opacity: 0 }
        }
        transition={{ duration: 0.75, ease: LUXURY_EASE }}
        className="pointer-events-none fixed inset-0 z-40 bg-radial from-white via-[#E4EEF7]/75 to-transparent"
      />

      {/* Interactive Enchanted Presentation Card */}
      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label="اضغط لفتح دعوة زفاف مصطفى وإيثار"
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={
          opening
            ? {
                opacity: 0,
                y: -24,
                scale: 1.07,
                filter: prefersReduced ? "none" : "blur(10px)",
              }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        whileHover={prefersReduced || opening ? undefined : { y: -5, scale: 1.012 }}
        whileTap={prefersReduced || opening ? undefined : { scale: 0.985 }}
        transition={{ duration: opening ? 0.65 : 1.25, ease: LUXURY_EASE }}
        className="winter-glass group relative z-10 flex w-full max-w-[375px] cursor-pointer flex-col items-center overflow-hidden rounded-[30px] px-7 py-10 text-center shadow-[0_28px_72px_rgba(30,42,56,0.09),inset_0_1px_0_rgba(255,255,255,0.98)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A977] sm:max-w-[410px] sm:px-9 sm:py-12"
      >
        {/* Subtle Sweeping Frost-Champagne Light Sheen */}
        {!prefersReduced && (
          <motion.span
            aria-hidden="true"
            initial={{ x: "-140%" }}
            animate={{ x: "180%" }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 3.2,
              ease: LUXURY_EASE,
            }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/65 to-transparent"
          />
        )}

        {/* Delicate Double Hairline Champagne-Gold Frame */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-[22px] border border-[#C8A977]/40 transition-colors duration-500 group-hover:border-[#C8A977]/70"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[18px] rounded-[17px] border border-[#9BB7D4]/25"
        />

        {/* Subtle Top Envelope Fold Line (Gives Authentic Luxury Invitation Feel) */}
        <svg
          viewBox="0 0 360 90"
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 w-full opacity-55"
          fill="none"
        >
          <path
            d="M0 0 L180 68 L360 0"
            stroke="#C8A977"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
        </svg>

        {/* Eyebrow Label */}
        <span className="relative z-10 mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#AE8E5B]">
          <Sparkles className="h-3 w-3 text-[#C8A977]" />
          <span>دعوة زفاف خاصة</span>
          <Sparkles className="h-3 w-3 text-[#C8A977]" />
        </span>

        {/* Sculpted Champagne-Gold Wax Seal Medallion */}
        <motion.div
          animate={
            opening
              ? { scale: 1.45, opacity: 0, rotate: 18 }
              : prefersReduced
                ? undefined
                : { scale: [1, 1.045, 1] }
          }
          transition={
            opening
              ? { duration: 0.45, ease: LUXURY_EASE }
              : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative z-10 my-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#DFC597] via-[#C8A977] to-[#A78754] text-base font-bold text-white shadow-[0_12px_28px_rgba(200,169,119,0.42)]"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2.5 rounded-full border border-[#C8A977]/35"
          />
          {brand.monogramAr}
        </motion.div>

        {/* Invitation Heading */}
        <p
          className="relative z-10 text-sm font-medium text-[#5A6B7C]"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          يسرّنا دعوتكم لحضور حفل زفاف
        </p>

        {/* Couple Names */}
        <h1
          className="relative z-10 mt-2 text-5xl font-bold leading-tight text-[#1E2A38] sm:text-6xl"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          {brand.groomAr}{" "}
          <span className="text-3xl text-[#C8A977] sm:text-4xl">&amp;</span>{" "}
          {brand.brideAr}
        </h1>

        {/* Hairline Divider */}
        <span
          aria-hidden="true"
          className="relative z-10 my-5 h-[1px] w-28 bg-gradient-to-r from-transparent via-[#C8A977]/80 to-transparent"
        />

        {/* Date Line */}
        <p
          className="relative z-10 text-base font-semibold text-[#1E2A38]"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          {event.dayLabelAr} · {event.gregorianDisplayAr}
        </p>

        {/* Tactile 3D Mechanical Keycap Open Prompt */}
        <span className="winter-keycap-gold relative z-10 mt-7 inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold">
          <MailOpen className="h-4 w-4" />
          <span>اضغط لفتح الدعوة</span>
        </span>
      </motion.button>
    </section>
  );
}
