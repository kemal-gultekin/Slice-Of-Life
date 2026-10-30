import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Check, Minus, Plus, ShoppingBag, Store, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/i18n";
import { lockScroll } from "@/lib/smoothScroll";
import { buildWhatsAppUrl, cartOrderMessage, formatPrice, type OrderDetails } from "@/utils/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;

/** Slide-in cart (bottom sheet on phones). Sends the whole order as one WhatsApp message. */
export function CartDrawer() {
  const cart = useCart();
  const { t, cat } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [details, setDetails] = useState<OrderDetails>({ mode: "delivery", name: "", address: "", note: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!cart.isOpen) return;
    setSent(false);
    lockScroll(true);
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isOpen]);

  const message = cartOrderMessage(
    cart.lines.map((l) => ({ name: l.item.name, qty: l.qty, lineTotal: l.lineTotal })),
    cart.subtotal,
    details,
    t.cart.msg,
  );
  const url = buildWhatsAppUrl(message);
  const set = (k: keyof OrderDetails) => (e: { target: { value: string } }) => setDetails((d) => ({ ...d, [k]: e.target.value }));

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cart.close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            data-lenis-prevent
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.55, ease }}
            className="cart-panel absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-3xl border border-cream/10 bg-charcoal shadow-food md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[440px] md:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <h2 id="cart-title" className="font-display text-3xl text-mozz">{t.cart.title}</h2>
                <p className="text-sm text-cream/50">{t.cart.count(cart.count)}</p>
              </div>
              <button ref={closeRef} type="button" onClick={cart.close} aria-label={t.cart.close} className="glass grid size-11 place-items-center rounded-full text-mozz transition-transform hover:rotate-90">
                <X className="size-5" />
              </button>
            </div>

            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-tomato/10 text-tomato"><ShoppingBag className="size-7" /></span>
                <p className="font-display text-2xl text-mozz">{t.cart.empty}</p>
                <p className="max-w-xs text-sm text-cream/55">{t.cart.emptySub}</p>
                <a href="#menu" onClick={cart.close} className="btn btn-primary mt-2">{t.cart.browse}</a>
              </div>
            ) : sent ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }} className="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="size-8" />
                </motion.span>
                <p className="font-display text-3xl text-mozz">{t.cart.sentTitle}</p>
                <p className="max-w-xs text-sm text-cream/60">{t.cart.sentBody}</p>
                <div className="mt-4 flex w-full flex-col gap-2">
                  <button type="button" onClick={() => { cart.clear(); cart.close(); }} className="btn btn-primary">{t.cart.clear}</button>
                  <button type="button" onClick={() => setSent(false)} className="btn btn-ghost">{t.cart.keep}</button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="grid grid-cols-1">
                    <AnimatePresence initial={false}>
                      {cart.lines.map((l) => (
                        <motion.li
                          key={l.item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 border-b border-border py-4">
                            {l.item.image ? (
                              <img src={l.item.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                            ) : (
                              <span className="font-display grid size-14 shrink-0 place-items-center rounded-xl bg-tomato/15 text-xl text-tomato" lang="en">{l.item.name[0]}</span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p lang="en" className="truncate font-semibold text-mozz">{l.item.name}</p>
                              <p className="text-xs text-cream/45">{cat(l.item.category)}</p>
                              <div className="mt-2 flex items-center gap-1">
                                <button type="button" onClick={() => cart.setQty(l.item.id, l.qty - 1)} aria-label={t.menu.dec} className="grid size-7 place-items-center rounded-full border border-cream/15 text-cream hover:bg-cream/10">
                                  {l.qty === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                                </button>
                                <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                                <button type="button" onClick={() => cart.setQty(l.item.id, l.qty + 1)} aria-label={t.menu.inc} className="grid size-7 place-items-center rounded-full border border-cream/15 text-cream hover:bg-cream/10">
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="font-display text-xl text-cream tabular-nums">{l.lineTotal != null ? formatPrice(l.lineTotal) : "—"}</span>
                              <button type="button" onClick={() => cart.remove(l.item.id)} className="text-xs text-cream/40 underline-offset-2 hover:text-tomato hover:underline">
                                {t.cart.remove}
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* order details */}
                  <fieldset className="mt-6">
                    <legend className="eyebrow text-cream/50">{t.cart.mode}</legend>
                    <div className="mt-3 grid grid-cols-2 gap-1 rounded-full border border-cream/15 p-1">
                      {(["delivery", "pickup"] as const).map((m) => {
                        const active = details.mode === m;
                        const Icon = m === "delivery" ? Bike : Store;
                        return (
                          <button
                            key={m}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setDetails((d) => ({ ...d, mode: m }))}
                            className={`relative flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${active ? "text-ink" : "text-cream/60 hover:text-cream"}`}
                          >
                            {active && <motion.span layoutId="cart-mode" className="absolute inset-0 rounded-full bg-mozz" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                            <Icon className="relative size-4" />
                            <span className="relative">{m === "delivery" ? t.cart.delivery : t.cart.pickup}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-5 grid gap-3">
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-cream/60">{t.cart.name} <span className="text-cream/35">· {t.cart.optional}</span></span>
                      <input value={details.name} onChange={set("name")} autoComplete="name" className="cart-input" />
                    </label>
                    <AnimatePresence initial={false}>
                      {details.mode === "delivery" && (
                        <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid gap-1.5 overflow-hidden text-sm">
                          <span className="text-cream/60">{t.cart.address} <span className="text-cream/35">· {t.cart.optional}</span></span>
                          <textarea value={details.address} onChange={set("address")} rows={2} autoComplete="street-address" className="cart-input resize-none" />
                        </motion.label>
                      )}
                    </AnimatePresence>
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-cream/60">{t.cart.note} <span className="text-cream/35">· {t.cart.optional}</span></span>
                      <input value={details.note} onChange={set("note")} className="cart-input" />
                    </label>
                  </div>
                </div>

                {/* footer */}
                <div className="border-t border-border bg-ink/40 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-cream/60">{t.cart.subtotal}</span>
                    <span className="font-display text-4xl text-mozz tabular-nums">{formatPrice(cart.subtotal)}</span>
                  </div>
                  {cart.hasUnpriced && <p className="mt-1 text-xs text-cream/45">{t.cart.unpriced}</p>}
                  <a
                    href={url ?? "#contact"}
                    {...(url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setSent(true)}
                    className="btn btn-primary mt-4 w-full"
                  >
                    {t.cart.send}
                  </a>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
