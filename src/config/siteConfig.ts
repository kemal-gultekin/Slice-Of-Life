/**
 * Business details — verified from https://sliceoflife.site/ (Oct 2026).
 * Edit here; everything on the site reads from this file.
 */
export const siteConfig = {
  name: "Slice of Life",
  tagline: "Where every slice feels like home.",
  city: "Lefkoşa",
  address: "Gazeteci Hasan Tahsin Cd 26-a, Ortaköy, Lefkoşa",
  mapUrl: "https://share.google/wpcvM8Y1eONZuxDEa",
  hours: "Open daily · 11 AM – 11 PM",
  /** Opening hours as 24h numbers, used for the live "open now" badge (local time in Cyprus). */
  openHour: 11,
  closeHour: 23,
  timeZone: "Europe/Istanbul",
  /** WhatsApp number in international format, digits only. Leave "" to disable WhatsApp buttons. */
  whatsappNumber: "905338560333",
  phoneDisplay: "+90 533 856 03 33",
  currency: "₺",
  /** Add verified social profile URLs here, e.g. { label: "Instagram", url: "https://instagram.com/..." } */
  socials: [] as { label: string; url: string }[],
};
