import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { createClient } from "@/lib/supabase/client";
import { FileObject } from "@supabase/storage-js";
import SkeletonList from "./SkeletonList";

interface ExtendedFileObject extends FileObject {
  size: number;
  type: string;
  fullPath: string;
}

interface FileListProps {
  folder: string;
  searchQuery: string;
  onFileSelect: (file: { id: string; type: string; path: string }) => void;
  renderActions: (
    file: ExtendedFileObject,
    refreshFiles: () => void
  ) => React.ReactNode;
  refreshTrigger: number;
}

export default function FileList({
  folder,
  searchQuery,
  onFileSelect,
  renderActions,
  refreshTrigger,
}: FileListProps) {
  const [files, setFiles] = useState<ExtendedFileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("Public").list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      console.error("Error fetching files:", error);
    } else if (data) {
      const extendedData: ExtendedFileObject[] = data.map((file) => ({
        ...file,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || "unknown",
        fullPath: `${folder ? folder + "/" : ""}${file.name}`,
      }));
      setFiles(extendedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, supabase, refreshTrigger]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) {
    return <SkeletonList />;
  }
  const formatFileSize = (bytes: number): string => {
    if (isNaN(bytes) || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Table aria-label="File list">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Size</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {filteredFiles.map((file) => (
          <TableRow
            key={file.id}
            onClick={() =>
              onFileSelect({
                id: file.id,
                type: file.type,
                path: file.fullPath,
              })
            }
          >
            <TableCell>{file.name}</TableCell>
            <TableCell>{formatFileSize(file.size)}</TableCell>
            <TableCell>{file.type}</TableCell>
            <TableCell>{renderActions(file, fetchFiles)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
