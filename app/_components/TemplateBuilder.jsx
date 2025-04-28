"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Settings, ArrowLeft, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TemplateMetadata from "@/app/_components/TemplateMetadata";
import DraggableQuestionsList from "@/app/_components/DraggableQuestionsList";
import { useTemplateStore } from "@/store/templateStore";
import {
  publishTemplate,
  publishEditedTemplate,
  fetchTemplateById,
} from "@/app/_actions/templateActions";
import UseExistingQuestions from "@/app/_components/UseExistingQuestions";

export default function TemplateBuilder({ templateId }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    title,
    description,
    topic,
    tags,
    thumbnailUrl,
    invitedUsers,
    accessType,
    questions,
    selectedMode,
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
    setSelectedMode,
  } = useTemplateStore();

  useEffect(() => {
    async function loadTemplate() {
      if (templateId) {
        setIsLoading(true);
        const template = await fetchTemplateById(templateId);
        if (template) {
          setTitle(template.title);
          setDescription(template.description);
          setTopic(template.topic);
          setThumbnailUrl(template.thumbnailUrl);
          setTags(template.tags.map((tag) => tag.tag.name));
          setInvitedUsers(template.invitedUsers.map((user) => user.email));

          const mappedQuestions = template.questions.map((q) => ({
            id: q.id,
            label: q.label,
            description: q.description,
            type: q.type,
            placeholder: q.placeholder,
            required: q.required,
            show: q.show,
            options: q.options.map((opt) => ({
              id: opt.id,
              text: opt.text,
            })),
          }));

          setQuestions(mappedQuestions);
        }
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handlePublish = async () => {
    const payload = {
      title,
      description,
      topic,
      thumbnailUrl,
      tags, // array of tag names
      invitedUsers, // array of emails
      accessType,
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

    try {
      if (templateId) {
        await publishEditedTemplate(templateId, payload);
        toast.success("Template updated successfully!");
      } else {
        await publishTemplate(payload);
        toast.success("Template published successfully!");
      }
    } catch (error) {
      toast.error("Failed to publish template. Please try again.");
    }
  };

  return (
    <div className="container mx-auto my-[3rem] px-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "bg-base-300! text-base-content! border! border-primary!",
          duration: 5000,
        }}
      />
      <div className="mb-8">
        <Link href="/dashboard" className="btn btn-sm btn-primary btn-outline">
          <ArrowLeft size={16} className="mr-1" /> Return to Dashboard
        </Link>
      </div>

      <div className="mb-8 max-w-[1100px] mx-auto p-8 bg-base-200 border border-base-300 rounded-lg shadow-lg">
        <h1 className="subheading-style">
          <Settings />
          Template Builder
        </h1>

        <p className="subtitle-style">
          Effortlessly build Forms/Surveys/Quizzes/Polls with{" "}
          <span className="text-primary font-semibold">ezForms</span> Template
          Builder. <br />
          Add infinite number of questions with markdown supporting fields.
        </p>

        <p className="subtitle-style">
          Check out the following resources for assistance:
          <br />
          <a
            href="#"
            target="_blank"
            className="font-mono text-xs link link-hover py-1"
          >
            1. Video demonstration
          </a>
          <br />
          <a
            href="#"
            target="_blank"
            className="font-mono text-xs link link-hover"
          >
            2. Markdown support
          </a>
        </p>

        <i className="text-sm">
          Do not have more than one instance of Template Builder Open!
        </i>
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
            accessType={accessType}
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

          {selectedMode === "existing" ? <UseExistingQuestions /> : null}
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

          {/* Preview Publish */}
          <div className="flex justify-end gap-3 mt-6">
            <Link href="/templates/preview">
              <button className="btn btn-primary">
                Preview <Eye className="w-4 h-4" />
              </button>
            </Link>
            <button className="btn btn-success" onClick={handlePublish}>
              Publish <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
