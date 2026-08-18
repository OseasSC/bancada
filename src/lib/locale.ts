import { routing, type Locale } from "@/i18n/routing";

export function detectLocaleFromHeader(header: string | null): Locale {
  if (!header) return routing.defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(";");
      const tag = tagRaw.trim().toLowerCase();
      const qParam = params.find((item) => item.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "1") : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .filter((item) => item.tag && item.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const exact = routing.locales.find((locale) => locale === tag);
    if (exact) return exact;

    const byPrefix = routing.locales.find(
      (locale) => tag === locale || tag.startsWith(`${locale}-`),
    );
    if (byPrefix) return byPrefix;
  }

  return routing.defaultLocale;
}
