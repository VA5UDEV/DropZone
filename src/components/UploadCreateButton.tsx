"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FolderPlus, FilePlus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DropboxUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    console.log("Dropped files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
  });

  const handleUploadClick = () => fileInputRef.current?.click();

  // const [folderDialogOpen, setFolderDialogOpen] = useState(false);


  return (
    <div
      {...getRootProps()}
      className={cn(
        "min-h-screen relative bg-transparent p-6",
        isDragActive && "bg-black/5 border-4 border-dashed border-violet-500"
      )}
    >
      {/* Hidden input for manual file upload */}
      <input {...getInputProps()} />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => {
          const newFiles = Array.from(e.target.files || []);
          setFiles((prev) => [...prev, ...newFiles]);
        }}
      />

      <div className="flex flex-row space-x-6">
        {/* Upload Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="flex flex-col items-center justify-center h-28 w-28 p-4 gap-2 rounded-xl border-2 transition-all hover:border-muted-foreground"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <UploadCloud className="w-6 h-6" />
              </motion.div>
              <span className="text-sm font-semibold">Upload or Drop</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 text-left">
            <DropdownMenuItem onClick={handleUploadClick}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload files
            </DropdownMenuItem>
            <DropdownMenuItem disabled onClick={() => alert("Create folder")}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New folder
            </DropdownMenuItem>
            <DropdownMenuItem disabled onClick={() => alert("Create doc")}>
              <FilePlus className="mr-2 h-4 w-4" />
              New doc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Create Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="flex flex-col items-center justify-center h-28 w-28 p-4 gap-2 rounded-xl border-2 transition-all hover:border-muted-foreground"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-semibold">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 text-left">
            <DropdownMenuItem onClick={() => alert("Create folder")}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New folder
            </DropdownMenuItem>
            <DropdownMenuItem disabled onClick={() => alert("Create doc")}>
              <FilePlus className="mr-2 h-4 w-4" />
              New doc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* File Preview Section */}
      {files.length > 0 && (
        <Card className="mt-10 max-w-xl mx-auto p-4">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul className="text-sm list-disc list-inside text-muted-foreground">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
