import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import fire from "@/assets/oven-fire.webp";
import { siteConfig } from "@/config/siteConfig";
import { menu } from "@/data/menu";
import { useOpenNow } from "@/lib/openNow";
import { useI18n } from "@/i18n";
import { useCart } from "@/lib/cart";
import { Plus, ShoppingBag } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";

const ease = [0.22, 1, 0.36, 1] as const;
const quickPicks = ["bbq-chicken-calzone", "deluxe-veggie-calzone", "mini-margarita", "garlic-cheesy-bread", "sharing-plate", "buffalo-wings"]
  .map((id) => menu.find((m) => m.id === id))
  .filter((m): m is NonNullable<typeof m> => !!m);

export function OrderSection() {
  const open = useOpenNow();
  const { t, cat } = useI18n();
  const cart = useCart();
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden px-5 py-28 md:scroll-mt-20 md:px-10 md:py-40" aria-labelledby="order-title">
      <img src={fire} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <motion.div className="min-w-0" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm text-cream" aria-live="polite">
            <span className="relative flex size-2.5">
              {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
              <span className={`relative inline-flex size-2.5 rounded-full ${open === null ? "bg-cream/40" : open ? "bg-emerald-400" : "bg-tomato"}`} />
            </span>
            {open === null ? t.hours : open ? t.order.openNow : t.order.closedNow}
          </span>
          <h2 id="order-title" className="font-display mt-8 text-[12vw] text-mozz md:text-[6.2vw]">
            {t.order.title}
          </h2>
          <p className="mt-6 max-w-md text-lg text-cream/70">{t.order.sub}</p>

          <address className="mt-12 grid gap-5 not-italic sm:grid-cols-2">
            <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-4">
              <span className="glass grid size-11 shrink-0 place-items-center rounded-xl text-tomato"><MapPin className="size-4" /></span>
              <span>
                <span className="eyebrow block text-cream/45">{t.order.find}</span>
                <span className="text-cream/85 transition-colors group-hover:text-mozz">{siteConfig.address}</span>
              </span>
            </a>
            <a href={`tel:+${siteConfig.whatsappNumber}`} className="group flex gap-4">
              <span className="glass grid size-11 shrink-0 place-items-center rounded-xl text-tomato"><Phone className="size-4" /></span>
              <span>
                <span className="eyebrow block text-cream/45">{t.order.call}</span>
                <span className="text-cream/85 transition-colors group-hover:text-mozz">{siteConfig.phoneDisplay}</span>
              </span>
            </a>
            <p className="flex gap-4">
              <span className="glass grid size-11 shrink-0 place-items-center rounded-xl text-tomato"><Clock className="size-4" /></span>
              <span>
                <span className="eyebrow block text-cream/45">{t.order.hours}</span>
                <span className="text-cream/85">{t.hours}</span>
              </span>
            </p>
          </address>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          style={{ transformPerspective: 1200 }}
          className="glass min-w-0 rounded-3xl p-5 md:p-9"
        >
          <p className="font-display text-3xl text-mozz md:text-4xl">{t.order.cardTitle}</p>
          <p className="mt-2 text-sm text-cream/60">{t.order.cardSub}</p>

          <ul className="mt-7 grid grid-cols-1 gap-2">
            {quickPicks.map((m, i) => {
              const inCart = cart.lines.find((l) => l.item.id === m.id)?.qty ?? 0;
              return (
                <motion.li key={m.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.06 }}>
                  <button
                    type="button"
                    onClick={() => cart.add(m.id)}
                    aria-label={`${t.cart.add}: ${m.name}`}
                    className="group flex w-full items-center gap-4 rounded-2xl text-left border border-cream/10 bg-ink/30 p-3 pr-4 transition-colors hover:border-tomato/50 hover:bg-ink/50"
                  >
                    {m.image ? (
                      <img src={m.image} alt="" loading="lazy" className="size-12 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="font-display grid size-12 shrink-0 place-items-center rounded-xl bg-tomato/15 text-lg text-tomato">{m.name[0]}</span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span lang="en" className="block truncate font-semibold text-mozz">{m.name}</span>
                      <span className="text-xs text-cream/50">{cat(m.category)}</span>
                    </span>
                    {m.price != null && <span className="font-display text-xl text-cream">₺{m.price}</span>}
                    <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-tomato/15 text-tomato transition-colors group-hover:bg-tomato group-hover:text-mozz">
                      <Plus className="size-4" />
                      {inCart > 0 && (
                        <motion.span key={inCart} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-mozz text-[0.65rem] font-bold text-ink">
                          {inCart}
                        </motion.span>
                      )}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-cream/10 pt-6">
            {cart.count > 0 ? (
              <button type="button" onClick={cart.open} className="btn btn-primary flex-1">
                <ShoppingBag className="size-4" aria-hidden /> {t.cart.view} · {cart.count}
              </button>
            ) : (
              <WhatsAppButton variant="primary" className="flex-1">{t.order.chat}</WhatsAppButton>
            )}
            <a href="#menu" className="btn btn-ghost flex-1">{t.order.fullMenu}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
