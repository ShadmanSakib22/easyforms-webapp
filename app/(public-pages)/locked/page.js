import React from "react";
import { isLocked } from "@/app/_actions/commonActions";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

const LockedContent = () => {
  const t = useTranslations("common");

  return (
    <div className="container mx-auto p-4 text-center my-[5rem]">
      <h1 className="text-2xl font-bold text-error">
        {t("Your Account is Locked!")}
      </h1>
      <p className="font-mono pb-[10rem]">
        {t("You have limited access to the site")}
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

const Page = async () => {
  if (await isLocked()) {
    return <LockedContent />;
  }
  redirect("/");
};

export default Page;
