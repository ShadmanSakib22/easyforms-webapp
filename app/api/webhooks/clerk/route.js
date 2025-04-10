// app/api/webhooks/clerk/route.js
import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

async function handler(request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };

  // Verify the webhook signature
  const wh = new Webhook(webhookSecret);
  let evt;
  try {
    evt = wh.verify(JSON.stringify(payload), heads);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return new Response("Error occured", { status: 400 });
  }

  const eventType = evt.type;
  const { id, email_addresses, ...otherData } = evt.data;
  console.log(`Received webhook event: ${eventType} for Clerk User ID: ${id}`);

  // --- Handle user.created ---
  if (eventType === "user.created") {
    if (!id || !email_addresses || email_addresses.length === 0) {
      return new Response("Error: Missing user ID or email", { status: 400 });
    }
    const primaryEmail = email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;
    if (!primaryEmail) {
      return new Response("Error: Primary email not found", { status: 400 });
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail,
          role: "member", // Default role
          status: "active", // Default status
        },
      });
      console.log(`User ${newUser.id} created in DB for Clerk ID ${id}`);
    } catch (error) {
      // Handle potential unique constraint violation if webhook retries/user already exists
      if (error.code === "P2002") {
        // Prisma unique constraint violation
        console.warn(
          `User with Clerk ID ${id} or email ${primaryEmail} likely already exists.`
        );
      } else {
        console.error("Error creating user in DB:", error);
        return new Response("Error processing webhook", { status: 500 });
      }
    }
  }

  // --- Handle user.updated ---
  if (eventType === "user.updated") {
    if (!id) {
      return new Response("Error: Missing user ID", { status: 400 });
    }
    const primaryEmail = email_addresses?.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    try {
      const dataToUpdate = {
        // Only update email if it's present and valid
        ...(primaryEmail && { email: primaryEmail }),
      };

      // Ensure we don't try to update with an empty object
      if (Object.keys(dataToUpdate).length === 0) {
        console.log(`No relevant fields to update for Clerk ID ${id}`);
        return new Response("", { status: 200 });
      }

      const updatedUser = await prisma.user.update({
        where: { clerkId: id },
        data: dataToUpdate,
      });
      console.log(`User ${updatedUser.id} updated in DB for Clerk ID ${id}`);
    } catch (error) {
      // Handle case where user might not exist in DB yet (e.g., if created webhook failed)
      if (error.code === "P2025") {
        // Prisma record not found
        console.warn(`User with Clerk ID ${id} not found in DB for update.`);
        // Optionally, attempt to create the user here if they should exist
      } else {
        console.error("Error updating user in DB:", error);
        // Don't return 500 usually, as other updates might succeed
      }
    }
  }

  return new Response("", { status: 200 });
}

// Export the handler function for GET, POST, and PUT requests
export const GET = handler;
export const POST = handler;
export const PUT = handler;
