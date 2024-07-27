import { Button } from "@nextui-org/react";
import { Download, Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FileActionsProps = {
  filePath: string;
  fileName: string;
  onDelete: () => void;
};

export default function FileActions({
  filePath,
  fileName,
  onDelete,
}: FileActionsProps) {
  const handleDownload = async () => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.storage
        .from("Public")
        .download(filePath);
      if (error) {
        console.error("Error getting file URL:", (error as any).message, (error as any).details, (error as any).hint);
        alert(`Error downloading file: ${error.message}`);
      } else if (data) {
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Unexpected error during download:", e);
      alert(`Unexpected error during download: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDelete = async () => {
    const supabase = createClient();
    try {
      const { error } = await supabase.storage.from("Public").remove([filePath]);
      if (error) {
        console.error("Error getting file URL:", (error as any).message, (error as any).details, (error as any).hint);
        alert(`Error deleting file: ${error.message}`);
      } else {
        console.log("File deleted successfully");
        onDelete();
      }
    } catch (e) {
      console.error("Unexpected error during delete:", e);
      alert(`Unexpected error during delete: ${e instanceof Error ? e.message : String(e)}`);
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