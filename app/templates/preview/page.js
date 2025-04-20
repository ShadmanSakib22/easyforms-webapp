// src/app/templates/preview/page.js
"use client";

// Boilerplate - Will need to go through and update

import React from "react";
import Link from "next/link";
import { useTemplateStore } from "@/store/templateStore"; // Adjust path if needed
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

// Helper component to render read-only questions
function ReadOnlyQuestion({ question, index }) {
  const { type, label, placeholder, options } = question;

  return (
    <div className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm">
      <div className="mb-2">
        <strong className="font-semibold text-base-content/90 mr-2">
          Q{index + 1}:
        </strong>
        {/* Render label - assume it might contain Markdown from SimpleMDE */}
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
          placeholder={placeholder || "User would type answer here..."}
          disabled
          className="input input-bordered input-disabled w-full mt-1 text-sm"
        />
      )}
      {type === "multi-line" && (
        <textarea
          placeholder={placeholder || "User would type answer here..."}
          disabled
          className="textarea textarea-bordered textarea-disabled w-full mt-1 text-sm h-24"
        />
      )}
      {type === "integer" && (
        <input
          type="number"
          placeholder={placeholder || "User would enter a number here..."}
          disabled
          className="input input-bordered input-disabled w-full mt-1 text-sm"
        />
      )}
      {type === "checkbox" && (
        <div className="mt-2 space-y-2 pl-2">
          <p className="text-xs text-base-content/70">
            Checkbox Options (User can select multiple):
          </p>
          {options && options.length > 0 ? (
            options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-not-allowed text-sm"
              >
                <input
                  type="checkbox"
                  disabled
                  className="checkbox checkbox-disabled checkbox-sm"
                  // In a real preview, you might check opt.isCorrect to show the intended "correct" answer
                />
                <span className="label-text text-base-content/80">
                  {opt.text || `Option ${opt.id}`}
                </span>
                {opt.isCorrect && (
                  <span className="badge badge-xs badge-success badge-outline ml-2">
                    Correct
                  </span>
                )}
              </label>
            ))
          ) : (
            <p className="text-xs text-error italic">
              No options defined for this checkbox group.
            </p>
          )}
        </div>
      )}
      {/* Add rendering for other types like SELECT later */}
    </div>
  );
}

export default function PreviewTemplatePage() {
  // Read state directly from Zustand store
  const title = useTemplateStore((state) => state.title);
  const description = useTemplateStore((state) => state.description);
  const questions = useTemplateStore((state) => state.questions);
  const orderedQuestions = questions;
  return (
    <div className="container mx-auto my-10 px-4">
      <div className="fixed top-0 left-0 right-0 z-10 bg-warning text-warning-content text-center py-1 text-sm font-semibold">
        PREVIEW MODE - This is how your form will look. Inputs are disabled.
      </div>

      <div className="mt-10 mb-4">
        <Link href="/templates/create" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} className="mr-1" /> Back to Editor
        </Link>
      </div>

      <article className="p-6 md:p-8 border border-primary/50 rounded-xl bg-base-100 shadow-lg">
        {/* Render Title */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          {title || "*Untitled Form*"}
        </h1>

        {/* Render Description using Markdown */}
        {description && (
          <div className="mb-8 pb-4 border-b border-base-300 text-center prose prose-sm max-w-none mx-auto text-base-content/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description}
            </ReactMarkdown>
          </div>
        )}
        {!description && (
          <div className="mb-8 pb-4 border-b border-base-300 text-center text-base-content/50 italic">
            *No description provided*
          </div>
        )}

        {/* Render Questions */}
        <div className="space-y-6">
          {orderedQuestions.length > 0 ? (
            orderedQuestions.map((q, index) => (
              <ReadOnlyQuestion key={q.id} question={q} index={index} />
            ))
          ) : (
            <p className="text-center text-base-content/70 py-6">
              This form template has no questions yet.
            </p>
          )}
        </div>

        {/* Footer / Submit Area (Disabled in Preview) */}
        <div className="mt-8 pt-6 border-t border-base-300 flex justify-center">
          <button className="btn btn-primary btn-disabled" disabled>
            Submit Answers (Disabled in Preview)
          </button>
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link href="/templates/create" className="btn btn-sm btn-outline">
          <ArrowLeft size={16} className="mr-1" /> Back to Editor
        </Link>
      </div>
    </div>
  );
}
