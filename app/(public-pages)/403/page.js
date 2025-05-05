import React from "react";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("common");
  return (
    <div className="container mx-auto p-4 text-center my-[5rem]">
      <h1 className="text-2xl font-bold text-error">
        {t("Access Forbidden - 403")}
      </h1>
      <p className="font-mono pb-[10rem]">
        {t("You do not have permission to access this page")}
      </p>
      <a
        href="#"
        className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
      >
        {t("Contact support for assistance")}
      </a>
    </div>
  );
};

export default page;
