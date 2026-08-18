import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articlePath, getArticles } from "@/lib/content";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { CategoryMenus } from "./CategoryMenus";
import { LanguageSwitcher, type TranslationMap } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { SearchBox } from "./SearchBox";

function buildTranslationMap(): TranslationMap {
  const map: TranslationMap = {};
  for (const locale of ["en", "pt"] as const) {
    for (const article of getArticles(locale)) {
      map[article.translationKey] ??= {};
      map[article.translationKey][locale] = {
        category: article.category,
        slug: article.slug,
      };
    }
  }
  return map;
}

export async function Header() {
  const t = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;
  const articles = getArticles(locale);
  const translationMap = buildTranslationMap();
  const problems = articles.map((article) => ({
    title: article.title,
    path: articlePath(article),
    category: article.category,
    categories: article.categories,
  }));
  const searchItems = articles.map((article) => ({
    title: article.title,
    path: articlePath(article),
    category: article.category,
    symptoms: article.symptoms,
    description: article.description,
  }));

  return (
    <header className="relative border-b border-line bg-paper">
      <div className="mx-auto flex max-w-site items-center gap-4 px-4">
        <Link href="/" className="py-4 font-serif text-xl tracking-tight">
          {site.name}
        </Link>
        <CategoryMenus problems={problems} />
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBox items={searchItems} />
          </div>
          <div className="hidden lg:block">
            <LanguageSwitcher translationMap={translationMap} />
          </div>
          <MobileNav problems={problems} translationMap={translationMap} />
        </div>
      </div>
      <div className="border-t border-line px-4 py-2 sm:hidden">
        <SearchBox items={searchItems} />
        <span className="sr-only">{t("searchAria")}</span>
      </div>
    </header>
  );
}
