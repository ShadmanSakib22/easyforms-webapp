import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  let currentLocale = await cookieStore;
  currentLocale = currentLocale.get("locale")?.value || "en";

  return {
    locale: currentLocale,
    messages: (await import(`@/i18n/messages/${currentLocale}.json`)).default,
  };
});
