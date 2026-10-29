import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { LangProvider } from "@/i18n";

export function renderWithLang(ui: ReactElement, lang: "en" | "tr" = "en") {
  localStorage.setItem("sol-lang", lang);
  return render(<LangProvider>{ui}</LangProvider>);
}
