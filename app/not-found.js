import { useTranslations } from "next-intl";
export default function NotFound() {
  const t = useTranslations("common");
  return (
    <div className="container mx-auto p-4 text-center my-[5rem]">
      <h1 className="text-2xl font-bold text-error">
        {t("Page Not Found - 404")}
      </h1>
      <p className="font-mono pb-[10rem]">
        {t("No page found at this location")}
      </p>
      <a
        href="#"
        className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
      >
        {t("Contact support for assistance")}
      </a>
    </div>
  );
}
