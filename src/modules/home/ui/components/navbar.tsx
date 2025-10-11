"use client";

import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { UserControll } from "./user-controll";

export const Navbar = () => {
  return (
    <nav className="p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-transparent backdrop-blur-xl border-b border-white/10"></div>

      <div className="max-w-5xl mx-auto w-full flex justify-between items-center relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
            <Image src="/innovate.svg" alt="innovate" width={20} height={20} />
          </div>
          <span className="font-semibold text-lg text-gray-100 group-hover:text-white transition-colors">
            Innovate
          </span>
        </Link>

        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-300"
              >
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button
                size="sm"
                className="bg-white/90 text-gray-900 hover:bg-white shadow-lg shadow-white/20 transition-all duration-300"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <UserControll showName />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};
