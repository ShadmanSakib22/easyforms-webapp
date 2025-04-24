// app/templates/preview/page.js
"use client";

import React from "react";
import Link from "next/link";
import { useTemplateStore } from "@/store/templateStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CheckCircle } from "lucide-react";

function ViewQuestion({ question, index }) {
  const {
    type,
    label,
    description,
    placeholder,
    marks,
    options,
    show,
    required,
  } = question;
  if (!show) return null;

  return (
    <div className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm">
      <div className="mb-2 relative">
        <div className="btn btn-circle btn-xs btn-primary mr-2 absolute top-0 right-0">
          {marks}
        </div>
        <strong className="font-semibold text-primary mr-2">
          Q{index + 1}:
        </strong>

        <strong className="font-bold text-base-content/70 w-[80%]">
          {label || "No question text"}
          {required ? "*" : ""}
        </strong>
        <br />
        {/* Description with Markdown support */}
        <div className="inline prose prose-xs max-w-none text-base-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: React.Fragment, // Prevent wrapping in <p> if needed
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ maxHeight: "180px" }}
                  className="rounded-md"
                  alt={props.alt || "markdown image"}
                />
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Render appropriate input based on type */}
      {type === "single-line" && (
        <input
          type="text"
          placeholder={placeholder || "Answer here..."}
          className="input input-bordered w-full mt-1 text-sm"
        />
      )}
      {type === "multi-line" && (
        <textarea
          placeholder={placeholder || "Answer here..."}
          className="textarea textarea-bordered w-full mt-1 text-sm h-24"
        />
      )}
      {type === "integer" && (
        <input
          type="number"
          placeholder={placeholder || "User would enter a number here..."}
          className="input input-bordered w-full mt-1 text-sm"
        />
      )}
      {type === "checkbox" && (
        <div className="mt-2 space-y-2 pl-2">
          <p className="font-mono text-xs text-base-content/70">
            Can Select Multiple:
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
              Error: No options defined for this checkbox group.
            </p>
          )}
        </div>
      )}
      {type === "radio-checkbox" && (
        <div className="mt-2 space-y-2 pl-2">
          <p className="font-mono text-xs text-base-content/70">
            Can Select Only One:
          </p>
          {options && options.length > 0 ? (
            options.map((opt, index) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`radio-question-${index}`}
                  className="radio radio-sm"
                />
                <span className="label-text text-base-content/80">
                  {opt.text || `Option ${index + 1}`}
                </span>
              </label>
            ))
          ) : (
            <p className="text-xs text-error italic">
              Error: No options defined for this radio group.
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

  return (
    <div className="container max-w-[1024px] mx-auto my-10 md:my-20 px-4">
      <div className="mt-10 mb-4">
        <Link href="/templates/create" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} className="mr-1" /> Back to Editor
        </Link>
      </div>

      <article className="p-6 md:p-8 border border-base-300 rounded-xl bg-base-200">
        {/* Render Title */}
        <h1 className="text-2xl font-mono font-bold mb-2">
          {title || "*Untitled Form*"}
        </h1>

        {/* Render Description using Markdown */}
        {description && (
          <div className="flex-1 prose prose-sm text-base-content/90">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml={false}
              components={{
                img: ({ alt }) => (
                  <span className="text-warning font-semibold">
                    ⚠️ Image not allowed {alt ? `(${alt})` : ""}
                  </span>
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
                className="block shadow max-h-[240px] w-auto aspect-square object-cover bg-base-300 rounded"
              />
            </div>
          )}
          {/* Render Topic & tags*/}
          {topic && (
            <div>
              <h4 className="badge border-primary bg-base-300 mt-8 capitalize font-semibold font-mono text-base-content/90">
                Topic: <span className="font-normal">{topic}</span>
              </h4>
              <div className="mt-4 rounded-box bg-base-300 p-4">
                <h4 className="text-sm capitalize font-mono text-primary mb-2">
                  Tags:
                </h4>
                {/* Map tags with badge */}
                <p className="badge">placeholderTag</p>
              </div>
              <p className="mt-4 text-sm text-base-content/70">
                Published on:{" "}
                <span className="font-semibold">Placeholder Date</span>
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                Signed in as:{" "}
                <span className="font-semibold text-primary">
                  Placeholder Email
                </span>
              </p>
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
              This form template has no questions yet.
            </p>
          )}
        </div>

        {/* Submit Area (No Action in Preview) */}
        <div className="mt-8 pt-6 flex justify-end">
          <button className="btn btn-success">
            Submit <CheckCircle />
          </button>
        </div>
      </article>

      <div className="mt-4 mb-4">
        <Link href="/templates/create" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} className="mr-1" /> Back to Editor
        </Link>
      </div>
    </div>
  );
}
