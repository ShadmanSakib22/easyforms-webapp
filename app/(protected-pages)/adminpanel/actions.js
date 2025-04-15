//app/(protected-pages)/adminpanel/actions.js

"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";

export async function lockUsers(clerkIds) {
  await adminPermissionsCheck();

  if (!Array.isArray(clerkIds) || clerkIds.length === 0) {
    return { success: false, error: "Invalid or empty user IDs provided." };
  }

  try {
    await prisma.user.updateMany({
      where: {
        clerkId: {
          in: clerkIds,
        },
        status: { not: "locked" },
      },
      data: {
        status: "locked",
      },
    });

    return {
      success: true,
      message: "Selected User(s) Locked",
    };
  } catch (error) {
    console.error("Error Locking User(s):", error);
    return { success: false, error: "Failed to update user status." };
  }
}

export async function unlockUsers(clerkIds) {
  await adminPermissionsCheck();

  if (!Array.isArray(clerkIds) || clerkIds.length === 0) {
    return { success: false, error: "Invalid or empty user IDs provided." };
  }
  try {
    await prisma.user.updateMany({
      where: {
        clerkId: {
          in: clerkIds,
        },
        status: { not: "active" },
      },
      data: { status: "active" },
    });
    return {
      success: true,
      message: "Selected User(s) Unlocked",
    };
  } catch (error) {
    console.error("Error Unlocking User(s):", error);
    return { success: false, error: "Failed to update user status." };
  }
}

export async function deleteUsers(clerkIds) {
  // 1. Verify Admin Role (Kept for security)
  await adminPermissionsCheck();

  // 2. Input Validation
  if (!Array.isArray(clerkIds) || clerkIds.length === 0) {
    return { success: false, error: "Invalid or empty user IDs provided." };
  }

  // 3. Delete from Clerk FIRST
  try {
    const client = await clerkClient(); // Initialize client
    if (!client?.users) {
      // Check client and users property
      console.error("Failed to initialize Clerk client in deleteUsers action.");
      return { success: false, error: "Server configuration error." };
    }

    const clerkDeletionPromises = clerkIds.map((clerkId) =>
      client.users
        .deleteUser(clerkId)
        .then(() => ({ clerkId, status: "fulfilled" }))
        .catch(() => ({
          // Catch individual errors to not stop others
          status: "rejected",
          error: `Failed to delete ${clerkId} from Clerk.`,
          // reason: error.errors ? error.errors[0]?.message : error.message
        }))
    );

    const clerkDeletionResults = await Promise.allSettled(
      clerkDeletionPromises
    );

    const successfullyDeletedClerkIds = [];
    let failedClerkCount = 0;

    clerkDeletionResults.forEach((result) => {
      if (result.value.status === "fulfilled") {
        successfullyDeletedClerkIds.push(result.value.clerkId);
      } else {
        failedClerkCount++;
        console.error(result.value.error);
      }
    });

    // 4. Delete from Prisma Database
    let dbDeleteResult = { count: 0 };
    if (successfullyDeletedClerkIds.length > 0) {
      try {
        dbDeleteResult = await prisma.user.deleteMany({
          where: {
            clerkId: { in: successfullyDeletedClerkIds },
          },
        });
      } catch (dbError) {
        console.error(
          "CRITICAL: DB delete failed after Clerk delete:",
          dbError
        );
        return {
          success: false,
          error:
            "Users deleted from Clerk, but failed to delete from DB. Manual cleanup required.",
        };
      }
    }

    // 5. Return Result
    const success = failedClerkCount === 0; // Overall success if no Clerk errors occurred
    let message = `Processed ${clerkIds.length} user(s). Clerk: ${successfullyDeletedClerkIds.length} deleted. DB: ${dbDeleteResult.count} deleted.`;
    if (failedClerkCount > 0) {
      message += ` ${failedClerkCount} Clerk deletion(s) failed.`;
    }

    return { success, message };
  } catch (error) {
    console.error("Unexpected error in deleteUsers action:", error);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

export async function setAdmin() {
  await adminPermissionsCheck();
  console.log("setAdmin function called");
}

export async function setMember() {
  await adminPermissionsCheck();
  console.log("setMember function called");
}

// --- Fetch Users Table Data ---
export async function fetchUsersForAdmin() {
  let users = [];
  try {
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users for admin panel:", error);
    throw error;
  }
}
