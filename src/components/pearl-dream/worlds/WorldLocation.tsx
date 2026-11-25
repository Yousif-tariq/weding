import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  Sparkles,
} from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../../config/whiteJoyConfig";
import { LUXURY_EASE } from "../../../animations/motionPresets";

/**
 * WORLD 04: قاعة لقائنا السعيد — Futuristic Holographic Transparent Map Sanctuary
 * Keeps the 3D Ruby Mechanical Keycap GPS pin & Google Maps CTA,
 * and the 3D Pure Snow-White Mechanical Keycap Share & WhatsApp buttons.
 */
export function WorldLocation() {
  const { venue, chapters, brand } = WHITE_JOY_CONFIG;
  const [sharedLoc, setSharedLoc] = useState(false);
  const prefersReduced = Boolean(useReducedMotion());

  const handleShareLocation = async () => {
    const text = `موقع حفل زفاف ${brand.groomAr} و ${brand.brideAr} في ${venue.name} (${venue.cityDistrict}):\n${venue.mapsUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: venue.name, text, url: venue.mapsUrl });
      } catch {
        // cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setSharedLoc(true);
      window.setTimeout(() => setSharedLoc(false), 2200);
    }
  };

  return (
    <section
      aria-label="عالم قاعة لقائنا السعيد"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-28 text-center"
    >
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Futuristic Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: LUXURY_EASE }}
          className="flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5FD3CC]/45 bg-[#07262C]/70 px-3.5 py-1 text-[10.5px] font-semibold text-[#5FD3CC] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#F0D29C]" />
            <span>وجهة ليلتنا المباركة</span>
          </span>

          <h2
            className="mt-2 bg-gradient-to-b from-[#FFFFFF] via-[#F7E3B8] to-[#D4A056] bg-clip-text text-3xl font-bold text-transparent drop-shadow-[0_3px_18px_rgba(4,24,29,0.9)] sm:text-4xl"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            {chapters.location.title}
          </h2>

          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D2ECEA] drop-shadow-[0_2px_10px_rgba(4,24,29,0.9)]">
            <Compass className="h-3.5 w-3.5 text-[#F0D29C]" />
            <span>
              {venue.name} · {venue.cityDistrict}
            </span>
          </p>
        </motion.div>

        {/* Futuristic Chamfered TRANSPARENT Holographic Map Viewport (Non-Circular) */}
        <motion.a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`فتح موقع ${venue.name} مباشرة على خرائط Google`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: LUXURY_EASE }}
          className="future-chamfer group relative mt-5 block h-[300px] w-full max-w-[365px] overflow-hidden border border-[#5FD3CC]/55 bg-[#062228]/28 shadow-[0_28px_72px_rgba(2,14,18,0.58),inset_0_1px_22px_rgba(95,211,204,0.22)] backdrop-blur-md transition-all duration-500 hover:scale-[1.015] hover:border-[#F0D29C] sm:h-[325px] sm:max-w-[395px]"
        >
          {/* Top Glowing Prism Edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-10 z-20 h-[2px] bg-gradient-to-r from-transparent via-[#5FD3CC] to-transparent"
          />

          {/* Animated Holographic Sweep Across Map */}
          {!prefersReduced && (
            <span
              aria-hidden="true"
              className="holo-sweep-beam pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-[#5FD3CC]/22 to-transparent"
            />
          )}

          {/* Pure Transparent Futuristic Holographic Blueprint Map SVG */}
          <svg
            viewBox="0 0 380 340"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="goldRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5FD3CC" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#F0D29C" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#5FD3CC" stopOpacity="0.35" />
              </linearGradient>
              <radialGradient id="pavilionAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#5FD3CC" stopOpacity="0.48" />
                <stop offset="55%" stopColor="#F0D29C" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#062228" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Translucent Holographic Urban Blocks */}
            <g
              fill="rgba(95, 211, 204, 0.10)"
              stroke="rgba(95, 211, 204, 0.35)"
              strokeWidth="1"
            >
              <rect x="44" y="64" width="72" height="50" rx="14" />
              <rect x="262" y="68" width="70" height="54" rx="14" />
              <rect x="34" y="196" width="84" height="58" rx="16" />
              <rect x="254" y="200" width="84" height="56" rx="16" />
              <circle cx="190" cy="54" r="24" />
            </g>

            {/* Glowing Turquoise Holographic Street Grid */}
            <g
              stroke="rgba(210, 238, 236, 0.38)"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M-10 124 Q190 108 390 132" strokeWidth="4.5" />
              <path d="M-10 218 Q190 202 390 222" strokeWidth="4" />
              <path d="M126 -10 Q138 170 116 350" strokeWidth="4" />
              <path d="M254 -10 Q242 170 264 350" strokeWidth="4" />
              <path d="M72 44 L318 282" strokeWidth="2" strokeOpacity="0.4" />
            </g>

            {/* Radar Telemetry Rings */}
            <g stroke="rgba(95, 211, 204, 0.32)" strokeWidth="1" fill="none">
              <circle cx="190" cy="156" r="92" strokeDasharray="3 7" />
              <circle cx="190" cy="156" r="58" stroke="#F0D29C" strokeOpacity="0.45" />
            </g>

            {/* Illuminated Champagne-Gold Royal Route */}
            <path
              d="M-10 176 Q110 158 190 156 T390 144"
              stroke="rgba(95, 211, 204, 0.28)"
              strokeWidth="10"
              fill="none"
            />
            <path
              d="M-10 176 Q110 158 190 156 T390 144"
              stroke="url(#goldRouteGrad)"
              strokeWidth="2.8"
              strokeDasharray="7 5"
              fill="none"
            />

            {/* Luminous Holographic Pavilion Silhouette */}
            <circle cx="190" cy="156" r="56" fill="url(#pavilionAura)" />
            <g transform="translate(190, 156)">
              <ellipse
                cx="0"
                cy="10"
                rx="34"
                ry="18"
                fill="rgba(95, 211, 204, 0.22)"
                stroke="#F0D29C"
                strokeWidth="1.4"
              />
              <path
                d="M-20 10 C-20 -12 20 -12 20 10 Z"
                fill="rgba(255, 255, 255, 0.24)"
                stroke="#F0D29C"
                strokeWidth="1.2"
              />
            </g>

            {/* Holographic Compass Rose */}
            <g transform="translate(64, 152)" opacity="0.82">
              <circle
                cx="0"
                cy="0"
                r="14"
                fill="rgba(6, 34, 40, 0.55)"
                stroke="#5FD3CC"
                strokeOpacity="0.55"
                strokeWidth="0.9"
              />
              <path d="M0 -9 L2.4 0 L0 9 L-2.4 0 Z" fill="#F0D29C" />
              <path d="M-9 0 L0 -2.4 L9 0 L0 2.4 Z" fill="#5FD3CC" />
            </g>
          </svg>

          {/* Animated 3D Ruby Mechanical Keycap GPS Beacon Pin */}
          <div className="pointer-events-none absolute top-[43%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-6 animate-ping rounded-full bg-[#EC3052]/35" />
            <span className="absolute -inset-3 rounded-2xl bg-[#FF99AC]/45 blur-md" />
            <div className="ruby-keycap-btn relative flex h-12 w-12 items-center justify-center rounded-[14px] text-white transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 group-active:translate-y-1">
              <MapPin className="h-5 w-5 text-[#FFF2F5] drop-shadow-xs" />
            </div>
          </div>

          {/* Floating Frosted-Glass Venue Ribbon at Bottom of Map */}
          <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-2xl border border-[#F0D29C]/45 bg-[#062228]/82 px-4 py-2.5 shadow-[0_12px_28px_rgba(2,14,18,0.52)] backdrop-blur-xl transition-colors duration-300 group-hover:bg-[#082D35]/90">
            <div className="text-right">
              <h3
                className="text-base font-bold leading-tight text-[#FDFBFF]"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {venue.name}
              </h3>
              <p className="mt-0.5 text-[11px] font-semibold text-[#5FD3CC]">
                {venue.cityDistrict}
              </p>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F0D29C]/65 bg-[#F0D29C]/15 text-[#F0D29C] shadow-md transition-transform duration-300 group-hover:scale-105">
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </motion.a>

        {/* 3D Ruby & Pure Snow-White Mechanical Keyboard Keycap Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: LUXURY_EASE }}
          className="mt-5 flex w-full max-w-[355px] flex-col items-center gap-2.5 sm:max-w-[385px]"
        >
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ruby-keycap-btn inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-wide"
          >
            <Navigation className="h-4 w-4 text-[#FFE3E8]" />
            <span>{chapters.location.openMapLabel}</span>
          </a>

          <div className="mt-1 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleShareLocation}
              className="white-keycap-btn inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold"
            >
              <Share2 className="h-3.5 w-3.5 text-[#D4A056]" />
              <span>{sharedLoc ? "تم النسخ ✓" : "مشاركة الموقع"}</span>
            </button>

            <a
              href={`https://wa.me/${venue.whatsappNumber}?text=${encodeURIComponent(
                `السلام عليكم، لدي استفسار حول حفل زفاف ${brand.groomAr} و ${brand.brideAr} في ${venue.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="white-keycap-btn inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
              <span>تواصل واتساب</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
