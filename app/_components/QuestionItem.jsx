"use client";

import { Trash, MessageCircleX } from "lucide-react";
import MarkdownEditor from "./MarkdownEditor";

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
          ⠿ Question [{i + 1}]
        </span>

        <div className="flex gap-2 items-center">
          <label className="input input-sm border-primary w-[100px]">
            <span className="font-mono text-primary text-xs">Mark:</span>
            <input
              type="number"
              min={1}
              value={q.marks}
              onChange={(e) =>
                handleQuestionChange(
                  q.id,
                  "marks",
                  parseInt(e.target.value) || 1
                )
              }
            />
          </label>
          <select
            className="select select-sm text-primary border-primary w-[140px]"
            value={q.type}
            onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
          >
            <option value="single-line">Single-line Text</option>
            <option value="multi-line">Multi-line Text</option>
            <option value="integer">Integer</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio-checkbox">Radio-Checkbox</option>
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
        placeholder="Question Title"
        value={q.label}
        onChange={(e) => handleQuestionChange(q.id, "label", e.target.value)}
      />

      {/* <textarea
        className="textarea bg-base-200 border-base-300 w-full"
        placeholder="Question Description (optional) - Supports Markdown"
        rows={3}
        value={q.description}
        onChange={(e) =>
          handleQuestionChange(q.id, "description", e.target.value)
        }
      /> */}
      <MarkdownEditor
        value={q.description}
        onChange={(value) => handleQuestionChange(q.id, "description", value)}
        placeholder="Question Description (optional)"
      />

      {q.type === "single-line" && (
        <input
          type="text"
          placeholder="Single-line placeholder (optional)"
          className="input bg-base-200 border-base-300 w-full"
          value={q.placeholder}
          onChange={(e) =>
            handleQuestionChange(q.id, "placeholder", e.target.value)
          }
        />
      )}

      {q.type === "multi-line" && (
        <textarea
          placeholder="Multi-line placeholder (optional)"
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
          placeholder="Numeric placeholder (optional)"
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
              <label className="btn btn-sm bg-base-300 text-success">
                Correct
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-success"
                  checked={opt.isCorrect}
                  onChange={(e) =>
                    handleOptionChange(
                      q.id,
                      opt.id,
                      "isCorrect",
                      e.target.checked
                    )
                  }
                />
              </label>
              <button
                onClick={() => removeOptionFromQuestion(q.id, opt.id)}
                className="btn btn-sm bg-base-300 text-error"
              >
                Remove <MessageCircleX className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOptionToQuestion(q.id)}
            className="btn btn-sm btn-outline btn-primary mt-2 w-fit"
          >
            + Add Option
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
              <label className="btn btn-sm bg-base-300 text-success">
                Correct
                <input
                  type="radio"
                  className="radio radio-success"
                  name={`radio-${q.id}`}
                  checked={opt.isCorrect}
                  onChange={(e) =>
                    handleOptionChange(
                      q.id,
                      opt.id,
                      "isCorrect",
                      e.target.checked
                    )
                  }
                />
              </label>
              <button
                onClick={() => removeOptionFromQuestion(q.id, opt.id)}
                className="btn btn-sm bg-base-300 text-error"
              >
                Remove <MessageCircleX className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addOptionToQuestion(q.id)}
            className="btn btn-sm btn-outline btn-primary mt-2 w-fit"
          >
            + Add Option
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <label className="label cursor-pointer">
          <span className="text-base-content/70 text-xs">Required:</span>
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
          <span className="text-base-content/70 text-xs">Visibility:</span>
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
