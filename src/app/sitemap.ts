import type { MetadataRoute } from "next";
import { getArticleByTranslationKey, getArticles } from "@/lib/content";
import { categories } from "@/lib/site";
import { routing } from "@/i18n/routing";
import {
  articleUrl,
  categoryPath,
  localizedUrl,
} from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

function latestUpdate(locale: Locale) {
  const dates = getArticles(locale).map((article) => article.updatedAt);
  return dates.sort().at(-1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const lastMod = latestUpdate(locale);
    entries.push({
      url: localizedUrl(locale),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: localizedUrl("en"),
          pt: localizedUrl("pt"),
          "x-default": localizedUrl("pt"),
        },
      },
    });
    entries.push({
      url: localizedUrl(locale, locale === "pt" ? "/aviso-legal" : "/disclaimer"),
      changeFrequency: "yearly",
      priority: 0.2,
    });
    entries.push({
      url: localizedUrl(locale, locale === "pt" ? "/privacidade" : "/privacy"),
      changeFrequency: "yearly",
      priority: 0.2,
    });
    entries.push({
      url: localizedUrl(locale, locale === "pt" ? "/mapa-do-site" : "/site-map"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.4,
    });
    for (const category of categories) {
      entries.push({
        url: categoryPath(locale, category),
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: categoryPath("en", category),
            pt: categoryPath("pt", category),
            "x-default": categoryPath("pt", category),
          },
        },
      });
    }
    for (const article of getArticles(locale)) {
      const en = getArticleByTranslationKey("en", article.translationKey);
      const pt = getArticleByTranslationKey("pt", article.translationKey);
      entries.push({
        url: articleUrl(locale, article),
        lastModified: article.updatedAt,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            en: en ? articleUrl("en", en) : localizedUrl("en"),
            pt: pt ? articleUrl("pt", pt) : localizedUrl("pt"),
            "x-default": pt ? articleUrl("pt", pt) : articleUrl(locale, article),
          },
        },
      });
    }
  }

  return entries;
}
