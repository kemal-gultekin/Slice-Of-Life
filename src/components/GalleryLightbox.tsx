import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gallery } from "@/data/gallery";
import { lockScroll } from "@/lib/smoothScroll";
import { useI18n } from "@/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

/** Photo grows out of its tile (shared layoutId) and can be swiped/arrowed through. */
export function GalleryLightbox({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();
  const altOf = (i: number) => t.gallery.alts[i] ?? gallery[i]!.alt;
  const n = gallery.length;
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    closeRef.current?.focus();
    return () => lockScroll(false);
  }, [isOpen]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % n);
      if (e.key === "ArrowLeft") onChange((index - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, n, onChange]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery.viewer}
          className="fixed inset-0 z-[85] flex items-center justify-center p-4 md:p-12"
          onClick={() => onChange(null)}
        >
          <motion.div className="absolute inset-0 bg-ink/92 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.figure
            className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onChange((index + 1) % n);
              else if (info.offset.x > 80) onChange((index - 1 + n) % n);
            }}
          >
            <motion.div layoutId={`gallery-${index}`} transition={{ duration: 0.65, ease }} style={{ borderRadius: 16 }} className="overflow-hidden">
              <img src={gallery[index]!.src} alt={altOf(index)} draggable={false} className="max-h-[78svh] w-auto select-none object-contain" />
            </motion.div>
            <motion.figcaption
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0 }}
              className="mt-4 flex w-full max-w-3xl justify-between gap-6 text-sm text-cream/70"
            >
              <span>{altOf(index)}</span>
              <span className="tabular-nums">{index + 1} / {n}</span>
            </motion.figcaption>
          </motion.figure>

          <motion.div className="contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button ref={closeRef} onClick={() => onChange(null)} aria-label={t.gallery.close} className="glass absolute right-4 top-4 grid size-12 place-items-center rounded-full text-cream transition-transform hover:rotate-90">
              <X className="size-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onChange((index - 1 + n) % n); }} aria-label={t.gallery.prev} className="glass absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full text-cream md:grid md:left-6">
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onChange((index + 1) % n); }} aria-label={t.gallery.next} className="glass absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full text-cream md:grid md:right-6">
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
