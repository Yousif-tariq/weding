/**
 * Ultra-lightweight Quiet Luxury Winter Snow Ambiance
 * Pure CSS frost glow + 16 gentle slow-drifting snow light motes.
 * Zero heavy WebGL, zero video overhead — instant load on mobile.
 */
const SNOW_MOTES = [
  { left: "6%", size: 5, dur: 18, delay: 0 },
  { left: "14%", size: 7, dur: 22, delay: -6 },
  { left: "23%", size: 4, dur: 16, delay: -11 },
  { left: "31%", size: 6, dur: 24, delay: -3 },
  { left: "40%", size: 5, dur: 19, delay: -14 },
  { left: "48%", size: 8, dur: 26, delay: -8 },
  { left: "57%", size: 4, dur: 17, delay: -2 },
  { left: "65%", size: 6, dur: 23, delay: -15 },
  { left: "74%", size: 5, dur: 20, delay: -9 },
  { left: "82%", size: 7, dur: 25, delay: -4 },
  { left: "90%", size: 4, dur: 18, delay: -12 },
  { left: "95%", size: 6, dur: 21, delay: -7 },
];

export function WinterSnowAmbiance() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Serene Winter Snow Sky & Soft Frosted Champagne Light Glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 84% 8%, rgba(200, 169, 119, 0.14) 0%, transparent 48%), radial-gradient(ellipse at 14% 18%, rgba(182, 210, 236, 0.34) 0%, transparent 52%), radial-gradient(ellipse at 50% 90%, rgba(226, 236, 246, 0.55) 0%, transparent 60%), linear-gradient(180deg, #F7FAFD 0%, #F2F7FC 52%, #EDF3F9 100%)",
        }}
      />

      {/* Ultra-Gentle Drifting Snowflakes / Frost Light Motes */}
      {SNOW_MOTES.map((m, idx) => (
        <span
          key={idx}
          className="snow-mote absolute -top-6 rounded-full"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            animationDuration: `${m.dur}s`,
            animationDelay: `${m.delay}s`,
            background:
              idx % 3 === 0
                ? "radial-gradient(circle, rgba(200, 169, 119, 0.55) 0%, rgba(255, 255, 255, 0) 75%)"
                : "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(155, 183, 212, 0.35) 60%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      ))}
    </div>
  );
}
