"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  return (
    <SimpleMDE
      className="custom-markdown"
      placeholder={placeholder || "Description (Markdown supported)"}
      value={value}
      options={{
        toolbar: [
          "bold",
          "italic",
          "link",
          "image",
          "preview",
          {
            name: "save",
            action: function customSave(editor) {
              const value = editor.value();
              onChange(value);
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
  );
};

export default memo(MarkdownEditor);
