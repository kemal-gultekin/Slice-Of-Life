import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * Endless type band. Drifts on its own, speeds up and leans with scroll velocity.
 */
export function Marquee({ words, tone = "tomato", tilt = -2 }: { words: string[]; tone?: "tomato" | "cream"; tilt?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [6, -6]);
  const dir = useRef(1);
  const track = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduce || !track.current) return;
    const half = track.current.scrollWidth / 2;
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    let next = x.get() - dir.current * (0.05 + Math.abs(b) * 0.05) * delta;
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  const colors = tone === "tomato" ? "bg-tomato text-mozz" : "bg-cream text-ink";
  const line = (
    <>
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          <span>{w}</span>
          <span aria-hidden className="inline-block size-3 rounded-full bg-current opacity-60 md:size-4" />
        </span>
      ))}
    </>
  );

  return (
    <div className={`relative z-10 -mx-4 overflow-hidden py-5 md:py-7 ${colors}`} style={{ rotate: `${tilt}deg` }} aria-label={words.join(" · ")} role="marquee">
      <motion.div ref={track} style={{ x, skewX: reduce ? 0 : skew }} className="font-display flex w-max whitespace-nowrap text-5xl md:text-8xl" aria-hidden>
        {line}
        {line}
        {line}
        {line}
      </motion.div>
    </div>
  );
}
