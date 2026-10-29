import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let activeLenis: Lenis | null = null;

/** Freeze/unfreeze page scrolling (modals). Works with or without Lenis. */
export function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  if (lock) activeLenis?.stop();
  else activeLenis?.start();
}

/**
 * Buttery inertial scrolling (Lenis) wired into GSAP's ticker so ScrollTrigger
 * timelines stay perfectly in sync. Skipped entirely for reduced-motion users.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: 0 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");
    activeLenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      activeLenis = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);
}
