import { useEffect, useState } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateRemaining(targetMs: number): CountdownState {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

export function useCountdown(isoDate: string): CountdownState {
  const targetMs = new Date(isoDate).getTime();
  const [remaining, setRemaining] = useState<CountdownState>(() =>
    calculateRemaining(targetMs)
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(calculateRemaining(targetMs));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return remaining;
}

export function toArabicDigits(value: number, pad = 2): string {
  return String(value)
    .padStart(pad, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
