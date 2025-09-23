"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();

  const invoke = useMutation({
    ...trpc.invoke.mutationOptions({}),
    onSuccess: (data) => {
      // Success toast
      toast.success("Background Job Completed! 🎉", {
        description: `Job processed successfully for: "${value}"`,
        duration: 4000,
      });
      // Clear input after success
      setValue("");
    },
    onError: (error) => {
      // Error toast
      toast.error("Background Job Failed! ❌", {
        description: error.message || "Something went wrong with the job",
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => invoke.mutate({ value: value }),
        },
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

    invoke.mutate({ value: value });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="space-y-4">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter text for background processing..."
          disabled={invoke.isPending}
        />
        <Button
          onClick={handleInvoke}
          className="cursor-pointer"
          disabled={invoke.isPending}
        >
          {invoke.isPending ? "Processing..." : "Invoke Background Job"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
