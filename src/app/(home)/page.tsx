"use client"

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full max-h-screen">
      <section className="space-y-8 py-[16vh] 2xl:py-48">
        {/* Logo & Badge */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Image
              src="/innovate.svg"
              alt="Innovate"
              className="hidden md:block"
              width={60}
              height={60}
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl rounded-full -z-10 hidden md:block" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300/50 dark:border-gray-700/50 backdrop-blur-sm">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              AI-Powered Development
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold md:text-6xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent leading-tight">
            Transform Ideas Into Code <br className="hidden md:block" />
            <span className="inline-flex items-center gap-3">
              with Innovate
              <span className="text-4xl md:text-5xl">💡</span>
            </span>
          </h1>

          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto leading-relaxed">
            Build stunning applications and websites through intelligent
            conversations.
            <br className="hidden md:block" />
            <span className="inline-flex items-center gap-2 mt-2">
              Just describe, and watch the magic happen
              <span className="text-lg">🚀</span>
            </span>
          </p>
        </div>

        {/* Features Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <span>⚡</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Lightning Fast
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <span>🎨</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Beautiful Design
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <span>💻</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Production Ready
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto w-full pt-4">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList/>
    </div>
  );
};

export default Page;
