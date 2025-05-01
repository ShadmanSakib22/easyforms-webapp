// app/templates/[id]/page.js
import { currentUser } from "@clerk/nextjs/server";
import { fetchTemplateForSubmission } from "@/app/_actions/templateActions";
import TemplateForm from "@/app/_components/TemplateForm";
import DisqusComments from "@/app/_components/DisqusComments";

export default async function TemplatePage({ params }) {
  const { templateId } = await params;
  const user = await currentUser();

  const requesterEmail = user?.emailAddresses[0].emailAddress;
  const requesterId = user?.id;

  const template = await fetchTemplateForSubmission(
    requesterEmail,
    requesterId,
    templateId
  );

  return (
    <>
      <TemplateForm
        template={template}
        userEmail={requesterEmail}
        userId={requesterId}
      />
      {template && (
        <DisqusComments
          templateId={templateId}
          templateTitle={template.title}
        />
      )}
    </>
  );
}
