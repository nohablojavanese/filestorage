// src/components/FileActions.tsx
import { Button } from "@nextui-org/react";
import { Download, Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FileActionsProps = {
  fileId: string;
  fileName: string;
  onDelete: () => void;
};

export default function FileActions({
  fileId,
  fileName,
  onDelete,
}: FileActionsProps) {
  const supabase = createClient();

  const handleDownload = async () => {
    const { data, error } = await supabase.storage
      .from("Public")
      .download(fileId);
    if (error) {
      console.error("Error downloading file:", error);
    } else if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.storage.from("Public").remove([fileId]);
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      onDelete();
    }
  };

  return (
    <>
      <Button
        isIconOnly
        color="primary"
        aria-label="Download"
        onClick={handleDownload}
      >
        <Download />
      </Button>
      <Button
        isIconOnly
        color="danger"
        aria-label="Delete"
        onClick={handleDelete}
      >
        <Trash />
      </Button>
    </>
  );
}
