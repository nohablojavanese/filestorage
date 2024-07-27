import { useState, useEffect } from "react";
import { Card, CardBody, Image, Progress } from "@nextui-org/react";
import { createClient } from "@/lib/supabase/client";

type FilePreviewProps = {
  filePath: string;
  fileType: string;
};

export default function FilePreview({ filePath, fileType }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getFileUrl() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      try {
        const { data, error } = await supabase.storage
          .from("Public")
          .createSignedUrl(filePath, 60);
        if (error) {
          console.error("Error getting file URL:", error.message);
          setError(`Error getting file URL: ${error.message}`);
        } else if (data) {
          setPreviewUrl(data.signedUrl);
        }
      } catch (e) {
        console.error("Unexpected error getting file URL:", e);
        setError(`Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setLoading(false);
      }
    }
    getFileUrl();
  }, [filePath]);


  if (loading) {
    return (
      <Card>
        <CardBody>
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-md"
          />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!previewUrl) {
    return <div>Failed to load preview.</div>;
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
          <iframe src={previewUrl} width="100%" height="500px" title="PDF Preview" />
        </CardBody>
      </Card>
    );
  }

  if (fileType.startsWith("video/")) {
    return (
      <Card>
        <CardBody>
          <video src={previewUrl} controls width="100%" height="auto">
            Your browser does not support the video tag.
          </video>
        </CardBody>
      </Card>
    );
  }

  if (fileType.startsWith("audio/")) {
    return (
      <Card>
        <CardBody>
          <audio src={previewUrl} controls>
            Your browser does not support the audio tag.
          </audio>
        </CardBody>
      </Card>
    );
  }

  return <div>Preview not available for this file type.</div>;
}