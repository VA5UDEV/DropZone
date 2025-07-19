// /app/images/page.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import List from "@/components/List";

export default function ImagesPage() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="p-6">
      <List userId={user.id} mode="images" />
    </div>
  );
}
