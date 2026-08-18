"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CategoryId } from "@/lib/site";

export interface SearchHit {
  title: string;
  path: {
    pathname: "/[category]/[slug]";
    params: { category: CategoryId; slug: string };
  };
  category: CategoryId;
  symptoms: string[];
  description: string;
}

export function SearchBox({ items }: { items: SearchHit[] }) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return items
      .filter((item) => {
        const haystack = [item.title, item.description, ...item.symptoms]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [items, query]);

  return (
    <div className="relative w-full max-w-sm">
      <label className="sr-only" htmlFor="site-search">
        {t("nav.searchAria")}
      </label>
      <input
        id="site-search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        placeholder={t("nav.searchPlaceholder")}
        className="w-full border border-line bg-white px-3 py-2 text-sm outline-none ring-accent focus:ring-1"
      />
      {open && query.trim().length >= 2 ? (
        <div className="absolute z-30 mt-1 w-full border border-line bg-paper">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted">{t("search.noResults")}</p>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={`${item.category}-${item.path.params.slug}`}>
                  <Link
                    href={item.path}
                    className="block px-3 py-2 text-sm hover:bg-white"
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {t(`nav.${item.category}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
