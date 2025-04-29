"use client";

import { UploadButton } from "@uploadthing/react";
import { UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ImageUploader({ value, onChange }) {
  return (
    <>
      <div className="flex flex-col gap-2 w-[240px]">
        <div className="block shadow max-h-[240px] w-auto aspect-square object-cover border border-base-300 bg-base-100 rounded">
          {value ? (
            <img
              src={value}
              alt="Thumbnail"
              className="block shadow max-h-[240px] w-auto aspect-square object-cover border border-base-300 bg-base-100 rounded"
            />
          ) : null}
        </div>

        <label className="input border-base-300">
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
            toast.error("Upload failed: " + error.message);
          }}
          appearance={{
            button: "btn btn-sm btn-primary text-base-300! w-[100px]",
            container: "",
            allowedContent: "",
          }}
        />
      </div>
    </>
  );
}
