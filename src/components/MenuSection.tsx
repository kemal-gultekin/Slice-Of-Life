import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { categories, menu, type MenuItem } from "@/data/menu";
import { formatPrice } from "@/utils/whatsapp";
import { MenuDialog } from "./MenuDialog";
import { Reveal } from "./Reveal";
import { useI18n } from "@/i18n";

type Cat = (typeof categories)[number];
const ease = [0.22, 1, 0.36, 1] as const;

const counts = categories.reduce<Record<string, number>>((acc, c) => {
  acc[c] = c === "All" ? menu.length : menu.filter((m) => m.category === c).length;
  return acc;
}, {});

function FeatureCard({ item, onOpen }: { item: MenuItem; onOpen: (i: MenuItem) => void }) {
  const { t, cat } = useI18n();
  const price = formatPrice(item.price);
  return (
    <motion.button
      type="button"
      layout="position"
      layoutId={`menu-${item.id}`}
      onClick={() => onOpen(item)}
      data-cursor={t.cursor.order}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease }}
      style={{ borderRadius: 20 }}
      className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden bg-charcoal text-left md:min-h-[30rem]"
      aria-label={`${item.name}${price ? `, ${price}` : ""} — ${t.menu.viewDetails}`}
    >
      <motion.div layoutId={`menu-img-${item.id}`} className="absolute inset-0 overflow-hidden">
        <img src={item.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
      <div className="relative flex items-end justify-between gap-4 p-6">
        <div>
          <p className="eyebrow text-tomato">{cat(item.category)}</p>
          <h3 lang="en" className="font-display mt-2 text-4xl text-mozz md:text-5xl">{item.name}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          {price && <span className="font-display text-3xl text-mozz">{price}</span>}
          <span className="grid size-11 place-items-center rounded-full bg-mozz text-ink transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Row({ item, i, onOpen }: { item: MenuItem; i: number; onOpen: (i: MenuItem) => void }) {
  const { t, item: loc } = useI18n();
  const price = formatPrice(item.price);
  const desc = loc(item).description;
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: Math.min(i, 12) * 0.03 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <motion.button
        type="button"
        layoutId={`menu-${item.id}`}
        onClick={() => onOpen(item)}
        style={{ borderRadius: 12 }}
        className="group relative -mx-3 flex w-[calc(100%+1.5rem)] items-baseline gap-3 px-3 py-4 text-left transition-colors hover:bg-cream/[0.04]"
      >
        <span lang="en" className="font-display text-xl text-mozz transition-colors group-hover:text-tomato md:text-2xl">{item.name}</span>
        <span className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-cream/20" aria-hidden />
        <span className={`shrink-0 ${price ? "font-display text-xl text-cream md:text-2xl" : "eyebrow text-cream/40"}`}>{price ?? t.menu.onRequest}</span>
        <ArrowUpRight className="size-4 shrink-0 -translate-x-1 self-center text-tomato opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
        {desc && <span className="sr-only">. {desc}</span>}
      </motion.button>
    </motion.li>
  );
}

export function MenuSection() {
  const [cat, setCat] = useState<Cat>("Pizza & Calzone");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<MenuItem | null>(null);
  const { t, cat: catLabel, lang, item: loc } = useI18n();
  const q = useDeferredValue(query.trim().toLocaleLowerCase(lang));

  const items = useMemo(() => {
    if (q)
      return menu.filter((m) => {
        const l = loc(m);
        const hay = `${m.name} ${m.description} ${l.description} ${m.ingredients.join(" ")} ${l.ingredients.join(" ")} ${m.category} ${catLabel(m.category)}`;
        return hay.toLocaleLowerCase(lang).includes(q);
      });
    return cat === "All" ? menu : menu.filter((m) => m.category === cat);
  }, [cat, q, catLabel, lang, loc]);
  const featured = items.filter((m) => m.image);
  const rows = items.filter((m) => !m.image);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="menu" className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-tomato">{t.menu.eyebrow(menu.length)}</p>
            <h2 className="font-display mt-4 text-[16vw] text-mozz md:text-[8vw]">{t.menu.title}</h2>
          </div>
          <label className="glass flex w-full items-center gap-3 rounded-full px-5 py-3.5 md:w-80">
            <Search className="size-4 shrink-0 text-cream/60" aria-hidden />
            <span className="sr-only">{t.menu.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.menu.search}
              className="w-full bg-transparent text-sm text-mozz placeholder:text-cream/45 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={t.menu.clear} className="text-cream/60 hover:text-mozz">
                <X className="size-4" />
              </button>
            )}
          </label>
        </Reveal>

        {/* category bar */}
        <div className="sticky top-16 z-30 -mx-5 mt-12 bg-ink/80 px-5 py-3 backdrop-blur-md md:top-20 md:-mx-10 md:px-10">
          <div role="tablist" aria-label={t.menu.tabs} className="no-scrollbar flex gap-1 overflow-x-auto [mask-image:linear-gradient(90deg,#000_92%,transparent)]">
            {categories.map((c) => {
              const active = !q && cat === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setQuery("");
                    setCat(c);
                  }}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-[0.8rem] font-semibold transition-colors ${active ? "text-ink" : "text-cream/60 hover:text-cream"}`}
                >
                  {active && <motion.span layoutId="menu-tab" className="absolute inset-0 rounded-full bg-mozz" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                  <span className="relative">
                    {catLabel(c)} <span className={active ? "text-ink/50" : "text-cream/30"}>{counts[c]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <LayoutGroup>
          <div className="mt-10" role="tabpanel" aria-live="polite">
            {q && (
              <p className="eyebrow mb-6 text-cream/50">
                {t.menu.results(items.length, query.trim())}
              </p>
            )}

            {featured.length > 0 && (
              <motion.div layout className="mb-10 grid gap-4 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {featured.map((m) => (
                    <FeatureCard key={m.id} item={m} onOpen={setOpen} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            <ul className="grid gap-x-16 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {rows.map((m, i) => (
                  <Row key={m.id} item={m} i={i} onOpen={setOpen} />
                ))}
              </AnimatePresence>
            </ul>

            {items.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-cream/50">
                {t.menu.empty}
              </motion.p>
            )}
          </div>

          <MenuDialog item={open} onClose={close} />
        </LayoutGroup>

        <p className="mt-16 text-sm text-cream/40">{t.menu.note}</p>
      </div>
    </section>
  );
}
