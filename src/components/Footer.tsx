import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, site } from "@/lib/site";
import { AdSlot } from "./AdSlot";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-site px-4 py-10">
        <AdSlot position="footer" />
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg">{site.name}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{t("footer.blurb")}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("home.browse")}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={{ pathname: "/[category]", params: { category } }}
                    className="text-muted hover:text-ink"
                  >
                    {t(`nav.${category}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <Link href="/disclaimer" className="block text-muted hover:text-ink">
              {t("footer.disclaimer")}
            </Link>
            <Link href="/privacy" className="mt-1 block text-muted hover:text-ink">
              {t("footer.privacy")}
            </Link>
            <Link href="/site-map" className="mt-1 block text-muted hover:text-ink">
              {t("footer.sitemap")}
            </Link>
            <Link href="/rss" className="mt-1 block text-muted hover:text-ink">
              {t("footer.rss")}
            </Link>
            <p className="mt-4 text-muted">{t("footer.notice")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
