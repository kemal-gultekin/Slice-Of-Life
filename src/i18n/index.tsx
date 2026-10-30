import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dict } from "./en";
import { tr } from "./tr";
import { menuTr } from "./menuTr";
import type { Category, MenuItem } from "@/data/menu";

export type Lang = "en" | "tr";
const dicts: Record<Lang, Dict> = { en, tr };
const KEY = "ce-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "tr") return saved;
  } catch {
    /* storage unavailable */
  }
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("tr")) return "tr";
  return "en";
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  /** Localised category label. */
  cat: (c: Category | "All") => string;
  /** Menu item with description/ingredients in the current language (names stay as on the restaurant's menu). */
  item: (m: MenuItem) => MenuItem;
};

const I18n = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const isTr = lang === "tr";
    return {
      lang,
      setLang,
      t: dicts[lang],
      cat: (c) => (isTr ? (menuTr.categories[c] ?? c) : c),
      item: (m) =>
        isTr
          ? {
              ...m,
              description: menuTr.descriptions[m.id] ?? m.description,
              ingredients: m.ingredients.map((g) => menuTr.ingredients[g] ?? g),
            }
          : m,
    };
  }, [lang, setLang]);

  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export function useI18n() {
  const v = useContext(I18n);
  if (!v) throw new Error("useI18n must be used inside <LangProvider>");
  return v;
}
