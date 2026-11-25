import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmeraldPetrol3DBackdrop } from "./components/EmeraldPetrol3DBackdrop";
import { PearlDreamExperience } from "./components/pearl-dream/PearlDreamExperience";
import { AmbientMusicController } from "./components/AmbientMusicController";
import { PearlTouchSparkles } from "./components/PearlTouchSparkles";
import type {
  DreamWorldId,
  ExperienceCameraState,
  GateId,
} from "./components/pearl-dream/PearlDreamTypes";
import { CinematicIntro } from "./components/cinema/CinematicIntro";
import { CarEnvelopeScene } from "./components/cinema/CarEnvelopeScene";
import { WHITE_JOY_CONFIG } from "./config/whiteJoyConfig";
import { LUXURY_EASE } from "./animations/motionPresets";

type ExperienceStage = "intro" | "envelope" | "palace";

export function App() {
  const [stage, setStage] = useState<ExperienceStage>("intro");
  const [activeWorld, setActiveWorld] = useState<DreamWorldId>("hub");
  const [, setHoveredGate] = useState<GateId | null>(null);
  const [replayToken, setReplayToken] = useState(0);

  const cameraState: ExperienceCameraState =
    stage === "palace" ? activeWorld : stage;

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-clip">
      {/* Real HD Emerald-Silk Video + Deep Petrol Green / Midnight Teal 3D Depth Backdrop */}
      <EmeraldPetrol3DBackdrop cameraState={cameraState} />

      {/* Tactile Pearl & Champagne-Gold Touch Sparkles */}
      <PearlTouchSparkles />

      {/* Studio-Grade Background Soundtrack (Ordinary - Alex Warren) with Smooth Fade-In/Out */}
      {WHITE_JOY_CONFIG.media.ambientMusicUrl && (
        <AmbientMusicController
          src={WHITE_JOY_CONFIG.media.ambientMusicUrl}
          replayToken={replayToken}
        />
      )}

      {/* Seamless Cinematic Stage Flow */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key={`scene-intro-${replayToken}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.75, ease: LUXURY_EASE }}
            >
              <CinematicIntro onComplete={() => setStage("envelope")} />
            </motion.div>
          )}

          {stage === "envelope" && (
            <motion.div
              key="scene-envelope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
              transition={{ duration: 0.75, ease: LUXURY_EASE }}
            >
              <CarEnvelopeScene
                onOpenInvitation={() => {
                  setActiveWorld("hub");
                  setStage("palace");
                }}
              />
            </motion.div>
          )}

          {stage === "palace" && (
            <motion.div
              key="scene-pearl-dream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: LUXURY_EASE }}
            >
              <PearlDreamExperience
                activeWorld={activeWorld}
                onChangeWorld={setActiveWorld}
                onHoverGate={setHoveredGate}
                onReplay={() => {
                  setActiveWorld("hub");
                  setHoveredGate(null);
                  setReplayToken((prev) => prev + 1);
                  setStage("intro");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
