"use client";

import { File, Star, Trash } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { File as FileType } from "@/lib/db/schema";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  const visibleFilesCount = files.filter((file) => !file.isTrash).length;

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full overflow-x-auto"
    >
      <TabsList className="gap-2 sm:gap-4 md:gap-6 flex-nowrap min-w-full">
        <TabsTrigger
          value="all"
          className="flex items-center gap-2 sm:gap-3 py-2 whitespace-nowrap"
        >
          <File className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">All Files</span>
          <Badge variant="outline">{visibleFilesCount}</Badge>
        </TabsTrigger>

        <TabsTrigger
          value="starred"
          className="flex items-center gap-2 sm:gap-3 py-2 whitespace-nowrap"
        >
          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Starred</span>
          <Badge variant="secondary">{starredCount}</Badge>
        </TabsTrigger>

        <TabsTrigger
          value="trash"
          className="flex items-center gap-2 sm:gap-3 py-2 whitespace-nowrap"
        >
          <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Trash</span>
          <Badge variant="destructive">{trashCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
