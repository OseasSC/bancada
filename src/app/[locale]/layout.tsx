import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ConsentProvider } from "@/lib/consent";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { AdSenseLoader } from "@/components/AdSenseLoader";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema";
import { indexFollowRobots, ogLocale, siteOrigin } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const serif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "meta",
  });
  const loc = locale as Locale;
  const keywords = t("keywords")
    .split(",")
    .map((item) => item.trim());

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: t("title"),
      template: `%s | ${site.name}`,
    },
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    keywords,
    robots: indexFollowRobots(),
    category: "technology",
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[loc] ?? ogLocale.pt,
      alternateLocale: loc === "pt" ? [ogLocale.en] : [ogLocale.pt],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(locale as Locale)} />
        <NextIntlClientProvider messages={messages}>
          <ConsentProvider>
            <AdSenseLoader />
            <Header />
            <main id="conteudo">{children}</main>
            <Footer />
            <DisclaimerBanner />
            <CookieConsent />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
