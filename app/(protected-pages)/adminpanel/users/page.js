// app/(protected-pages)/adminpanel/users/page.js
import React from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";
import UserTable from "./UserTable";
import { fetchUsersForAdmin } from "./actions";

const page = async () => {
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
    <div className="container max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <p className="mb-6">
        Welcome, <span className="text-primary">{currentUserEmail}</span>{" "}
      </p>

      {/* Admin-Tabs */}
      <div className="mb-6">
        <ul className="flex gap-2 bg-base-300 rounded-lg p-2">
          <li className="btn btn-sm w-[6rem] btn-primary">Users</li>
          <Link href="/adminpanel/forms">
            <li className="btn btn-sm w-[6rem] btn-primary btn-outline">
              Forms
            </li>
          </Link>
        </ul>
      </div>

      {/* User Table */}
      <UserTable initialUsers={userTableData} />
    </div>
  );
};

export default page;
