import { motion } from "framer-motion";
import { ArrowUp, Clock, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { useNavLinks } from "./Navbar";
import { useI18n } from "@/i18n";
import { WhatsAppButton } from "./WhatsAppButton";

const ease = [0.22, 1, 0.36, 1] as const;
const word = siteConfig.name;

/** Sits underneath the page and is uncovered as the last section scrolls away. */
export function Footer() {
  const { t } = useI18n();
  const navLinks = useNavLinks();
  return (
    <footer className="sticky bottom-0 z-0 bg-cream px-5 pb-28 pt-20 text-ink md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-3xl">{t.footer.hungry}</p>
            <p className="mt-3 text-ink/60">{t.tagline}</p>
            <WhatsAppButton variant="primary" className="mt-6">{t.cta.wa}</WhatsAppButton>
          </div>
          <nav aria-label="Footer" className="md:col-span-1">
            <p className="eyebrow text-ink/45">{t.footer.explore}</p>
            <ul className="mt-4 grid gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="group inline-flex items-center gap-2 text-lg transition-colors hover:text-tomato">
                    <span className="h-px w-0 bg-tomato transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <address className="grid content-start gap-4 not-italic text-ink/80 md:col-span-2 md:grid-cols-2">
            <p className="eyebrow text-ink/45 md:col-span-2">{t.footer.visit}</p>
            {siteConfig.mapUrl ? (
              <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-tomato"><MapPin className="mt-0.5 size-4 shrink-0" />{siteConfig.address}</a>
            ) : (
              <p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0" />{siteConfig.address}</p>
            )}
            <div className="grid gap-4">
              {siteConfig.phoneDisplay && (
                <a href={`tel:+${siteConfig.whatsappNumber}`} className="flex gap-3 hover:text-tomato"><Phone className="mt-0.5 size-4 shrink-0" />{siteConfig.phoneDisplay}</a>
              )}
              <p className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0" />{t.hours}</p>
            </div>
            {siteConfig.socials.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-tomato">{s.label}</a>)}
          </address>
        </div>

        <p lang="en" className="font-display mt-16 flex overflow-hidden text-[15vw] leading-[0.85] md:text-[12vw]" aria-label={word}>
          {word.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.9, ease, delay: i * 0.035 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-ink/15 pt-6 text-sm text-ink/50">
          <p>© {new Date().getFullYear()} {siteConfig.name}, {siteConfig.city}</p>
          <a href="#home" className="group inline-flex items-center gap-2 hover:text-tomato">
            {t.footer.backTop} <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
