import type { Article } from "./content";
import type { Locale } from "@/i18n/routing";
import { site } from "./site";
import { articleUrl, localizedUrl, siteOrigin } from "./seo";

export function organizationJsonLd() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: origin,
    logo: `${origin}/icon.svg`,
    description: site.tagline.pt,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: localizedUrl(locale),
    inLanguage: locale === "pt" ? "pt-BR" : "en-US",
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${localizedUrl(locale, locale === "pt" ? "/busca" : "/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(
  name: string,
  description: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function articleJsonLd(article: Article, locale: Locale) {
  const url = articleUrl(locale, article);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TechArticle", "HowTo"],
        "@id": `${url}#howto`,
        headline: article.title,
        name: article.title,
        description: article.description,
        datePublished: article.updatedAt,
        dateModified: article.updatedAt,
        inLanguage: locale === "pt" ? "pt-BR" : "en-US",
        author: { "@type": "Organization", name: site.name },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteOrigin()}/icon.svg`,
          },
        },
        mainEntityOfPage: url,
        url,
        keywords: article.symptoms.join(", "),
        about: article.symptoms,
        step: article.howtoSteps.map((name, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name,
          text: name,
          url: `${url}#passo-${index + 1}`,
        })),
        totalTime: "PT60M",
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name:
              locale === "pt"
                ? `Quais os sintomas de ${article.title.toLowerCase()}?`
                : `What are the symptoms of ${article.title.toLowerCase()}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: article.symptoms.join(" "),
            },
          },
          {
            "@type": "Question",
            name:
              locale === "pt"
                ? `Como um técnico resolve ${article.title.toLowerCase()}?`
                : `How would a technician fix ${article.title.toLowerCase()}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: article.howtoSteps.join(" "),
            },
          },
        ],
      },
    ],
  };
}

export function homeFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
