"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileActions({
  file,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Download button */}
      {!file.isTrash && !file.isFolder && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(file)}
          className="min-w-0 px-2"
        >
          <Download className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}

      {/* Star / Unstar button */}
      {!file.isTrash && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStar(file.id)}
          className="min-w-0 px-2"
        >
          <Star
            className={`h-4 w-4 mr-1 ${
              file.isStarred
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
          <span className="hidden sm:inline">
            {file.isStarred ? "Unstar" : "Star"}
          </span>
        </Button>
      )}

      {/* Trash or Restore button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onTrash(file.id)}
        className="min-w-0 px-2"
      >
        {file.isTrash ? (
          <ArrowUpFromLine className="h-4 w-4 mr-1" />
        ) : (
          <Trash className="h-4 w-4 mr-1" />
        )}
        <span className="hidden sm:inline">
          {file.isTrash ? "Restore" : "Delete"}
        </span>
      </Button>

      {/* Permanently Delete button */}
      {file.isTrash && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(file)}
          className="min-w-0 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      )}
    </div>
  );
}
