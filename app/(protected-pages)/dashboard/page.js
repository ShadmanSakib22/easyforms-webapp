import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchCreatorsTemplateList,
  fetchInvitesForUser,
} from "@/app/_actions/templateActions";
import { redirect } from "next/navigation";
import TemplatesTable from "@/app/_components/TemplatesTable";
import { isLocked, isAdmin } from "@/app/_actions/commonActions";
import InvitesTable from "@/app/_components/InvitesTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const DashboardContent = ({ templatesList, invitesList, admin }) => {
  const t = useTranslations("common");

  return (
    <div className="container max-w-[1100px] mx-auto my-[3rem] px-4">
      <div className="mb-6 flex flex-wrap gap-2 justify-between rounded-md p-2 bg-base-200 border-1 border-base-300">
        <ul className="flex flex-wrap gap-2">
          <li className="btn btn-sm min-w-[6rem] btn-primary">
            {t("Dashboard")}
          </li>
          {admin === true && (
            <Link href="/adminpanel/users">
              <li className="btn btn-sm min-w-[6rem] btn-primary btn-outline text-nowrap">
                {t("Admin-Panel")}
              </li>
            </Link>
          )}
        </ul>
        <Link href={"/templates/builder"}>
          <button className="btn btn-sm btn-success btn-outline">
            {t("Create Form")} <Plus size={16} />
          </button>
        </Link>
      </div>
      <TemplatesTable templatesList={templatesList} />
      <InvitesTable invitesList={invitesList} />
    </div>
  );
};

const Page = async () => {
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0].emailAddress;
  const userId = user?.id;

  if (await isLocked(userId)) {
    redirect("/locked");
  }

  const admin = await isAdmin(userId);
  const templatesList = await fetchCreatorsTemplateList(userId);
  const invitesList = await fetchInvitesForUser(userEmail);

  return (
    <DashboardContent
      templatesList={templatesList}
      invitesList={invitesList}
      admin={admin}
    />
  );
};

export default Page;
