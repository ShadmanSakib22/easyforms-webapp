"use client";

import { UploadButton } from "@uploadthing/react";
import { UploadCloud } from "lucide-react";

export default function ImageUploader({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <label className="input border-base-300 w-full">
        <UploadCloud className="w-5 h-5 text-primary" />
        <input
          placeholder="Thumbnail URL (1:1)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const ufsUrl = res?.[0]?.ufsUrl;
          if (ufsUrl) {
            onChange(ufsUrl);
          }
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error.message);
          alert("Upload failed: " + error.message);
        }}
        appearance={{
          button: "btn btn-sm btn-primary text-base-300! w-[100px]",
          container: "",
          allowedContent: "hidden",
        }}
      />
    </div>
  );
}
