"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/site";
import type { NavProblem } from "./CategoryMenus";
import { LanguageSwitcher, type TranslationMap } from "./LanguageSwitcher";

export function MobileNav({
  problems,
  translationMap,
}: {
  problems: NavProblem[];
  translationMap: TranslationMap;
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="border border-line px-3 py-1.5 text-sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? t("closeMenu") : t("openMenu")}
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full z-30 border-b border-line bg-paper px-4 py-4">
          <div className="mb-3">
            <LanguageSwitcher translationMap={translationMap} />
          </div>
          {categories.map((category) => (
            <div key={category} className="border-t border-line py-3 first:border-t-0">
              <Link
                href={{ pathname: "/[category]", params: { category } }}
                className="font-medium"
                onClick={() => setOpen(false)}
              >
                {t(category)}
              </Link>
              <ul className="mt-2 space-y-1">
                {problems
                  .filter(
                    (problem) =>
                      problem.category === category ||
                      problem.categories.includes(category),
                  )
                  .slice(0, 5)
                  .map((item) => (
                    <li key={item.path.params.slug}>
                      <Link
                        href={item.path}
                        className="text-sm text-muted hover:text-ink"
                        onClick={() => setOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
