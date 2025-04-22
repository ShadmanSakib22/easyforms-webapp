// app/templates/create/page.js
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Tags,
  Plus,
  Trash,
  Eye,
  Mail,
  Settings,
  MessageCircleX,
  ArrowLeft,
} from "lucide-react";
import ImageUploader from "@/app/_components/ImageUploader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "easymde/dist/easymde.min.css";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import { useTemplateStore } from "@/store/templateStore";

export default function CreateTemplatePage() {
  const {
    title,
    description,
    tags,
    thumbnailUrl,
    invitedUsers,
    selectedMode,
    selectedTemplate,
    questions,
    setTitle,
    setDescription,
    setTags,
    setThumbnailUrl,
    setInvitedUsers,
    setAccessType,
    setSelectedMode,
    setSelectedTemplate,
    setQuestions,
    addQuestion,
    removeQuestion,
    handleQuestionChange,
    handleOptionChange,
    addOptionToQuestion,
    removeOptionFromQuestion,
  } = useTemplateStore();

  return (
    <div className="container mx-auto my-[5rem] px-4">
      <div className="mb-8">
        <Link
          href="/templates/create"
          className="btn btn-sm btn-warning btn-outline"
        >
          <ArrowLeft size={16} className="mr-1" /> Return to Dashboard
        </Link>
      </div>

      <h1 className="text-center text-3xl text-primary font-mono font-bold mb-4">
        📒 Create New Template
      </h1>

      <p className="max-w-2xl text-center mx-auto mb-[3.5rem] text-base-content/80">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt alias
        asperiores assumenda, officia molestiae delectus voluptatem quae omnis
        hic cupiditate natus repellendus dolores dolorum? At laboriosam amet
        dicta voluptate non.
      </p>

      <div className="max-w-[1100px] mx-auto p-4 bg-base-200 border border-base-300 rounded-xl">
        <blockquote className="badge badge-accent badge-outline font-mono mb-4">
          Metadata
        </blockquote>
        <div className="grid gap-4">
          <input
            className="input w-full border-base-300"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <SimpleMDE
            className="custom-markdown"
            placeholder="Description (Markdown supported)"
            value={description}
            options={{
              toolbar: [
                "bold",
                "italic",
                "heading-smaller",
                "link",
                "preview",
                {
                  name: "save",
                  action: function customDescSave(editor) {
                    const value = editor.value();
                    setDescription(value);
                  },
                  className: "fa fa-save",
                  title: "Save",
                },
                "guide",
              ],
              spellChecker: false,
              status: false,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="input border-base-300 w-full">
              <Tags className="w-5 h-5 text-primary" />
              <input
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
              />
              {/* TODO: Implement tags input with autocomplete from db */}
            </label>

            <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Invite Users */}
            <fieldset className="fieldset bg-base-100 border-base-300 grow rounded-box border p-4">
              <legend className="fieldset-legend">Invite Users</legend>
              <label className="input validator border-primary/40 w-full">
                <Mail className="w-5 h-5 text-primary" />
                <input
                  type="email"
                  placeholder="johndoe@gmail.com, janesmith@yahoo.com, ..."
                  value={invitedUsers}
                  onChange={(e) => setInvitedUsers(e.target.value)}
                  required
                />
                {/* TODO: Implement invite users with autocomplete from db */}
              </label>
            </fieldset>

            {/* Visibility options */}
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Visibility Options</legend>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accessType"
                  className="radio radio-xs radio-primary"
                  value="public"
                  defaultChecked
                  onChange={() => setAccessType("public")}
                />
                Public
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accessType"
                  className="radio radio-xs radio-primary"
                  value="private"
                  onChange={() => setAccessType("private")}
                />
                Private
              </label>
            </fieldset>

            {/* Template starter options */}
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Template Starter</legend>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  className="radio radio-xs radio-primary"
                  value="existing"
                  onChange={() => setSelectedMode("existing")}
                />
                Start with Existing Template
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  className="radio radio-xs radio-primary"
                  value="new"
                  checked={selectedMode === "new"}
                  onChange={() => setSelectedMode("new")}
                />
                Start New
              </label>
            </fieldset>
          </div>

          {selectedMode === "existing" ? (
            <input
              className="input border-base-300"
              placeholder="Select existing template"
              /* TODO: Select exisiting template in db with autocomplete  dropdown */
            />
          ) : (
            <div className="mt-[3rem] pt-4 border-t-2 border-dashed border-primary">
              <blockquote className="badge badge-accent badge-outline font-mono mb-4">
                Questions
              </blockquote>

              {/* Questions Map - DND */}
              <DragDropContext
                onDragEnd={(result) => {
                  const { source, destination } = result;
                  if (!destination) return;

                  const reorderedQuestions = [...questions];
                  const [moved] = reorderedQuestions.splice(source.index, 1);
                  reorderedQuestions.splice(destination.index, 0, moved);

                  setQuestions(reorderedQuestions);
                }}
              >
                <Droppable droppableId="questions-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {questions.map((q, i) => (
                        <Draggable
                          key={q.id}
                          draggableId={q.id.toString()}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
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
                                    <span className="font-mono text-primary text-xs">
                                      Mark:
                                    </span>
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
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        q.id,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="single-line">
                                      Single-line Text
                                    </option>
                                    <option value="multi-line">
                                      Multi-line Text
                                    </option>
                                    <option value="integer">Integer</option>
                                    <option value="checkbox">Checkbox</option>
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
                                onChange={(e) =>
                                  handleQuestionChange(
                                    q.id,
                                    "label",
                                    e.target.value
                                  )
                                }
                              />

                              <textarea
                                className="textarea bg-base-200 border-base-300 w-full"
                                placeholder="Question Description (optional) - Supports Markdown"
                                rows={3}
                                value={q.description}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    q.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />

                              {q.type === "single-line" && (
                                <input
                                  type="text"
                                  placeholder="Single-line placeholder (optional)"
                                  className="input bg-base-200 border-base-300 w-full"
                                  value={q.placeholder}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      q.id,
                                      "placeholder",
                                      e.target.value
                                    )
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
                                    handleQuestionChange(
                                      q.id,
                                      "placeholder",
                                      e.target.value
                                    )
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
                                    handleQuestionChange(
                                      q.id,
                                      "placeholder",
                                      e.target.value
                                    )
                                  }
                                />
                              )}

                              {q.type === "checkbox" && (
                                <div className="grid gap-2 mt-2">
                                  {q.options.map((opt, index) => (
                                    <div
                                      key={opt.id}
                                      className="flex items-center gap-4"
                                    >
                                      <input
                                        type="text"
                                        placeholder={`Option ${String.fromCharCode(
                                          65 + index
                                        )}`}
                                        className="input border-primary/20"
                                        value={opt.text}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            q.id,
                                            opt.id,
                                            "text",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label className="btn btn-sm btn-success btn-outline">
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
                                        onClick={() =>
                                          removeOptionFromQuestion(q.id, opt.id)
                                        }
                                        className="btn btn-error btn-outline btn-sm"
                                      >
                                        Remove{" "}
                                        <MessageCircleX className="w-4 h-4" />
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

                              <label className="label cursor-pointer justify-end">
                                <span className="font-mono text-base-content/70 text-xs">
                                  Visibility:
                                </span>
                                <input
                                  type="checkbox"
                                  className="toggle toggle-sm toggle-success"
                                  checked={q.show}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      q.id,
                                      "show",
                                      e.target.checked,
                                      console.log(q.show)
                                    )
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                      <button
                        onClick={addQuestion}
                        className="btn btn-primary btn-outline"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Question
                      </button>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Link href="/templates/preview">
              <button className="btn btn-secondary">
                <Eye className="w-4 h-4 mr-1" /> Preview
              </button>
            </Link>
            <button className="btn btn-success">
              <Settings className="w-4 h-4 mr-1" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
