import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/lib/action';

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshFiles = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setUploadStatus(null);
      for (const file of acceptedFiles) {
        try {
          const data = await uploadFile(file, currentFolder);
          console.log('File uploaded successfully:', data);
          setUploadStatus(`${file.name} uploaded successfully`);
        } catch (error) {
          console.error('Error uploading file:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          setUploadStatus(`Error uploading ${file.name}: ${errorMessage}`);
        }
      }
      setUploading(false);
      refreshFiles();
    },
    [currentFolder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return {
    uploading,
    uploadStatus,
    getRootProps,
    getInputProps,
    isDragActive,
    setCurrentFolder,
  };
}
