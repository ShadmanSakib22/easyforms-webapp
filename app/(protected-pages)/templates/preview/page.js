// app/templates/preview/page.js
"use client";

import React from "react";
import Link from "next/link";
import { useTemplateStore } from "@/store/templateStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

function ViewQuestion({ question, index }) {
  const { type, label, description, placeholder, options, show, required } =
    question;
  if (!show) return null;

  const t = useTranslations("form");

  return (
    <div className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm">
      <div className="mb-2">
        <strong className="font-semibold text-primary mr-2">
          Q{index + 1}:
        </strong>

        <strong className="font-bold text-base-content/70 w-[80%]">
          {label || t("no question text")}
          {required ? "*" : ""}
        </strong>
        <br />
        {/* Description with Markdown support */}
        <div
          className="prose prose-xs max-w-none text-base-content"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ maxHeight: "180px" }}
                  className="rounded-md"
                  alt={props.alt || "markdown image"}
                />
              ),
              a: ({ node, ...props }) => (
                <a {...props} className="text-primary hover:text-primary/40" />
              ),
            }}
            skipHtml={false}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>

      <div className="block h-1"></div>

      {/* Render appropriate input based on type */}
      {type === "single-line" && (
        <input
          type="text"
          placeholder={placeholder || t("answer here")}
          className="input input-bordered w-full mt-1 text-sm"
        />
      )}
      {type === "multi-line" && (
        <textarea
          placeholder={placeholder || t("answer here")}
          className="textarea textarea-bordered w-full mt-1 text-sm h-24"
        />
      )}
      {type === "integer" && (
        <input
          type="number"
          placeholder={placeholder || t("answer here")}
          className="input input-bordered w-full mt-1 text-sm"
        />
      )}
      {type === "checkbox" && (
        <div className="mt-2 space-y-2 pl-2">
          <p className="font-mono text-xs text-base-content/70">
            {t("Can Select Multiple")}:
          </p>
          {options && options.length > 0 ? (
            options.map((opt, index) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="label-text text-base-content/80">
                  {opt.text || `Option ${index + 1}`}
                </span>
              </label>
            ))
          ) : (
            <p className="text-xs text-error italic">
              {t("Error: No options defined")}
            </p>
          )}
        </div>
      )}
      {type === "radio-checkbox" && (
        <div className="mt-2 space-y-2 pl-2">
          <p className="font-mono text-xs text-base-content/70">
            {t("Can Select Only One")}:
          </p>
          {options && options.length > 0 ? (
            options.map((opt, index) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`radio-question-${question.id}`}
                  className="radio radio-sm"
                />
                <span className="label-text text-base-content/80">
                  {opt.text || `Option ${index + 1}`}
                </span>
              </label>
            ))
          ) : (
            <p className="text-xs text-error italic">
              {t("Error: No options defined")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PreviewTemplatePage() {
  // Read state directly from Zustand store
  const title = useTemplateStore((state) => state.title);
  const description = useTemplateStore((state) => state.description);
  const thumbnailUrl = useTemplateStore((state) => state.thumbnailUrl);
  const topic = useTemplateStore((state) => state.topic);
  const tags = useTemplateStore((state) => state.tags);
  const questions = useTemplateStore((state) => state.questions);

  const t = useTranslations("form");

  return (
    <div className="container max-w-[1024px] mx-auto my-10 md:my-20 px-4">
      <div className="mt-10 mb-4">
        <Link href="/templates/builder" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} className="mr-1" /> {t("return to builder")}
        </Link>
      </div>

      <article className="p-6 md:p-8 border border-base-300 rounded-xl bg-base-200">
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

        <div className="flex flex-wrap gap-6 mt-4 mb-[3rem]">
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
          {/* Render Topic & tags*/}
          {topic && (
            <div>
              <h4 className="badge border-primary bg-base-300 mt-8 capitalize font-semibold font-mono text-base-content/90">
                {t("Topic")}: <span className="font-normal">{topic}</span>
              </h4>
              <p className="mt-4 text-sm text-base-content/70">
                {t("Published on")}:{" "}
                <span className="font-semibold">Placeholder Date</span>
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {t("Signed in as")}:{" "}
                <span className="font-semibold text-primary">
                  Placeholder Email
                </span>
              </p>
              <fieldset className="mt-4 fieldset bg-base-100 border-base-300 rounded-md border p-3 min-w-[300px] max-w-[600px]">
                <legend className="fieldset-legend mb-[-10px]">
                  {t("Tagged By")}:
                </legend>

                <div className="flex flex-wrap gap-1">
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-base-100 text-primary border border-primary/20 rounded-md px-2 py-1 text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-base-content/50">
                      {t("No tags added")}
                    </span>
                  )}
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* Render Questions */}
        <div className="space-y-6">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <ViewQuestion key={q.id} question={q} index={index} />
            ))
          ) : (
            <p className="text-center text-base-content/70 py-6">
              {t("This form template has no questions yet")}.
            </p>
          )}
        </div>

        {/* Submit Area (No Action in Preview) */}
        <div className="mt-8 pt-6 flex justify-end">
          <button className="btn btn-success">
            {t("Submit")} <CheckCircle />
          </button>
        </div>
      </article>

      <div className="mt-4 mb-4">
        <Link href="/templates/builder" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} className="mr-1" /> {t("return to builder")}
        </Link>
      </div>
    </div>
  );
}
