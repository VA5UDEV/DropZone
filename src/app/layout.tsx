import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/ThemeProvider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { CornerPopover } from "@/components/CornerPopover";

export const metadata: Metadata = {
  title: "DropZone",
  description: "Media Sharing App",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
        <html lang="en" suppressHydrationWarning>
          <body className="antialiased bg-background text-foreground">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>
                <main>
                {children}
                <CornerPopover />
                </main>
                <Toaster />
              </Providers>
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
