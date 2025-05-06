"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle } from "lucide-react";
import { submitTemplateResponse } from "@/app/_actions/templateActions";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const TemplateForm = ({ template, userEmail, userId }) => {
  const t = useTranslations("form");
  if (!template) {
    return (
      <div className="text-center text-error">
        {t("Template data not available")}
      </div>
    );
  }

  const {
    id,
    title,
    description,
    topic,
    thumbnailUrl,
    updatedAt,
    tags,
    questions,
  } = template;

  const [answers, setAnswers] = useState({});
  const [sendCopy, setSendCopy] = useState(false); // todo: resend setup
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error(t("Please login to submit a response"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTemplateResponse(
        template.id,
        userId,
        answers,
        sendCopy
      );
      if (result.success) {
        toast.success(t("Response submitted successfully!"));
      } else toast.error(t("You already submitted a response!"));
    } catch (error) {
      toast.error(t("Failed to submit response"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to format the date
  const formattedDate = updatedAt
    ? format(new Date(updatedAt), "d MMMM yyyy - h:mm aaa")
    : "N/A";

  const hasQuestions = questions && questions.length > 0;

  return (
    <div className="container max-w-[1024px] mx-auto mb-[3rem] px-4">
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
          {/* Render Topic*/}
          {topic && (
            <div>
              <h4 className="badge border-primary bg-base-300 mt-8 capitalize font-semibold font-mono text-base-content/90">
                {t("Topic")}: <span className="font-normal">{topic}</span>
              </h4>
              <p className="mt-4 text-sm text-base-content/70">
                {t("Published on")}:{" "}
                <span className="font-semibold">{formattedDate}</span>
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {t("Signed in as")}:{" "}
                <span className="text-primary">{userEmail || "Guest"}</span>
              </p>
              <fieldset className="mt-4 fieldset bg-base-100 border-base-300 rounded-md border p-3 min-w-[300px] max-w-[600px]">
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {questions && questions.length > 0 ? (
              questions.map((question, index) => (
                // Question container
                <div
                  key={question.id}
                  className="mb-6 p-4 border border-base-300 rounded-lg bg-base-100 shadow-sm"
                >
                  <div className="mb-2">
                    <strong className="font-semibold text-primary mr-2">
                      Q{index + 1}:
                    </strong>

                    <strong className="font-bold text-base-content/70 w-[80%]">
                      {question.label || t("no question text")}
                      {question.required ? "*" : ""}
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

                  <div className="block h-1"></div>

                  {/* Render appropriate input based on type */}
                  {question.type === "single-line" && (
                    <input
                      type="text"
                      name={`question-${question.id}`} // name attribute for form data
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder={question.placeholder || t("answer here")}
                      className="input bg-base-300 border-none w-full mt-1 text-sm"
                      required={question.required} // HTML required attribute
                    />
                  )}
                  {question.type === "multi-line" && (
                    <textarea
                      name={`question-${question.id}`}
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder={question.placeholder || t("answer here")}
                      className="textarea bg-base-300 border-none w-full mt-1 text-sm h-24"
                      required={question.required}
                    />
                  )}
                  {question.type === "integer" && (
                    <input
                      type="number"
                      name={`question-${question.id}`}
                      value={answers[question.id] || ""}
                      placeholder={question.placeholder || t("answer here")}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      className="input input-bordered w-full mt-1 text-sm"
                      required={question.required}
                    />
                  )}
                  {question.type === "checkbox" && (
                    <div className="mt-2 space-y-2 pl-2">
                      <p className="font-mono text-xs text-base-content/70">
                        {t("Can Select Multiple")}:
                      </p>
                      {question.options && question.options.length > 0 ? (
                        question.options.map((opt, optIndex) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name={`question-${question.id}`} // Use same name for group
                              value={opt.id} // Use option ID as value
                              onChange={(e) => {
                                const currentValues =
                                  answers[question.id] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, opt.text]
                                  : currentValues.filter((v) => v !== opt.text);
                                handleAnswerChange(question.id, newValues);
                              }}
                              className="checkbox checkbox-sm"
                            />
                            <span className="label-text text-base-content/80">
                              {opt.text || `Option ${optIndex + 1}`}
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
                  {question.type === "radio-checkbox" && (
                    <div className="mt-2 space-y-2 pl-2">
                      <p className="font-mono text-xs text-base-content/70">
                        {t("Can Select Only One")}:
                      </p>
                      {question.options && question.options.length > 0 ? (
                        question.options.map((opt, optIndex) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={opt.id}
                              onChange={(e) =>
                                handleAnswerChange(question.id, opt.text)
                              }
                              className="radio radio-sm"
                              required={question.required}
                            />
                            <span className="label-text text-base-content/80">
                              {opt.text || `Option ${optIndex + 1}`}
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
              ))
            ) : (
              <p className="text-center text-base-content/70 py-6 font-mono text-sm capitalize">
                {t("no questions found")}
              </p>
            )}
          </div>

          {/* Submit Area */}
          <div className="mt-8 pt-6 flex justify-between gap-4 flex-wrap">
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="sendCopy"
                className="checkbox checkbox-sm"
                onChange={(e) => setSendCopy(e.target.checked)}
              />
              <label htmlFor="sendCopy" className="text-sm">
                {t("Email me a copy of my responses")}
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || !hasQuestions}
            >
              {isSubmitting ? t("Submitting") : t("Submit")}{" "}
              <CheckCircle size={20} />
            </button>
          </div>
        </form>
      </article>
    </div>
  );
};

export default TemplateForm;
