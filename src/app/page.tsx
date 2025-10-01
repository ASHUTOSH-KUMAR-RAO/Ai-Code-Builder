"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const trpc = useTRPC();

  const createProject = useMutation({
    ...trpc.projects.create.mutationOptions({}),

    onSuccess: (data) => {
      // Dismiss loading toast
      toast.dismiss();

      // Show success toast
      toast.success("Job Completed! ✓", {
        description: `Successfully processed: "${value}"`,
        duration: 3000,
      });

      // Reset input
      setValue("");

      // Navigate after a brief delay to let user see the success message
      setTimeout(() => {
        router.push(`/projects/${data.id}`);
      }, 500);
    },

    onError: (error) => {
      // Dismiss loading toast before showing error
      toast.dismiss();

      // Error toast
      toast.error(error.message || "Something went wrong!", {
        description: error.message || "Something went wrong with the job",
        duration: 5000,
      });
    },
  });

  const handleInvoke = () => {
    if (!value.trim()) {
      toast.warning("Input Required! ⚠️", {
        description: "Please enter some text before invoking the job",
      });
      return;
    }

    // Loading toast
    toast.loading("Processing Background Job...", {
      description: `Working on: "${value}"`,
    });

    // Actually trigger the mutation
    createProject.mutate({ value });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto p-4 flex flex-col items-center gap-y-4 justify-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter text for background processing..."
          disabled={createProject.isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !createProject.isPending) {
              handleInvoke();
            }
          }}
        />
        <Button
          onClick={handleInvoke}
          className="cursor-pointer"
          disabled={createProject.isPending}
        >
          {createProject.isPending ? "Processing..." : "Invoke Background Job"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
