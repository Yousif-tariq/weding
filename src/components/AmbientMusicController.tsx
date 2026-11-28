import { useCallback, useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

interface AmbientMusicControllerProps {
  src: string;
  replayToken: number;
  /** When false (e.g. while viewing the Quranic verse section), music stays paused automatically */
  allowed?: boolean;
}

const TARGET_VOLUME = 0.78;

/**
 * Studio-Grade Ambient Soundtrack Controller
 * - Automatically stays silent / pauses whenever `allowed` is false (Quranic verse screen)
 * - Silently primes mobile audio permission on the first tap without audible sound on the verse screen
 * - Smoothly fades in (1.4s) as soon as the guest scrolls into the next section, and fades out (0.45s) on return
 */
export function AmbientMusicController({
  src,
  replayToken,
  allowed = true,
}: AmbientMusicControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const userMutedRef = useRef(false);
  const allowedRef = useRef(allowed);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    allowedRef.current = allowed;
  }, [allowed]);

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
    if (!audio || userMutedRef.current || !allowedRef.current) return false;

    try {
      audio.muted = false;
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      fadeVolume(audio, 0, TARGET_VOLUME, 1400);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [fadeVolume]);

  const stopWithFadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    if (audio.paused) {
      cancelFade();
      audio.volume = 0;
      return;
    }
    fadeVolume(audio, audio.volume, 0, 450, () => {
      audio.pause();
    });
  }, [cancelFade, fadeVolume]);

  // Initialize audio element & silently prime browser audio unlock on first gesture
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = 0;
    audioRef.current = audio;

    let primed = false;

    const handleGesture = async () => {
      if (userMutedRef.current) return;

      if (allowedRef.current) {
        const ok = await startWithFadeIn();
        if (ok) primed = true;
      } else if (!primed) {
        // Silently unlock iOS/Android playback permission while staying silent on the Quranic verse
        try {
          audio.muted = true;
          audio.volume = 0;
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
          primed = true;
        } catch {
          audio.muted = false;
        }
      }
    };

    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("touchstart", handleGesture, { passive: true });
    window.addEventListener("click", handleGesture, { passive: true });
    window.addEventListener("keydown", handleGesture, { passive: true });

    const onVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!userMutedRef.current && allowedRef.current && audio.paused) {
        void startWithFadeIn();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelFade();
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, startWithFadeIn, cancelFade]);

  // React automatically when entering or leaving the Quranic verse section
  useEffect(() => {
    if (allowed) {
      if (!userMutedRef.current) {
        void startWithFadeIn();
      }
    } else {
      stopWithFadeOut();
    }
  }, [allowed, startWithFadeIn, stopWithFadeOut]);

  // Synchronize restart when replaying from the beginning
  useEffect(() => {
    if (replayToken === 0) return;
    const audio = audioRef.current;
    if (!audio || userMutedRef.current || !allowedRef.current) return;

    audio.currentTime = 0;
    void startWithFadeIn();
  }, [replayToken, startWithFadeIn]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userMutedRef.current = true;
      stopWithFadeOut();
    } else {
      userMutedRef.current = false;
      if (allowedRef.current) {
        await startWithFadeIn();
      }
    }
  };

  // Hide or dim button slightly when on the verse section (or keep subtle muted state)
  return (
    <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        title={
          !allowed
            ? "تعمل الموسيقى تلقائياً عند التمرير بعد الآية الكريمة"
            : isPlaying
              ? "إيقاف الموسيقى"
              : "تشغيل الموسيقى"
        }
        className={`ruby-glass-keycap inline-flex h-10 w-10 items-center justify-center rounded-[12px] transition-opacity duration-300 ${
          !allowed ? "opacity-60" : "opacity-100"
        }`}
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
