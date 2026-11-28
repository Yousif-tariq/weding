import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Calendar,
  CalendarPlus,
  ChevronDown,
  Clock,
  Crown,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Utensils,
} from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { toArabicDigits, useCountdown } from "../../hooks/useCountdown";
import { downloadWeddingIcsFile } from "../../utils/calendar";
import { LUXURY_EASE } from "../../animations/motionPresets";

const sectionReveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: LUXURY_EASE },
};

const CARD_SNOWFLAKES = [
  { left: "8%", size: 6, dur: 6.2, delay: 0.0, drift: 12 },
  { left: "20%", size: 4, dur: 5.0, delay: 0.8, drift: -10 },
  { left: "34%", size: 7, dur: 6.8, delay: 0.3, drift: 14 },
  { left: "48%", size: 5, dur: 5.6, delay: 1.1, drift: -12 },
  { left: "62%", size: 8, dur: 7.0, delay: 0.5, drift: 15 },
  { left: "76%", size: 4, dur: 4.9, delay: 1.4, drift: -11 },
  { left: "89%", size: 6, dur: 6.1, delay: 0.2, drift: 10 },
  { left: "14%", size: 5, dur: 5.8, delay: 2.0, drift: -13 },
  { left: "54%", size: 6, dur: 6.4, delay: 1.7, drift: 12 },
  { left: "82%", size: 7, dur: 6.9, delay: 2.3, drift: -14 },
];

const InvitationLiveWriter = memo(function InvitationLiveWriter({
  bodyMsg,
  fam1,
  fam2,
  prefersReduced,
}: {
  bodyMsg: string;
  fam1: string;
  fam2: string;
  prefersReduced: boolean;
}) {
  const totalChars = bodyMsg.length + fam1.length + fam2.length;
  const [typedChars, setTypedChars] = useState(prefersReduced ? totalChars : 0);

  useEffect(() => {
    if (prefersReduced) {
      setTypedChars(totalChars);
      return;
    }

    let count = 0;
    let timer = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (count >= totalChars) return;
      count += 1;
      setTypedChars(count);

      const atEndBody = count === bodyMsg.length;
      const atEndFam1 = count === bodyMsg.length + fam1.length;
      const inSignatures = count > bodyMsg.length;
      const prevChar =
        count <= bodyMsg.length
          ? bodyMsg[count - 1]
          : count <= bodyMsg.length + fam1.length
          ? fam1[count - bodyMsg.length - 1]
          : fam2[count - bodyMsg.length - fam1.length - 1];

      // Calm, deliberate human-calligraphy rhythm: letter-by-letter with a natural breath between words
      const delay = atEndBody
        ? 520
        : atEndFam1
        ? 380
        : prevChar === " "
        ? 115
        : inSignatures
        ? 78
        : 62;

      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [prefersReduced, totalChars, bodyMsg, fam1, fam2]);

  const bodyText = bodyMsg.slice(0, Math.min(typedChars, bodyMsg.length));
  const fam1Offset = Math.max(0, typedChars - bodyMsg.length);
  const fam1Text = fam1.slice(0, Math.min(fam1Offset, fam1.length));
  const fam2Offset = Math.max(0, typedChars - bodyMsg.length - fam1.length);
  const fam2Text = fam2.slice(0, Math.min(fam2Offset, fam2.length));
  const showDivider = typedChars >= bodyMsg.length;
  const isWritingDone = typedChars >= totalChars;

  return (
    <div className="w-full" aria-live="polite">
      {/* Royal Poetic Invitation Message — Connected Arabic Letter-by-Letter */}
      <p
        className="mx-auto min-h-[175px] max-w-xl bg-gradient-to-b from-[#1A2636] via-[#283B52] to-[#4A2E3F] bg-clip-text text-[22px] leading-[2.25] font-semibold text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)] sm:min-h-[195px] sm:text-[27px] sm:leading-[2.3]"
        style={{ fontFamily: '"Scheherazade New", "Amiri", serif' }}
      >
        {bodyText}
        {typedChars > 0 && typedChars < bodyMsg.length && (
          <span className="mr-1 inline-block h-[0.9em] w-[2.5px] translate-y-1.5 animate-pulse rounded-full bg-gradient-to-b from-[#D82648] to-[#C8A977] shadow-[0_0_10px_rgba(216,38,72,0.85)]" />
        )}
      </p>

      {/* Ornamental Champagne-Gold & Sparkle Divider */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={showDivider ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.75, ease: LUXURY_EASE }}
        className="mx-auto my-6 flex items-center justify-center gap-3"
      >
        <span className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-[#C8A977] to-[#D82648]/60 sm:w-24" />
        <span className="text-sm text-[#C8A977] drop-shadow-[0_0_8px_rgba(200,169,119,0.8)]">
          ✦
        </span>
        <span className="h-[1.5px] w-16 bg-gradient-to-l from-transparent via-[#C8A977] to-[#D82648]/60 sm:w-24" />
      </motion.div>

      {/* Families Signature — Ceremonial Letter-by-Letter Calligraphy */}
      <div className="flex min-h-[108px] flex-col items-center gap-2.5">
        {fam1Text && (
          <p
            className="py-1 bg-gradient-to-l from-[#8F6B32] via-[#1E2A38] to-[#9E243F] bg-clip-text text-[26px] font-bold leading-relaxed text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.65)] sm:text-[34px]"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {fam1Text}
            {fam1Offset > 0 && fam1Offset < fam1.length && (
              <span className="mr-1 inline-block h-[0.88em] w-[2.5px] translate-y-1 animate-pulse rounded-full bg-[#D82648] shadow-[0_0_8px_#D82648]" />
            )}
          </p>
        )}

        {fam2Text && (
          <p
            className="py-1 bg-gradient-to-r from-[#8F6B32] via-[#1E2A38] to-[#9E243F] bg-clip-text text-[26px] font-bold leading-relaxed text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.65)] sm:text-[34px]"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {fam2Text}
            {fam2Offset > 0 && !isWritingDone && (
              <span className="mr-1 inline-block h-[0.88em] w-[2.5px] translate-y-1 animate-pulse rounded-full bg-[#D82648] shadow-[0_0_8px_#D82648]" />
            )}
          </p>
        )}
      </div>
    </div>
  );
});

export function WinterInvitationCardSection() {
  const { brand, chapters } = WHITE_JOY_CONFIG;
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const prefersReduced = Boolean(useReducedMotion());

  const bodyMsg = chapters.welcome.message;
  const fam1 = brand.families[0];
  const fam2 = `و${brand.families[1]}`;

  const [revealed, setRevealed] = useState(prefersReduced);

  useEffect(() => {
    if (!inView || revealed) return;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setRevealed(true);
    }, 1000);

    return () => window.clearTimeout(revealTimer);
  }, [inView, revealed, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="invitation"
      aria-label="دعوة فرح كريمة"
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 pt-20 pb-12 sm:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: LUXURY_EASE }}
        className="relative mx-auto w-full max-w-[740px] rounded-[30px] p-[2.5px] shadow-[0_24px_60px_rgba(30,42,56,0.10),0_0_28px_rgba(200,169,119,0.22)]"
      >
        {/* Crisp Orbiting Light Beam Tracing the Card Border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]"
        >
          <div
            className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255, 255, 255, 0.35) 0deg, rgba(155, 183, 212, 0.25) 215deg, rgba(255, 255, 255, 1) 262deg, rgba(200, 169, 119, 1) 298deg, rgba(240, 54, 88, 0.85) 332deg, rgba(255, 255, 255, 1) 352deg, rgba(255, 255, 255, 0.35) 360deg)",
            }}
          />
        </div>

        {/* Pure Transparent Crystal-Glass Inner Surface */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/38 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.92),inset_0_-1px_16px_rgba(255,255,255,0.45)] backdrop-blur-md sm:p-10 md:p-12">
        {/* Pure Snow-White Falling Snowfall Inside the Card (Pure CSS GPU) */}
        {!prefersReduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            {CARD_SNOWFLAKES.slice(0, 7).map((flake, idx) => (
              <span
                key={idx}
                style={{
                  left: flake.left,
                  width: flake.size,
                  height: flake.size,
                  animationDuration: `${flake.dur}s`,
                  animationDelay: `${flake.delay}s`,
                }}
                className="card-snow absolute top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]"
              />
            ))}
          </div>
        )}

        {/* Smart 1-Second Crystal Reveal & Royal Invitation Typography */}
        <div className="relative z-10 mx-auto max-w-2xl px-2 py-3 text-center sm:px-5">
            <span
              className="ruby-glass-keycap inline-flex items-center gap-3 rounded-[20px] px-8 py-3 text-2xl font-bold tracking-wide sm:text-4xl"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              <span className="text-lg text-[#FFE3EA]">✦</span>
              <span>دعوة فرح كريمة</span>
              <span className="text-lg text-[#FFE3EA]">✦</span>
            </span>

            <div className="mt-8 min-h-[300px] flex flex-col items-center justify-center sm:min-h-[320px]">
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div
                    key="smart-crystal-reveal-cue"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.06, y: -8 }}
                    transition={{ duration: 0.38, ease: LUXURY_EASE }}
                    className="flex flex-col items-center justify-center gap-5 py-10"
                  >
                    {/* 3 Breathing Luminous Crystal Stars */}
                    <div className="flex items-center gap-4">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{
                            scale: [0.85, 1.35, 0.85],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 0.9,
                            delay: dot * 0.16,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-lg text-[#C8A977] drop-shadow-[0_0_10px_rgba(200,169,119,0.85)]"
                        >
                          ✦
                        </motion.span>
                      ))}
                    </div>

                    {/* Sleek Sweeping Golden-Ruby Light Bar */}
                    <div className="relative h-[3px] w-48 overflow-hidden rounded-full bg-[#C8A977]/20 sm:w-60">
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "-100%" }}
                        transition={{
                          duration: 0.95,
                          ease: LUXURY_EASE,
                        }}
                        className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#D82648] to-[#C8A977] shadow-[0_0_12px_rgba(216,38,72,0.8)]"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed-invitation-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, ease: LUXURY_EASE }}
                    className="w-full"
                  >
                    <InvitationLiveWriter
                      bodyMsg={bodyMsg}
                      fam1={fam1}
                      fam2={fam2}
                      prefersReduced={prefersReduced}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle Downward Scroll Cue Below the Invitation Card */}
      <motion.a
        href="#countdown"
        aria-label="التمرير للأسفل"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: LUXURY_EASE }}
        className="mt-7 inline-flex flex-col items-center gap-1.5 text-[#5A6B7C] transition-colors hover:text-[#1E2A38]"
      >
        <span className="text-xs font-medium tracking-wide">مرر للأسفل</span>
        <motion.span
          animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/60 text-[#D82648] shadow-[0_8px_22px_rgba(30,42,56,0.08)] backdrop-blur-md"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}

const EVENING_PROGRAM = [
  {
    step: "٠١",
    title: "استقبال الأحبة",
    time: "٨:٣٠ م",
    Icon: Heart,
    delay: "0s",
  },
  {
    step: "٠٢",
    title: "العشاء",
    time: "١٠:٠٠ م",
    Icon: Utensils,
    delay: "-2.3s",
  },
  {
    step: "٠٣",
    title: "الزفة",
    time: "١٢:٠٠ ص",
    Icon: Crown,
    delay: "-4.6s",
  },
];

const CountdownSection = memo(function CountdownSection({
  isoDate,
}: {
  isoDate: string;
}) {
  const countdown = useCountdown(isoDate);

  return (
    <section id="countdown" className="relative px-5 py-16 sm:px-6 sm:py-24">
      <motion.div {...sectionReveal} className="relative z-10 mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#9BB7D4]/40 bg-white/75 px-4 py-1 text-[11px] font-semibold tracking-[0.2em] text-[#AE8E5B] shadow-xs backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-[#C8A977]" />
          <span>على موعد مع البهجة</span>
          <Sparkles className="h-3 w-3 text-[#C8A977]" />
        </span>

        <h2
          className="mt-3 text-3xl font-bold text-[#1E2A38] sm:text-4xl"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          الوقت المتبقي للفرح
        </h2>

        {/* Serene Frosted-Crystal Console Framing the 4 Orbiting-Light Cards */}
        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-white/75 bg-white/30 p-4 shadow-[0_20px_54px_rgba(30,42,56,0.07),inset_0_1px_1px_rgba(255,255,255,0.92)] backdrop-blur-md sm:p-6">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
              {[
                {
                  code: "٠١",
                  label: "أيام",
                  value: toArabicDigits(countdown.days, 2),
                  progress: Math.min(100, Math.max(8, (countdown.days / 365) * 100)),
                  delay: "0s",
                },
                {
                  code: "٠٢",
                  label: "ساعات",
                  value: toArabicDigits(countdown.hours, 2),
                  progress: Math.max(8, (countdown.hours / 24) * 100),
                  delay: "-2.5s",
                },
                {
                  code: "٠٣",
                  label: "دقائق",
                  value: toArabicDigits(countdown.minutes, 2),
                  progress: Math.max(8, (countdown.minutes / 60) * 100),
                  delay: "-5s",
                },
                {
                  code: "٠٤",
                  label: "ثواني",
                  value: toArabicDigits(countdown.seconds, 2),
                  progress: Math.max(5, (countdown.seconds / 60) * 100),
                  delay: "-7.5s",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group relative rounded-[22px] p-[2px] shadow-[0_10px_26px_rgba(30,42,56,0.07)] transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Crisp Orbiting Light Beam Tracing Card Edges */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
                  >
                    <div
                      className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
                      style={{
                        animationDelay: item.delay,
                        background:
                          "conic-gradient(from 0deg, rgba(255, 255, 255, 0.3) 0deg, rgba(155, 183, 212, 0.22) 220deg, rgba(255, 255, 255, 0.96) 268deg, rgba(200, 169, 119, 0.92) 304deg, rgba(240, 54, 88, 0.62) 334deg, rgba(255, 255, 255, 0.96) 352deg, rgba(255, 255, 255, 0.3) 360deg)",
                      }}
                    />
                  </div>

                  {/* Transparent Crystal-Glass Card Surface */}
                  <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-white/65 bg-white/44 px-4 pt-4 pb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-md">
                    {/* Top Telemetry Row */}
                    <div className="flex items-center justify-between text-[10px] font-semibold tracking-widest text-[#7D93AA]">
                      <span>{item.code}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C8A977] shadow-[0_0_6px_#C8A977]" />
                    </div>

                    {/* Center Precision Digital-Glide Numeral */}
                    <div className="relative my-5 flex h-14 items-center justify-center overflow-hidden sm:h-16">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={item.value}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.32, ease: LUXURY_EASE }}
                          className="bg-gradient-to-b from-[#1E2A38] via-[#2F455C] to-[#AE8E5B] bg-clip-text text-5xl font-bold leading-none text-transparent sm:text-[54px]"
                          style={{ fontFamily: "var(--font-display-ar)" }}
                        >
                          {item.value}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Unit Label & Live Laser Progress Bar */}
                    <div className="w-full">
                      <span className="block text-xs font-bold tracking-wider text-[#3B4E62]">
                        {item.label}
                      </span>
                      <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-[#9BB7D4]/25">
                        <div
                          className="h-full rounded-full bg-gradient-to-l from-[#C8A977] via-[#D8A7A0] to-[#9BB7D4] transition-all duration-700 ease-out"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export function WinterInvitationSections() {
  const { brand, event, venue } = WHITE_JOY_CONFIG;
  const prefersReduced = Boolean(useReducedMotion());
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const interval = window.setInterval(() => {
      setActiveStage((prev) => (prev + 1) % EVENING_PROGRAM.length);
    }, 3800);
    return () => window.clearInterval(interval);
  }, [prefersReduced]);

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

  return (
    <div className="relative z-10 w-full">
      {/* =========================================================
          SECTION 2: ISOLATED WINTER-CRYSTAL CHRONOMETER COUNTDOWN
         ========================================================= */}
      <CountdownSection isoDate={event.isoDate} />

      {/* =========================================================
          SECTION 4: EVENT DETAILS — ENCHANTED PASSING-LIGHT TIMELINE
         ========================================================= */}
      <section id="details" aria-label="تفاصيل المناسبة" className="relative overflow-hidden px-5 py-16 sm:py-24">
        <motion.div {...sectionReveal} className="relative mx-auto max-w-5xl">
          <div className="text-center">
            <h2
              className="text-3xl font-bold text-[#1E2A38] sm:text-4xl"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              تفاصيل المناسبة
            </h2>
          </div>

          {/* Interactive Passing-Comet Luminous Timeline */}
          <div className="relative mt-14">
            {/* Desktop Horizontal Luminous Track + Gliding Comet (RTL: Right -> Left) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[54px] right-[12%] left-[12%] hidden h-[3px] overflow-visible rounded-full bg-gradient-to-l from-[#C8A977]/25 via-[#9BB7D4]/45 to-[#D82648]/25 md:block"
            >
              {!prefersReduced && (
                <>
                  {/* Continuous Flowing Golden-Crystal Light Stream */}
                  <motion.div
                    initial={{ right: "0%", opacity: 0 }}
                    animate={{
                      right: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-l from-transparent via-white to-[#D82648]/85 shadow-[0_0_12px_rgba(200,169,119,0.7)]"
                  />
                  {/* Glowing Star Orb Riding the Track */}
                  <motion.div
                    initial={{ right: "0%" }}
                    animate={{ right: ["0%", "100%"] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_20px_rgba(200,169,119,0.85)]"
                  />
                </>
              )}
            </div>

            {/* Mobile Vertical Luminous Track + Gliding Comet (Pixel-Aligned With Node Center) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-10 bottom-10 right-[27px] w-[3px] overflow-hidden rounded-full bg-gradient-to-b from-[#C8A977]/25 via-[#9BB7D4]/45 to-[#D82648]/25 md:hidden"
            >
              {!prefersReduced && (
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: ["0%", "100%"] }}
                  transition={{
                    duration: 5.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-1/2 h-20 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-white to-[#D82648]/85 shadow-[0_0_12px_rgba(200,169,119,0.7)]"
                />
              )}
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-6 pr-12 md:grid-cols-3 md:gap-7 md:pr-0">
              {EVENING_PROGRAM.map((stage, idx) => {
                const isActive = activeStage === idx;
                const StageIcon = stage.Icon;

                return (
                  <motion.div
                    key={stage.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.85,
                      delay: idx * 0.16,
                      ease: LUXURY_EASE,
                    }}
                    onMouseEnter={() => setActiveStage(idx)}
                    onClick={() => setActiveStage(idx)}
                    className="relative cursor-pointer"
                  >
                    {/* Mobile Timeline Node Dot */}
                    <div
                      aria-hidden="true"
                      className={`absolute top-1/2 -right-8 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-500 md:hidden ${
                        isActive
                          ? "scale-125 border-white bg-[#D82648] shadow-[0_0_18px_rgba(240,54,88,0.85)]"
                          : "border-white/80 bg-[#C8A977]/80"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    {/* Floating Animated Card Wrapper */}
                    <motion.div
                      animate={
                        isActive && !prefersReduced
                          ? { y: -8, scale: 1.02 }
                          : { y: 0, scale: 1 }
                      }
                      transition={{ duration: 0.6, ease: LUXURY_EASE }}
                      className={`relative rounded-[26px] p-[2px] transition-shadow duration-500 ${
                        isActive
                          ? "shadow-[0_20px_50px_rgba(30,42,56,0.12),0_0_26px_rgba(200,169,119,0.32)]"
                          : "shadow-[0_16px_40px_rgba(30,42,56,0.08)]"
                      }`}
                    >
                      {/* Crisp Orbiting Edge Light */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]"
                      >
                        <div
                          className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
                          style={{
                            animationDelay: stage.delay,
                            background:
                              "conic-gradient(from 0deg, rgba(255, 255, 255, 0.35) 0deg, rgba(155, 183, 212, 0.25) 215deg, rgba(255, 255, 255, 1) 262deg, rgba(200, 169, 119, 1) 298deg, rgba(240, 54, 88, 0.9) 332deg, rgba(255, 255, 255, 1) 352deg, rgba(255, 255, 255, 0.35) 360deg)",
                          }}
                        />
                      </div>

                      {/* Transparent Crystal-Glass Card Interior */}
                      <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] border border-white/70 bg-white/42 px-6 py-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-md">
                        {/* Passing Diagonal Crystal Light Sweep When Active */}
                        {!prefersReduced && isActive && (
                          <motion.div
                            key={`sheen-${activeStage}`}
                            aria-hidden="true"
                            initial={{ x: "140%", opacity: 0 }}
                            animate={{ x: "-140%", opacity: [0, 0.85, 0] }}
                            transition={{ duration: 1.4, ease: LUXURY_EASE }}
                            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                          />
                        )}

                        {/* Step Number Pill */}
                        <span className="text-[11px] font-bold tracking-[0.24em] text-[#AE8E5B]">
                          ✦ {stage.step} ✦
                        </span>

                        {/* 3D Ruby-Glass Emblem with Blooming Halo */}
                        <div className="relative mt-4 flex h-16 w-16 items-center justify-center">
                          {!prefersReduced && isActive && (
                            <motion.span
                              initial={{ scale: 0.85, opacity: 0.7 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="pointer-events-none absolute inset-0 rounded-[20px] border-2 border-[#F03658]/60"
                            />
                          )}
                          <div className="ruby-glass-keycap flex h-16 w-16 items-center justify-center rounded-[18px]">
                            <StageIcon className="h-7 w-7 text-white drop-shadow-xs" />
                          </div>
                        </div>

                        {/* Stage Title */}
                        <h3
                          className="mt-5 text-3xl font-bold text-[#1E2A38]"
                          style={{ fontFamily: "var(--font-calligraphy)" }}
                        >
                          {stage.title}
                        </h3>

                        {/* Luminous Time Capsule */}
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C8A977]/45 bg-white/75 px-5 py-1.5 shadow-[0_6px_18px_rgba(30,42,56,0.06)] backdrop-blur-md">
                          <Clock className="h-4 w-4 text-[#D82648]" />
                          <span
                            className="text-lg font-bold text-[#1E2A38]"
                            style={{ fontFamily: "var(--font-display-ar)" }}
                          >
                            الساعة {stage.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Compact Crystal-Glass Date & Venue Quick-Action Strip */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-white/75 bg-white/46 px-5 py-5 shadow-[0_12px_32px_rgba(30,42,56,0.06)] backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex items-center gap-3.5 text-right">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C8A977]/40 bg-white/80 text-[#C8A977]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className="text-base font-bold text-[#1E2A38]"
                    style={{ fontFamily: "var(--font-display-ar)" }}
                  >
                    {event.dayLabelAr} {event.gregorianDisplayAr}
                  </p>
                  {hijriDisplay && (
                    <p className="text-xs text-[#64788E]">{hijriDisplay}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={downloadWeddingIcsFile}
                className="ruby-glass-keycap inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold sm:w-auto sm:py-2"
              >
                <CalendarPlus className="h-3.5 w-3.5 text-[#FFE6EC]" />
                <span>حفظ بالتقويم</span>
              </button>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-white/75 bg-white/46 px-5 py-5 shadow-[0_12px_32px_rgba(30,42,56,0.06)] backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex items-center gap-3.5 text-right">
                <div className="ruby-glass-keycap flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px]">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p
                    className="text-base font-bold text-[#1E2A38]"
                    style={{ fontFamily: "var(--font-display-ar)" }}
                  >
                    {venue.name}
                  </p>
                  <p className="text-xs text-[#64788E]">{venue.cityDistrict}</p>
                </div>
              </div>
              <div className="flex w-full flex-col items-stretch gap-2.5 sm:w-auto sm:items-end">
                <a
                  href="#location"
                  className="ruby-glass-keycap inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold sm:py-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#FFE6EC]" />
                  <span>عرض الخريطة</span>
                </a>
                <a
                  href={`https://wa.me/${venue.whatsappNumber}?text=${encodeURIComponent(
                    `السلام عليكم، بخصوص دعوة زفاف ${brand.groomAr} و ${brand.brideAr} في ${venue.name}: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ruby-glass-keycap inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold sm:py-2"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#FFE6EC]" />
                  <span>للتواصل أو الاعتذار</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 5: VENUE & GOOGLE MAPS (Soft Winter Frost Surface)
         ========================================================= */}
      <section
        id="location"
        aria-label="وجهة لقائنا والفرح"
        className="border-y border-white/45 bg-white/15 px-5 py-20 backdrop-blur-[2px] sm:py-24"
      >
        <motion.div {...sectionReveal} className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-10 bg-gradient-to-r from-transparent to-[#C8A977] sm:w-16"
              />
              <Sparkles className="h-4 w-4 text-[#C8A977]" />
              <span
                aria-hidden="true"
                className="h-[1.5px] w-10 bg-gradient-to-l from-transparent to-[#C8A977] sm:w-16"
              />
            </div>

            <h2
              className="mt-3 py-1 bg-gradient-to-b from-[#1E2A38] via-[#2B3E54] to-[#9E7C47] bg-clip-text text-4xl font-bold leading-snug text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.65)] sm:text-5xl"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              وجهة لقائنا والفرح
            </h2>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/55 px-5 py-2 text-sm font-semibold text-[#33465B] shadow-[0_8px_24px_rgba(30,42,56,0.06)] backdrop-blur-md sm:text-base">
              <MapPin className="h-4 w-4 shrink-0 text-[#D82648]" />
              <span>
                {venue.name} {venue.cityDistrict}
              </span>
            </div>
          </div>

          {/* Embedded Google Maps Frame with Orbiting Edge Light & Floating 3D Ruby-Glass GPS Keycap Pin */}
          <div className="relative mt-9 rounded-[28px] p-[2px] shadow-[0_24px_60px_rgba(30,42,56,0.09),0_0_24px_rgba(200,169,119,0.2)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
            >
              <div
                className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(255, 255, 255, 0.35) 0deg, rgba(155, 183, 212, 0.25) 215deg, rgba(255, 255, 255, 1) 262deg, rgba(200, 169, 119, 1) 298deg, rgba(240, 54, 88, 0.85) 332deg, rgba(255, 255, 255, 1) 352deg, rgba(255, 255, 255, 0.35) 360deg)",
                }}
              />
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-white/65 bg-white/42 p-2 backdrop-blur-md">
              <div className="relative h-[320px] w-full overflow-hidden rounded-[20px] bg-[#E2ECF6] sm:h-[380px]">
                <iframe
                  title={`خريطة ${venue.name}`}
                  src="https://maps.google.com/maps?q=%D9%82%D8%A7%D8%B9%D8%A9%20%D8%B1%D9%8A%D9%85%D8%A7%D8%B3%20%D9%84%D9%84%D8%A7%D8%AD%D8%AA%D9%81%D8%A7%D9%84%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%20%D8%AD%D9%8A%20%D8%A7%D9%84%D8%B4%D9%81%D8%A7%D8%A1&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
                {/* Floating 3D Ruby-Glass Keycap GPS Badge */}
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`فتح موقع ${venue.name} في خرائط Google`}
                  className="ruby-glass-keycap absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-[14px] shadow-[0_10px_24px_rgba(182,20,52,0.38)]"
                >
                  <MapPin className="relative z-10 h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 6: ENCHANTED CRYSTAL-GLASS GRAND FINALE FOOTER
         ========================================================= */}
      <footer className="relative overflow-hidden px-5 pt-16 pb-20 text-center sm:pt-24 sm:pb-24">
        <motion.div
          {...sectionReveal}
          className="relative z-10 mx-auto max-w-2xl rounded-[32px] p-[2.5px] shadow-[0_24px_60px_rgba(30,42,56,0.10),0_0_28px_rgba(200,169,119,0.22)]"
        >
          {/* Crisp Orbiting Edge Light Beam */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
          >
            <div
              className="orbit-light-ring absolute top-1/2 left-1/2 h-[220%] w-[220%]"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255, 255, 255, 0.35) 0deg, rgba(155, 183, 212, 0.25) 215deg, rgba(255, 255, 255, 1) 262deg, rgba(200, 169, 119, 1) 298deg, rgba(240, 54, 88, 0.88) 332deg, rgba(255, 255, 255, 1) 352deg, rgba(255, 255, 255, 0.35) 360deg)",
              }}
            />
          </div>

          {/* Transparent Crystal-Glass Finale Interior */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/42 px-6 py-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-md sm:px-12 sm:py-14">
            {/* Gentle Falling Pure-White Snowflakes Inside Finale Card (Pure CSS GPU) */}
            {!prefersReduced && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                {CARD_SNOWFLAKES.slice(0, 5).map((flake, idx) => (
                  <span
                    key={`footer-snow-${idx}`}
                    style={{
                      left: flake.left,
                      width: flake.size,
                      height: flake.size,
                      animationDuration: `${flake.dur + 1.5}s`,
                      animationDelay: `${flake.delay}s`,
                    }}
                    className="card-snow absolute top-0 rounded-full bg-white shadow-[0_0_8px_#FFFFFF]"
                  />
                ))}
              </div>
            )}

            {/* 3D Ruby-Glass Monogram Seal Crest (English Luxury Finale) */}
            <div dir="ltr" className="relative z-10 flex flex-col items-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                {!prefersReduced && (
                  <motion.span
                    animate={{ scale: [1, 1.38, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-0 rounded-[20px] border border-[#F03658]/55"
                  />
                )}
                <div
                  className="ruby-glass-keycap flex h-16 w-16 items-center justify-center rounded-[18px] text-lg font-semibold tracking-wider text-white"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  M &amp; E
                </div>
              </div>

              {/* Ornamental Crown Divider */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="h-[1.5px] w-14 bg-gradient-to-r from-transparent via-[#C8A977] to-[#D82648]/60 sm:w-20" />
                <Sparkles className="h-4 w-4 text-[#C8A977]" />
                <span className="h-[1.5px] w-14 bg-gradient-to-l from-transparent via-[#C8A977] to-[#D82648]/60 sm:w-20" />
              </div>

              {/* Sculpted Radiant Groom & Bride English Calligraphy */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <span
                  className="py-1 bg-gradient-to-b from-[#1A2636] via-[#2B3E54] to-[#9E7C47] bg-clip-text text-5xl font-normal leading-tight text-transparent drop-shadow-[0_3px_12px_rgba(255,255,255,0.75)] sm:text-7xl"
                  style={{ fontFamily: '"Great Vibes", "Playfair Display", serif' }}
                >
                  Mustafa
                </span>

                <span className="flex h-10 w-10 rotate-45 items-center justify-center rounded-lg border border-[#C8A977]/65 bg-white/75 shadow-[0_6px_18px_rgba(200,169,119,0.24)] backdrop-blur-md">
                  <span
                    className="-rotate-45 text-lg font-semibold text-[#D82648]"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    &amp;
                  </span>
                </span>

                <span
                  className="py-1 bg-gradient-to-b from-[#1A2636] via-[#2B3E54] to-[#9E243F] bg-clip-text text-5xl font-normal leading-tight text-transparent drop-shadow-[0_3px_12px_rgba(255,255,255,0.75)] sm:text-7xl"
                  style={{ fontFamily: '"Great Vibes", "Playfair Display", serif' }}
                >
                  Ethar
                </span>
              </div>

              {/* Luminous Crystal Date Capsule */}
              <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/60 px-6 py-2 shadow-[0_8px_24px_rgba(30,42,56,0.06)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A977] shadow-[0_0_8px_#C8A977]" />
                <p
                  className="text-sm font-semibold tracking-[0.12em] uppercase text-[#1E2A38] sm:text-base"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Thursday December 3 2026
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D82648] shadow-[0_0_8px_#D82648]" />
              </div>

              {/* Poetic English Closing Line */}
              <p
                className="mt-5 max-w-md text-base italic tracking-wide text-[#33465B] sm:text-lg"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                We look forward to celebrating our most joyful moments with you
              </p>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
