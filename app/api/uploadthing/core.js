// app/api/uploadthing/core.js
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    }, // https://docs.uploadthing.com/file-routes#route-config
  }).onUploadComplete(async ({ file }) => {
    return { fileUrl: file.ufsUrl };
  }),
};
