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
  salesforceConnected,
}) => {
  const [showSFForm, setShowSFForm] = useState(false);
  const t = useTranslations("common");
  const t2 = useTranslations("salesforce");

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
          <Link href={"/templates/builder"}>
            <button className="btn btn-sm btn-success btn-outline">
              {t("Create Form")} <Plus size={16} />
            </button>
          </Link>
        </div>
      </div>
      <TemplatesTable templatesList={templatesList} />
      <InvitesTable invitesList={invitesList} />

      {/* Salesforce Integration Form */}
      {salesforceConnected ? (
        <div className="bg-base-200 shadow-xl border-1 border-base-300 p-4 rounded-md flex flex-wrap gap-4 items-end justify-between">
          <div className="max-w-[500px]">
            <h2 className="text-lg font-semibold text-success">
              {t2("Connected to Salesforce")} ✓
            </h2>
            <p className="text-base-content text-sm">
              {t2("You'll receive updates about new features and releases")}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-base-200 shadow-xl border-1 border-base-300 p-4 rounded-md flex flex-wrap gap-4 items-end justify-between">
          <div className="max-w-[500px]">
            <h2 className="text-lg font-semibold">
              {t2("Stay Ahead with ezForms!")}
            </h2>
            <p className="text-base-content text-sm">
              {t2("Connect your Salesforce to")}
            </p>
          </div>
          <button
            onClick={() => setShowSFForm(true)}
            className="btn btn-sm btn-primary"
          >
            {t2("Connect Now")}
          </button>
          {showSFForm && (
            <SalesforceIntegrationForm
              userEmail={userEmail}
              userId={userId}
              onClose={() => setShowSFForm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
