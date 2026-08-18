export const site = {
  name: "Bancada",
  tagline: {
    pt: "O que um técnico faria",
    en: "What a technician would do",
  },
} as const;

export const categories = [
  "desktop-pc",
  "notebook",
  "software",
  "hardware",
] as const;

export type CategoryId = (typeof categories)[number];

export function isCategoryId(value: string): value is CategoryId {
  return (categories as readonly string[]).includes(value);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
