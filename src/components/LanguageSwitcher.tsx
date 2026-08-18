"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CategoryId } from "@/lib/site";

export type ArticleAlternate = { category: CategoryId; slug: string };
export type TranslationMap = Record<
  string,
  Partial<Record<Locale, ArticleAlternate>>
>;

export function LanguageSwitcher({
  translationMap,
}: {
  translationMap: TranslationMap;
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function currentAlternate(next: Locale): ArticleAlternate | undefined {
    const slug = typeof params.slug === "string" ? params.slug : undefined;
    if (!slug) return undefined;
    const entry = Object.values(translationMap).find(
      (item) => item.en?.slug === slug || item.pt?.slug === slug,
    );
    return entry?.[next];
  }

  function switchTo(next: Locale) {
    const alt = currentAlternate(next);
    if (alt) {
      router.replace(
        { pathname: "/[category]/[slug]", params: alt },
        { locale: next },
      );
      return;
    }
    router.replace(
      // @ts-expect-error -- pathname + params always match the current route
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm" aria-label={t("language")}>
      {(["en", "pt"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={`px-1.5 py-1 uppercase ${
            locale === code ? "font-semibold text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
