import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WinterSnowAmbiance } from "./components/winter-luxury/WinterSnowAmbiance";
import { RubyCrystalCurtain } from "./components/winter-luxury/RubyCrystalCurtain";
import { WinterHeroSection } from "./components/winter-luxury/WinterHeroSection";
import {
  WinterInvitationCardSection,
  WinterInvitationSections,
} from "./components/winter-luxury/WinterInvitationSections";
import { WeddingReminderToast } from "./components/winter-luxury/WeddingReminderToast";
import { AmbientMusicController } from "./components/AmbientMusicController";
import { WHITE_JOY_CONFIG } from "./config/whiteJoyConfig";
import { LUXURY_EASE } from "./animations/motionPresets";

export function App() {
  const [opened] = useState(true);
  const [isPastVerseSection, setIsPastVerseSection] = useState(false);

  // Automatically pause music while on the Quranic verse hero section,
  // and start playing smoothly as soon as the guest scrolls to the next section
  useEffect(() => {
    const checkScrollPosition = () => {
      const heroEl = document.getElementById("hero-verse");
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      setIsPastVerseSection(rect.bottom <= window.innerHeight * 0.45);
    };

    checkScrollPosition();
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  // Automatically glide up from the Quranic verse screen to the invitation card
  // 3 seconds after the curtain parts and the verse page appears
  useEffect(() => {
    const autoScrollTimer = window.setTimeout(() => {
      if (window.scrollY < 80) {
        document
          .getElementById("invitation")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 6200);

    return () => window.clearTimeout(autoScrollTimer);
  }, []);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-clip bg-[#F7FAFD] text-[#1E2A38]">
      {/* Transparent Crystal-Glass Snow Curtain (Opens Automatically After 2 Seconds) */}
      <RubyCrystalCurtain />

      {/* Lightweight Winter Snow Frost Glow & Ambient Post-Open Crystal Light */}
      <WinterSnowAmbiance active={opened} />

      {/* Ambient Wedding Soundtrack — Pauses Automatically on the Quranic Verse Section */}
      {WHITE_JOY_CONFIG.media.ambientMusicUrl && (
        <AmbientMusicController
          src={WHITE_JOY_CONFIG.media.ambientMusicUrl}
          replayToken={0}
          allowed={opened && isPastVerseSection}
        />
      )}

      {/* Smart Wedding-Day Reminder Prompt (Appears at «تفاصيل المناسبة») */}
      <WeddingReminderToast />

      {/* Futuristic Gateway Hero (First Screen) -> Auto-Glides to Full Invitation */}
      <div className="relative z-10">
        <WinterHeroSection />

        <AnimatePresence>
          <motion.div
            key="winter-invitation-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: LUXURY_EASE }}
          >
            <WinterInvitationCardSection />
            <WinterInvitationSections />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
