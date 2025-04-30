import { notFound } from "next/navigation";
import {
  hasFullTemplateAccess,
  fetchTemplateMetadataById,
} from "@/app/_actions/templateActions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import TemplateDetails from "@/app/_components/TemplateDetails";

const page = async ({ params }) => {
  const { templateId } = await params;
  if (!/^c[a-z0-9]+$/.test(templateId)) {
    notFound(); // check cuid match
  }

  const { userId: reqId } = await auth(); // ID of the user making the request
  if (!(await hasFullTemplateAccess(templateId, reqId))) {
    redirect("/403");
  }

  const template = await fetchTemplateMetadataById(templateId);
  if (!template) {
    notFound();
  }

  return (
    <div>
      <TemplateDetails template={template} />
    </div>
  );
};

export default page;
