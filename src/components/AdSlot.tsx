"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "@/lib/consent";

type AdPosition = "header" | "inArticle" | "sidebar" | "footer";

const SLOT_ENV: Record<AdPosition, string | undefined> = {
  header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER,
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
};

const SIZE: Record<AdPosition, string> = {
  header: "min-h-[90px]",
  inArticle: "min-h-[250px]",
  sidebar: "min-h-[280px] lg:min-h-[600px]",
  footer: "min-h-[90px]",
};

export function AdSlot({ position }: { position: AdPosition }) {
  const t = useTranslations("ads");
  const { adsAllowed, ready } = useConsent();
  const pushed = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = SLOT_ENV[position];
  const canRender =
    ready &&
    adsAllowed &&
    client &&
    !client.includes("xxxxxxxx") &&
    Boolean(slot);

  useEffect(() => {
    if (!canRender || pushed.current) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // AdSense may be blocked by an extension.
    }
  }, [canRender]);

  return (
    <aside
      className={`border border-dashed border-line bg-white/40 ${SIZE[position]}`}
      aria-label={t("label")}
    >
      <p className="px-3 py-2 text-[11px] uppercase tracking-wide text-muted">
        {t("label")}
      </p>
      {canRender ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={position === "sidebar" ? "auto" : "horizontal"}
          data-full-width-responsive="true"
        />
      ) : (
        <p className="px-3 pb-3 text-sm text-muted">{t("placeholder")}</p>
      )}
    </aside>
  );
}
