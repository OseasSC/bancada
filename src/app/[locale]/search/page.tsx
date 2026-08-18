import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { hreflang, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const loc = locale as Locale;
  const t = await getTranslations({ locale: loc, namespace: "search" });
  const path = loc === "pt" ? "/busca" : "/search";
  return {
    title: q ? `${t("pageTitle")}: ${q}` : t("pageTitle"),
    description: t("pageLead"),
    robots: { index: false, follow: true },
    alternates: hreflang(
      {
        en: localizedUrl("en", "/search"),
        pt: localizedUrl("pt", "/busca"),
      },
      localizedUrl(loc, path),
    ),
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  setRequestLocale(locale as Locale);
  const t = await getTranslations();
  const query = q.trim().toLowerCase();
  const articles = getArticles(locale as Locale);
  const results = query
    ? articles.filter((article) =>
        [article.title, article.description, ...article.symptoms]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : articles;

  return (
    <div className="mx-auto max-w-article px-4 py-12">
      <h1 className="font-serif text-4xl">{t("search.pageTitle")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{t("search.pageLead")}</p>
      <form className="mt-8" action="" method="get">
        <label className="block text-sm" htmlFor="q">
          {t("search.queryLabel")}
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          className="mt-2 w-full border border-line bg-white px-3 py-2 text-sm outline-none ring-accent focus:ring-1"
        />
      </form>
      <p className="mt-6 text-sm text-muted">
        {t("search.results")}: {results.length}
      </p>
      {results.length === 0 ? (
        <p className="mt-4 text-muted">{t("search.noResults")}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {results.map((article) => (
            <li key={article.translationKey}>
              <Link
                href={{
                  pathname: "/[category]/[slug]",
                  params: { category: article.category, slug: article.slug },
                }}
                className="font-serif text-xl text-accent hover:underline"
              >
                {article.title}
              </Link>
              <p className="mt-1 text-sm leading-6 text-muted">
                {article.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
