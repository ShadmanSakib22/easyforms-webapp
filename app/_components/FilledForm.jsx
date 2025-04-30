"use client";

import Link from "next/link";
import { ArrowLeft, ListCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

const FilledForm = ({ submission, submittedBy, templateId }) => {
  if (!submission) {
    return <div className="text-center text-error">No submission found.</div>;
  }

  const { title, questions, updatedAt } = submission;

  const formattedDateTime = updatedAt
    ? format(new Date(updatedAt), "d MMMM yyyy - h:mm aaa")
    : "N/A";

  return (
    <div className="container max-w-[1100px] mx-auto my-[3rem] px-4">
      <div className="mb-4 md:mb-8">
        <Link
          href={`/templates/details/${templateId}`}
          className="btn btn-sm btn-primary btn-outline"
        >
          <ArrowLeft size={16} className="mr-1" /> Return to Details
        </Link>
      </div>

      <article className="p-6 md:p-8 border border-base-300 rounded-xl bg-base-200">
        <h1 className="subheading-style">
          {" "}
          <ListCheck /> Form Response
        </h1>

        <h1 className="text-2xl font-mono font-bold mb-2">
          {title || "*Untitled Form*"}
        </h1>

        <div className="mb-6 text-base-content/70">
          Submitted By: <span className="text-primary/80">{submittedBy}</span>
          <br />
          Date Submitted:{" "}
          <span className="text-sm text-primary/80">{formattedDateTime}</span>
        </div>

        <div className="space-y-6">
          {questions?.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm"
              >
                <div className="mb-2">
                  <strong className="font-semibold text-primary mr-2">
                    Q{index + 1}:
                  </strong>
                  <strong className="font-bold text-base-content/70 w-[80%]">
                    {question.label}
                  </strong>
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
                          <a
                            {...props}
                            className="text-primary hover:text-primary/40"
                          />
                        ),
                      }}
                      skipHtml={false}
                    >
                      {question.description}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-base-300 rounded-md">
                  <p className="font-mono text-sm">Answer:</p>
                  <div className="mt-1 text-base-content/90">
                    {question.answer || "No answer provided"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-base-content/70 py-6">
              No questions found in this submission.
            </p>
          )}
        </div>
      </article>
    </div>
  );
};

export default FilledForm;
