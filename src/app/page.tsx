import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectLocaleFromHeader } from "@/lib/locale";

export default async function RootPage() {
  const headerList = await headers();
  const locale = detectLocaleFromHeader(headerList.get("accept-language"));
  redirect(`/${locale}`);
}
