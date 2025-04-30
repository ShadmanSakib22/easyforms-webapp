import React from "react";
import {
  hasFullTemplateAccess,
  fetchUserSubmission,
} from "@/app/_actions/templateActions";
import FilledForm from "@/app/_components/FilledForm";
import { redirect, notFound } from "next/navigation";
import { getEmailFromUserId } from "@/app/_actions/commonActions";
import { auth } from "@clerk/nextjs/server";

const page = async ({ params }) => {
  const { templateId, userId } = await params; // userId = user whose submission we're viewing
  if (!/^c[a-z0-9]+$/.test(templateId) || !/^user_[a-zA-Z0-9]+$/.test(userId)) {
    notFound();
  }

  const { userId: reqId } = await auth(); // reqId = user making the request
  if (!(await hasFullTemplateAccess(templateId, reqId))) {
    redirect("/403");
  }

  // Fetch the user's submission using the IDs from the URL
  const submission = await fetchUserSubmission(templateId, userId);

  // Get the submitter's email
  const submittedBy = await getEmailFromUserId(userId);

  return (
    <FilledForm
      submission={submission}
      submittedBy={submittedBy}
      templateId={templateId}
    />
  );
};

export default page;
