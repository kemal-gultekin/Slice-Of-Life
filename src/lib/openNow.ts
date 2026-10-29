import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

function hourIn(tz: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hour12: false, timeZone: tz }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}

/** Live open/closed state in the restaurant's own time zone; null until mounted. */
export function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const h = hourIn(siteConfig.timeZone);
      setOpen(h >= siteConfig.openHour && h < siteConfig.closeHour);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}
