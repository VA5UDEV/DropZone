"use client";

import { useState, useRef } from "react";
import axios from "axios";
import {
  // Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface FileUploadFormProps {
  // userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  // userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const { userId, getToken } = useAuth(); // ✅ get both from Clerk
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(droppedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    const token = await getToken(); // ⬅️ Fetch Clerk token

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId); // ⬅️ still needed for server check
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ⬅️ CRITICAL: send token
        },
        withCredentials: true,
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      toast("Upload Successful", {
        description: `${file.name} uploaded successfully.`,
      });

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess?.();
    } catch {
      setError("Upload failed");
      toast("Upload Failed", {
        description: "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast("Invalid Folder Name", {
        description: "Please enter a folder name.",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId,
        parentId: currentFolder,
      });

      toast("Folder Created", {
        description: `\"${folderName}\" was created.`,
      });

      setFolderDialogOpen(false);
      setFolderName("");
      onUploadSuccess?.();
    } catch {
      toast("Folder Creation Failed", {
        description: "Could not create folder. Please try again.",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDragging && (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none transition-opacity">
        <div className="text-center space-y-2">
          <FileUp className="h-12 w-12 text-primary animate-bounce" />
          <p className="text-lg font-semibold text-muted-foreground">
            Drop file to upload
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setFolderDialogOpen(true)}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
        <Button
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          error
            ? "border-destructive/50 bg-destructive/10"
            : file
            ? "border-primary/50 bg-primary/10"
            : "border-muted hover:border-primary"
        )}
      >
        {!file ? (
          <>
            <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-sm mt-2">
              Drag and drop image here or{" "}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Up to 5MB only</p>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <FileUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            {uploading && (
              <Progress value={progress} className="h-2 bg-muted" />
            )}

            <Button
              className="w-full"
              disabled={!userId || !!error || uploading}
              onClick={handleUpload}
            >
              {uploading ? `Uploading... ${progress}%` : "Upload Image"}
              {!uploading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground bg-muted/10 p-3 rounded-lg">
        <p>• JPG, PNG, GIF, WebP supported</p>
        <p>• Max size: 5MB</p>
        <p>• Private uploads only</p>
      </div>

      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FolderPlus className="h-5 w-5" />
              New Folder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setFolderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || creatingFolder}
            >
              {creatingFolder && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {creatingFolder ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
