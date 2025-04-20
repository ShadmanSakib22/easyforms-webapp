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
  UploadCloud,
  Mail,
  Settings,
  MessageCircleX,
} from "lucide-react";
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
    <div className="container mx-auto my-[5rem]">
      <h1 className="text-2xl font-bold mb-4">Create a New Template</h1>

      <div className="p-4 bg-base-200 border border-base-300 rounded-xl">
        <blockquote className="mb-4 label inline-flex py-2 px-4 bg-base-300 border border-primary/40 rounded-2xl uppercase font-mono text-sm">
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
                "link",
                "image",
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

            <label className="input border-base-300 w-full">
              <UploadCloud className="w-5 h-5 text-primary" />
              <input
                placeholder="Thumbnail URL"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              {/* TODO: Implement thumbnail upload with cloudinary */}
            </label>
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
            <>
              <div className="flex justify-between items-center mt-[3rem] border-t-2 border-dashed border-primary pt-4">
                <blockquote className="label inline-flex py-2 px-4 bg-base-300 border border-primary/40 rounded-2xl uppercase font-mono text-sm">
                  Questions
                </blockquote>
                <button
                  onClick={addQuestion}
                  className="btn btn-primary btn-outline"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Question
                </button>
              </div>

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
                              className={`p-4 border border-dashed border-primary rounded-lg flex flex-col gap-2 bg-base-100 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-primary font-mono text-nowrap cursor-move"
                                  {...provided.dragHandleProps}
                                >
                                  ⠿ Question [{i + 1}]
                                </span>

                                <div className="flex gap-2 items-center">
                                  <select
                                    className="select select-sm text-primary border-primary"
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

                              <SimpleMDE
                                className="custom-markdown"
                                value={q.label}
                                placeholder="Enter question text (Markdown supported)"
                                options={{
                                  toolbar: [
                                    "bold",
                                    "italic",
                                    "link",
                                    "image",
                                    "preview",
                                    {
                                      name: "save",
                                      action(editor) {
                                        const value = editor.value();
                                        handleQuestionChange(
                                          q.id,
                                          "label",
                                          value
                                        );
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

                              {q.type === "single-line" && (
                                <input
                                  type="text"
                                  placeholder="Single-line placeholder (optional)"
                                  className="input border-primary w-full"
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
                                  className="textarea border-primary w-full"
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
                                  className="input border-primary w-full"
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
                                        className="input border-primary"
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
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Link href="/templates/preview">
              <button className="btn btn-outline btn-primary">
                <Eye className="w-4 h-4 mr-1" /> Preview
              </button>
            </Link>
            <button className="btn btn-primary">
              <Settings className="w-4 h-4 mr-1" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
