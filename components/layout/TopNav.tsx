"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Button variant={"ghost"} asChild>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mail className="h-5 w-5" />
            {appName}
          </Link>
        </Button>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/#subscribe"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Subscribe
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
