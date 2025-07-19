"use client";

// import FileList from "@/components/FileList";
import { useUser } from "@clerk/nextjs";
import UploadSheet from "@/components/UploadSheet";

export default function Page() {
  const { user } = useUser();

  if (!user?.id) {
    return null;
  }
  return (
    <div className="flex w-full p-6 gap-6">
      <UploadSheet />
      {/* <FileList userId={user.id} /> */}
    </div>
  );
}
