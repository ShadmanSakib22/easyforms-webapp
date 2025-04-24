"use client";

import { Tags, Mail } from "lucide-react";
import ImageUploader from "@/app/_components/ImageUploader";
import MarkdownEditor from "@/app/_components/MarkdownEditor";

export default function TemplateMetadata({
  title,
  description,
  topic,
  tags,
  thumbnailUrl,
  invitedUsers,
  selectedMode,
  setTitle,
  setDescription,
  setTopic,
  setTags,
  setThumbnailUrl,
  setInvitedUsers,
  setAccessType,
  setSelectedMode,
}) {
  return (
    <>
      <blockquote className="badge badge-accent badge-outline font-mono">
        Metadata
      </blockquote>

      <input
        className="input input-xl w-full border-base-300 text-2xl font-mono font-bold"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <MarkdownEditor
        value={description}
        onChange={setDescription}
        placeholder="Enter markdown text here..."
      />

      <div className="flex flex-wrap gap-4">
        <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />

        <div className="flex flex-col gap-2 flex-1 min-w-[280px]">
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
            <legend className="fieldset-legend">Topic & Tags</legend>
            <label className="select bg-base-300">
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option disabled={true}>Pick a Topic</option>
                <option value="general">General</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="health">Health</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </label>
            <label className="input w-full bg-base-200 border-base-300">
              <Tags className="w-5 h-5 text-primary" />
              <input
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
            <legend className="fieldset-legend">Invite Users</legend>
            <label className="input bg-base-200 border-base-300 w-full">
              <Mail className="w-5 h-5 text-primary" />
              <input
                type="email"
                placeholder="johndoe@gmail.com, janesmith@yahoo.com, ..."
                value={invitedUsers}
                onChange={(e) => setInvitedUsers(e.target.value)}
                required
              />
            </label>
          </fieldset>
        </div>

        <div className="flex flex-col gap-2">
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4 w-[240px]">
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

          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4 w-[240px]">
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
      </div>
    </>
  );
}
