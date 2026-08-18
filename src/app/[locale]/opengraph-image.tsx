import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const alt = "Bancada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = locale === "en" ? site.tagline.en : site.tagline.pt;
  const kicker =
    (locale as Locale) === "en"
      ? "Technician guides for PC and laptop"
      : "Guias de técnico para PC e notebook";

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#0f5c56", letterSpacing: 4 }}>
            BANCADA
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 64,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            {tagline}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#6b6560" }}>{kicker}</div>
      </div>
    ),
    { ...size },
  );
}
