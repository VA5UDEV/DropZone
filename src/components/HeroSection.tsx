"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle as ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Plasma } from "@/components/Plasma";

export default function HeroSection() {
  return (
    <section className="relative bg-transparent">
      {/* Plasma Background */}
      <div className="absolute inset-0 -z-10">
        <Plasma
          color="#f1f1f1"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background/10" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">DropZone</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Share instantly. No login, no limits.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-lg font-bold">
          DropZone
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
