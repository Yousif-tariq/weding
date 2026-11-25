import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, RotateCcw } from "lucide-react";
import { WHITE_JOY_CONFIG } from "../../config/whiteJoyConfig";
import { cinemaSound } from "../../utils/cinemaSoundEngine";
import { LUXURY_EASE } from "../../animations/motionPresets";
import {
  DREAM_GATES_META,
  type DreamWorldId,
  type GateId,
} from "./PearlDreamTypes";
import { FourDreamGatesHub } from "./FourDreamGatesHub";
import { WorldWelcome } from "./worlds/WorldWelcome";
import { WorldJirtiq } from "./worlds/WorldJirtiq";
import { WorldDate } from "./worlds/WorldDate";
import { WorldLocation } from "./worlds/WorldLocation";

interface PearlDreamExperienceProps {
  activeWorld: DreamWorldId;
  onChangeWorld: (world: DreamWorldId) => void;
  onHoverGate: (gate: GateId | null) => void;
  onReplay: () => void;
}

const GATE_ORDER: GateId[] = ["welcome", "jirtiq", "date", "location"];

/**
 * THE PEARL DREAM — Full Spatial Experience Coordinator
 * Connects The Four Dream Gates Hub, the 4 distinct full-screen worlds,
 * and the Magical Pearl Constellation Navigation.
 */
export function PearlDreamExperience({
  activeWorld,
  onChangeWorld,
  onHoverGate,
  onReplay,
}: PearlDreamExperienceProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const finaleCelebratedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<number | null>(null);

  const goToWorld = useCallback(
    (next: DreamWorldId) => {
      if (next === activeWorld) return;
      onHoverGate(null);
      onChangeWorld(next);
      cinemaSound.playPageTurn();
    },
    [activeWorld, onChangeWorld, onHoverGate]
  );

  const navigateRelative = useCallback(
    (delta: 1 | -1) => {
      if (activeWorld === "hub") {
        if (delta === 1) goToWorld("welcome");
        return;
      }
      const idx = GATE_ORDER.indexOf(activeWorld);
      const nextIdx = idx + delta;
      if (nextIdx >= 0 && nextIdx < GATE_ORDER.length) {
        goToWorld(GATE_ORDER[nextIdx]);
      } else if (nextIdx < 0) {
        goToWorld("hub");
      }
    },
    [activeWorld, goToWorld]
  );

  // Smooth mouse wheel & trackpad scrolling across hub and all 4 worlds
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 18) return;
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      if (e.deltaY > 0) {
        navigateRelative(1);
      } else {
        navigateRelative(-1);
      }

      if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 650);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
    };
  }, [navigateRelative]);

  // Celebrate subtly once when reaching the final sanctuary (قاعة ريماس)
  useEffect(() => {
    if (activeWorld === "location" && !finaleCelebratedRef.current) {
      finaleCelebratedRef.current = true;
      cinemaSound.playFinaleChime();
      try {
        confetti({
          particleCount: 40,
          spread: 62,
          origin: { y: 0.72 },
          colors: ["#D8C19A", "#FAFAF8", "#F4E4E5", "#DCEAF4"],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
    }
  }, [activeWorld]);

  // Keyboard support (Escape -> Hub, Arrows -> Next/Prev world)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeWorld !== "hub") {
        goToWorld("hub");
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        navigateRelative(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        navigateRelative(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeWorld, goToWorld, navigateRelative]);

  // Touch swipe navigation across hub and all 4 worlds (responsive swipe up/down or left/right)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const end = e.changedTouches[0];
    const dx = end.clientX - touchStartRef.current.x;
    const dy = end.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dy) > 38 && Math.abs(dy) >= Math.abs(dx)) {
      if (dy < 0) navigateRelative(1);
      else navigateRelative(-1);
    } else if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) navigateRelative(1);
      else navigateRelative(-1);
    }
  };

  const activeMeta =
    activeWorld === "hub"
      ? null
      : DREAM_GATES_META.find((g) => g.id === activeWorld) ?? null;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative min-h-[100dvh] w-full overflow-hidden text-[#1F2E47]"
    >
      {/* Top Minimal Floating Spatial Controls */}
      <header className="fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-40 mx-auto flex w-full max-w-5xl items-center justify-between px-4">
        {/* Right side in RTL: Return to Main World button or Monogram */}
        {activeWorld !== "hub" ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => goToWorld("hub")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#F0D29C]/45 bg-[#062228]/80 px-3.5 py-2 text-xs font-bold text-[#FDFBFF] shadow-[0_8px_24px_rgba(2,14,18,0.45)] backdrop-blur-xl transition hover:border-[#5FD3CC] hover:bg-[#092F38]/90"
          >
            <ArrowRight className="h-3.5 w-3.5 text-[#F0D29C]" />
            <span>البوابات</span>
          </motion.button>
        ) : (
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0D29C]/45 bg-[#062228]/80 text-xs font-bold text-[#F0D29C] shadow-[0_8px_24px_rgba(2,14,18,0.45)] backdrop-blur-xl"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {WHITE_JOY_CONFIG.brand.monogramAr}
          </span>
        )}

        {/* Left side in RTL (shifted slightly inward from fixed sound button) */}
        <button
          type="button"
          onClick={onReplay}
          title="إعادة التجربة من البداية"
          aria-label="إعادة التجربة من البداية"
          className="mr-auto ml-12 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0D29C]/45 bg-[#062228]/80 text-[#F0D29C] shadow-[0_8px_24px_rgba(2,14,18,0.45)] backdrop-blur-xl transition hover:border-[#5FD3CC] hover:bg-[#092F38]/90"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      {/* Seamless Full-Screen Spatial Stage */}
      <AnimatePresence mode="wait">
        {activeWorld === "hub" && (
          <motion.div
            key="pearl-hub"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.08,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.65, ease: LUXURY_EASE }}
          >
            <FourDreamGatesHub
              onEnterGate={(gate) => goToWorld(gate)}
              onHoverGate={onHoverGate}
            />
          </motion.div>
        )}

        {activeWorld === "welcome" && (
          <motion.div
            key="world-welcome"
            initial={{
              opacity: 0,
              scale: prefersReduced ? 1 : 0.92,
              filter: prefersReduced ? "none" : "blur(12px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.06,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.72, ease: LUXURY_EASE }}
          >
            <WorldWelcome />
          </motion.div>
        )}

        {activeWorld === "jirtiq" && (
          <motion.div
            key="world-jirtiq"
            initial={{
              opacity: 0,
              scale: prefersReduced ? 1 : 0.92,
              filter: prefersReduced ? "none" : "blur(12px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.06,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.72, ease: LUXURY_EASE }}
          >
            <WorldJirtiq />
          </motion.div>
        )}

        {activeWorld === "date" && (
          <motion.div
            key="world-date"
            initial={{
              opacity: 0,
              scale: prefersReduced ? 1 : 0.92,
              filter: prefersReduced ? "none" : "blur(12px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.06,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.72, ease: LUXURY_EASE }}
          >
            <WorldDate />
          </motion.div>
        )}

        {activeWorld === "location" && (
          <motion.div
            key="world-location"
            initial={{
              opacity: 0,
              scale: prefersReduced ? 1 : 0.92,
              filter: prefersReduced ? "none" : "blur(12px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.06,
              filter: prefersReduced ? "none" : "blur(10px)",
            }}
            transition={{ duration: 0.72, ease: LUXURY_EASE }}
          >
            <WorldLocation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magical Pearl Constellation Navigation (4 Luminous Pearl Orbs on a Gossamer Thread) */}
      <nav
        aria-label="التنقل بين العوالم الأربعة"
        className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-1.5 px-4"
      >
        {/* Active World Poetic Label */}
        <AnimatePresence mode="wait">
          {activeMeta && (
            <motion.span
              key={activeMeta.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.96, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: LUXURY_EASE }}
              className="rounded-xl border border-[#5FD3CC]/45 bg-[#062228]/82 px-3.5 py-0.5 text-[11px] font-bold text-[#F0D29C] shadow-md backdrop-blur-xl"
            >
              {activeMeta.titleAr}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Connected Futuristic Emerald-Glass Navigation Dock */}
        <div className="relative flex items-center gap-5 rounded-2xl border border-[#F0D29C]/40 bg-[#062228]/80 px-5 py-2.5 shadow-[0_14px_34px_rgba(2,14,18,0.55)] backdrop-blur-xl">
          {/* Connecting Champagne-Turquoise Thread */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-7 left-7 h-[1px] -translate-y-1/2 bg-gradient-to-l from-[#5FD3CC]/35 via-[#F0D29C]/75 to-[#5FD3CC]/35"
          />

          {DREAM_GATES_META.map((gate) => {
            const isActive = activeWorld === gate.id;
            return (
              <button
                key={gate.id}
                type="button"
                onClick={() => goToWorld(gate.id)}
                aria-label={gate.titleAr}
                aria-current={isActive ? "page" : undefined}
                title={gate.titleAr}
                className="group relative z-10 flex h-5 w-5 items-center justify-center focus:outline-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="pearl-nav-halo"
                    className="absolute -inset-1 rounded-sm bg-[#5FD3CC]/35 blur-[3px]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span
                  className={`block rotate-45 border transition-all duration-300 ${
                    isActive
                      ? "h-3 w-3 border-[#FFF5DE] bg-gradient-to-br from-[#FFF5DE] via-[#F0D29C] to-[#D4A056] shadow-[0_0_12px_rgba(240,210,156,0.75)]"
                      : "h-2 w-2 border-[#5FD3CC]/75 bg-[#0A353E] group-hover:scale-125 group-hover:border-[#F0D29C]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
