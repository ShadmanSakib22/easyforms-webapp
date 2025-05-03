import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="py-4 px-4 text-center text-xs md:text-sm text-base-content/80 bg-base-300 mt-[4rem]">
      <span>{t("copyright")}</span>{" "}
      <a
        href="https://shadman-portfolio-2024.vercel.app/"
        className="hover:underline underline-offset-4 text-nowrap"
      >
        Shadman Sakib
      </a>
    </footer>
  );
}
