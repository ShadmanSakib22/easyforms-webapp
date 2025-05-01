// app/(protected-pages)/adminpanel/forms/page.js
import React from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { adminPermissionsCheck } from "@/app/_actions/commonActions";

const page = async () => {
  await adminPermissionsCheck();

  const user = await currentUser();
  const currentUserEmail = user?.emailAddresses[0]?.emailAddress;

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
          <Link href="/adminpanel/users">
            <li className="btn btn-sm w-[6rem] btn-primary btn-outline">
              Users
            </li>
          </Link>
          <li className="btn btn-sm w-[6rem] btn-primary">Forms</li>
        </ul>
      </div>

      {/* Forms Table */}
    </div>
  );
};

export default page;
