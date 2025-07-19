"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, PawPrint, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CornerPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute bottom-16 right-0 w-72 p-4 rounded-xl shadow-xl bg-background border border-border space-y-3",
              "md:bottom-[4.5rem]"
            )}
          >
            <div className="text-sm leading-relaxed text-muted-foreground">
              We’re building this in public. New features dropping soon! 🚀
            </div>

            <Link
              href="https://github.com/VA5UDEV/DropZone"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
                <span className="text-sm">Repo Link</span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground pt-2">
              Your contributions matter.
            </p>

            <div className="flex justify-end">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Button */}
      <div
        className={cn(
          "w-14 h-14 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md border border-border transition-transform",
          "bg-background text-foreground"
        )}
      >
        <PawPrint className="w-6 h-6" />
      </div>
    </div>
  );
}
