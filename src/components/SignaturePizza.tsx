import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { menu, signatureId } from "@/data/menu";
import { formatPrice, itemOrderMessage } from "@/utils/whatsapp";
import { useI18n } from "@/i18n";
import { WhatsAppButton } from "./WhatsAppButton";
import { Reveal } from "./Reveal";

export function SignaturePizza() {
  const { t, item: loc } = useI18n();
  const item = loc(menu.find((m) => m.id === signatureId)!);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 12]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.9, 1, 1.05]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal px-5 py-28 md:px-10 md:py-40" aria-labelledby="sig-title">
      <p aria-hidden className="font-display pointer-events-none absolute -left-4 top-10 select-none whitespace-nowrap text-[28vw] text-cream/[0.04]">Signature</p>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <motion.img style={{ rotate, scale }} src={item.image} alt={item.name} width={1400} height={1400} loading="lazy" className="aspect-square w-full rounded-full object-cover shadow-food" />
        <Reveal>
          <p className="eyebrow text-tomato">{t.signature.eyebrow}</p>
          <h2 id="sig-title" lang="en" className="font-display mt-4 text-[14vw] text-mozz md:text-[6vw]">{item.name}</h2>
          <p className="mt-6 max-w-md text-lg text-cream/70">{item.description}</p>
          <ul className="mt-8 grid max-w-md grid-cols-2 gap-y-3 border-t border-border pt-6 text-cream/80">
            {item.ingredients.map((g) => <li key={g} className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-olive" />{g}</li>)}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <WhatsAppButton message={itemOrderMessage(item.name, 1, item.price, t.wa.item)} variant="primary">{t.signature.order}</WhatsAppButton>
            {formatPrice(item.price) && <span className="font-display text-4xl text-mozz">{formatPrice(item.price)}</span>}
          </div>
          <p className="mt-6 text-xs text-cream/40">{t.menu.illustration}</p>
        </Reveal>
      </div>
    </section>
  );
}
