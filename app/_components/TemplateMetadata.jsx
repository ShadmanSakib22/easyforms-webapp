"use client";

import ImageUploader from "@/app/_components/ImageUploader";
import MarkdownEditor from "@/app/_components/MarkdownEditor";
import TagInput from "@/app/_components/TagInput";
import InviteUsers from "@/app/_components/InviteUsers";
import { useTranslations } from "next-intl";

export default function TemplateMetadata({
  title,
  description,
  topic,
  tags,
  thumbnailUrl,
  invitedUsers,
  accessType,
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
  const t = useTranslations("builder");
  return (
    <>
      <blockquote className="badge badge-accent badge-outline font-mono">
        {t("Metadata")}
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

        <div className="flex flex-col gap-2 flex-1 min-w-[340px]">
          <label className="select bg-base-300">
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option disabled={true}>{t("Pick a Topic")}</option>
              <option value="general">General</option>
              <option value="education">Education</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </label>

          <TagInput tags={tags} setTags={setTags} />

          <InviteUsers
            invitedUsers={invitedUsers}
            setInvitedUsers={setInvitedUsers}
          />
        </div>

        <div className="flex flex-col gap-2">
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4 w-[240px]">
            <legend className="fieldset-legend">
              {t("Visibility Options")}
            </legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accessType"
                className="radio radio-xs radio-primary"
                value="public"
                checked={accessType === "public"}
                onChange={() => setAccessType("public")}
              />
              {t("Public")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accessType"
                className="radio radio-xs radio-primary"
                value="private"
                checked={accessType === "private"}
                onChange={() => setAccessType("private")}
              />
              {t("Private")}
            </label>
          </fieldset>

          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4 w-[240px]">
            <legend className="fieldset-legend">{t("Template Starter")}</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                className="radio radio-xs radio-primary"
                value="existing"
                checked={selectedMode === "existing"}
                onChange={() => setSelectedMode("existing")}
              />
              {t("Start with Existing Template")}
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
              {t("Start New")}
            </label>
          </fieldset>
        </div>
      </div>
    </>
  );
}
