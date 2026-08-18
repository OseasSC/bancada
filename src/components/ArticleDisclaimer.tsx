import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function ArticleDisclaimer() {
  const t = await getTranslations("disclaimer");

  return (
    <div className="border border-warning/30 bg-warning/5 p-4 text-sm leading-6">
      <p className="font-medium text-warning">{t("articleTitle")}</p>
      <p className="mt-1 text-muted">
        {t("articleBody")}{" "}
        <Link href="/disclaimer" className="text-accent underline-offset-2 hover:underline">
          {t("readFull")}
        </Link>
      </p>
    </div>
  );
}
