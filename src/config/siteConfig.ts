/**
 * Business details for Crust & Ember — a fictional pizzeria used as a demo brand.
 * Edit here; everything on the site reads from this file.
 */
export const siteConfig = {
  name: "Crust & Ember",
  tagline: "Where every slice feels like home.",
  city: "Lefkoşa",
  address: "Lefkoşa",
  /** Google Maps link for the address. Leave "" to show the address as plain text. */
  mapUrl: "",
  hours: "Open daily · 11 AM – 11 PM",
  /** Opening hours as 24h numbers, used for the live "open now" badge (local time in Cyprus). */
  openHour: 11,
  closeHour: 23,
  timeZone: "Europe/Istanbul",
  /** WhatsApp number in international format, digits only. Leave "" to disable WhatsApp buttons. */
  whatsappNumber: "",
  /** Shown next to the phone icon. Leave "" to hide the phone line. */
  phoneDisplay: "",
  currency: "₺",
  /** Add verified social profile URLs here, e.g. { label: "Instagram", url: "https://instagram.com/..." } */
  socials: [] as { label: string; url: string }[],
};
