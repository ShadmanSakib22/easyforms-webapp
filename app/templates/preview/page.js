// app/templates/preview/page.js
"use client";

import React from "react";
import Link from "next/link";
import { useTemplateStore } from "@/store/templateStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CheckCircle } from "lucide-react";

function ViewQuestion({ question, index }) {
  const { type, label, placeholder, options } = question;

  return (
    <div className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm">
      <div className="mb-2">
        <strong className="font-semibold text-base-content/90 mr-2">
          Q{index + 1}:
        </strong>
        {/* Render label - Containing Markdown from SimpleMDE */}
        <div className="inline prose prose-sm max-w-none text-base-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ p: React.Fragment }}
          >
            {label || "*No question text*"}
          </ReactMarkdown>
        </div>
      </div>

      {/* Render appropriate disabled input based on type */}
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
            options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="label-text text-base-content/80">
                  {opt.text || `Option ${opt.id}`}
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
    </div>
  );
}

export default function PreviewTemplatePage() {
  // Read state directly from Zustand store
  const title = useTemplateStore((state) => state.title);
  const description = useTemplateStore((state) => state.description);
  const thumbnailUrl = useTemplateStore((state) => state.thumbnailUrl);
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
        <h1 className="text-3xl font-bold mb-2">
          {title || "*Untitled Form*"}
        </h1>

        {/* Render Description using Markdown */}
        {description && (
          <div className="mb-4 pb-4 prose prose-sm text-base-content/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml={false}>
              {description}
            </ReactMarkdown>
          </div>
        )}
        {!description && (
          <div className="mb-4 pb-4 text-base-content/50 italic">
            *No description provided*
          </div>
        )}
        {/* Render Thumbnail */}
        {thumbnailUrl && (
          <div className="mb-8">
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="rounded-lg object-cover w-auto h-[240px]"
            />
          </div>
        )}

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
