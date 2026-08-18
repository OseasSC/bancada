"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "@/lib/consent";

export function DisclaimerBanner() {
  const t = useTranslations("disclaimer");
  const { ready, disclaimer, acceptDisclaimer } = useConsent();

  useEffect(() => {
    if (!ready || disclaimer) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready, disclaimer]);

  if (!ready || disclaimer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="w-full max-w-lg border border-line bg-paper p-6">
        <h2 id="disclaimer-title" className="font-serif text-2xl">
          {t("bannerTitle")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{t("bannerBody")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={acceptDisclaimer}
            className="bg-accent px-4 py-2 text-sm font-medium text-paper hover:bg-accent-hover"
          >
            {t("accept")}
          </button>
          <Link href="/disclaimer" className="text-sm text-accent underline-offset-2 hover:underline">
            {t("readFull")}
          </Link>
        </div>
      </div>
    </div>
  );
}
