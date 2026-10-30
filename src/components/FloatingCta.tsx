import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl, formatPrice } from "@/utils/whatsapp";
import { useI18n } from "@/i18n";
import { useCart } from "@/lib/cart";
import { menu } from "@/data/menu";

/** Glassy pill that floats at the bottom of every section; becomes the cart button once something is added. */
export function FloatingCta() {
  const [shown, setShown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { t } = useI18n();
  const cart = useCart();
  const wa = buildWhatsAppUrl(t.wa.greeting);

  useEffect(() => {
    const id = setTimeout(() => setShown(true), 1400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!cart.lastAdded) return;
    const name = menu.find((m) => m.id === cart.lastAdded!.id)?.name ?? "";
    setToast(`${cart.lastAdded.qty}× ${name}`);
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [cart.lastAdded]);

  const hasCart = cart.count > 0;

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-cine)] md:bottom-7 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast + String(cart.lastAdded?.at)}
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            className="glass flex max-w-[86vw] items-center gap-2 rounded-full px-4 py-2 text-sm text-mozz"
          >
            <Check className="size-4 shrink-0 text-emerald-400" />
            <span className="truncate">
              {t.cart.added} · <span lang="en">{toast}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="glass flex items-center gap-1.5 rounded-full p-1.5">
        {hasCart ? (
          <motion.button
            layout
            key={cart.count}
            type="button"
            data-magnetic
            onClick={cart.open}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            aria-label={`${t.cart.open} · ${t.cart.count(cart.count)}`}
            className="flex items-center gap-2.5 rounded-full bg-tomato px-5 py-2.5 text-[0.8rem] font-bold text-mozz transition-colors hover:bg-[oklch(0.55_0.18_32)]"
          >
            <ShoppingBag className="size-4" />
            <span>{t.cart.view}</span>
            <span className="grid min-w-5 place-items-center rounded-full bg-mozz px-1.5 text-[0.7rem] text-ink">{cart.count}</span>
            {cart.subtotal > 0 && <span className="tabular-nums opacity-85">{formatPrice(cart.subtotal)}</span>}
          </motion.button>
        ) : (
          <a href="#menu" data-magnetic className="rounded-full bg-mozz px-5 py-2.5 text-[0.8rem] font-bold text-ink transition-colors hover:bg-cream">
            {t.cta.order}
          </a>
        )}
        <a
          href={wa ?? "#contact"}
          {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={t.cta.wa}
          className="group grid size-10 place-items-center rounded-full bg-mozz text-ink transition-colors hover:bg-tomato hover:text-mozz"
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </a>
      </motion.div>
    </div>
  );
}
