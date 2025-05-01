"use client";

import { DiscussionEmbed } from "disqus-react";

export default function DisqusComments({ templateId, templateTitle }) {
  const pageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/templates/${templateId}`;

  console.log("Disqus Comments Component - Page URL:", pageUrl);

  return (
    <div className="container max-w-[1100px] bg-base-200 border border-base-300 mx-auto p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <DiscussionEmbed
        shortname="https-easyforms-webapp-vercel-app"
        config={{
          url: pageUrl,
          identifier: templateId,
          title: templateTitle || "Untitled Template",
          language: "en",
        }}
      />
    </div>
  );
}
