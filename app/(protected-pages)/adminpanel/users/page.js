import React from "react";
import Link from "next/link";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";
import UserTable from "./UserTable";
import { fetchUsersForAdmin } from "./actions";
import { useTranslations } from "next-intl";

const AdminContent = ({ userTableData }) => {
  const t = useTranslations("common");

  return (
    <div className="container max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">{t("Admin-Panel")}</h1>

      {/* Admin-Tabs */}
      <div className="mb-6">
        <ul className="flex gap-2 bg-base-300 rounded-lg p-2">
          <li className="btn btn-sm min-w-[6rem] btn-primary">{t("Users")}</li>
          <Link href="/adminpanel/forms">
            <li className="btn btn-sm min-w-[6rem] btn-primary btn-outline">
              {t("Forms")}
            </li>
          </Link>
        </ul>
      </div>

      {/* User Table */}
      <UserTable initialUsers={userTableData} />
    </div>
  );
};

const Page = async () => {
  await adminPermissionsCheck();

  let userTableData;
  try {
    userTableData = await fetchUsersForAdmin();
  } catch (error) {
    console.error(error);
    userTableData = [];
  }

  return <AdminContent userTableData={userTableData} />;
};

export default Page;
