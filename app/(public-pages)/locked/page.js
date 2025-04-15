import React from "react";
import { isLocked } from "@/app/_actions/commonActions";
import { redirect } from "next/navigation";

const page = async () => {
  if (await isLocked()) {
    return (
      <div className="container mx-auto p-4 text-center my-[5rem]">
        <h1 className="text-2xl font-bold text-error">
          Your Account is Locked!
        </h1>
        <p className="font-mono pb-[10rem]">
          You have limited access to the site
        </p>
        <a
          href="#"
          className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
        >
          Contact support for assistance
        </a>
      </div>
    );
  } else redirect("/");
};

export default page;
