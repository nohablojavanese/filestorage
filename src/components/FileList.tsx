// src/components/FileList.tsx
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton, User } from "@nextui-org/react";
import { createClient } from '@/lib/supabase/client';
import { File } from "lucide-react";

type FileItem = {
  name: string;
  size: number;
  created_at: string;
  id: string;
  type: string;
};

type FileListProps = {
  folder: string;
  searchQuery: string;
  onFileSelect: (file: { id: string; type: string }) => void;
  renderActions: (file: FileItem) => React.ReactNode;
};

export default function FileList({ folder, searchQuery, onFileSelect, renderActions }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase.storage.from('Public').list(folder);
      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data as unknown as FileItem[]);
      }
      setLoading(false);
    }
    fetchFiles();
  }, [folder, supabase.storage]);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Table aria-label="File list loading skeleton">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SIZE</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-3 w-3/4 rounded-lg"/></TableCell>
              <TableCell><Skeleton className="h-3 w-1/4 rounded-lg"/></TableCell>
              <TableCell><Skeleton className="h-3 w-1/2 rounded-lg"/></TableCell>
              <TableCell><Skeleton className="h-3 w-1/4 rounded-lg"/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table aria-label="File list">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>SIZE</TableColumn>
        <TableColumn>CREATED AT</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {filteredFiles.map((file) => (
          <TableRow key={file.id} onClick={() => onFileSelect({ id: file.id, type: file.type })}>
            <TableCell>
              <User
                avatarProps={{
                  icon: <File size={20} />,
                }}
                name={file.name}
              />
            </TableCell>
            <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
            <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
            <TableCell>{renderActions(file)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}