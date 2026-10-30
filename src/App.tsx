import { Navbar } from "@/components/Navbar";
import { OvenDive } from "@/components/OvenDive";
import { FloatingCta } from "@/components/FloatingCta";
import { PizzaStoryAnimation } from "@/components/PizzaStoryAnimation";
import { BrandStory } from "@/components/BrandStory";
import { MenuSection } from "@/components/MenuSection";
import { SignaturePizza } from "@/components/SignaturePizza";
import { Gallery } from "@/components/Gallery";
import { WhyUs } from "@/components/WhyUs";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import { useSmoothScroll } from "@/lib/smoothScroll";
import { Marquee } from "@/components/Marquee";
import { Cursor } from "@/components/Cursor";
import { CartDrawer } from "@/components/CartDrawer";
import { useI18n } from "@/i18n";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function App() {
  useSmoothScroll();
  const { t, lang } = useI18n();
  // The two GSAP scenes are rebuilt when the language changes (key={lang}); re-measure everything after.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [lang]);
  return (
    <div className="grain">
      <a href="#menu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-tomato focus:p-3">
        {t.nav.skip}
      </a>
      <Navbar />
      <main className="relative z-10 overflow-clip rounded-b-[2rem] bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <OvenDive key={`oven-${lang}`} />
        <PizzaStoryAnimation key={`story-${lang}`} />
        <BrandStory />
        <MenuSection />
        <SignaturePizza />
        <Gallery />
        <Marquee words={t.marquee} />
        <WhyUs />
        <OrderSection />
      </main>
      <Footer />
      <FloatingCta />
      <CartDrawer />
      <Cursor />
    </div>
  );
}
