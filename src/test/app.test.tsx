import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { renderWithLang } from "./utils";

describe("App", () => {
  it("renders the hero headline in English", () => {
    renderWithLang(<App />, "en");
    expect(screen.getByRole("heading", { level: 1, name: /good things take dough/i })).toBeInTheDocument();
  });

  it("switches to Turkish", () => {
    renderWithLang(<App />, "en");
    fireEvent.click(screen.getAllByRole("button", { name: "Türkçe" })[0]!);
    expect(screen.getByRole("heading", { level: 1, name: /güzel şeyler hamurla başlar/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("tr");
  });
});
