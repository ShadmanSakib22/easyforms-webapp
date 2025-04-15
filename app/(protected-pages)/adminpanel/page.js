// app/(protected-pages)/adminpanel/page.js
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";
import UserTable from "./UserTable";
import { fetchUsersForAdmin } from "./actions";

const AdminPanelPage = async () => {
  await adminPermissionsCheck();

  const user = await currentUser();
  const currentUserEmail = user?.emailAddresses[0]?.emailAddress;

  let userTableData;
  try {
    userTableData = await fetchUsersForAdmin();
  } catch (error) {
    console.error(error);
    userTableData = [];
  }

  // --- Render Admin Content ---
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <p className="mb-6">
        Welcome, <span className="text-primary">{currentUserEmail}</span>{" "}
      </p>

      {/* User Table */}
      <UserTable initialUsers={userTableData} />
    </div>
  );
};

export default AdminPanelPage;
