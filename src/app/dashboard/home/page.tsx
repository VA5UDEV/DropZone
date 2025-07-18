"use client";

// import DropboxUploader from "@/components/UploadCreateButton";
import FileUploadForm from "@/components/FileUploadForm";
// import FileList from "@/components/FileList";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user } = useUser();

  if (!user?.id) {
    return null;
  }
  return (
    <div className="flex w-full p-6">
      {/* <DropboxUploader /> */}
      <FileUploadForm onUploadSuccess={() => {}} />
      {/* <FileList userId={user.id} /> */}
    </div>
  );
}
