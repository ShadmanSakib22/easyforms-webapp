import React from "react";
import Link from "next/link";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";
import { fetchAdminsTemplateList } from "@/app/_actions/templateActions";
import TemplatesTable from "@/app/_components/TemplatesTable";
import { useTranslations } from "next-intl";

const AdminFormsContent = ({ templatesList }) => {
  const t = useTranslations("common");

  return (
    <div className="container max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">{t("Admin-Panel")}</h1>

      {/* Admin-Tabs */}
      <div className="mb-6">
        <ul className="flex gap-2 bg-base-300 rounded-lg p-2">
          <Link href="/adminpanel/users">
            <li className="btn btn-sm min-w-[6rem] btn-primary btn-outline">
              {t("Users")}
            </li>
          </Link>
          <li className="btn btn-sm min-w-[6rem] btn-primary">{t("Forms")}</li>
        </ul>
      </div>

      {/* Forms Table */}
      <TemplatesTable templatesList={templatesList} />
    </div>
  );
};

const Page = async () => {
  await adminPermissionsCheck();
  const templatesList = await fetchAdminsTemplateList();

  return <AdminFormsContent templatesList={templatesList} />;
};

export default Page;
