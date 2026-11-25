import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Clock, Share2, Sparkles } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../../config/whiteJoyConfig";
import { toArabicDigits, useCountdown } from "../../../hooks/useCountdown";
import { downloadWeddingIcsFile } from "../../../utils/calendar";
import { LUXURY_EASE } from "../../../animations/motionPresets";

/**
 * WORLD 03: موعد ليلتنا المباركة — Futuristic Celestial Chronometer Sanctuary
 */
export function WorldDate() {
  const { event, chapters, brand, venue } = WHITE_JOY_CONFIG;
  const countdown = useCountdown(event.isoDate);
  const [sharedDate, setSharedDate] = useState(false);
  const prefersReduced = Boolean(useReducedMotion());

  const hijriDisplay = useMemo(() => {
    try {
      const d = new Date(event.isoDate);
      const formatted = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
      return `الموافق ${formatted} هـ`;
    } catch {
      return null;
    }
  }, [event.isoDate]);

  const handleShareDate = async () => {
    const text = `موعد زفاف ${brand.groomAr} و ${brand.brideAr}\n${event.dayLabelAr} — ${event.gregorianDisplayAr} (${event.timeDisplayAr})\n${venue.name} — ${venue.cityDistrict}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: brand.experienceTitle, text });
      } catch {
        // cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setSharedDate(true);
      window.setTimeout(() => setSharedDate(false), 2200);
    }
  };

  return (
    <section
      aria-label="عالم موعد ليلتنا المباركة"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-28 text-center"
    >
      {/* Monumental Rotating Futuristic Telemetry Rings Behind Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 sm:h-[580px] sm:w-[580px]"
      >
        <svg
          viewBox="0 0 500 500"
          className="animate-orbit-slow h-full w-full opacity-45"
          fill="none"
        >
          <circle
            cx="250"
            cy="250"
            r="230"
            stroke="#5FD3CC"
            strokeWidth="1"
            strokeDasharray="4 10"
          />
          <circle
            cx="250"
            cy="250"
            r="196"
            stroke="#F0D29C"
            strokeWidth="0.8"
            strokeOpacity="0.55"
          />
          <circle cx="250" cy="20" r="4.5" fill="#F0D29C" />
          <circle cx="446" cy="250" r="3.5" fill="#5FD3CC" />
        </svg>
      </div>

      {/* Main Futuristic Chronometer Glass Module */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: LUXURY_EASE }}
        className="future-glass-panel future-chamfer relative z-10 flex w-full max-w-[410px] flex-col items-center overflow-hidden px-6 py-7 sm:px-8 sm:py-8"
      >
        {!prefersReduced && (
          <span
            aria-hidden="true"
            className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#5FD3CC]/22 to-transparent"
          />
        )}

        <span aria-hidden="true" className="pointer-events-none absolute top-0 inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-[#5FD3CC] to-transparent" />

        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.18em] text-[#5FD3CC]">
          <Sparkles className="h-3 w-3 text-[#F0D29C]" />
          <span>التقويم السماوي للفرح</span>
        </span>

        <h2
          className="mt-1 bg-gradient-to-b from-[#FFFFFF] via-[#F7E3B8] to-[#D4A056] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          {chapters.date.title}
        </h2>

        {/* Futuristic Chamfered Holographic Chronometer Display (Non-Circular) */}
        <div className="future-chamfer-sm relative mt-5 flex w-full flex-col items-center justify-center border border-[#5FD3CC]/50 bg-gradient-to-b from-[#0C3740]/82 to-[#04181D]/90 px-5 py-6 shadow-[0_0_40px_rgba(95,211,204,0.18),inset_0_0_24px_rgba(240,210,156,0.12)]">
          <span className="text-base font-bold tracking-wider text-[#5FD3CC] sm:text-lg">
            {event.dayLabelAr}
          </span>
          <time
            className="mt-1.5 bg-gradient-to-b from-[#FFFFFF] via-[#F5DBA6] to-[#D4A056] bg-clip-text text-4xl font-bold text-transparent sm:text-[42px]"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            {event.gregorianDisplayAr}
          </time>
          {hijriDisplay && (
            <span className="mt-1.5 text-sm font-medium text-[#CBE6E4]">
              {hijriDisplay}
            </span>
          )}
          <div className="mt-3.5 inline-flex items-center gap-1.5 border border-[#F0D29C]/50 bg-white/10 px-4 py-1.5 text-sm font-bold text-[#FFF7E6]">
            <Clock className="h-4 w-4 text-[#5FD3CC]" />
            <span>{event.timeDisplayAr}</span>
          </div>
        </div>

        {/* 4 Futuristic Smoked-Glass Countdown Capsules */}
        <div className="mt-5 grid w-full grid-cols-4 gap-2">
          {[
            { label: "يوم", val: toArabicDigits(countdown.days, 3) },
            { label: "ساعة", val: toArabicDigits(countdown.hours, 2) },
            { label: "دقيقة", val: toArabicDigits(countdown.minutes, 2) },
            { label: "ثانية", val: toArabicDigits(countdown.seconds, 2) },
          ].map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#5FD3CC]/35 bg-white/8 py-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]"
            >
              <span
                className="text-xl font-bold leading-none text-[#F5DBA6] sm:text-2xl"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {u.val}
              </span>
              <span className="mt-1 text-[10px] font-medium text-[#CBE6E4]">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex w-full items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={downloadWeddingIcsFile}
            className="white-keycap-btn inline-flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold"
          >
            <CalendarPlus className="h-3.5 w-3.5 text-[#D4A056]" />
            <span>حفظ بالتقويم</span>
          </button>

          <button
            type="button"
            onClick={handleShareDate}
            className="white-keycap-btn inline-flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold"
          >
            <Share2 className="h-3.5 w-3.5 text-[#0D5B63]" />
            <span>{sharedDate ? "تم النسخ ✓" : "مشاركة الموعد"}</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
