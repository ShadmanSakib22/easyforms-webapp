"use client";

import { DiscussionEmbed } from "disqus-react";

export default function DisqusComments({ templateId, templateTitle }) {
  const pageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/templates/${templateId}`;
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;

  return (
    <div className="container max-w-[1100px] bg-base-200 border border-base-300 mx-auto p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <div className="relative">
        <DiscussionEmbed
          shortname={disqusShortname}
          config={{
            url: pageUrl,
            identifier: templateId,
            title: templateTitle || "Untitled Template",
            language: "en",
          }}
        />
        <div className="theme-overlay bg-base-100 absolute top-0 left-0 h-full w-full opacity-60 pointer-events-none"></div>
      </div>
    </div>
  );
}
