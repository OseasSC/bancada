"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "@/lib/consent";

export function CookieConsent() {
  const t = useTranslations("consent");
  const { ready, cookies, setCookies } = useConsent();

  if (!ready || cookies) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper p-4 shadow-none">
      <div className="mx-auto flex max-w-site flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium">{t("title")}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{t("body")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/privacy" className="text-sm text-accent underline-offset-2 hover:underline">
            {t("privacy")}
          </Link>
          <button
            type="button"
            onClick={() => setCookies("rejected")}
            className="border border-ink px-3 py-2 text-sm"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => setCookies("accepted")}
            className="bg-accent px-3 py-2 text-sm font-medium text-paper hover:bg-accent-hover"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
