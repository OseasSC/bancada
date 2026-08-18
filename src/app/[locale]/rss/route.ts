import { getArticles } from "@/lib/content";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { articleUrl, localizedUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function rfc822(date: string) {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return new Response("Not found", { status: 404 });
  }
  const loc = locale as Locale;
  const articles = getArticles(loc);
  const channelTitle =
    loc === "pt"
      ? `${site.name} — guias de técnico para PC e notebook`
      : `${site.name} — technician guides for PC and laptop`;
  const channelDesc =
    loc === "pt"
      ? "Novos e atualizados guias de diagnóstico para desktop e notebook."
      : "New and updated diagnostic guides for desktops and notebooks.";

  const items = articles
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((article) => {
      const url = articleUrl(loc, article);
      return `<item>
        <title><![CDATA[${article.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${rfc822(article.updatedAt)}</pubDate>
        <description><![CDATA[${article.description}]]></description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${channelTitle}]]></title>
    <link>${localizedUrl(loc)}</link>
    <description><![CDATA[${channelDesc}]]></description>
    <language>${loc === "pt" ? "pt-BR" : "en"}</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
