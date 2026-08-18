import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categories, isCategoryId, type CategoryId } from "./site";
import type { Locale } from "@/i18n/routing";

export type Severity = "low" | "medium" | "high";

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  translationKey: string;
  category: CategoryId;
  categories: CategoryId[];
  symptoms: string[];
  severity: Severity;
  updatedAt: string;
  related: string[];
  description: string;
  howtoSteps: string[];
}

export interface Article extends ArticleFrontmatter {
  locale: Locale;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function parseArticle(filePath: string, locale: Locale): Article {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;

  if (!fm.categories?.includes(fm.category)) {
    fm.categories = [fm.category, ...(fm.categories ?? [])];
  }

  return {
    ...fm,
    locale,
    body: content,
  };
}

export function getArticles(locale: Locale): Article[] {
  const localeDir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(localeDir)) return [];

  const results: Article[] = [];
  for (const category of categories) {
    const dir = path.join(localeDir, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      results.push(parseArticle(path.join(dir, file), locale));
    }
  }

  return results.sort((a, b) => a.title.localeCompare(b.title, locale));
}

export function getArticlesByCategory(locale: Locale, category: CategoryId): Article[] {
  return getArticles(locale).filter(
    (article) =>
      article.category === category || article.categories.includes(category),
  );
}

export function getArticle(
  locale: Locale,
  category: CategoryId,
  slug: string,
): Article | undefined {
  const filePath = path.join(CONTENT_DIR, locale, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  const article = parseArticle(filePath, locale);
  return article;
}

export function getArticleByTranslationKey(
  locale: Locale,
  translationKey: string,
): Article | undefined {
  return getArticles(locale).find(
    (article) => article.translationKey === translationKey,
  );
}

export function getRelatedArticles(article: Article): Article[] {
  const all = getArticles(article.locale);
  const byKey = new Map(all.map((item) => [item.translationKey, item]));
  return article.related
    .map((key) => byKey.get(key))
    .filter((item): item is Article => Boolean(item));
}

export function articlePath(article: Article) {
  return {
    pathname: "/[category]/[slug]" as const,
    params: { category: article.category, slug: article.slug },
  };
}

export function categoryPath(category: CategoryId) {
  return {
    pathname: "/[category]" as const,
    params: { category },
  };
}

export function getSearchIndex(locale: Locale) {
  return getArticles(locale).map((article) => ({
    title: article.title,
    slug: article.slug,
    category: article.category,
    categories: article.categories,
    symptoms: article.symptoms,
    description: article.description,
    path: articlePath(article),
    severity: article.severity,
  }));
}

export function parseCategoryParam(value: string): CategoryId | undefined {
  return isCategoryId(value) ? value : undefined;
}
