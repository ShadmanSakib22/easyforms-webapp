// app/actions/commonActions.js
import prisma from "@/lib/prisma";

// Handler Function for Admin Check
export async function isAdmin(userId) {
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
