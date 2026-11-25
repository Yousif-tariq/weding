import { WHITE_JOY_CONFIG } from "../config/whiteJoyConfig";

function toIcsUtcString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}Z`
  );
}

export function getGoogleCalendarUrl(): string {
  const start = new Date(WHITE_JOY_CONFIG.event.isoDate);
  const end = new Date(
    start.getTime() + WHITE_JOY_CONFIG.event.durationHours * 60 * 60 * 1000
  );

  const title = `${WHITE_JOY_CONFIG.brand.experienceTitle} — زفاف ${WHITE_JOY_CONFIG.brand.groomAr} و ${WHITE_JOY_CONFIG.brand.brideAr}`;
  const details = `${WHITE_JOY_CONFIG.chapters.welcome.title} — ${WHITE_JOY_CONFIG.venue.name}`;
  const location = `${WHITE_JOY_CONFIG.venue.name}, ${WHITE_JOY_CONFIG.venue.cityDistrict}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toIcsUtcString(start)}/${toIcsUtcString(end)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadWeddingIcsFile(): void {
  const start = new Date(WHITE_JOY_CONFIG.event.isoDate);
  const end = new Date(
    start.getTime() + WHITE_JOY_CONFIG.event.durationHours * 60 * 60 * 1000
  );

  const summary = `${WHITE_JOY_CONFIG.brand.experienceTitle} — زفاف ${WHITE_JOY_CONFIG.brand.groomAr} و ${WHITE_JOY_CONFIG.brand.brideAr}`;
  const description = `${WHITE_JOY_CONFIG.chapters.welcome.title} — ${WHITE_JOY_CONFIG.venue.name} (${WHITE_JOY_CONFIG.venue.cityDistrict})`;
  const location = `${WHITE_JOY_CONFIG.venue.name}، ${WHITE_JOY_CONFIG.venue.cityDistrict}`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Laylat Al-Farah Al-Abyad//Wedding Invitation//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:white-joy-${start.getTime()}@invitation.local`,
    `DTSTAMP:${toIcsUtcString(new Date())}`,
    `DTSTART:${toIcsUtcString(start)}`,
    `DTEND:${toIcsUtcString(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([icsLines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Wedding-Mustafa-Eithar.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
