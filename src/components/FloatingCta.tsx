import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import { useI18n } from "@/i18n";

/** Glassy pill that floats at the bottom of the screen on every section. */
export function FloatingCta() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1400);
    return () => clearTimeout(t);
  }, []);
  const { t } = useI18n();
  const wa = buildWhatsAppUrl(t.wa.greeting);

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-cine)] md:bottom-7 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="glass flex items-center gap-1.5 rounded-full p-1.5">
        <a href="#menu" data-magnetic className="rounded-full bg-mozz px-5 py-2.5 text-[0.8rem] font-bold text-ink transition-colors hover:bg-cream">
          {t.cta.order}
        </a>
        <a
          href={wa ?? "#contact"}
          {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={t.cta.wa}
          className="group grid size-10 place-items-center rounded-full bg-mozz text-ink transition-colors hover:bg-tomato hover:text-mozz"
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </a>
      </div>
    </div>
  );
}
