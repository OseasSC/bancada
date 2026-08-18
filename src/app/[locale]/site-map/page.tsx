import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content";
import { categories } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { hreflang, indexFollowRobots, localizedUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale: loc, namespace: "sitemapPage" });
  const path = loc === "pt" ? "/mapa-do-site" : "/site-map";
  return {
    title: t("title"),
    description: t("lead"),
    robots: indexFollowRobots(),
    alternates: hreflang(
      {
        en: localizedUrl("en", "/site-map"),
        pt: localizedUrl("pt", "/mapa-do-site"),
      },
      localizedUrl(loc, path),
    ),
  };
}

export default async function SiteMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations();
  const articles = getArticles(loc);

  return (
    <div className="mx-auto max-w-article px-4 py-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("article.breadcrumbHome"), url: localizedUrl(loc) },
          {
            name: t("sitemapPage.title"),
            url: localizedUrl(loc, loc === "pt" ? "/mapa-do-site" : "/site-map"),
          },
        ])}
      />
      <h1 className="font-serif text-4xl">{t("sitemapPage.title")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{t("sitemapPage.lead")}</p>
      {categories.map((category) => {
        const items = articles.filter(
          (article) =>
            article.category === category || article.categories.includes(category),
        );
        return (
          <section key={category} className="mt-10">
            <h2 className="font-serif text-2xl">
              <Link
                href={{ pathname: "/[category]", params: { category } }}
                className="hover:text-accent"
              >
                {t(`category.${category}.title`)}
              </Link>
            </h2>
            <ul className="mt-3 space-y-2">
              {items.map((article) => (
                <li key={`${category}-${article.translationKey}`}>
                  <Link
                    href={{
                      pathname: "/[category]/[slug]",
                      params: { category: article.category, slug: article.slug },
                    }}
                    className="text-accent hover:underline"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
