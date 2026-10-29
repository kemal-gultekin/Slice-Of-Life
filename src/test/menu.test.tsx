import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithLang } from "./utils";
import { describe, expect, it } from "vitest";
import { MenuSection } from "@/components/MenuSection";

describe("MenuSection", () => {
  it("filters by search across categories", () => {
    renderWithLang(<MenuSection />);
    fireEvent.change(screen.getByPlaceholderText(/search the menu/i), { target: { value: "frappe" } });
    expect(screen.getByText(/results? for “frappe”/i)).toBeInTheDocument();
    expect(screen.getByText("Caramel Frappe")).toBeInTheDocument();
    expect(screen.queryByText("Cheese Burger")).not.toBeInTheDocument();
  });

  it("opens an item and builds a WhatsApp order with quantity", async () => {
    renderWithLang(<MenuSection />);
    fireEvent.change(screen.getByPlaceholderText(/search the menu/i), { target: { value: "garlic cheesy" } });
    fireEvent.click(screen.getByRole("button", { name: /garlic cheesy bread/i }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /increase quantity/i }));
    const link = within(dialog).getByRole("link", { name: /order on whatsapp/i });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("2× Garlic Cheesy Bread (₺680)");
  });

  it("orders in Turkish and finds dishes by Turkish category", async () => {
    renderWithLang(<MenuSection />, "tr");
    fireEvent.change(screen.getByPlaceholderText(/menüde ara/i), { target: { value: "tatlı" } });
    expect(screen.getByText("Chocolate Delight")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/menüde ara/i), { target: { value: "garlic cheesy" } });
    fireEvent.click(screen.getByRole("button", { name: /garlic cheesy bread/i }));
    const dialog = await screen.findByRole("dialog");
    const link = within(dialog).getByRole("link", { name: /whatsapp'tan sipariş/i });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("1 adet Garlic Cheesy Bread (₺340)");
  });
});
