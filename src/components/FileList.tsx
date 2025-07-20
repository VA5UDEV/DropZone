"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Folder, Star, Trash, X, ExternalLink } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import ConfirmationModal from "@/components/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;
      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error Loading Files", {
        description: "We couldn't load your files. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder, fetchFiles]);

  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((f) => f.isStarred && !f.isTrash);
      case "trash":
        return files.filter((f) => f.isTrash);
      default:
        return files.filter((f) => !f.isTrash);
    }
  }, [files, activeTab]);

  const trashCount = useMemo(
    () => files.filter((f) => f.isTrash).length,
    [files]
  );
  const starredCount = useMemo(
    () => files.filter((f) => f.isStarred && !f.isTrash).length,
    [files]
  );

  const handleStarFile = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
        )
      );
      const file = files.find((f) => f.id === fileId);
      toast.success(
        file?.isStarred ? "Removed from Starred" : "Added to Starred",
        {
          description: `"${file?.name}" has been ${
            file?.isStarred ? "removed from" : "added to"
          } starred.`,
        }
      );
    } catch (err) {
      toast.error("Action Failed", {
        description: "Couldn't update star status.",
      });
      console.error(err);
    }
  };

  const handleTrashFile = async (fileId: string) => {
    try {
      const { data } = await axios.patch(`/api/files/${fileId}/trash`);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, isTrash: !f.isTrash } : f))
      );
      const file = files.find((f) => f.id === fileId);
      toast.success(data.isTrash ? "Moved to Trash" : "Restored", {
        description: `"${file?.name}" has been ${
          data.isTrash ? "trashed" : "restored"
        }`,
      });
    } catch {
      toast.error("Action Failed", {
        description: "Couldn't update file status.",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const file = files.find((f) => f.id === fileId);
      const res = await axios.delete(`/api/files/${fileId}/delete`);
      if (res.data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast.success("File Deleted", {
          description: `"${file?.name}" was permanently deleted.`,
        });
        setDeleteModalOpen(false);
      }
    } catch {
      toast.error("Deletion Failed", { description: "Try again later." });
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      toast("Preparing Download", {
        description: `Getting "${file.name}" ready...`,
      });
      const url = file.type.startsWith("image/")
        ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`
        : file.fileUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success("Download Ready", {
        description: `"${file.name}" is ready.`,
      });
    } catch {
      toast.error("Download Failed", { description: "Try again later." });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);
      setFiles(files.filter((file) => !file.isTrash));
      toast.success("Trash Emptied", {
        description: `All ${trashCount} items have been permanently deleted`,
      });
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      toast.error("Action Failed", {
        description: "We couldn't empty the trash. Please try again later.",
      });
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
    onFolderChange?.(folderId);
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      const newFolderId =
        newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setFolderPath(newPath);
      setCurrentFolder(newFolderId);
      onFolderChange?.(newFolderId);
    }
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);
      onFolderChange?.(null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      setCurrentFolder(newFolderId);
      onFolderChange?.(newFolderId);
    }
  };

  const handleItemClick = (file: FileType) => {
    if (file.isFolder) navigateToFolder(file.id, file.name);
    else if (file.type.startsWith("image/")) openImageViewer(file);
  };

  if (loading) return <FileLoadingState />;

  return (
    <div className="space-y-6">
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />
      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}
      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />
      <div className="border-t border-muted my-4" />
      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Added
                    </TableHead>
                    <TableHead className="w-[240px]">Actions</TableHead>
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
                      onClick={() => handleItemClick(file)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon file={file} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[300px] font-medium">
                                {file.name}
                              </span>
                              <TooltipProvider>
                                {file.isStarred && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Star
                                        className="h-4 w-4 text-yellow-400"
                                        fill="currentColor"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>Starred</TooltipContent>
                                  </Tooltip>
                                )}
                                {file.isFolder && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Folder className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>Folder</TooltipContent>
                                  </Tooltip>
                                )}
                                {file.type.startsWith("image/") && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Click to view image
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {formatDistanceToNow(new Date(file.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {file.isFolder ? "Folder" : file.type}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {file.isFolder
                          ? "-"
                          : file.size < 1024
                          ? `${file.size} B`
                          : file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(file.createdAt), "MMMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <FileActions
                          file={file}
                          onStar={handleStarFile}
                          onTrash={handleTrashFile}
                          onDelete={() => {
                            setSelectedFile(file);
                            setDeleteModalOpen(true);
                          }}
                          onDownload={handleDownloadFile}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description="Are you sure you want to permanently delete this file?"
        icon={X}
        iconColor="text-destructive"
        confirmText="Delete Permanently"
        confirmColor="destructive"
        onConfirm={() => selectedFile && handleDeleteFile(selectedFile.id)}
        isDangerous
        warningMessage={`You are about to permanently delete "${selectedFile?.name}". This cannot be undone.`}
      />

      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description="Are you sure you want to permanently delete all items in your trash?"
        icon={Trash}
        iconColor="text-destructive"
        confirmText="Empty Trash"
        confirmColor="destructive"
        onConfirm={handleEmptyTrash}
        isDangerous
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash. This action cannot be undone.`}
      />
    </div>
  );
}
