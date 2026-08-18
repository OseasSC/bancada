"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type Risk = "low" | "medium" | "high";

const riskClass: Record<Risk, string> = {
  low: "text-accent",
  medium: "text-warning",
  high: "text-danger",
};

export function Solution({
  difficulty,
  risk,
  time,
  title,
  tools = [],
  children,
}: {
  difficulty: 1 | 2 | 3 | 4;
  risk: Risk;
  time: string;
  title: string;
  tools?: string[];
  children: ReactNode;
}) {
  const t = useTranslations();

  return (
    <section
      id={`passo-${difficulty}`}
      className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0"
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
        {t(`difficulty.${difficulty}`)}
      </p>
      <h2 className="mt-2 font-serif text-2xl">{title}</h2>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <div>
          <dt className="inline">{t("risk.label")}: </dt>
          <dd className={`inline font-medium ${riskClass[risk]}`}>
            {t(`risk.${risk}`)}
          </dd>
        </div>
        <div>
          <dt className="inline">{t("time.label")}: </dt>
          <dd className="inline">{time}</dd>
        </div>
        <div>
          <dt className="inline">{t("tools.label")}: </dt>
          <dd className="inline">
            {tools.length ? tools.join(", ") : t("tools.none")}
          </dd>
        </div>
      </dl>
      {risk === "high" ? (
        <p className="mt-4 border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          {t("disclaimer.articleTitle")}
        </p>
      ) : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
