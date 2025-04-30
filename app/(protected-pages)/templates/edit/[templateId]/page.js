import React from "react";
import { auth } from "@clerk/nextjs/server";
import { hasFullTemplateAccess } from "@/app/_actions/templateActions";
import TemplateBuilder from "@/app/_components/TemplateBuilder";
import { notFound, redirect } from "next/navigation";

const page = async ({ params }) => {
  const { templateId } = await params;
  if (!/^c[a-z0-9]+$/.test(templateId)) {
    notFound(); // check cuid match
  }

  const { userId: reqId } = await auth(); // ID of the user making the request
  if (!(await hasFullTemplateAccess(templateId, reqId))) {
    redirect("/403");
  }

  return <TemplateBuilder templateId={templateId} />;
};

export default page;
