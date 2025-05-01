"use client";

import { DiscussionEmbed } from "disqus-react";

export default function DisqusComments({ templateId, templateTitle }) {
  const pageUrl = `http://localhost:3000/templates/${templateId}`;

  return (
    <div className="container w-max-[1100px] mx-auto px-4">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <DiscussionEmbed
        shortname="https-easyforms-webapp-vercel-app"
        config={{
          url: pageUrl,
          identifier: templateId,
          title: templateTitle || "Untitled Template",
          language: "zh_TW",
        }}
      />
    </div>
  );
}
