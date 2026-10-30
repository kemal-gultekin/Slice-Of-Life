import { useEffect, useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { LangSwitch } from "./LangSwitch";
import { useI18n } from "@/i18n";

export function useNavLinks() {
  const { t } = useI18n();
  return [
    { href: "#home", label: t.nav.home },
    { href: "#menu", label: t.nav.menu },
    { href: "#story", label: t.nav.story },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#contact", label: t.nav.contact },
  ];
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const navLinks = useNavLinks();
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled ? "border-b border-border bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#home" aria-label={t.nav.homeAria}><Logo /></a>
        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow text-cream/70 transition-colors hover:text-cream">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 md:gap-3">
          <LangSwitch />
          <button type="button" onClick={cart.open} aria-label={`${t.cart.open} · ${t.cart.count(cart.count)}`} className="glass relative grid size-10 place-items-center rounded-full text-mozz">
            <ShoppingBag className="size-4" />
            {cart.count > 0 && (
              <motion.span key={cart.count} initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 15 }} className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-tomato px-1 text-[0.65rem] font-bold text-mozz">
                {cart.count}
              </motion.span>
            )}
          </button>
          <a href="#menu" className="btn btn-primary hidden !py-3 sm:inline-flex">{t.nav.order}</a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-label={t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
