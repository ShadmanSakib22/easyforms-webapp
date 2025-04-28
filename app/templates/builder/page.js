import React from "react";
import { lockedRedirect } from "@/app/_actions/commonActions";
import TemplateBuilder from "@/app/_components/TemplateBuilder";

const page = async () => {
  await lockedRedirect();

  return <TemplateBuilder />;
};

export default page;
