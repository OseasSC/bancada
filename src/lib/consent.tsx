"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CookieChoice = "accepted" | "rejected" | null;

interface ConsentState {
  ready: boolean;
  cookies: CookieChoice;
  disclaimer: boolean;
  adsAllowed: boolean;
  setCookies: (choice: Exclude<CookieChoice, null>) => void;
  acceptDisclaimer: () => void;
}

const COOKIE_KEY = "bancada-cookie-consent";
const DISCLAIMER_KEY = "bancada-disclaimer-ack";

const ConsentContext = createContext<ConsentState | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cookies, setCookiesState] = useState<CookieChoice>(null);
  const [disclaimer, setDisclaimer] = useState(false);

  useEffect(() => {
    const storedCookies = window.localStorage.getItem(COOKIE_KEY);
    const storedDisclaimer = window.localStorage.getItem(DISCLAIMER_KEY);
    if (storedCookies === "accepted" || storedCookies === "rejected") {
      setCookiesState(storedCookies);
    }
    setDisclaimer(storedDisclaimer === "1");
    setReady(true);
  }, []);

  const setCookies = useCallback((choice: Exclude<CookieChoice, null>) => {
    window.localStorage.setItem(COOKIE_KEY, choice);
    setCookiesState(choice);
  }, []);

  const acceptDisclaimer = useCallback(() => {
    window.localStorage.setItem(DISCLAIMER_KEY, "1");
    setDisclaimer(true);
  }, []);

  const value = useMemo<ConsentState>(
    () => ({
      ready,
      cookies,
      disclaimer,
      adsAllowed: cookies === "accepted",
      setCookies,
      acceptDisclaimer,
    }),
    [ready, cookies, disclaimer, setCookies, acceptDisclaimer],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
