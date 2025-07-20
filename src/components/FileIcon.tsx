"use client";

import { Folder, FileText } from "lucide-react";
import { IKImage } from "imagekitio-next"; // or "imagekitio-next" based on setup
import type { File as FileType } from "@/lib/db/schema";

interface FileIconProps {
  file: FileType;
}

export default function FileIcon({ file }: FileIconProps) {
  if (file.isFolder) {
    return <Folder className="h-5 w-5 text-blue-500" />;
  }

  const fileType = file.type.split("/")[0];

  switch (fileType) {
    case "image":
      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
          <IKImage
            path={file.path}
            transformation={[
              {
                height: 48,
                width: 48,
                focus: "auto",
                quality: 80,
                dpr: 2,
              },
            ]}
            loading="lazy"
            lqip={{ active: true }}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>
      );

    case "application":
      if (file.type.includes("pdf")) {
        return <FileText className="h-5 w-5 text-red-500" />;
      }
      return <FileText className="h-5 w-5 text-orange-500" />;

    case "video":
      return <FileText className="h-5 w-5 text-purple-500" />;

    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
}
