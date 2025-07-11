"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle as ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
// import { ClerkAuthDialog } from '@/components/ui/clerk-auth-dialog';


export default function HeroSection() {
  return (
    <section className="w-full bg-background py-24 md:py-32">
      <Navbar />
      <div className="container mx-auto pt-80 px-4 text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">DropZone</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          The fastest and simplest way to share your files — no login = no
          limits.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/upload">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          {/* <Link
            href="/about"
            className="text-sm underline text-muted-foreground hover:text-primary"
          >
            Learn how it works
          </Link> */}
        </div>
      </div>
    </section>
  );
}

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-lg font-bold">
          DropZone
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <SignedOut>
            {/* <ClerkAuthDialog type="sign-in" triggerLabel="Sign In" />
            <ClerkAuthDialog type="sign-up" triggerLabel="Sign Up" /> */}
            <SignInButton mode="modal">Login</SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
