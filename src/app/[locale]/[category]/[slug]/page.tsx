import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getArticle,
  getArticleByTranslationKey,
  getArticles,
  getRelatedArticles,
  parseCategoryParam,
} from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { ArticleDisclaimer } from "@/components/ArticleDisclaimer";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { ProblemCard } from "@/components/ProblemCard";
import type { Locale } from "@/i18n/routing";
import {
  articleKeywords,
  articleSeoTitle,
  articleUrl,
  categoryPath,
  hreflang,
  indexFollowRobots,
  localizedUrl,
} from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  const locales: Locale[] = ["en", "pt"];
  return locales.flatMap((locale) =>
    getArticles(locale).map((article) => ({
      locale,
      category: article.category,
      slug: article.slug,
    })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const id = parseCategoryParam(category);
  if (!id) return {};
  const loc = locale as Locale;
  const article = getArticle(loc, id, slug);
  if (!article) return {};
  const en = getArticleByTranslationKey("en", article.translationKey);
  const pt = getArticleByTranslationKey("pt", article.translationKey);
  const title = articleSeoTitle(article);
  const url = articleUrl(loc, article);
  return {
    title,
    description: article.description,
    keywords: articleKeywords(article),
    robots: indexFollowRobots(),
    alternates: hreflang(
      {
        en: en ? articleUrl("en", en) : localizedUrl("en"),
        pt: pt ? articleUrl("pt", pt) : localizedUrl("pt"),
      },
      url,
    ),
    openGraph: {
      type: "article",
      url,
      title,
      description: article.description,
      publishedTime: article.updatedAt,
      modifiedTime: article.updatedAt,
      authors: ["Bancada"],
      section: article.category,
      tags: article.symptoms,
      locale: loc === "pt" ? "pt_BR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale as Locale);
  const id = parseCategoryParam(category);
  if (!id) notFound();
  const loc = locale as Locale;
  const article = getArticle(loc, id, slug);
  if (!article) notFound();
  const t = await getTranslations();
  const related = getRelatedArticles(article);
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(article.updatedAt));
  const faqSymptoms =
    loc === "pt"
      ? `Quais os sintomas de ${article.title.toLowerCase()}?`
      : `What are the symptoms of ${article.title.toLowerCase()}?`;
  const faqHow =
    loc === "pt"
      ? `Como um técnico resolve ${article.title.toLowerCase()}?`
      : `How would a technician fix ${article.title.toLowerCase()}?`;

  return (
    <div className="mx-auto grid max-w-site gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_280px]">
      <JsonLd data={articleJsonLd(article, loc)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("article.breadcrumbHome"), url: localizedUrl(loc) },
          {
            name: t(`nav.${article.category}`),
            url: categoryPath(loc, article.category),
          },
          { name: article.title, url: articleUrl(loc, article) },
        ])}
      />
      <article>
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            {t("article.breadcrumbHome")}
          </Link>
          <span className="px-2">/</span>
          <Link
            href={{ pathname: "/[category]", params: { category: article.category } }}
            className="hover:text-ink"
          >
            {t(`nav.${article.category}`)}
          </Link>
          <span className="px-2">/</span>
          <span className="text-ink">{article.title}</span>
        </nav>
        <p className="mt-6 text-xs uppercase tracking-[0.14em] text-danger">
          {t(`severity.${article.severity}`)}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight">{articleSeoTitle(article)}</h1>
        <p className="mt-3 text-sm text-muted">
          <time dateTime={article.updatedAt}>
            {t("article.updated")} {date}
          </time>
        </p>
        <p className="mt-6 text-lg leading-8 text-muted">{article.description}</p>

        <div className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide">
            {t("article.symptoms")}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-7">
            {article.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </div>

        <nav className="mt-8 border border-line bg-white p-4" aria-label={t("article.toc")}>
          <p className="text-sm font-medium">{t("article.toc")}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {article.howtoSteps.map((step, index) => (
              <li key={step}>
                <a href={`#passo-${index + 1}`} className="text-accent hover:underline">
                  {step}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8">
          <ArticleDisclaimer />
        </div>
        <div className="mt-8">
          <AdSlot position="header" />
        </div>

        <div className="mt-10">
          <MDXRemote
            source={article.body}
            components={mdxComponents}
            options={{ blockJS: false }}
          />
        </div>

        <div className="mt-8">
          <AdSlot position="inArticle" />
        </div>

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-serif text-2xl">{t("article.faqTitle")}</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-medium">{faqSymptoms}</h3>
              <p className="mt-2 text-[15px] leading-7 text-muted">
                {article.symptoms.join(" ")}
              </p>
            </div>
            <div>
              <h3 className="font-medium">{faqHow}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-[15px] leading-7 text-muted">
                {article.howtoSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-serif text-2xl">{t("article.didNotHelp")}</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted">
            {t("article.didNotHelpBody")}
          </p>
        </section>

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl">{t("article.related")}</h2>
            <div className="mt-6 grid gap-4">
              {related.map((item) => (
                <ProblemCard key={item.translationKey} article={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-8">
          <AdSlot position="sidebar" />
        </div>
      </aside>
    </div>
  );
}
