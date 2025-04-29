// app/templates/[id]/page.js
import { currentUser } from "@clerk/nextjs/server";
import { isLocked } from "@/app/_actions/commonActions";
import { fetchTemplateForSubmission } from "@/app/_actions/templateActions";
import TemplateForm from "@/app/_components/TemplateForm";
import { redirect } from "next/navigation";

export default async function TemplatePage({ params }) {
  const { id: templateId } = await params;
  const user = await currentUser();

  //   if (await isLocked(user?.id)) {
  //     redirect("/locked");
  //   }

  const requesterEmail = user.emailAddresses[0].emailAddress;
  const requesterId = user.id;

  const template = await fetchTemplateForSubmission(
    requesterEmail,
    requesterId,
    templateId
  );

  return (
    <TemplateForm
      template={template}
      userEmail={requesterEmail}
      userId={requesterId}
    />
  );
}
