"use server";
import { auth } from "@clerk/nextjs/server";
import { isLocked, isAdmin } from "@/app/_actions/commonActions";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export async function isCreator(templateId, reqId) {
  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      creatorId: reqId,
    },
    select: {
      id: true,
    },
  });

  return template !== null;
}

export async function hasFullTemplateAccess(templateId, reqId) {
  try {
    if (!templateId || !reqId) return false;

    if (await isLocked(reqId)) {
      redirect("/locked");
    }

    if ((await isCreator(templateId, reqId)) || (await isAdmin(reqId))) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking template access:", error);
    return false;
  }
}

export async function fetchTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return tags;
}

export async function fetchEmails() {
  const users = await prisma.user.findMany({
    select: { email: true },
  });

  return users.map((user) => user.email);
}

export async function fetchTemplatesList() {
  return await prisma.template.findMany({
    where: { access: "public" },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function fetchTemplateById(templateId) {
  return await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      invitedUsers: true,
    },
  });
}

export async function fetchTemplateQuestionsById(templateId) {
  return await prisma.template.findUnique({
    where: { id: templateId, access: "public" },
    select: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
}

export async function publishTemplate(payload) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }
  if (await isLocked(userId)) {
    return redirect("/locked");
  }

  const {
    title,
    description,
    topic,
    thumbnailUrl,
    tags,
    invitedUsers,
    accessType,
    questions,
  } = payload;

  try {
    const createdTemplate = await prisma.template.create({
      data: {
        title,
        description,
        topic,
        access: accessType,
        thumbnailUrl,
        creatorId: userId,
        tags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
        invitedUsers: {
          create: invitedUsers.map((email) => ({
            email,
          })),
        },
        questions: {
          create: questions.map((q) => ({
            label: q.label,
            description: q.description,
            type: q.type,
            placeholder: q.placeholder,
            required: q.required,
            show: q.show,
            options: {
              create: q.options.map((opt) => ({
                text: opt.text,
              })),
            },
          })),
        },
      },
    });

    return { success: true, templateId: createdTemplate.id };
  } catch (error) {
    console.error("Failed to publish template:", error);
    throw new Error("Failed to publish template");
  }
}

export async function publishEditedTemplate(templateId, payload) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }
  if (await isLocked(userId)) {
    return redirect("/locked");
  }

  const {
    title,
    description,
    topic,
    thumbnailUrl,
    tags,
    invitedUsers,
    accessType,
    questions,
  } = payload;

  try {
    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        title,
        description,
        topic,
        access: accessType,
        thumbnailUrl,
        tags: {
          deleteMany: {},
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
        invitedUsers: {
          deleteMany: {},
          create: invitedUsers.map((email) => ({
            email,
          })),
        },
        questions: {
          deleteMany: {},
          create: questions.map((q) => ({
            label: q.label,
            description: q.description,
            type: q.type,
            placeholder: q.placeholder,
            required: q.required,
            show: q.show,
            options: {
              create: q.options.map((opt) => ({
                text: opt.text,
              })),
            },
          })),
        },
      },
    });

    return { success: true, templateId: updatedTemplate.id };
  } catch (error) {
    console.error("Failed to update template:", error);
    throw new Error("Failed to update template");
  }
}

export async function fetchTemplateForSubmission(
  requesterEmail,
  requesterId,
  templateId
) {
  if (!/^c[a-z0-9]{24}$/.test(templateId)) {
    notFound();
    // throw new Error("Invalid ID");
  }

  // Step 1: Check access
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: {
      access: true,
      invitedUsers: true,
      creatorId: true,
    },
  });

  if (!template) {
    notFound();
    //throw new Error("Template not found");
  }

  const isDirectlyAuthorized =
    template.access === "public" ||
    template.creatorId === requesterId ||
    template.invitedUsers.some((user) => user.email === requesterEmail);

  const isAuthorized = isDirectlyAuthorized || (await isAdmin(requesterId));

  if (!isAuthorized) {
    redirect("/403");
    // throw new Error("Unauthorized");
  }

  // Step 2: Fetch full data now that access is confirmed
  const fullTemplate = await prisma.template.findUnique({
    where: { id: templateId },
    select: {
      id: true,
      title: true,
      description: true,
      topic: true,
      access: true,
      thumbnailUrl: true,
      updatedAt: true,
      tags: { include: { tag: true } },
      questions: {
        where: { show: true },
        include: { options: true },
      },
    },
  });

  return fullTemplate;
}

export async function submitTemplateResponse(
  templateId,
  userId,
  answers,
  sendCopy
) {
  try {
    // Check for existing submission
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        templateId,
        userId,
      },
    });

    if (existingSubmission) {
      return {
        success: false,
      };
    }

    // Create new submission if none exists
    await prisma.submission.create({
      data: {
        templateId,
        userId,
        answers: {
          create: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value: Array.isArray(value) ? value.join(", ") : String(value),
          })),
        },
      },
      include: {
        template: true,
        answers: {
          include: {
            question: true,
          },
        },
        user: true,
      },
    });

    if (sendCopy) {
      console.log("Sending email copy to user...");
      // Todo: Implement email sending logic
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit response:", error);
    throw new Error("Failed to submit response");
  }
}

export async function fetchUserSubmission(templateId, userId) {
  const submission = await prisma.submission.findFirst({
    where: {
      templateId,
      userId,
    },
    select: {
      updatedAt: true,
      template: {
        select: {
          title: true,
          questions: {
            where: { show: true },
            select: {
              id: true,
              label: true,
              description: true,
              type: true,
              options: true,
            },
          },
        },
      },
      answers: {
        select: {
          questionId: true,
          value: true,
        },
      },
    },
  });

  if (submission) {
    const questionsWithAnswers = submission.template.questions.map(
      (question) => {
        const answer = submission.answers.find(
          (a) => a.questionId === question.id
        );
        return {
          ...question,
          answer: answer ? answer.value : null,
        };
      }
    );

    return {
      updatedAt: submission.updatedAt,
      title: submission.template.title,
      questions: questionsWithAnswers,
    };
  }

  return null;
}
