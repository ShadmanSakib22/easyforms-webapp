"use server";
import { auth } from "@clerk/nextjs/server";
import { isLocked } from "@/app/_actions/commonActions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const publishTemplate = async (payload) => {
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
    questions,
  } = payload;

  try {
    const createdTemplate = await prisma.template.create({
      data: {
        title,
        description,
        topic,
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
};

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
    },
  });
}
