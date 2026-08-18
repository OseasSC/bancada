"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categories, type CategoryId } from "@/lib/site";

export interface NavProblem {
  title: string;
  path: {
    pathname: "/[category]/[slug]";
    params: { category: CategoryId; slug: string };
  };
  category: CategoryId;
  categories: CategoryId[];
}

export function CategoryMenus({ problems }: { problems: NavProblem[] }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState<CategoryId | null>(null);

  return (
    <nav className="hidden lg:flex lg:items-stretch" aria-label="Primary">
      {categories.map((category) => {
        const items = problems
          .filter(
            (problem) =>
              problem.category === category ||
              problem.categories.includes(category),
          )
          .slice(0, 8);
        const isOpen = open === category;
        return (
          <div
            key={category}
            className="relative"
            onMouseEnter={() => setOpen(category)}
            onMouseLeave={() => setOpen(null)}
          >
            <Link
              href={{ pathname: "/[category]", params: { category } }}
              className="flex h-14 items-center px-3 text-sm hover:text-accent"
              onFocus={() => setOpen(category)}
            >
              {t(category)}
            </Link>
            {isOpen ? (
              <div className="absolute left-0 top-full z-30 w-72 border border-line bg-paper py-2">
                <ul>
                  {items.map((item) => (
                    <li key={item.path.params.slug}>
                      <Link
                        href={item.path}
                        className="block px-4 py-2 text-sm hover:bg-white"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={{ pathname: "/[category]", params: { category } }}
                  className="mt-1 block border-t border-line px-4 py-2 text-sm text-accent"
                >
                  {t("seeAll")}
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
