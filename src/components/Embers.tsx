import { useMemo } from "react";

export function Embers({ count }: { count: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const s = Math.sin(i * 9301 + n * 49297) * 233280;
          return s - Math.floor(s);
        };
        return {
          left: `${15 + r(1) * 70}%`,
          size: 2 + r(2) * 4,
          dur: 3.2 + r(3) * 3.5,
          delay: -r(4) * 6,
          drift: `${(r(5) - 0.5) * 120}px`,
        };
      }),
    [count],
  );
  return (
    <div data-embers className="pointer-events-none absolute inset-0 z-[5] overflow-hidden opacity-0" aria-hidden>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            ["--drift" as string]: s.drift,
          }}
        />
      ))}
    </div>
  );
}
