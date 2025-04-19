// app/templates/create/page.js
"use client";

import dynamic from "next/dynamic";
import React, { useState, useMemo } from "react";
import {
  Tags,
  Plus,
  Trash,
  Grip,
  Eye,
  UploadCloud,
  Mail,
  Settings,
} from "lucide-react";
import "easymde/dist/easymde.min.css";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function CreateTemplatePage() {
  const [description, setDescription] = useState("");
  const [selectedMode, setSelectedMode] = useState("new");
  const [questions, setQuestions] = useState([]);

  const simpleMdeDescOptions = useMemo(
    () => ({
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
    }),
    []
  );

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type: "single-line",
        label: "",
        placeholder: "",
        options: [
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id, key, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const handleOptionChange = (qid, optId, key, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optId ? { ...opt, [key]: value } : opt
              ),
            }
          : q
      )
    );
  };

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
          />

          <SimpleMDE
            className="custom-markdown"
            placeholder="Description (Markdown supported)"
            value={description}
            options={simpleMdeDescOptions}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="input border-base-300 w-full">
              <Tags className="w-5 h-5 text-primary" />
              <input placeholder="Tags" />
              {/* TODO: Implement tags input with autocomplete from db */}
            </label>

            <label className="input border-base-300 w-full">
              <UploadCloud className="w-5 h-5 text-primary" />
              <input placeholder="Thumbnail URL" />
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
                />
                Public
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accessType"
                  className="radio radio-xs radio-primary"
                  value="private"
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

              <div className="grid gap-3">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="p-4 border border-dashed border-primary rounded-lg flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-mono text-nowrap">
                        Question [{i + 1}]
                      </span>

                      <div className="flex gap-2 items-center">
                        <select
                          className="select select-sm text-primary border-primary"
                          value={q.type}
                          onChange={(e) =>
                            handleQuestionChange(q.id, "type", e.target.value)
                          }
                        >
                          <option value="single-line">Single-line Text</option>
                          <option value="multi-line">Multi-line Text</option>
                          <option value="integer">Integer</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="btn btn-circle btn-outline btn-error btn-sm"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <button className="btn btn-circle btn-outline btn-warning btn-sm">
                          <Grip className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <SimpleMDE
                      className="custom-markdown"
                      value={q.label}
                      options={{
                        spellChecker: false,
                        placeholder: "Enter question text (Markdown supported)",
                        status: false,
                        toolbar: [
                          "bold",
                          "italic",
                          "image",
                          "preview",
                          {
                            name: "save",
                            action: function customQuestionSave(editor) {
                              const value = editor.value();
                              handleQuestionChange(q.id, "label", value);
                            },
                            className: "fa fa-save",
                            title: "Save",
                          },
                          "guide",
                        ],
                      }}
                    />

                    {q.type !== "checkbox" && (
                      <input
                        placeholder="Placeholder (optional)"
                        className="input border-base-300"
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
                        {q.options.map((opt) => (
                          <div key={opt.id} className="flex items-center gap-4">
                            <input
                              type="text"
                              placeholder={`Option ${opt.id}`}
                              className="input border-base-300"
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
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm checkbox-success"
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
                              Correct
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button className="btn btn-outline btn-primary">
              <Eye className="w-4 h-4 mr-1" /> Preview
            </button>
            <button className="btn btn-primary">
              <Settings className="w-4 h-4 mr-1" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
