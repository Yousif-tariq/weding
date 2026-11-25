import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
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

export function WinterInvitationCardSection() {
  const { brand, event, chapters } = WHITE_JOY_CONFIG;

  return (
    <section
      id="invitation"
      aria-label="دعوة كريمة"
      className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center px-5 pt-20 pb-14 sm:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: LUXURY_EASE }}
        className="winter-glass mx-auto w-full max-w-[920px] overflow-hidden rounded-[28px] p-4 sm:p-7"
      >
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* Editorial Portrait Showcase (Cropped cleanly on the couple & glowing ice-blue floral ring) */}
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-[22px] border border-[#C8A977]/45 bg-white p-2 shadow-[0_20px_48px_rgba(30,42,56,0.12)]">
              <div className="relative h-[340px] w-full overflow-hidden rounded-[16px] sm:h-[390px] md:h-[440px]">
                <img
                  src="/images/jirtiq.jpg"
                  alt={`الجرتق السوداني وفرحة ${brand.groomAr} و${brand.brideAr}`}
                  loading="eager"
                  className="h-full w-full scale-[1.03] object-cover object-center transition-transform duration-700 hover:scale-[1.07]"
                />
                {/* Delicate Winter-Frost Vignette & Editorial Caption */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E2A38]/75 via-transparent to-[#E4EEF7]/15"
                />
                <div className="absolute inset-x-0 bottom-4 px-4 text-center">
                  <p
                    className="text-2xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
                    style={{ fontFamily: "var(--font-calligraphy)" }}
                  >
                    {brand.groomAr}{" "}
                    <span className="text-[#E6CFA5]">&amp;</span>{" "}
                    {brand.brideAr}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium tracking-widest text-[#E4EEF7]/90">
                    {event.gregorianDisplayAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Serene Centered Invitation Typography */}
          <div className="px-2 py-2 text-center md:col-span-7 md:px-4">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-[#C8A977]">
              ✦ دعوة كريمة ✦
            </span>

            <div className="mt-5 flex flex-col items-center gap-1">
              <p
                className="text-xl font-bold text-[#1E2A38] sm:text-2xl"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {brand.families[0]}
              </p>
              <span className="text-sm font-semibold text-[#C8A977]">و</span>
              <p
                className="text-xl font-bold text-[#1E2A38] sm:text-2xl"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {brand.families[1]}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto my-6 h-[1px] w-28 bg-gradient-to-r from-transparent via-[#C8A977]/80 to-transparent"
            />

            <p className="mx-auto max-w-xl text-base leading-[2.1] font-normal text-[#2B3746] sm:text-lg">
              {chapters.welcome.message}
            </p>

            <p
              className="mx-auto mt-5 max-w-lg text-sm leading-[1.95] font-medium text-[#5A6B7C] sm:text-base"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              {chapters.jirtiq.jirtiqCopy}
            </p>

            <p
              className="mt-5 text-base font-semibold text-[#AE8E5B] sm:text-lg"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              {chapters.jirtiq.traditionalCheer}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function WinterInvitationSections() {
  const { brand, event, venue } = WHITE_JOY_CONFIG;
  const countdown = useCountdown(event.isoDate);

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
          SECTION 2: FUTURISTIC WINTER-CRYSTAL CHRONOMETER COUNTDOWN
         ========================================================= */}
      <section id="countdown" className="relative px-5 py-20 sm:py-28">
        {/* Soft Radial Ice-Blue & Frosted Champagne Halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-[#9BB7D4]/26 via-[#C8A977]/14 to-transparent blur-3xl"
        />

        <motion.div {...sectionReveal} className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#9BB7D4]/40 bg-white/75 px-4 py-1 text-[11px] font-semibold tracking-[0.2em] text-[#AE8E5B] shadow-xs backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#C8A977]" />
            <span>على موعدٍ مع البهجة</span>
            <Sparkles className="h-3 w-3 text-[#C8A977]" />
          </span>

          <h2
            className="mt-3 text-3xl font-bold text-[#1E2A38] sm:text-4xl"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            الوقت المتبقي للاحتفال
          </h2>

          {/* Unified Futuristic Frosted-Crystal Chronometer Console */}
          <div className="winter-glass relative mt-10 overflow-hidden rounded-[28px] border border-[#9BB7D4]/45 p-4 shadow-[0_28px_70px_rgba(30,42,56,0.08)] sm:p-6">
            {/* Precision Architectural Corner Brackets */}
            <span aria-hidden="true" className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#C8A977]/70" />
            <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#C8A977]/70" />
            <span aria-hidden="true" className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-r-2 border-b-2 border-[#9BB7D4]/75" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#9BB7D4]/75" />

            {/* Top Laser Prism Horizon Line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#C8A977]/80 to-transparent"
            />

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
              {[
                {
                  code: "٠١",
                  label: "أيام",
                  value: toArabicDigits(countdown.days, 2),
                  progress: Math.min(100, Math.max(8, (countdown.days / 365) * 100)),
                },
                {
                  code: "٠٢",
                  label: "ساعات",
                  value: toArabicDigits(countdown.hours, 2),
                  progress: Math.max(8, (countdown.hours / 24) * 100),
                },
                {
                  code: "٠٣",
                  label: "دقائق",
                  value: toArabicDigits(countdown.minutes, 2),
                  progress: Math.max(8, (countdown.minutes / 60) * 100),
                },
                {
                  code: "٠٤",
                  label: "ثواني",
                  value: toArabicDigits(countdown.seconds, 2),
                  progress: Math.max(5, (countdown.seconds / 60) * 100),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    clipPath:
                      "polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden border border-[#C8A977]/35 bg-gradient-to-b from-[#FFFFFF]/94 via-[#F5F9FE]/88 to-[#E8F1FA]/88 px-4 pt-4 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_28px_rgba(30,42,56,0.06)] transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Top Telemetry Row */}
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-widest text-[#7D93AA]">
                    <span>{item.code}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8A977] shadow-[0_0_8px_#C8A977]" />
                  </div>

                  {/* Center Precision Digital-Glide Numeral */}
                  <div className="relative my-5 flex h-14 items-center justify-center overflow-hidden sm:h-16">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={item.value}
                        initial={{ y: 16, opacity: 0, filter: "blur(5px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -16, opacity: 0, filter: "blur(5px)" }}
                        transition={{ duration: 0.36, ease: LUXURY_EASE }}
                        className="bg-gradient-to-b from-[#1E2A38] via-[#2F455C] to-[#AE8E5B] bg-clip-text text-5xl font-bold leading-none text-transparent sm:text-[54px]"
                        style={{ fontFamily: "var(--font-display-ar)" }}
                      >
                        {item.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Unit Label & Live Futuristic Laser Progress Bar */}
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
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 4: EVENT DETAILS (3 Columns Desktop / 1 Mobile)
         ========================================================= */}
      <section aria-label="تفاصيل المناسبة" className="px-5 py-16 sm:py-24">
        <motion.div {...sectionReveal} className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#C8A977]">
              موعدُ لقائنا والفرح
            </p>
            <h2
              className="mt-2 text-3xl font-bold text-[#1E2A38] sm:text-4xl"
              style={{ fontFamily: "var(--font-display-ar)" }}
            >
              تفاصيل المناسبة
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Date Card */}
            <div className="winter-glass flex flex-col items-center rounded-[24px] px-6 py-9 text-center transition-transform duration-300 hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C8A977]/35 bg-[#F7FAFD] text-[#C8A977]">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="mt-5 text-xs font-semibold tracking-wider text-[#7D93AA]">
                التاريخ
              </span>
              <h3
                className="mt-2 text-2xl font-bold text-[#1E2A38]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {event.gregorianDisplayAr}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#4F6073]">
                {event.dayLabelAr}
              </p>
              {hijriDisplay && (
                <p className="mt-1 text-xs text-[#7D93AA]">{hijriDisplay}</p>
              )}
              <button
                type="button"
                onClick={downloadWeddingIcsFile}
                className="ruby-glass-keycap mt-5 inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold"
              >
                <CalendarPlus className="h-3.5 w-3.5 text-[#FFE6EC]" />
                <span>حفظ بالتقويم</span>
              </button>
            </div>

            {/* Time Card */}
            <div className="winter-glass flex flex-col items-center rounded-[24px] px-6 py-9 text-center transition-transform duration-300 hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C8A977]/35 bg-[#F7FAFD] text-[#C8A977]">
                <Clock className="h-6 w-6" />
              </div>
              <span className="mt-5 text-xs font-semibold tracking-wider text-[#7D93AA]">
                الوقت
              </span>
              <h3
                className="mt-2 text-2xl font-bold text-[#1E2A38]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {event.timeDisplayAr}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#4F6073]">
                {event.receptionTimeAr}
              </p>
              <p className="mt-1 text-xs text-[#7D93AA]">
                حضوركم يشرفنا ويسعدنا
              </p>
            </div>

            {/* Location Card with 3D Ruby-Glass Keycap GPS Pin */}
            <div className="winter-glass flex flex-col items-center rounded-[24px] px-6 py-9 text-center transition-transform duration-300 hover:-translate-y-2">
              <a
                href="#location"
                aria-label="الانتقال إلى خريطة الموقع"
                className="ruby-glass-keycap flex h-14 w-14 items-center justify-center rounded-[16px]"
              >
                <MapPin className="h-6 w-6 text-white drop-shadow-xs" />
              </a>
              <span className="mt-5 text-xs font-semibold tracking-wider text-[#7D93AA]">
                الموقع
              </span>
              <h3
                className="mt-2 text-2xl font-bold text-[#1E2A38]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {venue.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#4F6073]">
                {venue.cityDistrict}
              </p>
              <a
                href="#location"
                className="ruby-glass-keycap mt-5 inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold"
              >
                <MapPin className="h-3.5 w-3.5 text-[#FFE6EC]" />
                <span>عرض الخريطة</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 5: VENUE & GOOGLE MAPS (Soft Winter Frost Surface)
         ========================================================= */}
      <section
        id="location"
        aria-label="موقع الاحتفال"
        className="border-y border-[#9BB7D4]/25 bg-[#EAF1F8]/75 px-5 py-20 backdrop-blur-sm sm:py-24"
      >
        <motion.div {...sectionReveal} className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C8A977]">
            وجهة لقائنا والفرح
          </p>
          <h2
            className="mt-2 text-3xl font-bold text-[#1E2A38] sm:text-4xl"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            موقع الاحتفال
          </h2>
          <p className="mt-2 text-base font-medium text-[#4F6073]">
            {venue.name} — {venue.cityDistrict}
          </p>

          {/* Embedded Google Maps Frame with Floating 3D Ruby-Glass GPS Keycap Pin */}
          <div className="winter-glass mt-8 overflow-hidden rounded-[26px] p-2">
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
                className="ruby-glass-keycap absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-[14px]"
              >
                <span className="pointer-events-none absolute -inset-2 animate-ping rounded-xl bg-[#F03658]/30" />
                <MapPin className="relative z-10 h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Primary Directions & WhatsApp Contact/Apology 3D Ruby-Glass Keycap Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ruby-glass-keycap inline-flex w-full items-center justify-center gap-2.5 px-10 py-3.5 text-base font-bold sm:w-auto"
            >
              <Navigation className="h-4 w-4 text-[#FFE6EC]" />
              <span>عرض الاتجاهات</span>
            </a>

            <a
              href={`https://wa.me/${venue.whatsappNumber}?text=${encodeURIComponent(
                `السلام عليكم، بخصوص دعوة زفاف ${brand.groomAr} و ${brand.brideAr} في ${venue.name}: `
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ruby-glass-keycap inline-flex w-full items-center justify-center gap-2.5 px-9 py-3.5 text-base font-bold sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-[#FFE6EC]" />
              <span>للتواصل أو الاعتذار</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 6: MINIMALIST FOOTER
         ========================================================= */}
      <footer className="border-t border-[#9BB7D4]/25 bg-white/45 px-5 py-14 text-center backdrop-blur-sm">
        <p
          className="text-4xl font-bold text-[#1E2A38]"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          {brand.groomAr}{" "}
          <span className="text-[#C8A977]">&amp;</span>{" "}
          {brand.brideAr}
        </p>
        <p
          className="mt-3 text-base font-medium text-[#AE8E5B]"
          style={{ fontFamily: "var(--font-display-ar)" }}
        >
          {event.dayLabelAr} · {event.gregorianDisplayAr}
        </p>
        <p className="mt-3 text-sm text-[#5A6B7C]">
          «ننتظركم لتشاركونا أجمل لحظات حياتنا»
        </p>
      </footer>
    </div>
  );
}
