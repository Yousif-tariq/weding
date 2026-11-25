import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WinterSnowAmbiance } from "./components/winter-luxury/WinterSnowAmbiance";
import { WinterHeroSection } from "./components/winter-luxury/WinterHeroSection";
import {
  WinterInvitationCardSection,
  WinterInvitationSections,
} from "./components/winter-luxury/WinterInvitationSections";
import { AmbientMusicController } from "./components/AmbientMusicController";
import { WHITE_JOY_CONFIG } from "./config/whiteJoyConfig";
import { LUXURY_EASE } from "./animations/motionPresets";

export function App() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-clip bg-[#F7FAFD] text-[#1E2A38]">
      {/* Lightweight Winter Snow Frost Glow & Gentle Snowfall Motes */}
      <WinterSnowAmbiance />

      {/* Optional Ambient Wedding Soundtrack (Fades in Smoothly on Open) */}
      {WHITE_JOY_CONFIG.media.ambientMusicUrl && (
        <AmbientMusicController
          src={WHITE_JOY_CONFIG.media.ambientMusicUrl}
          replayToken={0}
        />
      )}

      {/* Futuristic Reception-Backdrop Hero Gateway (First Screen) -> Unlocks Full Invitation */}
      <div className="relative z-10">
        <WinterHeroSection opened={opened} onOpen={() => setOpened(true)} />

        <AnimatePresence>
          {opened && (
            <motion.div
              key="winter-invitation-body"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: LUXURY_EASE }}
            >
              <WinterInvitationCardSection />
              <WinterInvitationSections />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
