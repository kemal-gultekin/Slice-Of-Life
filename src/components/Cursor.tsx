import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MAGNETIC = ".btn, [data-magnetic]";
const INTERACTIVE = "a, button, [role='tab'], label, input";

/**
 * Desktop-only polish: a soft ring that trails the pointer (native cursor stays),
 * grows over links and shows a label over [data-cursor] targets; buttons lean
 * magnetically toward the pointer.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset["cursor"] ?? null);
      setHover(!!t?.closest(INTERACTIVE));

      const m = t?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        m.style.translate = `${dx}px ${dy}px`;
      }
    };
    const onScroll = () => {
      setLabel(null);
      setHover(false);
      release();
    };
    const onDown = () => {
      setDown(true);
      setLabel(null);
    };
    const onUp = () => setDown(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
      release();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 88 : hover ? 54 : 28;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: sx, y: sy }}>
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${label ? "bg-tomato text-mozz" : "border border-cream/60 mix-blend-difference"}`}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {label && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="eyebrow text-[0.6rem]">
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
