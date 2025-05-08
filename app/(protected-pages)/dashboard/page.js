import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchCreatorsTemplateList,
  fetchInvitesForUser,
} from "@/app/_actions/templateActions";
import { redirect } from "next/navigation";
import { isLocked, isAdmin } from "@/app/_actions/commonActions";
import DashboardContent from "./DashboardContent";

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
      userEmail={userEmail}
      userId={userId}
    />
  );
};

export default Page;
