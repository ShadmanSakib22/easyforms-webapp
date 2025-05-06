import { notFound } from "next/navigation";
import { hasFullTemplateAccess } from "@/app/_actions/templateActions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import FormAnalysisTable from "@/app/_components/FormAnalysisTable";
import prisma from "@/lib/prisma";

const page = async ({ params }) => {
  const { templateId } = await params;
  if (!/^c[a-z0-9]+$/.test(templateId)) {
    notFound();
  }

  const { userId: reqId } = await auth();
  if (!(await hasFullTemplateAccess(templateId, reqId))) {
    redirect("/403");
  }

  // Fetch template questions and answers
  const templateData = await prisma.template.findUnique({
    where: { id: templateId },
    select: {
      questions: {
        select: {
          id: true,
          label: true,
          description: true,
          answers: {
            select: {
              value: true,
              submission: {
                select: {
                  updatedAt: true,
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="container max-w-[1080px] mx-auto px-4">
      <FormAnalysisTable templateData={templateData} templateId={templateId} />
    </div>
  );
};

export default page;
