import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Clock, MapPin, MessageCircle, UtensilsCrossed } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { menu } from "@/data/menu";
import { useI18n } from "@/i18n";
import { Brand } from "./Brand";

const ease = [0.22, 1, 0.36, 1] as const;

const icons = [UtensilsCrossed, Clock, MessageCircle, MapPin];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = `${to}${suffix}`;
      return;
    }
    const c = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => c.stop();
  }, [inView, to, suffix, reduce]);
  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

export function WhySliceOfLife() {
  const { t } = useI18n();
  const stats = [
    { value: menu.length, suffix: "", label: t.why.stats[0]! },
    { value: 7, suffix: "", label: t.why.stats[1]! },
    { value: siteConfig.closeHour - siteConfig.openHour, suffix: t.why.hourSuffix, label: t.why.stats[2]! },
    { value: 1, suffix: t.why.tapSuffix, label: t.why.stats[3]! },
  ];
  const values = t.why.values.map((v, i) => ({ ...v, icon: icons[i]!, body: v.body || siteConfig.address }));
  return (
    <section className="px-5 py-28 md:px-10 md:py-40" aria-labelledby="why-title">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          id="why-title"
          className="font-display text-[14vw] text-mozz md:text-[7vw]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          <Brand text={t.why.title} />
        </motion.h2>

        <dl className="mt-16 grid grid-cols-2 border-t border-border lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="border-b border-border py-8 pr-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display whitespace-nowrap text-5xl text-tomato md:text-7xl xl:text-8xl">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
              <dd className="mt-3 text-sm text-cream/60">{s.label}</dd>
            </motion.div>
          ))}
        </dl>

        <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.li
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-border bg-charcoal/60 p-7 transition-colors hover:border-tomato/40"
            >
              <span className="grid size-12 place-items-center rounded-full bg-tomato/10 text-tomato transition-colors group-hover:bg-tomato group-hover:text-mozz">
                <v.icon className="size-5" strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="font-display mt-8 text-2xl text-mozz">{v.title}</h3>
              <p className="mt-3 text-cream/60">{v.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
