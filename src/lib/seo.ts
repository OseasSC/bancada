import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { site, getSiteUrl, type CategoryId } from "./site";
import type { Article } from "./content";

export const ogLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export function siteOrigin() {
  return getSiteUrl().replace(/\/$/, "");
}

export function localizedUrl(locale: Locale, path = "") {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${siteOrigin()}/${locale}${suffix}`;
}

export function articleUrl(locale: Locale, article: Pick<Article, "category" | "slug">) {
  return localizedUrl(locale, `/${article.category}/${article.slug}`);
}

export function hreflang(map: { en: string; pt: string }, canonical: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical,
    languages: {
      en: map.en,
      pt: map.pt,
      "x-default": map.pt,
    },
  };
}

export function articleSeoTitle(article: Article) {
  if (article.locale === "pt") {
    return `${article.title}: como resolver passo a passo`;
  }
  return `${article.title}: how to fix it step by step`;
}

export function articleKeywords(article: Article) {
  const extra =
    article.locale === "pt"
      ? ["como resolver", "técnico", "PC", "notebook", "Windows"]
      : ["how to fix", "technician", "PC", "laptop", "Windows"];
  return Array.from(
    new Set([article.title, article.category, ...article.symptoms, ...extra]),
  ).slice(0, 16);
}

export function openGraphImageAlt(locale: Locale, title?: string) {
  if (title) return `${title} · ${site.name}`;
  return locale === "pt"
    ? "Bancada — guias de técnico para PC e notebook"
    : "Bancada — technician guides for PC and laptop";
}

export function indexFollowRobots(): Metadata["robots"] {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function categoryPath(locale: Locale, category: CategoryId) {
  return localizedUrl(locale, `/${category}`);
}
