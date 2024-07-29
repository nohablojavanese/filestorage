// app/page.tsx (or wherever your page is located)
// import { uploadFile } from "@/lib/action";
// import { useState, useCallback } from "react";
// import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { createClient } from "@/lib/supabase/server";
// import FileList from "@/components/FileList";
// import FilePreview from "@/components/FilePreview";
// import FileActions from "@/components/FileActions";
// import FolderNavigation from "@/components/FolderNavigation";
// import SearchBar from "@/components/SearchBar";
import UploadComponent from "@/components/Upload";
import { redirect } from "next/navigation";


export default async function Home() {
  const supabase = createClient();
  // Fetch initial data if needed
  // const initialData = await supabase.storage.from("Public").list();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-tr from-black to-gray-800">
      <Card className="w-full max-w-4xl ">
        <CardHeader className="flex flex-col justify-between items-center pt-10 space-y-5">
          <h1 className="text-2xl font-bold">Perwira Public Dropbox</h1>
          {/* <SearchBar onSearch={setSearchQuery} /> */}
        </CardHeader>
        <CardBody className="p-0">
          <UploadComponent/>
        </CardBody>
        <CardFooter className="flex justify-center pb-6">
          <Button
            className="bg-gray-900 hover:bg-green-600"
            color="primary"
          >
            Upload Files
          </Button>
        </CardFooter>
      </Card>
      {/* <FileList initialData={initialData} /> */}
    </main>
  );
}
