// app/templates/create/CreateTemplatePage.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Settings, ArrowLeft } from "lucide-react";
import TemplateMetadata from "@/app/_components/TemplateMetadata";
import DraggableQuestionsList from "@/app/_components/DraggableQuestionsList";
import { useTemplateStore } from "@/store/templateStore";
import { publishTemplate } from "@/app/_actions/templateActions";

export default function CreateTemplatePage() {
  const {
    title,
    description,
    topic,
    tags,
    thumbnailUrl,
    invitedUsers,
    questions,
    setTitle,
    setDescription,
    setTopic,
    setTags,
    setThumbnailUrl,
    setInvitedUsers,
    setAccessType,
    setQuestions,
    addQuestion,
    removeQuestion,
    handleQuestionChange,
    handleOptionChange,
    addOptionToQuestion,
    removeOptionFromQuestion,
  } = useTemplateStore();
  const [selectedMode, setSelectedMode] = useState("new");
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Todo: select existing template from db

  const handlePublish = async () => {
    const payload = {
      title,
      description,
      topic,
      thumbnailUrl,
      tags, // array of tag names
      invitedUsers, // array of emails
      questions: questions.map((q) => ({
        label: q.label,
        description: q.description,
        type: q.type,
        placeholder: q.placeholder,
        required: q.required,
        show: q.show,
        options: q.options.map((opt) => ({
          text: opt.text,
        })),
      })),
    };
    await publishTemplate(payload);
  };

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

      <div className="mb-8 text-center max-w-2xl mx-auto ">
        <h1 className="text-3xl text-primary font-mono font-bold mb-4">
          📒 Create New Template
        </h1>

        <p className="text-base-content/80">
          Effortlessly create new Forms/Surveys/Quizzes/Polls with{" "}
          <span className="text-primary font-semibold">ezForms</span> Template
          Builder. <br />
          Add infinite number of questions with markdown supporting fields.
        </p>

        <p className="text-sm text-base-content/80 mt-4">
          Check out the following resources for assistance:
          <a
            href="#"
            target="_blank"
            className="font-mono block text-xs link link-hover py-1"
          >
            1. Video demonstration
          </a>
          <a
            href="#"
            target="_blank"
            className="font-mono block text-xs link link-hover"
          >
            2. Markdown support
          </a>
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto p-4 bg-base-200 border border-base-300 rounded-xl">
        <div className="grid gap-4">
          <TemplateMetadata
            title={title}
            description={description}
            topic={topic}
            tags={tags}
            thumbnailUrl={thumbnailUrl}
            invitedUsers={invitedUsers}
            selectedMode={selectedMode}
            setTitle={setTitle}
            setDescription={setDescription}
            setTopic={setTopic}
            setTags={setTags}
            setThumbnailUrl={setThumbnailUrl}
            setInvitedUsers={setInvitedUsers}
            setAccessType={setAccessType}
            setSelectedMode={setSelectedMode}
          />

          {selectedMode === "existing" ? (
            <div className="flex mt-2 justify-end">
              <input
                className="input border-base-300"
                placeholder="Select existing template"
                /* TODO: Select exisiting template in db with autocomplete  dropdown */
              />
            </div>
          ) : (
            <div className="mt-[3rem] pt-4 border-t-2 border-dashed border-primary">
              <blockquote className="badge badge-accent badge-outline font-mono mb-4">
                Questions
              </blockquote>

              <DraggableQuestionsList
                questions={questions}
                setQuestions={setQuestions}
                handleQuestionChange={handleQuestionChange}
                handleOptionChange={handleOptionChange}
                removeQuestion={removeQuestion}
                addQuestion={addQuestion}
                addOptionToQuestion={addOptionToQuestion}
                removeOptionFromQuestion={removeOptionFromQuestion}
              />
            </div>
          )}

          {/* Preview Publish */}
          <div className="flex justify-end gap-3 mt-6">
            <Link href="/templates/preview">
              <button className="btn btn-primary">
                <Eye className="w-4 h-4 mr-1" /> Preview
              </button>
            </Link>
            <button className="btn btn-success" onClick={handlePublish}>
              <Settings className="w-4 h-4 mr-1" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
