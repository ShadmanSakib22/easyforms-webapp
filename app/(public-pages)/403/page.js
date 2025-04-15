import React from "react";

const page = () => {
  return (
    <div className="container mx-auto p-4 text-center my-[5rem]">
      <h1 className="text-2xl font-bold text-error">Access Forbidden - 403</h1>
      <p className="font-mono pb-[10rem]">
        You do not have sufficient permissions
      </p>
      <a
        href="#"
        className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
      >
        Contact support for assistance
      </a>
    </div>
  );
};

export default page;
