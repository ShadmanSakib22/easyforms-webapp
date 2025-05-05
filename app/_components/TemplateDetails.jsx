import React from "react";
import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export default function TemplateDetails({ template }) {
  const {
    title,
    description,
    topic,
    thumbnailUrl,
    createdAt,
    updatedAt,
    tags,
    creatorId,
    creator,
    invitedUsers,
    access,
    _count,
  } = template;

  const updatedDate = updatedAt
    ? format(new Date(updatedAt), "d MMMM yyyy - h:mm aaa")
    : "N/A";
  const createdDate = createdAt
    ? format(new Date(createdAt), "d MMMM yyyy - h:mm aaa")
    : "N/A";

  //   console.log(template);
  const t = useTranslations("form");

  return (
    <div className="container max-w-[1100px] mx-auto mb-[3rem] px-4">
      <div className="mb-4 md:mb-8">
        <Link href="/dashboard" className="btn btn-sm btn-primary btn-outline">
          <ArrowLeft size={16} className="mr-1" /> {t("Return to Dashboard")}
        </Link>
      </div>
      <article className="p-6 md:p-8 border border-base-300 rounded-xl bg-base-200">
        <h1 className="subheading-style">
          {" "}
          <ScrollText /> {t("Template Details")}
        </h1>

        {/* Render Title */}
        <h1 className="text-2xl font-mono font-bold mb-2">
          {title || "*Untitled Form*"}
        </h1>

        {/* Render Description using Markdown */}
        {description && (
          <div
            className="flex-1 prose prose-sm text-base-content/90"
            style={{ whiteSpace: "pre-wrap" }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml={false}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    style={{ maxHeight: "240px" }}
                    className="rounded-md"
                    alt={props.alt || "markdown image"}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-primary hover:text-primary/40"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        )}
        {!description && (
          <div className="mb-4 pb-4 text-base-content/50 italic">
            *No description provided*
          </div>
        )}

        <div className="flex flex-wrap gap-6 mt-4">
          {/* Render Thumbnail */}
          {thumbnailUrl && (
            <div>
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="block shadow h-[240px] w-auto aspect-square object-cover bg-base-300 rounded"
              />
            </div>
          )}
          {/* Render Topic & General Info */}
          {topic && (
            <div>
              <h4 className="mt-4 badge border-primary bg-base-300 capitalize font-semibold font-mono text-base-content/90">
                {t("Topic")}: <span className="font-normal">{topic}</span>
              </h4>
              <br />
              <h4 className="mt-4 badge border-primary bg-base-300 capitalize font-semibold font-mono text-base-content/90">
                {t("Access")}:{" "}
                <span className="font-normal capitalize">{access}</span>
              </h4>
              <p className="mt-4 text-sm text-base-content/70">
                {t("Updated on")}:{" "}
                <span className="text-primary/90">{updatedDate}</span>
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {t("Published on")}:{" "}
                <span className="text-primary/90">{createdDate}</span>
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {t("Published by")}:{" "}
                <span className="text-primary/90">{creator.email}</span>
              </p>
              <p className="mt-6 text-sm text-base-content/70">
                {t("Total Submissions")}:{" "}
                <span className="text-primary/90">{_count.submissions}</span>
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Render Tags */}
      <fieldset className="mt-2 fieldset bg-base-200 border-base-300 rounded-md border p-3 w-full">
        <legend className="fieldset-legend mb-[-10px]">
          {t("Tagged By")}:
        </legend>

        <div className="flex flex-wrap gap-1">
          {/* Render tags */}
          {tags && tags.length > 0 ? (
            tags.map((tagItem, index) => (
              <span
                key={index}
                className="bg-base-100 text-primary border border-primary/20 rounded-md px-2 py-1 text-xs font-mono"
              >
                {tagItem.tag.name}
              </span>
            ))
          ) : (
            <span className="text-base-content/50">{t("No tags added")}</span>
          )}
        </div>
      </fieldset>
      {/* Render invited users */}
      <fieldset className="mt-2 fieldset bg-base-200 border-base-300 rounded-md border p-3 w-full">
        <legend className="fieldset-legend mb-[-10px]">
          {t("Invited Users")}:
        </legend>
        <div className="flex flex-wrap gap-1">
          {invitedUsers && invitedUsers.length > 0 ? (
            invitedUsers.map((user, index) => (
              <span
                key={index}
                className="bg-base-100 text-primary border border-primary/20 rounded-md px-2 py-1 text-xs font-mono"
              >
                {user.email}
              </span>
            ))
          ) : (
            <span className="text-base-content/50">
              {t("No invited users")}
            </span>
          )}
        </div>
      </fieldset>
    </div>
  );
}
