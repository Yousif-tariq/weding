import { Component, type ErrorInfo, type ReactNode } from "react";
import { WHITE_JOY_CONFIG } from "../config/whiteJoyConfig";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Production Safety ErrorBoundary
 * Guarantees the wedding invitation link never fails to a blank screen on any device.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Error contained gracefully; fallback displays essential wedding details
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { brand, event, venue } = WHITE_JOY_CONFIG;

    return (
      <main
        dir="rtl"
        className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#F7FAFD] px-6 py-12 text-center text-[#1E2A38]"
      >
        <div className="w-full max-w-md rounded-[26px] border border-[#C8A977]/45 bg-white p-8 shadow-lg">
          <h1
            className="text-4xl font-bold text-[#1E2A38]"
            style={{ fontFamily: "var(--font-calligraphy)" }}
          >
            {brand.groomAr} &amp; {brand.brideAr}
          </h1>
          <p className="mt-4 text-lg font-bold text-[#AE8E5B]">
            {event.dayLabelAr} {event.gregorianDisplayAr}
          </p>
          <p className="mt-2 text-base font-medium text-[#4F6073]">
            {venue.name} {venue.cityDistrict}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ruby-glass-keycap inline-flex items-center justify-center px-6 py-3 text-sm font-bold"
            >
              فتح الموقع على خرائط Google
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl border border-[#C8A977]/50 px-6 py-2.5 text-sm font-semibold text-[#1E2A38]"
            >
              إعادة تحميل الدعوة
            </button>
          </div>
        </div>
      </main>
    );
  }
}
