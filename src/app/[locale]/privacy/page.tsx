import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflang, indexFollowRobots, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "en" | "pt", namespace: "privacy" });
  return {
    title: t("pageTitle"),
    description: t("pageLead"),
    robots: indexFollowRobots(),
    alternates: hreflang(
      {
        en: localizedUrl("en", "/privacy"),
        pt: localizedUrl("pt", "/privacidade"),
      },
      localizedUrl(locale as "en" | "pt", locale === "pt" ? "/privacidade" : "/privacy"),
    ),
  };
}

const copy = {
  en: [
    {
      title: "Who we are",
      body: "Bancada is a bilingual educational site with technician-style guides for desktop and notebook problems. This policy explains what we store in your browser and how advertising works.",
    },
    {
      title: "Essential storage",
      body: "We store two local values on your device: your acknowledgement of the disclaimer, and your advertising-cookie choice. They stay in the browser (localStorage) and are not sent to our servers as an account profile. The site also stores the language prefix in the URL (/en or /pt).",
    },
    {
      title: "Google AdSense",
      body: "If you accept advertising cookies, we load Google AdSense. Google may use cookies and similar technologies to show ads, measure them, and (depending on your Google account settings) personalize them. If you reject ads, AdSense scripts are not loaded. You can change your choice by clearing this site’s stored data in the browser.",
    },
    {
      title: "Legal bases and LGPD",
      body: "Essential storage is needed to operate the site (remembering the disclaimer and your ad choice). Advertising cookies are optional and run only with consent. You may refuse ads and still read every guide. For requests about personal data, use the contact channel you publish when the site is in production.",
    },
    {
      title: "Third parties",
      body: "AdSense is operated by Google. Google’s advertising policies and privacy documentation apply to ads shown after consent. We do not sell your personal information.",
    },
  ],
  pt: [
    {
      title: "Quem somos",
      body: "A Bancada é um site educativo bilingue com guias no estilo de um técnico para problemas de desktop e notebook. Esta política explica o que guardamos no seu navegador e como a publicidade funciona.",
    },
    {
      title: "Armazenamento essencial",
      body: "Guardamos dois valores locais no seu dispositivo: o aceite do aviso legal e a escolha de cookies de publicidade. Eles ficam no navegador (localStorage) e não são enviados aos nossos servidores como um perfil de conta. O site também usa o prefixo de idioma na URL (/en ou /pt).",
    },
    {
      title: "Google AdSense",
      body: "Se você aceitar cookies de publicidade, carregamos o Google AdSense. O Google pode usar cookies e tecnologias semelhantes para exibir anúncios, medi-los e (conforme as definições da sua conta Google) personalizá-los. Se você recusar, os scripts do AdSense não são carregados. Você pode mudar a escolha apagando os dados deste site no navegador.",
    },
    {
      title: "Bases legais e LGPD",
      body: "O armazenamento essencial é necessário para operar o site (lembrar o aviso legal e a sua escolha de anúncios). Cookies de publicidade são opcionais e só rodam com consentimento. Você pode recusar anúncios e continuar lendo todos os guias. Para pedidos sobre dados pessoais, use o canal de contato que for publicado quando o site estiver em produção.",
    },
    {
      title: "Terceiros",
      body: "O AdSense é operado pelo Google. As políticas de publicidade e de privacidade do Google se aplicam aos anúncios exibidos após o consentimento. Não vendemos as suas informações pessoais.",
    },
  ],
} as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "en" | "pt");
  const t = await getTranslations("privacy");
  const sections = locale === "en" ? copy.en : copy.pt;

  return (
    <div className="mx-auto max-w-article px-4 py-12">
      <h1 className="font-serif text-4xl">{t("pageTitle")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{t("pageLead")}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-2xl">{section.title}</h2>
            <p className="mt-3 text-[15px] leading-7">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/disclaimer" className="text-accent underline-offset-2 hover:underline">
          {locale === "en" ? "Disclaimer" : "Aviso legal"}
        </Link>
      </p>
    </div>
  );
}
