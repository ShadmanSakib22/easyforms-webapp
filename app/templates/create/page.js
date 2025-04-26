import React from "react";
import { lockedRedirect } from "@/app/_actions/commonActions";
import CreateTemplatePage from "./CreateTemplatePage";

const page = async () => {
  await lockedRedirect();

  return <CreateTemplatePage />;
};

export default page;
