"use client";

import { Button } from "@nextui-org/react";
import { useUpload } from "@/app/utils/upload";

export default function UploadComponent() {
  const {
    uploading,
    uploadStatus,
    getRootProps,
    getInputProps,
    isDragActive,
    setCurrentFolder,
  } = useUpload();

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer m-4 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Upload File Disini</p>
        )}
      </div>
      {uploadStatus && (
        <p
          className={`my-4 text-center ${
            uploadStatus.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </>
  );
}
