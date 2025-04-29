import React from "react";
import { lockedRedirect } from "@/app/_actions/commonActions";
import TemplateBuilder from "@/app/_components/TemplateBuilder";

const page = async () => {
  await lockedRedirect();

  // return <TemplateBuilder templateId={"cma0x2d7g0001vl8cgsglo0ql"} />;
  return <TemplateBuilder />;
};

export default page;
