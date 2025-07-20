"use client";

import { ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
}: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm overflow-x-auto pb-2">
      {/* Go Up Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={navigateUp}
        disabled={folderPath.length === 0}
        className="p-2 h-8 w-8"
      >
        <ArrowUpFromLine className="h-4 w-4" />
      </Button>

      {/* Home Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={`px-3 h-8 ${folderPath.length === 0 ? "font-semibold" : ""}`}
      >
        Home
      </Button>

      {/* Folder Breadcrumbs */}
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <span className="mx-1 text-muted-foreground">/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPathFolder(index)}
            className={`px-3 h-8 truncate max-w-[150px] ${
              index === folderPath.length - 1 ? "font-semibold" : ""
            }`}
            title={folder.name}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
