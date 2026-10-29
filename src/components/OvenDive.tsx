import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import ovenOuter from "@/assets/oven-outer.webp";
import ovenArch from "@/assets/oven-arch.webp";
import ovenFire from "@/assets/oven-fire.webp";
import { Embers } from "./Embers";
import { useI18n } from "@/i18n";
import { isBrandWord } from "./Brand";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;


/* Each photo layer covers the viewport like `object-fit: cover`, but as a real
   box so transform-origin can be aimed at the oven opening in image coordinates. */
const cover = (ratio: number) => ({
  width: `max(100vw, calc(100svh * ${ratio}))`,
  aspectRatio: `${ratio}`,
});

function Words({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-hword className="inline-block">{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Opening "camera dive": a dark, tiled wood-fired oven → fly through its
 * mouth → into the dome → into the flames, where the brand statement fills in
 * word by word. Hands off to the pizza story on black.
 */
export function OvenDive() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const { t } = useI18n();
  const STATEMENT = t.hero.statement;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useIso(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const one = (s: string) => q(s)[0]!;
      const isMobile = window.innerWidth < 768;

      const outer = one("[data-outer]");
      const arch = one("[data-arch]");
      const fire = one("[data-fire]");
      const words = q("[data-sword]");

      gsap.set([outer, arch, fire], { xPercent: -50, yPercent: -50 });
      gsap.set(outer, { transformOrigin: "51.6% 51.6%" });
      // the dome photo waits, small, behind the oven mouth
      gsap.set(arch, { transformOrigin: "55% 45%", scale: 0.42, x: () => -0.034 * outer.offsetWidth, filter: "brightness(0.9)" });
      gsap.set(fire, { transformOrigin: "50% 45%", scale: 1.3, autoAlpha: 0 });
      gsap.set(words, { opacity: 0.14 });
      gsap.set(one("[data-statement]"), { autoAlpha: 0 });

      /* load intro */
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(outer, { scale: 1.12, filter: "brightness(0.3)", duration: 2.4 }, 0)
        .from(q("[data-hword]"), { yPercent: 115, duration: 1.3, stagger: 0.07 }, 0.3)
        .from(q("[data-hfade]"), { autoAlpha: 0, y: 16, duration: 1.1, stagger: 0.1 }, 0.7);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: isMobile ? "+=420%" : "+=520%",
          scrub: 1,
          pin: one("[data-pin]"),
          anticipatePin: 1,
        },
      });

      // 1 — fly through the oven mouth
      tl.to(one("[data-hero]"), { autoAlpha: 0, y: -60, duration: 0.8, ease: "power2.in" }, 0);
      tl.to(one("[data-cue]"), { autoAlpha: 0, duration: 0.3 }, 0);
      tl.to(outer, { scale: isMobile ? 7 : 9, duration: 3, ease: "power2.in" }, 0);
      tl.to(outer, { autoAlpha: 0, filter: "blur(6px)", duration: 0.5 }, 2.55);
      tl.to(arch, { scale: 1.05, x: 0, filter: "brightness(1)", duration: 3, ease: "power1.in" }, 0);
      tl.to(one("[data-heat]"), { autoAlpha: 1, duration: 1.5 }, 1.5);

      // 2 — through the dome's own arch, into the flames
      tl.to(arch, { scale: 3.2, duration: 1.8, ease: "power2.in" }, 3);
      tl.to(arch, { autoAlpha: 0, filter: "blur(8px)", duration: 0.6 }, 4.2);
      tl.to(fire, { autoAlpha: 1, scale: 1.08, duration: 1.2, ease: "power2.out" }, 4);
      tl.to(one("[data-embers]"), { autoAlpha: 1, duration: 0.8 }, 3.8);

      // 3 — the brand statement burns in, word by word
      tl.to(one("[data-shade]"), { autoAlpha: 1, duration: 0.8 }, 4.6);
      tl.set(one("[data-statement]"), { autoAlpha: 1 }, 4.8);
      tl.to(words, { opacity: 1, duration: 0.25, stagger: 0.09 }, 4.9);
      tl.to(fire, { scale: 1.28, duration: 3.2 }, 5.2);

      // 4 — flare up and cut to black for the pizza story
      const outAt = 4.9 + words.length * 0.09 + 0.6;
      tl.to(one("[data-statement]"), { autoAlpha: 0, y: -40, duration: 0.6, ease: "power2.in" }, outAt);
      tl.to(fire, { scale: 2.2, filter: "brightness(1.6) saturate(1.3)", duration: 1, ease: "power2.in" }, outAt + 0.2);
      tl.to(one("[data-black]"), { autoAlpha: 1, duration: 0.7, ease: "power1.in" }, outAt + 0.6);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const statement = (
    <p className="font-display max-w-5xl text-[8.2vw] leading-[1.02] text-mozz md:text-[4.3vw]">
      <span className="sr-only">{STATEMENT}</span>
      {STATEMENT.split(" ").map((w, i) => (
        <span key={i} aria-hidden data-sword className="inline-block" {...(isBrandWord(w) ? { lang: "en" } : {})}>
          {w}&nbsp;
        </span>
      ))}
    </p>
  );

  if (reduced) {
    return (
      <section id="home" className="relative overflow-hidden bg-ink px-5 pb-20 pt-32 md:px-10">
        <img src={ovenOuter} alt={t.hero.ovenAlt} className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="relative mx-auto max-w-7xl">
          <h1 className="font-display text-[16vw] text-mozz md:text-[7vw]">{t.hero.staticTitle}</h1>
          <div className="mt-16">{statement}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" ref={root} className="relative" aria-label={t.hero.aria}>
      <div data-pin className="relative h-[100svh] overflow-hidden bg-[#121416]">
        {/* photo layers, back to front */}
        <img data-fire src={ovenFire} alt="" aria-hidden className="absolute left-1/2 top-1/2 max-w-none object-cover will-change-transform" style={cover(2000 / 1502)} />
        <img data-arch src={ovenArch} alt="" aria-hidden className="absolute left-1/2 top-1/2 max-w-none object-cover will-change-transform [mask-image:radial-gradient(70%_70%_at_55%_45%,#000_62%,transparent_100%)]" style={cover(2000 / 1334)} />
        <div data-heat className="oven-light pointer-events-none absolute inset-0 opacity-0" aria-hidden />
        <img
          data-outer
          src={ovenOuter}
          alt={t.hero.ovenAlt}
          fetchPriority="high"
          className="absolute left-1/2 top-1/2 max-w-none will-change-transform"
          style={cover(2000 / 1334)}
        />

        <Embers count={34} />
        <div data-shade className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,oklch(0.145_0_0/0.55),oklch(0.145_0_0/0.85))] opacity-0" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" aria-hidden />

        {/* hero copy */}
        <div data-hero className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent px-5 pb-16 pt-24 md:bg-none md:pt-0 md:pb-0 md:bottom-auto md:left-0 md:right-auto md:top-1/2 md:max-w-[46vw] md:-translate-y-1/2 md:px-10">
          <p data-hfade className="eyebrow text-tomato">{t.hero.eyebrow}</p>
          <h1 className="font-display mt-4 text-[14vw] text-mozz drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] md:text-[6.6vw]">
            <Words text={t.hero.title1} />
            <br />
            <Words text={t.hero.title2} />
          </h1>
          <p data-hfade className="mt-5 max-w-sm text-base text-cream/80 md:text-lg">
            {t.hero.sub}
          </p>
        </div>
        <div data-cue className="eyebrow absolute bottom-24 right-5 z-20 hidden items-center gap-2 text-cream/60 md:right-10 md:inline-flex">
          <ArrowDown className="size-4 animate-bounce" /> {t.hero.cue}
        </div>

        {/* statement */}
        <div data-statement className="absolute inset-0 z-20 flex items-center px-5 opacity-0 md:px-[8vw]">
          {statement}
        </div>

        <div data-black className="pointer-events-none absolute inset-0 z-30 bg-ink opacity-0" aria-hidden />
      </div>
    </section>
  );
}
