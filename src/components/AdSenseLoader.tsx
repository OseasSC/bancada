"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

export function AdSenseLoader() {
  const { adsAllowed, ready } = useConsent();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!ready || !adsAllowed || !client || client.includes("xxxxxxxx")) {
    return null;
  }

  return (
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
