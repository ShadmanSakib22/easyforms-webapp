"use client";

import Link from "next/link";
import { useState } from "react";
import TemplatesTable from "@/app/_components/TemplatesTable";
import InvitesTable from "@/app/_components/InvitesTable";
import SalesforceIntegrationForm from "@/app/_components/SalesforceIntegrationForm";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

const DashboardContent = ({
  templatesList,
  invitesList,
  admin,
  userEmail,
  userId,
}) => {
  const [showSFForm, setShowSFForm] = useState(false);
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowSFForm(true)}
            className="btn btn-sm btn-primary btn-outline"
          >
            Connect Salesforce
          </button>
          <Link href={"/templates/builder"}>
            <button className="btn btn-sm btn-success btn-outline">
              {t("Create Form")} <Plus size={16} />
            </button>
          </Link>
        </div>
      </div>
      {showSFForm && (
        <SalesforceIntegrationForm
          userEmail={userEmail}
          userId={userId}
          onClose={() => setShowSFForm(false)}
        />
      )}
      <TemplatesTable templatesList={templatesList} />
      <InvitesTable invitesList={invitesList} />
    </div>
  );
};

export default DashboardContent;
