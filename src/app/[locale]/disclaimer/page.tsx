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
  const t = await getTranslations({ locale: locale as "en" | "pt", namespace: "disclaimer" });
  return {
    title: t("pageTitle"),
    description: t("pageLead"),
    robots: indexFollowRobots(),
    alternates: hreflang(
      {
        en: localizedUrl("en", "/disclaimer"),
        pt: localizedUrl("pt", "/aviso-legal"),
      },
      localizedUrl(locale as "en" | "pt", locale === "pt" ? "/aviso-legal" : "/disclaimer"),
    ),
  };
}

const copy = {
  en: [
    "Bancada publishes educational troubleshooting guides for desktops, notebooks, software, and hardware. The procedures describe what a technician might try on a machine they own or have been hired to repair. They are not a personal service, not a warranty, and not a promise that your computer will be fixed.",
    "You follow every step on your own equipment and at your own risk. You are solely responsible for damage to hardware, loss of data, loss of software licenses, electrical injury, voided manufacturer warranties, and any other harm that results from using this site.",
    "Do not open a power supply. Do not work on a machine that is plugged in when a step says otherwise. Do not bypass passwords, copy other people’s data, or install pirated software. If a step is marked high risk, or you are unsure, stop and take the computer to a qualified technician.",
    "To the maximum extent permitted by law, Bancada, its authors, and its operators disclaim all liability for direct, indirect, incidental, or consequential damages arising from use of these guides — including damages caused by the users themselves.",
    "Guides can be incomplete or become outdated when vendors change firmware, drivers, or Windows. Verify commands and BIOS options on your own model before you apply them.",
  ],
  pt: [
    "A Bancada publica guias educativos de diagnóstico para desktops, notebooks, software e hardware. Os procedimentos descrevem o que um técnico poderia tentar em um equipamento próprio ou que foi contratado para reparar. Não são um serviço pessoal, não são garantia e não prometem que o seu computador será consertado.",
    "Você segue cada passo no seu próprio equipamento e por sua conta e risco. Você é o único responsável por danos ao hardware, perda de dados, perda de licenças, risco elétrico, garantia do fabricante anulada e qualquer outro prejuízo resultante do uso deste site.",
    "Não abra uma fonte de alimentação. Não trabalhe em uma máquina ligada à tomada quando o passo disser o contrário. Não ignore senhas de terceiros, não copie dados de outras pessoas e não instale software pirata. Se um passo estiver marcado como alto risco, ou se você tiver dúvida, pare e leve o computador a um técnico qualificado.",
    "Na máxima extensão permitida pela lei, a Bancada, seus autores e operadores isentam-se de responsabilidade por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso destes guias — inclusive danos causados pelos próprios usuários.",
    "Os guias podem estar incompletos ou desatualizados quando fabricantes mudam firmware, drivers ou o Windows. Confira comandos e opções de BIOS no seu modelo antes de aplicá-los.",
  ],
} as const;

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "en" | "pt");
  const t = await getTranslations("disclaimer");
  const paragraphs = locale === "en" ? copy.en : copy.pt;

  return (
    <div className="mx-auto max-w-article px-4 py-12">
      <h1 className="font-serif text-4xl">{t("pageTitle")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{t("pageLead")}</p>
      <div className="mt-8 space-y-5 text-[15px] leading-7">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
          {locale === "en" ? "Privacy policy" : "Política de privacidade"}
        </Link>
      </p>
    </div>
  );
}
