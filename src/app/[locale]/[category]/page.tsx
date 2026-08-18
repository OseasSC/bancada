import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticlesByCategory, parseCategoryParam } from "@/lib/content";
import { categories } from "@/lib/site";
import { ProblemCard } from "@/components/ProblemCard";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import type { Locale } from "@/i18n/routing";
import {
  articleUrl,
  categoryPath,
  hreflang,
  indexFollowRobots,
  localizedUrl,
} from "@/lib/seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const id = parseCategoryParam(category);
  if (!id) return {};
  const t = await getTranslations({ locale: locale as Locale, namespace: "category" });
  const loc = locale as Locale;
  const title = t(`${id}.seoTitle`);
  const description = t(`${id}.description`);
  return {
    title,
    description,
    robots: indexFollowRobots(),
    alternates: hreflang(
      { en: categoryPath("en", id), pt: categoryPath("pt", id) },
      categoryPath(loc, id),
    ),
    openGraph: {
      type: "website",
      url: categoryPath(loc, id),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale as Locale);
  const id = parseCategoryParam(category);
  if (!id) notFound();
  const t = await getTranslations();
  const loc = locale as Locale;
  const articles = getArticlesByCategory(loc, id);

  return (
    <div className="mx-auto max-w-site px-4 py-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("article.breadcrumbHome"), url: localizedUrl(loc) },
          { name: t(`category.${id}.title`), url: categoryPath(loc, id) },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          t(`category.${id}.seoTitle`),
          t(`category.${id}.intro`),
          articles.map((article) => ({
            name: article.title,
            url: articleUrl(loc, article),
          })),
        )}
      />
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          {t("article.breadcrumbHome")}
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{t(`category.${id}.title`)}</span>
      </nav>
      <p className="mt-6 text-xs uppercase tracking-[0.14em] text-accent">
        {t("home.browse")}
      </p>
      <h1 className="mt-2 font-serif text-4xl">{t(`category.${id}.seoTitle`)}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        {t(`category.${id}.intro`)}
      </p>
      <div className="mt-8">
        <AdSlot position="header" />
      </div>
      <h2 className="mt-12 font-serif text-2xl">{t("category.problems")}</h2>
      {articles.length === 0 ? (
        <p className="mt-4 text-muted">{t("category.empty")}</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <ProblemCard key={article.translationKey} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
