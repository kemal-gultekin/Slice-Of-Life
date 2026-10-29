import { motion } from "framer-motion";
import { useI18n, type Lang } from "@/i18n";

const langs: { id: Lang; label: string; name: string }[] = [
  { id: "tr", label: "TR", name: "Türkçe" },
  { id: "en", label: "EN", name: "English" },
];

/** Compact TR / EN pill with a sliding highlight. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.nav.language} className={`glass flex rounded-full p-1 ${className}`}>
      {langs.map((l) => {
        const active = lang === l.id;
        return (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-pressed={active}
            aria-label={l.name}
            onClick={() => setLang(l.id)}
            className={`relative rounded-full px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] transition-colors ${active ? "text-ink" : "text-cream/65 hover:text-cream"}`}
          >
            {active && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-mozz" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}
