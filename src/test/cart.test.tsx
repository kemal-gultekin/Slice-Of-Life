import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenuSection } from "@/components/MenuSection";
import { CartDrawer } from "@/components/CartDrawer";
import { cartOrderMessage } from "@/utils/whatsapp";
import { en } from "@/i18n/en";
import { renderWithLang } from "./utils";

describe("cart", () => {
  it("builds one WhatsApp message for several items", () => {
    const msg = cartOrderMessage(
      [
        { name: "BBQ Chicken Calzone", qty: 2, lineTotal: 1380 },
        { name: "English Tea", qty: 1, lineTotal: null },
      ],
      1380,
      { mode: "delivery", name: "Kemal", address: "Ortaköy", note: "" },
      en.cart.msg,
    );
    expect(msg).toContain("• 2× BBQ Chicken Calzone — ₺1.380");
    expect(msg).toContain("• 1× English Tea — price on request");
    expect(msg).toContain("Subtotal: ₺1.380");
    expect(msg).toContain("Address: Ortaköy");
    expect(msg).not.toContain("Note:");
  });

  it("adds items from the menu and sends them together", async () => {
    renderWithLang(
      <>
        <MenuSection />
        <CartDrawer />
      </>,
    );
    const search = screen.getByPlaceholderText(/search the menu/i);
    for (const [q, name] of [["garlic cheesy", /garlic cheesy bread/i], ["onion rings", /onion rings/i]] as const) {
      fireEvent.change(search, { target: { value: q } });
      fireEvent.click(screen.getByRole("button", { name }));
      const dialog = await screen.findByRole("dialog");
      fireEvent.click(within(dialog).getByRole("button", { name: /add to cart/i }));
    }
    expect(localStorage.getItem("sol-cart")).toContain("garlic-cheesy-bread");
    expect(localStorage.getItem("sol-cart")).toContain("onion-rings");
  });
});
