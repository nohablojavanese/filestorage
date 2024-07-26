// src/components/FilePreview.tsx
import { useState, useEffect } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import { createClient } from "@/lib/supabase/client";

type FilePreviewProps = {
  fileId: string;
  fileType: string;
};

export default function FilePreview({ fileId, fileType }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getFileUrl() {
      const { data, error } = await supabase.storage
        .from("Public")
        .createSignedUrl(fileId, 60);
      if (error) {
        console.error("Error getting file URL:", error);
      } else if (data) {
        setPreviewUrl(data.signedUrl);
      }
    }
    getFileUrl();
  }, [fileId, supabase.storage]);

  if (!previewUrl) {
    return <div>Loading preview...</div>;
  }

  if (fileType.startsWith("image/")) {
    return (
      <Card>
        <CardBody>
          <Image src={previewUrl} alt="File preview" />
        </CardBody>
      </Card>
    );
  }

  if (fileType === "application/pdf") {
    return (
      <Card>
        <CardBody>
          <iframe src={previewUrl} width="100%" height="500px" />
        </CardBody>
      </Card>
    );
  }

  return <div>Preview not available for this file type.</div>;
}
