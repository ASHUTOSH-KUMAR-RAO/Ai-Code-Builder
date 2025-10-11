"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Loader2, FolderOpen } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery(trpc.projects.getMany.queryOptions());

  if (!user) return null;

  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-6 sm:p-8 border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {user?.firstName}&apos;s Innovations
        </h2>
        {projects && projects.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-sm text-destructive">
            Failed to load projects. Please try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium">No projects yet</p>
            <p className="text-sm text-muted-foreground">
              Start creating your first innovation
            </p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && !error && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Button
              variant="outline"
              key={project.id}
              className="font-normal h-auto justify-start w-full text-start p-4 hover:bg-accent hover:shadow-md transition-all duration-200"
              asChild
            >
              <Link href={`/projects/${project.id}`}>
                <div className="flex items-center gap-x-4 w-full">
                  <div className="flex-shrink-0">
                    <Image
                      src="/innovate.svg"
                      alt="innovate"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1 min-w-0 flex-1">
                    <h3 className="truncate font-medium text-base">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Updated{" "}
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
