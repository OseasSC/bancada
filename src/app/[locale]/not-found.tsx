import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto max-w-article px-4 py-24 text-center">
      <h1 className="font-serif text-4xl">{t("title")}</h1>
      <p className="mt-4 text-muted">{t("body")}</p>
      <Link href="/" className="mt-8 inline-block text-accent hover:underline">
        {t("home")}
      </Link>
    </div>
  );
}
