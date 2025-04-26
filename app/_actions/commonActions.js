// app/actions/commonActions.js
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Handler Function for Admin Check
async function isAdmin(userId) {
  if (!userId) return false;
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export async function isLocked(optionalUserId) {
  let userIdToUse = null;

  if (optionalUserId !== undefined) {
    userIdToUse = optionalUserId;
  } else {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn();
    }
    userIdToUse = userId;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userIdToUse },
      select: { status: true },
    });
    return user?.status === "locked";
  } catch (error) {
    console.error("Error checking status:", error);
    return false;
  }
}

export const lockedRedirect = async () => {
  if (await isLocked()) {
    redirect("/locked");
  }
};

export const adminPermissionsCheck = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }
  if (await isLocked(userId)) {
    redirect("/locked");
  }
  if (!(await isAdmin(userId))) {
    redirect("/403");
  }
};
