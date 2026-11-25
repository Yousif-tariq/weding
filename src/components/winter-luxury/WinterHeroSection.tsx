import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronDown, MailOpen, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../animations/motionPresets";

interface WinterHeroSectionProps {
  opened: boolean;
  onOpen: () => void;
}

/**
 * Futuristic Magical Winter Gateway Hero (First Entry Screen of the Invitation)
 * Displays `/images/reception.jpg` vividly with a winter ice-blue color grade,
 * topped by a chamfered frosted-crystal Quranic Verse prism card, sculpted couple names,
 * and a 3D champagne-gold keyboard keycap button to unlock the invitation smoothly.
 */
export function WinterHeroSection({ opened, onOpen }: WinterHeroSectionProps) {
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

  const handleOpenClick = () => {
    if (!opened) {
      try {
        confetti({
          particleCount: 42,
          spread: 68,
          startVelocity: 28,
          gravity: 0.65,
          origin: { y: 0.72 },
          colors: ["#FFFFFF", "#C8A977", "#9BB7D4", "#D8A7A0"],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore if canvas unavailable
      }
      onOpen();
      window.setTimeout(() => {
        document
          .getElementById("invitation")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    } else {
      document
        .getElementById("invitation")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-label="المدخل الرئيسي: دعوة زفاف مصطفى وإيثار"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 py-16 text-center"
    >
      {/* Vivid Full-Bleed Jirtiq Photography Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#152232]"
      >
        <img
          src="/images/jirtiq.jpg"
          alt=""
          loading="eager"
          style={
            prefersReduced
              ? {
                  filter: "brightness(0.68) contrast(1.06) saturate(1.02)",
                }
              : {
                  filter: "brightness(0.68) contrast(1.06) saturate(1.02)",
                  transform: `translate3d(${parallax.x * -0.55}px, ${parallax.y * -0.55}px, 0) scale(1.07)`,
                }
          }
          className="h-full w-full object-cover object-center opacity-100 transition-transform duration-700 ease-out"
        />

        {/* Balanced Cinema Contrast Vignette + Seamless Bottom Transition to Snow-White Page */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(16, 28, 44, 0.24) 0%, rgba(15, 27, 42, 0.56) 72%, rgba(12, 22, 34, 0.72) 100%), linear-gradient(180deg, rgba(15, 27, 42, 0.42) 0%, rgba(15, 27, 42, 0.14) 55%, rgba(247, 250, 253, 0.96) 100%)",
          }}
        />
      </div>

      {/* Centered Futuristic Gateway Composition (Fade In + Up, 1.35s) */}
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
        {/* Futuristic Spatial Basmala Pill */}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E6CFA5]/55 bg-[#152232]/55 px-5 py-1.5 text-xs font-semibold tracking-[0.16em] text-[#F2DEC0] shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#E6CFA5]" />
          <span style={{ fontFamily: "var(--font-display-ar)" }}>
            بسم الله الرحمن الرحيم
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#E6CFA5]" />
        </span>

        {/* Futuristic Chamfered Frosted-Crystal Prism Card for the Quranic Verse */}
        <div
          style={{
            clipPath:
              "polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)",
          }}
          className="relative mt-6 w-full max-w-xl overflow-hidden border border-[#E6CFA5]/55 bg-[#0F1E30]/58 px-7 py-6 shadow-[0_28px_68px_rgba(6,14,24,0.48),inset_0_1px_1px_rgba(255,255,255,0.32)] backdrop-blur-xl sm:px-10 sm:py-7"
        >
          {/* Top Glowing Champagne-Ice Laser Line */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-[#F2DEC0] to-transparent"
          />

          {/* Slow Sweeping Holographic Snow-Light Sheen */}
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
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}

          {/* Precision Architectural Micro Corner Brackets */}
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-4 h-3 w-3 border-t border-r border-[#F2DEC0]/80" />
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-4 h-3 w-3 border-t border-l border-[#F2DEC0]/80" />
          <span aria-hidden="true" className="pointer-events-none absolute right-4 bottom-2.5 h-3 w-3 border-r border-b border-[#9BB7D4]/85" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-4 h-3 w-3 border-b border-l border-[#9BB7D4]/85" />

          <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#B9D3EC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F2DEC0] shadow-[0_0_8px_#F2DEC0]" />
            <span>قال تعالى</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#9BB7D4] shadow-[0_0_8px_#9BB7D4]" />
          </div>

          <p
            className="relative z-10 mt-2.5 text-lg leading-[2] font-semibold text-[#FFFFFF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-xl"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا﴾
          </p>
        </div>

        {/* Futuristic Luminous Couple Names Over Reception Scene */}
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
            <span className="flex h-9 w-9 rotate-45 items-center justify-center border border-[#F2DEC0]/75 bg-[#0F1E30]/65 shadow-[0_0_20px_rgba(242,222,192,0.35)] backdrop-blur-md">
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
        <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#F2DEC0]/50 bg-[#0F1E30]/58 px-6 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl">
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

        {/* Primary 3D Ruby-Glass Mechanical Keycap Gateway CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleOpenClick}
            className="ruby-glass-keycap inline-flex items-center gap-2.5 px-9 py-3.5 text-sm font-bold tracking-wide sm:text-base"
          >
            {opened ? (
              <>
                <span>تصفّح تفاصيل الدعوة</span>
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </>
            ) : (
              <>
                <MailOpen className="h-4 w-4" />
                <span>اضغط لفتح الدعوة</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
