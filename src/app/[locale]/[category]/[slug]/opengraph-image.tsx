import { ImageResponse } from "next/og";
import { getArticle, parseCategoryParam } from "@/lib/content";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const alt = "Bancada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const id = parseCategoryParam(category);
  const article = id
    ? getArticle(locale as Locale, id, slug)
    : undefined;
  const title = article?.title ?? site.name;
  const kicker =
    locale === "en" ? "How a technician would fix it" : "O que um técnico faria";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#1c1b19",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 24, color: "#0f5c56", letterSpacing: 3 }}>
          BANCADA
        </div>
        <div
          style={{
            fontSize: title.length > 48 ? 48 : 60,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: "#6b6560" }}>{kicker}</div>
      </div>
    ),
    { ...size },
  );
}
