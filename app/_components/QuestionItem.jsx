"use client";

import { Trash, MessageCircleX } from "lucide-react";
//import MarkdownEditor from "./MarkdownEditor";
import { useTranslations } from "next-intl";

export default function QuestionItem({
  q,
  i,
  provided,
  snapshot,
  handleQuestionChange,
  handleOptionChange,
  removeQuestion,
  addOptionToQuestion,
  removeOptionFromQuestion,
}) {
  const t = useTranslations("builder");
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      suppressHydrationWarning={true}
      className={`p-4 border border-dashed border-primary rounded-lg flex flex-col gap-4 bg-base-100 ${
        snapshot.isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <span
          className="text-primary font-mono text-nowrap cursor-move"
          {...provided.dragHandleProps}
        >
          ⠿ {t("question")} [{i + 1}]
        </span>

        <div className="flex gap-2 items-center">
          <select
            className="select select-sm text-primary border-primary w-[140px]"
            value={q.type}
            onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
          >
            <option value="single-line">{t("Single-line Text")}</option>
            <option value="multi-line">{t("Multi-line Text")}</option>
            <option value="integer">{t("Integer")}</option>
            <option value="checkbox">{t("Checkbox")}</option>
            <option value="radio-checkbox">{t("Radio-Checkbox")}</option>
          </select>
          <button
            onClick={() => removeQuestion(q.id)}
            className="btn btn-circle btn-outline btn-error btn-sm"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <input
        type="text"
        className="input bg-base-200 border-base-300 w-full"
        placeholder={t("Question Label")}
        value={q.label}
        onChange={(e) => handleQuestionChange(q.id, "label", e.target.value)}
      />

      <textarea
        className="textarea bg-base-200 border-base-300 w-full"
        placeholder={t("Question Description (optional) - Supports Markdown")}
        rows={3}
        value={q.description}
        onChange={(e) =>
          handleQuestionChange(q.id, "description", e.target.value)
        }
      />
      {/* <MarkdownEditor
        value={q.description}
        onChange={(value) => handleQuestionChange(q.id, "description", value)}
        placeholder="Question Description (optional)"
      /> */}

      {q.type === "single-line" && (
        <input
          type="text"
          placeholder={t("Single-line placeholder (optional)")}
          className="input bg-base-200 border-base-300 w-full"
          value={q.placeholder}
          onChange={(e) =>
            handleQuestionChange(q.id, "placeholder", e.target.value)
          }
        />
      )}

      {q.type === "multi-line" && (
        <textarea
          placeholder={t("Multi-line placeholder (optional)")}
          className="textarea bg-base-200 border-base-300 w-full"
          rows={4}
          value={q.placeholder}
          onChange={(e) =>
            handleQuestionChange(q.id, "placeholder", e.target.value)
          }
        />
      )}

      {q.type === "integer" && (
        <input
          type="number"
          placeholder={t("Numeric placeholder (optional)")}
          className="input bg-base-200 border-base-300 w-full"
          value={q.placeholder}
          onChange={(e) =>
            handleQuestionChange(q.id, "placeholder", e.target.value)
          }
        />
      )}

      {q.type === "checkbox" && (
        <div className="grid gap-2 mt-2">
          {q.options.map((opt, index) => (
            <div key={opt.id} className="flex items-center gap-4">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="input bg-base-200 border-base-300"
                value={opt.text}
                onChange={(e) =>
                  handleOptionChange(q.id, opt.id, "text", e.target.value)
                }
              />
              <button
                onClick={() => removeOptionFromQuestion(q.id, opt.id)}
                className="btn btn-sm bg-base-300 text-error"
              >
                {t("Remove")} <MessageCircleX className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOptionToQuestion(q.id)}
            className="btn btn-sm btn-outline btn-primary mt-2 w-fit"
          >
            {t("+ Add Option")}
          </button>
        </div>
      )}

      {q.type === "radio-checkbox" && (
        <div className="grid gap-2 mt-2">
          {q.options.map((opt, index) => (
            <div key={opt.id} className="flex items-center gap-4">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="input bg-base-200 border-base-300"
                value={opt.text}
                onChange={(e) =>
                  handleOptionChange(q.id, opt.id, "text", e.target.value)
                }
              />
              <button
                onClick={() => removeOptionFromQuestion(q.id, opt.id)}
                className="btn btn-sm bg-base-300 text-error"
              >
                {t("Remove")} <MessageCircleX className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOptionToQuestion(q.id)}
            className="btn btn-sm btn-outline btn-primary mt-2 w-fit"
          >
            {t("+ Add Option")}
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <label className="label cursor-pointer">
          <span className="text-base-content/70 text-xs">{t("Required")}:</span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-success"
            checked={q.required}
            onChange={(e) =>
              handleQuestionChange(q.id, "required", e.target.checked)
            }
          />
        </label>
        <label className="label cursor-pointer">
          <span className="text-base-content/70 text-xs">
            {t("Visibility")}:
          </span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-success"
            checked={q.show}
            onChange={(e) =>
              handleQuestionChange(q.id, "show", e.target.checked)
            }
          />
        </label>
      </div>
    </div>
  );
}
