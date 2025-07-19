"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { toast } from "sonner";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { formatDistanceToNow, format } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FolderNavigation from "@/components/FolderNavigation";

interface FileListProps {
  userId: string;
  parentId?: string;
  mode?: "folders" | "images" | "all"; // 👈 filter mode
}

export default function List({ userId, mode = "all" }: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;
      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error loading files");
    } finally {
      setLoading(false);
    }
  }, [userId, currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const filteredFiles = useMemo(() => {
    if (mode === "folders") return files.filter((f) => f.isFolder);
    if (mode === "images")
      return files.filter((f) => !f.isFolder && f.type.startsWith("image/"));
    return files;
  }, [files, mode]);

  const handleStar = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
        )
      );
    } catch {
      toast.error("Failed to star/unstar");
    }
  };

  const handleTrash = async (fileId: string) => {
    try {
      const { data } = await axios.patch(`/api/files/${fileId}/trash`);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, isTrash: data.isTrash } : f))
      );
    } catch {
      toast.error("Failed to move to trash");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await axios.delete(`/api/files/${fileId}/delete`);
      if (res.data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast.success("File deleted");
      }
    } catch {
      toast.error("Deletion failed");
    }
  };

  const handleDownload = async (file: FileType) => {
    try {
      const url = file.type.startsWith("image/")
        ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`
        : file.fileUrl;

      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      toast.error("Download failed");
    }
  };

  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      const url = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(url, "_blank");
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
  };

  const navigateUp = () => {
    const newPath = [...folderPath];
    newPath.pop();
    const newFolderId =
      newPath.length > 0 ? newPath[newPath.length - 1].id : null;
    setFolderPath(newPath);
    setCurrentFolder(newFolderId);
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolder(newPath[newPath.length - 1].id);
    }
  };

  if (loading) return <p className="p-4">Loading files...</p>;

  return (
    <div className="space-y-4">
      {mode !== "images" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden sm:table-cell">Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow
                  key={file.id}
                  className={`hover:bg-muted/50 ${
                    file.isFolder || file.type.startsWith("image/")
                      ? "cursor-pointer"
                      : ""
                  }`}
                  onClick={() =>
                    file.isFolder
                      ? navigateToFolder(file.id, file.name)
                      : openImageViewer(file)
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileIcon file={file} />
                      <span className="truncate max-w-[300px] font-medium">
                        {file.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {file.isFolder ? "Folder" : file.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {file.isFolder
                      ? "-"
                      : file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <FileActions
                      file={file}
                      onStar={() => handleStar(file.id)}
                      onTrash={() => handleTrash(file.id)}
                      onDelete={() => handleDelete(file.id)}
                      onDownload={() => handleDownload(file)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
