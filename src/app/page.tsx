// src/app/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react'
import { createClient } from '@/lib/supabase/client'
import FileList from '@/components/FileList'
import FilePreview from '@/components/FilePreview'
import FileActions from '@/components/FileActions'
import FolderNavigation from '@/components/FolderNavigation'
import SearchBar from '@/components/SearchBar'
import ShareLink from '@/components/ShareLink'

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [currentFolder, setCurrentFolder] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<{ id: string; type: string } | null>(null)
  const supabase = createClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setUploadStatus(null)
    for (const file of acceptedFiles) {
      try {
        const { data, error } = await supabase.storage
          .from('Public')
          .upload(`${currentFolder}/${Date.now()}-${file.name}`, file)

        if (error) {
          console.error('Error uploading file:', error)
          setUploadStatus(`Error uploading ${file.name}: ${error.message}`)
        } else {
          console.log('File uploaded successfully:', data)
          setUploadStatus(`${file.name} uploaded successfully`)
        }
      } catch (e) {
        console.error('Unexpected error during upload:', e)
        setUploadStatus(`Unexpected error uploading ${file.name}`)
      }
    }
    setUploading(false)
  }, [supabase.storage, currentFolder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">File Drop Storage</h1>
          <SearchBar onSearch={setSearchQuery} />
        </CardHeader>
        <CardBody>
          <FolderNavigation onNavigate={setCurrentFolder} />
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
            )}
          </div>
          {uploadStatus && (
            <p className={`mt-4 text-center ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {uploadStatus}
            </p>
          )}
          <FileList
            folder={currentFolder}
            searchQuery={searchQuery}
            onFileSelect={setSelectedFile}
            renderActions={(file) => (
              <>
                <FileActions
                  fileId={file.id}
                  fileName={file.name}
                  onDelete={() => {
                    // Refresh file list
                    setSelectedFile(null)
                  }}
                />
                <ShareLink fileId={file.id} />
              </>
            )}
          />
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button color="primary" isLoading={uploading}>
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </CardFooter>
      </Card>
      {selectedFile && (
        <Card className="w-full max-w-4xl mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold">File Preview</h2>
          </CardHeader>
          <CardBody>
            <FilePreview fileId={selectedFile.id} fileType={selectedFile.type} />
          </CardBody>
        </Card>
      )}
    </main>
  )
}