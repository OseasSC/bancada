import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/content";
import { articlePath } from "@/lib/content";

export async function ProblemCard({ article }: { article: Article }) {
  const t = await getTranslations();

  return (
    <Link
      href={articlePath(article)}
      className="block border border-line bg-white p-5 hover:border-accent"
    >
      <p className="text-xs uppercase tracking-wide text-muted">
        {t(`severity.${article.severity}`)}
      </p>
      <h3 className="mt-2 font-serif text-xl">{article.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{article.description}</p>
    </Link>
  );
}
