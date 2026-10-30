import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { formatPrice, itemOrderMessage } from "@/utils/whatsapp";
import { lockScroll } from "@/lib/smoothScroll";
import { useI18n } from "@/i18n";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import { ShoppingBag } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Item detail: morphs out of the card/row it was opened from (shared layoutId). */
export function MenuDialog({ item: raw, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { t, cat, item: loc } = useI18n();
  const item = raw ? loc(raw) : null;
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!raw) return;
    setQty(1);
    lockScroll(true);
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [raw, onClose]);

  const total = item?.price != null ? formatPrice(item.price * qty) : null;

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/70 backdrop-blur-sm md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          onClick={onClose}
        >
          <motion.div
            layoutId={`menu-${item.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-dialog-title"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.6, ease }}
            style={{ borderRadius: 24 }}
            className="relative max-h-[92svh] w-full overflow-y-auto border border-cream/10 bg-charcoal shadow-food md:max-w-3xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.menu.close}
              className="glass absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full text-mozz transition-transform hover:rotate-90"
            >
              <X className="size-5" />
            </button>

            <div className={item.image ? "md:grid md:grid-cols-2" : ""}>
              {item.image && (
                <motion.div layoutId={`menu-img-${item.id}`} transition={{ duration: 0.6, ease }} className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-full">
                  <img src={item.image} alt={item.name} className="absolute inset-0 size-full object-cover" />
                </motion.div>
              )}

              <motion.div
                className="flex flex-col p-6 pt-8 md:p-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <p className="eyebrow text-tomato">{cat(item.category)}</p>
                <h3 id="menu-dialog-title" lang="en" className="font-display mt-3 pr-10 text-4xl text-mozz md:text-5xl">
                  {item.name}
                </h3>
                {item.description && <p className="mt-4 text-cream/70">{item.description}</p>}
                {item.ingredients.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={t.menu.ingredients}>
                    {item.ingredients.map((g, i) => (
                      <motion.li
                        key={g}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.35 + i * 0.04 } }}
                        className="rounded-full border border-cream/15 px-3 py-1.5 text-sm text-cream/80"
                      >
                        {g}
                      </motion.li>
                    ))}
                  </ul>
                )}
                {item.dietary && <p className="eyebrow mt-4 text-olive">{item.dietary}</p>}

                <div className="mt-auto pt-10">
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
                    <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1" role="group" aria-label={t.menu.quantity}>
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t.menu.dec} className="grid size-9 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 disabled:opacity-30" disabled={qty <= 1}>
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={qty} className="inline-block" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                            {qty}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label={t.menu.inc} className="grid size-9 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10">
                        <Plus className="size-4" />
                      </button>
                    </div>
                    {total ? (
                      <span className="font-display text-4xl text-mozz tabular-nums">{total}</span>
                    ) : (
                      <span className="eyebrow text-cream/50">{t.menu.priceOnRequest}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      cart.add(item.id, qty);
                      onClose();
                    }}
                    className="btn btn-primary mt-5 w-full"
                  >
                    <ShoppingBag className="size-4" aria-hidden /> {t.cart.add}
                  </button>
                  {(() => {
                    const url = buildWhatsAppUrl(itemOrderMessage(item.name, qty, item.price, t.wa.item));
                    return url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-sm text-cream/55 underline-offset-4 transition-colors hover:text-mozz hover:underline">
                        {t.cart.orderOnlyThis}
                      </a>
                    ) : null;
                  })()}
                  {item.image && <p className="mt-4 text-xs text-cream/40">{t.menu.illustration}</p>}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
