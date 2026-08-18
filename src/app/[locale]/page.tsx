import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content";
import { categories } from "@/lib/site";
import { ProblemCard } from "@/components/ProblemCard";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { articleUrl, hreflang, localizedUrl, indexFollowRobots } from "@/lib/seo";
import { homeFaqJsonLd, itemListJsonLd } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  const locale = (await getLocale()) as Locale;
  return {
    title: { absolute: `${t("title")} | Bancada` },
    description: t("description"),
    keywords: t("keywords").split(",").map((item) => item.trim()),
    robots: indexFollowRobots(),
    alternates: {
      ...hreflang(
        { en: localizedUrl("en"), pt: localizedUrl("pt") },
        localizedUrl(locale),
      ),
      types: {
        "application/rss+xml": localizedUrl(locale, "/rss"),
      },
    },
    openGraph: {
      type: "website",
      url: localizedUrl(locale),
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations();
  const loc = locale as Locale;
  const articles = getArticles(loc);
  const featured = [...articles]
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    })
    .slice(0, 6);
  const faqs = [0, 1, 2].map((index) => ({
    q: t(`home.faq.${index}.q`),
    a: t(`home.faq.${index}.a`),
  }));

  return (
    <div className="mx-auto max-w-site px-4">
      <JsonLd
        data={itemListJsonLd(
          t("meta.title"),
          t("meta.description"),
          articles.map((article) => ({
            name: article.title,
            url: articleUrl(loc, article),
          })),
        )}
      />
      <JsonLd data={homeFaqJsonLd(faqs)} />
      <section className="grid gap-10 border-b border-line py-14 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {t("home.kicker")}
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            {t("home.lead")}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-ink/80">
            {t("home.seoBody")}
          </p>
          <p className="mt-4 text-sm text-muted">{t("home.searchHint")}</p>
        </div>
        <div className="hidden lg:block">
          <AdSlot position="sidebar" />
        </div>
      </section>

      <section className="py-12">
        <h2 className="font-serif text-2xl">{t("home.browse")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={{ pathname: "/[category]", params: { category } }}
              className="border border-line bg-white p-5 hover:border-accent"
            >
              <h3 className="font-serif text-xl">
                {t(`category.${category}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {t(`category.${category}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot position="header" />

      <section className="py-12">
        <h2 className="font-serif text-2xl">{t("home.featured")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {featured.map((article) => (
            <ProblemCard key={article.translationKey} article={article} />
          ))}
        </div>
      </section>

      <section className="border-t border-line py-12">
        <h2 className="font-serif text-2xl">{t("home.allGuides")}</h2>
        <ul className="mt-6 columns-1 gap-x-10 sm:columns-2">
          {articles.map((article) => (
            <li key={article.translationKey} className="mb-2 break-inside-avoid">
              <Link
                href={{
                  pathname: "/[category]/[slug]",
                  params: { category: article.category, slug: article.slug },
                }}
                className="text-[15px] text-accent hover:underline"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line py-12">
        <h2 className="font-serif text-2xl">{t("home.faqTitle")}</h2>
        <div className="mt-6 max-w-article space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-medium">{faq.q}</h3>
              <p className="mt-2 text-[15px] leading-7 text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
