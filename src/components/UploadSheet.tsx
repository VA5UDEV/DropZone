"use client";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import FileUploadForm from "@/components/FileUploadForm";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add or Upload</SheetTitle>
          <SheetDescription>
            Add a folder or upload a file(image)
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {/* <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div> */}
          <FileUploadForm onUploadSuccess={() => {}} />
        </div>
        <SheetFooter>
          {/* <Button type="submit">Save changes</Button> */}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
