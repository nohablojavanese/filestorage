"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { createClient } from "@/lib/supabase/client";
import FileList from "@/components/FileList";
import FilePreview from "@/components/FilePreview";
import FileActions from "@/components/FileActions";
import FolderNavigation from "@/components/FolderNavigation";
import SearchBar from "@/components/SearchBar";
import ShareLink from "@/components/ShareLink";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    type: string;
    path: string; // Add this line
  } | null>(null);
  const supabase = createClient();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setUploadStatus(null);
      for (const file of acceptedFiles) {
        try {
          const { data, error } = await supabase.storage
            .from("Public")
            .upload(`${currentFolder}/${file.name}`, file);

          if (error) {
            console.error("Error uploading file:", error);
            setUploadStatus(`Error uploading ${file.name}: ${error.message}`);
          } else {
            console.log("File uploaded successfully:", data);
            setUploadStatus(`${file.name} uploaded successfully`);
          }
        } catch (e) {
          console.error("Unexpected error during upload:", e);
          setUploadStatus(`Unexpected error uploading ${file.name}`);
        }
      }
      setUploading(false);
    },
    [supabase.storage, currentFolder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-4xl ">
        <CardHeader className="flex flex-col justify-between items-center pt-10 space-y-5">
          <h1 className="text-2xl font-bold">Perwira Public Dropbox</h1>
          <SearchBar onSearch={setSearchQuery} />
        </CardHeader>
        <CardBody className="p-0">
          {/* <FolderNavigation onNavigate={setCurrentFolder} /> */}
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
                uploadStatus.includes("Error")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {uploadStatus}
            </p>
          )}
          <FileList
            folder={currentFolder}
            searchQuery={searchQuery}
            onFileSelect={(file) => {
              console.log("Selected file:", file); // Add this line for debugging
              setSelectedFile({
                id: file.id,
                type: file.type,
                path: file.path, // Note: changed from file.fullPath to file.path
              });
            }}
            renderActions={(file) => (
              <>
                <FileActions
                  filePath={file.fullPath}
                  fileName={file.name}
                  onDelete={() => {
                    setSelectedFile(null);
                  }}
                />
                <ShareLink filePath={file.fullPath} />
              </>
            )}
          />
        </CardBody>
        <CardFooter className="flex justify-center pb-6">
          <Button
            className="bg-gray-900 hover:bg-green-600"
            color="primary"
            isLoading={uploading}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </CardFooter>
      </Card>
      {selectedFile && (
        <Card className="w-full max-w-4xl mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold">File Preview</h2>
          </CardHeader>
          <CardBody>
            <FilePreview
              filePath={selectedFile.path}
              fileType={selectedFile.type}
            />
          </CardBody>
        </Card>
      )}
    </main>
  );
}
