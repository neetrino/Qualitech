import { HomePage } from "@/features/home/home.page";
import { loadHomeMessages } from "@/features/home/home.messages";
import { getHomeLocale } from "@/lib/i18n/home-locale";

export default async function Page() {
  const locale = await getHomeLocale();
  const messages = await loadHomeMessages(locale);
  return <HomePage locale={locale} messages={messages} />;
}
