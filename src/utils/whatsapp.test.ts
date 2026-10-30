import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, pizzaOrderMessage } from "./whatsapp";

describe("whatsapp", () => {
  it("builds a wa.me URL with digits only and encoded text", () => {
    expect(buildWhatsAppUrl("Hi & hello", "+90 555 000 00 00")).toBe("https://wa.me/905550000000?text=Hi%20%26%20hello");
  });
  it("is disabled without a valid number", () => {
    expect(buildWhatsAppUrl("Hi", "")).toBeNull();
  });
  it("includes pizza name and verified price", () => {
    expect(pizzaOrderMessage("Mini Pizza (Margarita)", 450)).toContain("Mini Pizza (Margarita) (₺450)");
  });
});
