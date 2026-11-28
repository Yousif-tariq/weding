import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, CalendarPlus, Check, X } from "lucide-react";
import { LUXURY_EASE } from "../../animations/motionPresets";
import { downloadWeddingIcsFile } from "../../utils/calendar";

const ONESIGNAL_APP_ID = "28c5f743-f7a9-43e9-b2ba-a18d10ccad1e";
const STORAGE_KEY = "wedding_reminder_prompt_state_v1";

interface OneSignalLike {
  init: (config: Record<string, unknown>) => Promise<void>;
  Notifications?: {
    permission?: boolean;
    isPushSupported?: () => boolean;
    requestPermission?: () => Promise<void>;
  };
  User?: {
    PushSubscription?: {
      optedIn?: boolean;
      optIn?: () => Promise<void>;
    };
  };
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalLike) => void | Promise<void>>;
    __oneSignalInitialized?: boolean;
  }
}

/**
 * Smart Wedding-Day Reminder Prompt (OneSignal Web Push + Calendar Fallback)
 * - Triggers gracefully ONLY when the guest scrolls down to «تفاصيل المناسبة» (#details)
 * - Uses OneSignal v16 Web Push on supported devices (delivers automatically once online on Dec 3, 2026)
 * - Automatically falls back to a 2-alarm .ics calendar reminder on iOS Safari / in-app browsers
 */
export function WeddingReminderToast() {
  const [visible, setVisible] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "fallback">("idle");
  const oneSignalRef = useRef<OneSignalLike | null>(null);

  // Initialize OneSignal v16 cleanly once
  useEffect(() => {
    const basicSupport =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      window.isSecureContext;

    setPushSupported(basicSupport);

    if (!basicSupport) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      oneSignalRef.current = OneSignal;
      try {
        if (!window.__oneSignalInitialized) {
          window.__oneSignalInitialized = true;
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            serviceWorkerPath: "/OneSignalSDKWorker.js",
            allowLocalhostAsSecureOrigin: true,
            notifyButton: { enable: false },
          });
        }
        const supported = OneSignal.Notifications?.isPushSupported?.() ?? basicSupport;
        setPushSupported(Boolean(supported));
        if (OneSignal.Notifications?.permission || OneSignal.User?.PushSubscription?.optedIn) {
          try {
            localStorage.setItem(STORAGE_KEY, "subscribed");
          } catch {
            // ignore storage errors
          }
          setVisible(false);
        }
      } catch {
        // Gracefully fall back to calendar reminder if SDK fails
        setPushSupported(false);
      }
    });
  }, []);

  // Show prompt only when guest reaches «تفاصيل المناسبة» (#details)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "subscribed" || saved === "dismissed") return;
    } catch {
      // ignore storage errors
    }

    let observer: IntersectionObserver | null = null;
    let retryTimer = 0;

    const attachObserver = () => {
      const detailsEl = document.getElementById("details");
      if (!detailsEl) {
        retryTimer = window.setTimeout(attachObserver, 500);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(detailsEl);
    };

    attachObserver();

    return () => {
      window.clearTimeout(retryTimer);
      observer?.disconnect();
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // ignore
    }
  };

  const handleEnablePush = async () => {
    setStatus("loading");
    const withTimeout = <T,>(promise: Promise<T>, ms = 6000): Promise<T> =>
      new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
        promise.then(
          (val) => {
            window.clearTimeout(timer);
            resolve(val);
          },
          (err) => {
            window.clearTimeout(timer);
            reject(err);
          }
        );
      });

    try {
      const OneSignal = oneSignalRef.current;
      if (OneSignal?.Notifications?.requestPermission) {
        await withTimeout(OneSignal.Notifications.requestPermission());
        if (OneSignal.Notifications.permission) {
          if (OneSignal.User?.PushSubscription?.optIn) {
            await withTimeout(OneSignal.User.PushSubscription.optIn());
          }
          try {
            localStorage.setItem(STORAGE_KEY, "subscribed");
          } catch {
            // ignore
          }
          setStatus("done");
          window.setTimeout(() => setVisible(false), 2600);
          return;
        }
      } else if ("Notification" in window) {
        const perm = await withTimeout(Notification.requestPermission());
        if (perm === "granted") {
          try {
            localStorage.setItem(STORAGE_KEY, "subscribed");
          } catch {
            // ignore
          }
          setStatus("done");
          window.setTimeout(() => setVisible(false), 2600);
          return;
        }
      }
      // If permission was declined or unavailable (e.g. in-app browser), offer 1-tap calendar alarm
      setStatus("fallback");
    } catch {
      setStatus("fallback");
    }
  };

  const handleCalendarFallback = () => {
    downloadWeddingIcsFile();
    try {
      localStorage.setItem(STORAGE_KEY, "subscribed");
    } catch {
      // ignore
    }
    setStatus("done");
    window.setTimeout(() => setVisible(false), 2400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          aria-label="تذكير يوم الفرح"
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.96 }}
          transition={{ duration: 0.55, ease: LUXURY_EASE }}
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto max-w-md"
        >
          <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white/82 p-4 shadow-[0_20px_48px_rgba(30,42,56,0.16),0_0_20px_rgba(200,169,119,0.22)] backdrop-blur-md">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="إغلاق"
              className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full text-[#64788E] transition-colors hover:bg-black/5 hover:text-[#1E2A38]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3.5 pl-6">
              <div className="ruby-glass-keycap flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px]">
                {status === "done" ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <BellRing className="h-5 w-5 text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-right">
                <p
                  className="text-base font-bold text-[#1E2A38]"
                  style={{ fontFamily: "var(--font-display-ar)" }}
                >
                  {status === "done" ? "تم تفعيل التذكير بنجاح" : "تذكير يوم الفرح"}
                </p>
                <p className="mt-0.5 text-xs text-[#4F6073]">
                  {status === "done"
                    ? "سنذكرك بموعدنا يوم الخميس ٣ ديسمبر ٢٠٢٦"
                    : status === "fallback" || !pushSupported
                      ? "احفظ تذكيرا تلقائيا في تقويم جوالك ليوم ٣ ديسمبر ٢٠٢٦"
                      : "اسمح بالإشعارات ليصلك تذكير تلقائي يوم الفرح"}
                </p>
              </div>
            </div>

            {status !== "done" && (
              <div className="mt-3.5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[#5A6B7C] transition-colors hover:bg-black/5"
                >
                  لاحقا
                </button>

                {pushSupported && status !== "fallback" ? (
                  <button
                    type="button"
                    disabled={status === "loading"}
                    onClick={handleEnablePush}
                    className="ruby-glass-keycap inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold disabled:opacity-70"
                  >
                    <BellRing className="h-3.5 w-3.5 text-[#FFE6EC]" />
                    <span>{status === "loading" ? "جاري التفعيل" : "تفعيل التذكير"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCalendarFallback}
                    className="ruby-glass-keycap inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-[#FFE6EC]" />
                    <span>حفظ تذكير بالتقويم</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
