import { hasFullTemplateAccess } from "@/app/_actions/templateActions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const page = async ({ params }) => {
  const { templateId } = await params; // ID of the user whose submission we're viewing
  const { userId: reqId } = await auth(); // ID of the user making the request
  if (!(await hasFullTemplateAccess(templateId, reqId))) {
    redirect("/403");
  }

  return (
    <div>
      <h1>Template Details</h1>
      <p>Template ID: {templateId}</p>
    </div>
  );
};

export default page;
