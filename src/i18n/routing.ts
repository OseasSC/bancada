import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "pt",
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/disclaimer": {
      en: "/disclaimer",
      pt: "/aviso-legal",
    },
    "/privacy": {
      en: "/privacy",
      pt: "/privacidade",
    },
    "/search": {
      en: "/search",
      pt: "/busca",
    },
    "/site-map": {
      en: "/site-map",
      pt: "/mapa-do-site",
    },
    "/rss": "/rss",
    "/[category]": "/[category]",
    "/[category]/[slug]": "/[category]/[slug]",
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
