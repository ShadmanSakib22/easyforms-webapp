// app/(protected-pages)/adminpanel/page.js
import React from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import UserTable from "./UserTable";

var currentUserEmail = "";

// Helper function to check admin role (fetches from DB based on Clerk ID)
async function checkAdminRole(userId) {
  if (!userId) return false;
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, email: true },
    });
    currentUserEmail = user.email;
    return user?.role === "admin";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return false; // Fail safe
  }
}

// The Page component itself (Server Component)
const AdminPanelPage = async () => {
  const { userId } = await auth(); // Get user ID and session claims from Clerk

  const isAdmin = await checkAdminRole(userId); // True if user is admin

  // Not an admin, display forbidden message - 403 Page
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-error">Access Forbidden</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // --- Fetch Data for Admin ---
  let users = [];
  try {
    // Fetch all users from your database
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching users for admin panel:", error);
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-error">Error Loading Data</h1>
        <p>Could not fetch user list.</p>
      </div>
    );
  }

  // --- Render Admin Content ---
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <p className="mb-6">
        Welcome, <span className="text-primary">{currentUserEmail}</span>{" "}
      </p>

      <UserTable initialUsers={users} />
    </div>
  );
};

export default AdminPanelPage;
