// src/components/FolderNavigation.tsx
import { useState } from 'react';
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import { Folder } from "lucide-react";

type FolderNavigationProps = {
  onNavigate: (path: string) => void;
};

export default function FolderNavigation({ onNavigate }: FolderNavigationProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const handleNavigate = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    onNavigate(newPath.join('/'));
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button isIconOnly color="primary" aria-label="Root" onClick={() => handleNavigate(-1)}>
        <Folder />
      </Button>
      <Breadcrumbs>
        {currentPath.map((folder, index) => (
          <BreadcrumbItem key={index} onClick={() => handleNavigate(index)}>
            {folder}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}