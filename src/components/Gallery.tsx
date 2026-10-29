import { useCallback, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { gallery } from "@/data/gallery";
import { GalleryLightbox } from "./GalleryLightbox";
import { Reveal } from "./Reveal";
import { useI18n } from "@/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

function Tile({ i, onOpen }: { i: number; onOpen: (i: number) => void }) {
  const g = gallery[i]!;
  const { t } = useI18n();
  const alt = t.gallery.alts[i] ?? g.alt;
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <motion.li
      ref={ref}
      className={`${g.span} ${i === 0 ? "col-span-2 row-span-2" : ""}`}
      initial={{ opacity: 0, y: 40, clipPath: "inset(12% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease, delay: (i % 4) * 0.08 }}
    >
      <button type="button" data-cursor={t.cursor.view} onClick={() => onOpen(i)} className="group relative block size-full" aria-label={`${t.gallery.open}: ${alt}`}>
        <motion.div layoutId={`gallery-${i}`} style={{ borderRadius: 16 }} className="relative size-full overflow-hidden">
          <motion.img style={{ y, scale: 1.18 }} src={g.src} alt={alt} width={g.w} height={g.h} loading="lazy" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute bottom-4 left-4 right-14 translate-y-2 text-left text-sm text-mozz opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{alt}</span>
          <span className="glass absolute bottom-3 right-3 grid size-10 scale-75 place-items-center rounded-full text-mozz opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Plus className="size-4" />
          </span>
        </motion.div>
      </button>
    </motion.li>
  );
}

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const change = useCallback((i: number | null) => setIndex(i), []);
  const { t } = useI18n();
  return (
    <section id="gallery" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-tomato">{t.gallery.eyebrow}</p>
            <h2 className="font-display mt-4 text-[16vw] text-mozz md:text-[8vw]">{t.gallery.title}</h2>
          </div>
          <p className="max-w-xs text-cream/55">{t.gallery.sub}</p>
        </Reveal>
        <LayoutGroup id="gallery">
          <ul className="mt-14 grid auto-rows-[44vw] grid-cols-2 gap-3 md:auto-rows-[18vw] md:grid-cols-4 md:gap-4">
            {gallery.map((_, i) => (
              <Tile key={i} i={i} onOpen={setIndex} />
            ))}
          </ul>
          <GalleryLightbox index={index} onChange={change} />
        </LayoutGroup>
      </div>
    </section>
  );
}
