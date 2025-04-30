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
import Link from "next/link";
import { Plus } from "lucide-react";

const page = async () => {
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0].emailAddress;
  const userId = user?.id;

  if (await isLocked(userId)) {
    redirect("/locked");
  }

  const admin = await isAdmin(userId);

  const templatesList = await fetchCreatorsTemplateList(userId);
  const invitesList = await fetchInvitesForUser(userEmail);
  // console.log(invitesList);

  return (
    <div className="container max-w-[1080px] mx-auto my-[3rem]">
      <div className="mb-6 flex flex-wrap justify-between rounded-md p-2 bg-base-200 border-1 border-base-300">
        <ul className="flex gap-2">
          <li className="btn btn-sm w-[6rem] btn-primary">Dashboard</li>
          {admin === true && (
            <Link href="/adminpanel/users">
              <li className="btn btn-sm w-[6rem] btn-primary btn-outline text-nowrap">
                Admin-Panel
              </li>
            </Link>
          )}
        </ul>
        <button className="btn btn-sm btn-success btn-outline">
          Create Form <Plus className="w-4 h-4" />
        </button>
      </div>
      <TemplatesTable templatesList={templatesList} />
      <InvitesTable invitesList={invitesList} />
    </div>
  );
};

export default page;
