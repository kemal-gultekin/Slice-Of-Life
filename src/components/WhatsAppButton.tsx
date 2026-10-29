import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import { useI18n } from "@/i18n";

type Props = { message?: string; children: ReactNode; variant?: "primary" | "ghost" | "olive"; className?: string; icon?: boolean };

export function WhatsAppButton({ message, children, variant = "ghost", className = "", icon = true }: Props) {
  const { t } = useI18n();
  const url = buildWhatsAppUrl(message ?? t.wa.greeting);
  const cls = `btn btn-${variant} ${className}`;
  if (!url) {
    return (
      <span className={cls} aria-disabled="true" title={t.wa.notConfigured}>
        {icon && <MessageCircle className="size-4" aria-hidden />} {children}
      </span>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
      {icon && <MessageCircle className="size-4" aria-hidden />} {children}
      <span className="sr-only"> {t.wa.newTab}</span>
    </a>
  );
}
