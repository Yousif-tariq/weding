import { useCallback, useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

interface AmbientMusicControllerProps {
  src: string;
  replayToken: number;
}

const TARGET_VOLUME = 0.78;

/**
 * Studio-Grade Ambient Soundtrack Controller
 * - Smooth exponential-feeling fade-in (1.6s) & fade-out (0.45s)
 * - Attempts immediate autoplay on load; seamlessly unlocks on first touch/click if browser blocks
 * - Loops seamlessly and stays synchronized with app replay
 * - Renders a minimal luxury golden equalizer pill in the top-left corner
 */
export function AmbientMusicController({
  src,
  replayToken,
}: AmbientMusicControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const userMutedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      from: number,
      to: number,
      durationMs: number,
      onComplete?: () => void
    ) => {
      cancelFade();
      const start = performance.now();
      audio.volume = Math.max(0, Math.min(1, from));

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        // Smooth ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));

        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = null;
          onComplete?.();
        }
      };

      fadeRafRef.current = requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const startWithFadeIn = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return false;

    try {
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      fadeVolume(audio, 0, TARGET_VOLUME, 1600);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [fadeVolume]);

  // Initialize audio element, attempt autoplay, and unlock smoothly on first gesture
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    let unlocked = false;

    const tryUnlock = async () => {
      if (unlocked || userMutedRef.current) return;
      const ok = await startWithFadeIn();
      if (ok) {
        unlocked = true;
        window.removeEventListener("pointerdown", tryUnlock);
        window.removeEventListener("touchstart", tryUnlock);
        window.removeEventListener("click", tryUnlock);
        window.removeEventListener("keydown", tryUnlock);
      }
    };

    // Attempt immediate autoplay on link open
    void tryUnlock();

    window.addEventListener("pointerdown", tryUnlock, { passive: true });
    window.addEventListener("touchstart", tryUnlock, { passive: true });
    window.addEventListener("click", tryUnlock, { passive: true });
    window.addEventListener("keydown", tryUnlock, { passive: true });

    // Keep music alive cleanly if tab returns to foreground
    const onVisibility = () => {
      if (!document.hidden && !userMutedRef.current && audio.paused && unlocked) {
        void audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelFade();
      window.removeEventListener("pointerdown", tryUnlock);
      window.removeEventListener("touchstart", tryUnlock);
      window.removeEventListener("click", tryUnlock);
      window.removeEventListener("keydown", tryUnlock);
      document.removeEventListener("visibilitychange", onVisibility);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, startWithFadeIn, cancelFade]);

  // Synchronize restart when the user replays the invitation from the beginning
  useEffect(() => {
    if (replayToken === 0) return;
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return;

    audio.currentTime = 0;
    void startWithFadeIn();
  }, [replayToken, startWithFadeIn]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userMutedRef.current = true;
      setIsPlaying(false);
      fadeVolume(audio, audio.volume, 0, 450, () => {
        audio.pause();
      });
    } else {
      userMutedRef.current = false;
      await startWithFadeIn();
    }
  };

  return (
    <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        className="ruby-glass-keycap inline-flex h-10 w-10 items-center justify-center rounded-[12px]"
      >
        {isPlaying ? (
          <span
            aria-hidden="true"
            className="flex h-3.5 items-end gap-[2.5px]"
          >
            <span className="h-2.5 w-[2.5px] animate-[pulse_0.9s_ease-in-out_infinite] rounded-full bg-white" />
            <span className="h-3.5 w-[2.5px] animate-[pulse_0.7s_ease-in-out_0.15s_infinite] rounded-full bg-[#FFE3E8]" />
            <span className="h-2 w-[2.5px] animate-[pulse_1.05s_ease-in-out_0.3s_infinite] rounded-full bg-white" />
          </span>
        ) : (
          <VolumeX className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
}
