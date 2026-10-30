import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { menu, type MenuItem } from "@/data/menu";

const KEY = "sol-cart";
const MAX = 50;
const byId = new Map(menu.map((m) => [m.id, m]));

export type CartLine = { item: MenuItem; qty: number; lineTotal: number | null };

type Ctx = {
  lines: CartLine[];
  count: number;
  /** Sum of priced lines. */
  subtotal: number;
  hasUnpriced: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Last added item + a changing key, for the "added" toast. */
  lastAdded: { id: string; qty: number; at: number } | null;
};

const CartCtx = createContext<Ctx | null>(null);

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    // drop anything no longer on the menu
    return Object.fromEntries(Object.entries(parsed).filter(([id, q]) => byId.has(id) && Number.isFinite(q) && q > 0));
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>(load);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<Ctx["lastAdded"]>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [items]);

  const add = useCallback((id: string, qty = 1) => {
    if (!byId.has(id)) return;
    setItems((s) => ({ ...s, [id]: Math.min(MAX, (s[id] ?? 0) + qty) }));
    setLastAdded({ id, qty, at: Date.now() });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setItems((s) => {
      const next = { ...s };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(MAX, qty);
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);
  const clear = useCallback(() => setItems({}), []);

  const value = useMemo<Ctx>(() => {
    const lines: CartLine[] = Object.entries(items)
      .map(([id, qty]) => {
        const item = byId.get(id)!;
        return { item, qty, lineTotal: item.price != null ? item.price * qty : null };
      })
      .filter((l) => l.qty > 0);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + (l.lineTotal ?? 0), 0),
      hasUnpriced: lines.some((l) => l.lineTotal == null),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      lastAdded,
    };
  }, [items, add, setQty, remove, clear, isOpen, lastAdded]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const v = useContext(CartCtx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}
