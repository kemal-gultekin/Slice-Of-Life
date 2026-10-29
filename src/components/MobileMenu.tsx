import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavLinks } from "./Navbar";
import { useI18n } from "@/i18n";
import { lockScroll } from "@/lib/smoothScroll";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();
  const navLinks = useNavLinks();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.siteMenu}
          className="fixed inset-0 z-[70] flex flex-col bg-ink px-6 pb-10 pt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button ref={closeRef} type="button" onClick={onClose} aria-label={t.nav.closeMenu} className="inline-flex size-11 items-center justify-center">
              <X className="size-6" />
            </button>
          </div>
          <ul className="mt-14 flex flex-col gap-2">
            {navLinks.map((l, i) => (
              <motion.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <a href={l.href} onClick={onClose} className="font-display block py-2 text-5xl text-cream hover:text-tomato">
                  {l.label}
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <a href="#menu" onClick={onClose} className="btn btn-primary">{t.nav.order}</a>
            <WhatsAppButton>{t.nav.chatWhatsApp}</WhatsAppButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
