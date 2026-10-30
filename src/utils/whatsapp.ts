import { siteConfig } from "@/config/siteConfig";

export function cleanNumber(raw: string) {
  return (raw || "").replace(/\D/g, "");
}

/** Returns a wa.me click-to-chat URL, or null when no valid number is configured. */
export function buildWhatsAppUrl(message: string, number: string = siteConfig.whatsappNumber): string | null {
  const n = cleanNumber(number);
  if (n.length < 8) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price: number | null | undefined) {
  if (price == null) return null;
  return `${siteConfig.currency}${price.toLocaleString("tr-TR")}`;
}

export function pizzaOrderMessage(name: string, price?: number | null) {
  const p = formatPrice(price);
  return `Hi Crust & Ember! I'd like to order ${name}${p ? ` (${p})` : ""}. Could you please share the available options and delivery details?`;
}

export const greetingMessage = "Hi Crust & Ember! I'd like to place an order. Could you share today's options and delivery details?";

/** Localised order message: pass `t.wa.item` from useI18n(). */
export function itemOrderMessage(
  name: string,
  qty: number,
  unitPrice?: number | null,
  fmt: (qty: number, name: string, total: string | null) => string = (q, n, tot) =>
    `Hi Crust & Ember! I'd like to order ${q}× ${n}${tot ? ` (${tot})` : ""}. Could you please confirm availability and delivery details?`,
) {
  const total = unitPrice != null ? formatPrice(unitPrice * qty) : null;
  return fmt(qty, name, total);
}

export type OrderDetails = { mode: "delivery" | "pickup"; name: string; address: string; note: string };
export type OrderLabels = {
  hello: string; subtotal: string; delivery: string; pickup: string; name: string;
  address: string; note: string; outro: string; priceOnReq: string;
};

/** One WhatsApp message for the whole cart. */
export function cartOrderMessage(
  lines: { name: string; qty: number; lineTotal: number | null }[],
  subtotal: number,
  d: OrderDetails,
  L: OrderLabels,
) {
  const rows = lines.map((l) => `• ${l.qty}× ${l.name} — ${l.lineTotal != null ? formatPrice(l.lineTotal) : L.priceOnReq}`);
  const out = [L.hello, ...rows, "", `${L.subtotal}: ${formatPrice(subtotal)}`, `${d.mode === "delivery" ? L.delivery : L.pickup}`];
  if (d.name.trim()) out.push(`${L.name}: ${d.name.trim()}`);
  if (d.mode === "delivery" && d.address.trim()) out.push(`${L.address}: ${d.address.trim()}`);
  if (d.note.trim()) out.push(`${L.note}: ${d.note.trim()}`);
  out.push("", L.outro);
  return out.join("\n");
}
