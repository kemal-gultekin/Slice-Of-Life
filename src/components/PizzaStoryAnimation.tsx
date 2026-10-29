import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dough from "@/assets/stage-dough.webp";
import sauce from "@/assets/stage-sauce.webp";
import cheese from "@/assets/stage-cheese.webp";
import toppings from "@/assets/stage-toppings.webp";
import baked from "@/assets/stage-baked.webp";
import boxOpen from "@/assets/box-open.webp";
import boxClosed from "@/assets/box-closed.webp";
import { WhatsAppButton } from "./WhatsAppButton";
import { Embers } from "./Embers";
import { useI18n } from "@/i18n";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------------ data */

const stages = [dough, sauce, cheese, toppings, baked];

/** Point on the pizza (in % of the pizza box) → label to its left. */
type Callout = { x: number; y: number };
const rim = (deg: number, r = 43) => {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
};
const callouts: Callout[][] = [
  [{ ...rim(200) }],
  [{ ...rim(190, 30) }],
  [{ ...rim(195, 30) }],
  [
    { ...rim(212) },
    { ...rim(192) },
    { ...rim(172) },
    { ...rim(152) },
  ],
  [
    { ...rim(200) },
    { ...rim(160, 26) },
  ],
];

/* Scroll timeline (arbitrary units; the whole thing is scrubbed). */
const T = { s: [0.6, 2.2, 3.8, 5.4, 7.0], box: 8.8, finale: 10.6, end: 11.4 };
const SPIN = [0, 70, 140, 215, 290, 360]; // pizza rotation held at each stage

/* ---------------------------------------------------------- small pieces */

function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word className="inline-block will-change-transform">{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </span>
  );
}

function Callouts() {
  const { t } = useI18n();
  return (
    <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block" aria-hidden>
      {callouts.map((group, gi) => (
        <div key={gi} data-callouts className="absolute inset-0">
          {group.map((c, i) => (
            <span
              key={`l${i}`}
              data-cline
              className="absolute h-px origin-right bg-cream/45"
              style={{ left: "-6%", width: `${c.x + 6}%`, top: `${c.y}%` }}
            />
          ))}
          {group.map((c, i) => (
            <Fragment key={i}>
              <span
                data-cdot
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mozz shadow-[0_0_0_5px_oklch(0.993_0.01_95/0.18)]"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              />
              <span
                data-clabel
                className="eyebrow absolute -translate-y-1/2 whitespace-nowrap text-right text-[0.66rem] text-cream/80"
                style={{ right: "107%", top: `${c.y}%` }}
              >
                {t.story.callouts[gi]?.[i]}
              </span>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

function Finale() {
  const { t } = useI18n();
  return (
    <div data-finale className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-10 opacity-0 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-[40%] md:flex-col md:justify-center md:pl-4 md:pr-10 md:pb-0">
      <p className="eyebrow text-tomato">{t.story.finaleK}</p>
      <h2 className="font-display mt-4 text-[13vw] text-mozz md:text-[5vw]">
        <Words text={t.story.finaleT} />
      </h2>
      <p className="mt-4 text-cream/70 md:text-lg">{t.story.finaleSub}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#menu" className="btn btn-primary">{t.story.orderPizza}</a>
        <WhatsAppButton>{t.story.orderWa}</WhatsAppButton>
      </div>
    </div>
  );
}

function StaticStory() {
  const { t } = useI18n();
  return (
    <section id="story-pizza" className="relative px-5 pb-16 pt-28 md:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-[15vw] text-mozz md:text-8xl">{t.story.staticTitle}</h2>
        <p className="mt-5 max-w-md text-cream/70">{t.hero.sub}</p>
        <a href="#menu" className="btn btn-primary mt-8">{t.story.discover}</a>
        <ol className="mt-16 grid gap-12 md:grid-cols-2">
          {stages.map((s, i) => (
            <li key={i}>
              <img src={s} alt={t.story.alts[i]} width={1400} height={1400} loading={i ? "lazy" : "eager"} className="aspect-square w-full object-cover" />
              <p className="eyebrow mt-4 text-tomato">{t.story.captions[i]!.k}</p>
              <p className="font-display mt-2 text-4xl">{t.story.captions[i]!.t}</p>
            </li>
          ))}
          <li>
            <img src={boxClosed} alt={t.story.boxClosedAlt} width={1400} height={1050} loading="lazy" className="aspect-square w-full object-cover" />
            <p className="font-display mt-4 text-4xl">{t.story.finaleT}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#menu" className="btn btn-primary">{t.story.orderPizza}</a>
              <WhatsAppButton>{t.story.orderWa}</WhatsAppButton>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- main */

export function PizzaStoryAnimation() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setMobile(window.innerWidth < 768);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useIso(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const q = gsap.utils.selector(root);
      const one = (sel: string) => q(sel)[0]!;
      const layers = q("[data-layer]");
      const caps = q("[data-cap]");
      const nums = q("[data-num]");
      const groups = q("[data-callouts]");
      const railItems = q("[data-rail-item]");
      const heatMap = root.current!.querySelector("#heat-map");

      /* ---- initial state */
      gsap.set(layers.slice(1), { autoAlpha: 0 });
      gsap.set(layers[1]!, { autoAlpha: 1, "--sweep": "0deg", "--grow": "-15%" });
      gsap.set(caps, { autoAlpha: 0 });
      gsap.set(q("[data-cap] [data-word]"), { yPercent: 115 });
      gsap.set(q("[data-finale] [data-word]"), { yPercent: 115 });
      gsap.set(nums, { autoAlpha: 0, yPercent: 30 });
      gsap.set(q("[data-cline]"), { scaleX: 0, transformOrigin: "100% 50%" });
      gsap.set(q("[data-cdot]"), { scale: 0 });
      gsap.set(q("[data-clabel]"), { autoAlpha: 0, x: 12 });

      const pos = one("[data-pos]");
      const storyPos = isMobile ? { x: 0, y: "-13svh", scale: 1 } : { x: "-12vw", y: 0, scale: 0.9 };
      gsap.set(pos, { ...storyPos });

      /* ---- entrance: the pizza rises out of the dark as the section arrives */
      gsap.fromTo(
        one("[data-intro]"),
        { scale: 0.55, rotation: -60, autoAlpha: 0 },
        {
          scale: 1, rotation: 0, autoAlpha: 1, ease: "power2.out",
          scrollTrigger: { trigger: root.current!, start: "top 85%", end: "top top", scrub: 1 },
        },
      );

      /* ---- master scroll timeline */
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: isMobile ? "+=520%" : "+=720%",
          scrub: 1,
          pin: one("[data-pin]"),
          anticipatePin: 1,
          onUpdate: (self) => {
            const t = self.progress * T.end;
            let idx = 0;
            T.s.forEach((s, i) => { if (t >= s - 0.3) idx = i; });
            if (t >= T.box - 0.3) idx = 5;
            railItems.forEach((el, i) => el.toggleAttribute("data-active", i <= idx && t > 0.3));
            const counter = one("[data-counter]");
            counter.textContent = `0${idx + 1}`;
          },
        },
      });

      const word = (el: Element) => el.querySelectorAll("[data-word]");
      const capIn = (i: number, at: number) => {
        tl.set(caps[i]!, { autoAlpha: 1 }, at);
        tl.to(word(caps[i]!), { yPercent: 0, duration: 0.55, stagger: 0.05, ease: "power3.out" }, at);
        tl.fromTo(caps[i]!.querySelector("[data-eyebrow]"), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.4 }, at);
        tl.to(nums[i]!, { autoAlpha: 1, yPercent: 0, duration: 0.7, ease: "power3.out" }, at - 0.1);
        const g = groups[i];
        if (g) {
          tl.to(g.querySelectorAll("[data-cdot]"), { scale: 1, duration: 0.25, stagger: 0.06, ease: "back.out(3)" }, at + 0.1);
          tl.to(g.querySelectorAll("[data-cline]"), { scaleX: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }, at + 0.2);
          tl.to(g.querySelectorAll("[data-clabel]"), { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.06 }, at + 0.45);
        }
      };
      const capOut = (i: number, at: number) => {
        tl.to(word(caps[i]!), { yPercent: -115, duration: 0.4, stagger: 0.03, ease: "power2.in" }, at);
        tl.to(caps[i]!.querySelector("[data-eyebrow]"), { autoAlpha: 0, duration: 0.3 }, at);
        tl.set(caps[i]!, { autoAlpha: 0 }, at + 0.55);
        tl.to(nums[i]!, { autoAlpha: 0, yPercent: -30, duration: 0.5, ease: "power2.in" }, at);
        const g = groups[i];
        if (g) {
          tl.to(g.querySelectorAll("[data-clabel]"), { autoAlpha: 0, duration: 0.25 }, at);
          tl.to(g.querySelectorAll("[data-cline]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.3 }, at);
          tl.to(g.querySelectorAll("[data-cdot]"), { scale: 0, duration: 0.2 }, at + 0.15);
        }
      };
      const spin = (i: number, at: number, dur = 0.9) =>
        tl.to(one("[data-stack]"), { rotation: SPIN[i]!, duration: dur, ease: "power3.inOut" }, at);

      // 0 — dough
      gsap.set(one("[data-spot]"), { xPercent: isMobile ? 0 : -27 });
      capIn(0, T.s[0]!);
      capOut(0, T.s[1]! - 0.6);

      // 1 — sauce: a ladle-like spiral sweep from the centre outwards
      spin(1, T.s[1]! - 0.5, 1.4);
      tl.to(layers[1]!, { "--sweep": "380deg", duration: 1.3, ease: "power1.inOut" }, T.s[1]! - 0.45);
      tl.to(layers[1]!, { "--grow": "75%", duration: 1.3, ease: "power2.out" }, T.s[1]! - 0.45);
      capIn(1, T.s[1]!);
      capOut(1, T.s[2]! - 0.6);

      // 2 — mozzarella melts in
      spin(2, T.s[2]! - 0.5);
      tl.fromTo(layers[2]!, { autoAlpha: 0, scale: 1.04, filter: "blur(10px) brightness(1.3)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 0.9, ease: "power2.out" }, T.s[2]! - 0.4);
      capIn(2, T.s[2]!);
      capOut(2, T.s[3]! - 0.6);

      // 3 — toppings drop in from above
      spin(3, T.s[3]! - 0.5);
      tl.fromTo(layers[3]!, { autoAlpha: 0, scale: 1.12, filter: "blur(8px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, T.s[3]! - 0.35);
      tl.fromTo(one("[data-tilt]"), { y: 0 }, { y: 10, duration: 0.15, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.s[3]! + 0.35);
      capIn(3, T.s[3]!);
      capOut(3, T.s[4]! - 0.6);

      // 4 — into the oven: warm light, embers, heat haze
      spin(4, T.s[4]! - 0.5, 1.2);
      tl.to(one("[data-oven]"), { autoAlpha: 1, duration: 0.9 }, T.s[4]! - 0.6);
      tl.to(one("[data-embers]"), { autoAlpha: 1, duration: 0.6 }, T.s[4]! - 0.5);
      tl.fromTo(layers[4]!, { autoAlpha: 0, filter: "brightness(1.6) saturate(0.6) sepia(0.4)" }, { autoAlpha: 1, filter: "brightness(1) saturate(1) sepia(0)", duration: 1.1 }, T.s[4]! - 0.4);
      tl.to(one("[data-glow]"), { autoAlpha: 1, scale: 1.08, duration: 1 }, T.s[4]! - 0.4);
      if (heatMap && !isMobile) {
        tl.set(one("[data-stack]"), { filter: "url(#heat)" }, T.s[4]! - 0.5);
        tl.fromTo(heatMap, { attr: { scale: 0 } }, { attr: { scale: 14 }, duration: 0.6, ease: "sine.inOut" }, T.s[4]! - 0.5);
        tl.to(heatMap, { attr: { scale: 0 }, duration: 0.6, ease: "sine.inOut" }, T.s[4]! + 0.15);
        tl.set(one("[data-stack]"), { filter: "none" }, T.s[4]! + 0.8);
      }
      tl.to(one("[data-steam]"), { autoAlpha: 0.55, duration: 0.6 }, T.s[4]! + 0.3);
      capIn(4, T.s[4]!);
      capOut(4, T.box - 0.6);
      tl.to(one("[data-steam]"), { autoAlpha: 0, duration: 0.4 }, T.box - 0.6);
      tl.to(one("[data-oven]"), { autoAlpha: 0, duration: 0.8 }, T.box - 0.5);
      tl.to(one("[data-embers]"), { autoAlpha: 0, duration: 0.5 }, T.box - 0.5);

      // 5 — boxed: pizza drops into the box, lid swaps, box lands
      spin(5, T.box - 0.6, 0.6);
      tl.to(one("[data-glow]"), { autoAlpha: 0, duration: 0.4 }, T.box - 0.2);
      tl.fromTo(one("[data-boxopen]"), { autoAlpha: 0, y: 40, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }, T.box - 0.4);
      tl.to(one("[data-stack]"), { scale: 0.62, yPercent: 17, duration: 1.1, ease: "power3.inOut" }, T.box - 0.2);
      tl.to(one("[data-stack]"), { autoAlpha: 0, duration: 0.35 }, T.box + 0.75);
      tl.to(nums[5]!, { autoAlpha: 1, yPercent: 0, duration: 0.7, ease: "power3.out" }, T.box);
      tl.to(one("[data-boxopen]"), { rotationX: 55, y: -30, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, T.box + 1.1);
      tl.fromTo(one("[data-boxclosed]"), { autoAlpha: 0, y: -90, rotation: -4, scale: 1.06 }, { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: "back.out(1.4)" }, T.box + 1.45);
      tl.fromTo(one("[data-shadow]"), { autoAlpha: 0, scaleX: 0.6 }, { autoAlpha: 1, scaleX: 1, duration: 0.9 }, T.box + 1.45);

      // finale
      tl.to(one("[data-finale]"), { autoAlpha: 1, pointerEvents: "auto", duration: 0.3 }, T.finale);
      tl.to(q("[data-finale] [data-word]"), { yPercent: 0, duration: 0.55, stagger: 0.05, ease: "power3.out" }, T.finale);
      tl.to(one("[data-rail-fill]"), { scaleX: 1, duration: T.end, ease: "none" }, 0);
      tl.to({}, { duration: 0.5 }, T.end - 0.5);

      /* ---- subtle cursor parallax (desktop only) */
      if (!isMobile && window.matchMedia("(pointer: fine)").matches) {
        const tilt = one("[data-tilt]");
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.2, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          rx(((e.clientY / window.innerHeight) - 0.5) * -8);
          ry(((e.clientX / window.innerWidth) - 0.5) * 10);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
      return undefined;
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) return <StaticStory />;

  return (
    <section id="story-pizza" ref={root} className="relative" aria-label={t.story.aria}>
      {/* heat-haze filter used briefly while baking */}
      <svg className="absolute size-0" aria-hidden>
        <filter id="heat" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur="6s" values="0.012 0.04;0.016 0.05;0.012 0.04" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap id="heat-map" in="SourceGraphic" scale="0" />
        </filter>
      </svg>

      <div data-pin className="relative h-[100svh] overflow-hidden bg-ink">
        <div data-spot className="bg-spotlight absolute inset-0" aria-hidden />
        <div data-oven className="oven-light absolute inset-0 opacity-0" aria-hidden />

        {/* giant outlined stage numbers */}
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center md:justify-start" aria-hidden>
          {["01", "02", "03", "04", "05", "06"].map((n) => (
            <span
              key={n}
              data-num
              className="font-display text-outline absolute left-1/2 top-[6svh] -translate-x-1/2 text-[38vw] leading-none opacity-0 md:left-[3vw] md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:text-[30vw]"
            >
              {n}
            </span>
          ))}
        </div>

        <Embers count={mobile ? 18 : 42} />

        {/* the pizza */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ perspective: 1400 }}>
          <div data-pos className="relative aspect-square w-[min(90vw,50svh)] md:w-[min(72svh,46vw)]" style={{ transformStyle: "preserve-3d" }}>
            <div data-tilt className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              <div data-intro className="absolute inset-0">
                <div data-glow className="absolute inset-[-14%] rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.19_45/0.45),transparent)] opacity-0 blur-2xl" aria-hidden />
                <div data-shadow className="absolute inset-x-[8%] bottom-[10%] h-[14%] rounded-[50%] bg-black/70 opacity-0 blur-2xl" aria-hidden />
                <div data-boxopen className="absolute inset-[-12%] opacity-0" style={{ transformOrigin: "50% 40%" }}>
                  <img src={boxOpen} alt={t.story.boxOpenAlt} width={1400} height={1400} className="size-full object-cover [mask-image:radial-gradient(closest-side,black_80%,transparent)]" />
                </div>
                <div data-stack className="absolute inset-0 will-change-transform">
                  {stages.map((s, i) => (
                    <img
                      key={i}
                      data-layer
                      src={s}
                      alt={t.story.alts[i]}
                      width={1400}
                      height={1400}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      className={`absolute inset-0 size-full object-cover ${i === 1 ? "sauce-mask" : "[mask-image:radial-gradient(closest-side,black_86%,transparent_100%)]"}`}
                      style={{ willChange: "opacity, transform" }}
                    />
                  ))}
                  <div data-steam className="pointer-events-none absolute inset-x-[25%] -top-[8%] h-1/3 bg-[radial-gradient(closest-side,var(--color-mozz),transparent)] opacity-0 blur-2xl" aria-hidden />
                </div>
                <div data-boxclosed className="absolute inset-[2%] flex items-center opacity-0">
                  <img src={boxClosed} alt={t.story.boxClosedAlt} width={1400} height={1050} className="w-full [mask-image:radial-gradient(closest-side,black_82%,transparent)]" />
                </div>
              </div>
            </div>
            <Callouts />
          </div>
        </div>


        {/* stage captions */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-24 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-[36%] md:items-center md:pl-4 md:pr-10 md:pb-0">
          <div className="relative w-full">
            {t.story.captions.map((c, i) => (
              <div key={i} data-cap className="absolute bottom-0 left-0 right-0 opacity-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
                <p data-eyebrow className="eyebrow text-tomato">{c.k}</p>
                <p className="font-display mt-3 text-[11vw] text-mozz md:text-[4.4vw]">
                  <Words text={c.t} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <Finale />

        {/* progress rail */}
        <div data-rail className="pointer-events-none absolute inset-x-5 top-20 z-30 md:inset-x-auto md:bottom-8 md:left-10 md:top-auto md:w-[min(560px,46vw)]" aria-hidden>
          <div className="flex items-end justify-between gap-4">
            <span className="font-display text-sm text-cream/40 md:text-base">
              <span data-counter className="text-mozz">01</span> / 06
            </span>
            <ol className="hidden flex-1 justify-between pl-6 md:flex">
              {t.story.rail.map((l) => (
                <li key={l} data-rail-item className="rail-item eyebrow text-[0.6rem]">{l}</li>
              ))}
            </ol>
          </div>
          <div className="mt-3 h-px w-full bg-cream/15">
            <div data-rail-fill className="h-full origin-left scale-x-0 bg-tomato" />
          </div>
        </div>
      </div>
    </section>
  );
}
