import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { LangProvider } from "@/i18n";
import { CartProvider } from "@/lib/cart";

export function renderWithLang(ui: ReactElement, lang: "en" | "tr" = "en") {
  localStorage.setItem("sol-lang", lang);
  localStorage.removeItem("sol-cart");
  return render(
    <LangProvider>
      <CartProvider>{ui}</CartProvider>
    </LangProvider>,
  );
}
