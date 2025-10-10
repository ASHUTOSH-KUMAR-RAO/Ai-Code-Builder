"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUp, Loader2Icon, Sparkles, Wand2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value Is Required" })
    .max(1000, { message: "Value is Too Long" }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        toast.success("Project created successfully! 🎉");
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create project");
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const onSelect = (prompt: string, title: string) => {
    setSelectedTemplate(title);
    form.setValue("value", prompt, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });

    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      textarea?.focus();
    }, 100);
  };

  const onClear = () => {
    form.reset();
    setSelectedTemplate(null);
  };

  const isPending = createProject.isPending;
  const isDisable = isPending || !form.formState.isValid;
  const charCount = form.watch("value")?.length || 0;
  const isNearLimit = charCount > 800;
  const isCriticalLimit = charCount > 950;

  return (
    <Form {...form}>
      <section className="space-y-8 w-full max-w-5xl mx-auto px-4">
        {/* Header with smooth gradient */}
        <div className="text-center space-y-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent leading-tight tracking-tight">
            What would you like to build?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
            Describe your vision or start with a template ✨
          </p>
        </div>

        {/* Main Form with glassmorphism */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl transition-all duration-500",
              "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl",
              "border border-gray-200/50 dark:border-gray-700/50",
              isFocused &&
                "shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 border-gray-300 dark:border-gray-600 scale-[1.01]",
              !isFocused &&
                isHovered &&
                "shadow-xl shadow-gray-200/50 dark:shadow-gray-800/50 border-gray-300/70 dark:border-gray-600/70",
              !isFocused && !isHovered && "shadow-lg"
            )}
          >
            {/* Animated background gradient */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none",
                isFocused && "opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
            </div>

            <div className="relative p-6 space-y-4">
              {/* Selected Template Badge */}
              {selectedTemplate && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/60 dark:border-blue-800/60 backdrop-blur-sm">
                    <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      {selectedTemplate}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="h-7 w-7 p-0 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              )}

              {/* Textarea */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <TextAreaAutosize
                    disabled={isPending}
                    {...field}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    minRows={4}
                    maxRows={12}
                    className={cn(
                      "w-full resize-none border-none outline-none bg-transparent text-base md:text-lg leading-relaxed transition-all duration-300",
                      "text-gray-900 dark:text-gray-100",
                      "placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:transition-colors",
                      isFocused &&
                        "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    )}
                    placeholder="Describe your dream project in detail... 🚀"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                      }
                    }}
                  />
                )}
              />

              {/* Footer */}
              <div className="flex gap-x-3 items-center justify-between pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Keyboard shortcut */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <kbd className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                      <span className="text-xs">⌘</span>
                      <span>K</span>
                    </kbd>
                    <span className="hidden sm:inline">to submit</span>
                  </div>

                  {/* Character count with color states */}
                  <div
                    className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-300",
                      isCriticalLimit &&
                        "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 animate-pulse",
                      isNearLimit &&
                        !isCriticalLimit &&
                        "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
                      !isNearLimit &&
                        "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {charCount}/1000
                  </div>
                </div>

                {/* Submit button with ripple effect */}
                <Button
                  disabled={isDisable}
                  size="icon"
                  type="submit"
                  className={cn(
                    "size-11 rounded-full transition-all duration-300 relative overflow-hidden group",
                    isDisable
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 shadow-lg hover:shadow-2xl hover:shadow-gray-900/30 dark:hover:shadow-gray-100/30 hover:scale-110 active:scale-95"
                  )}
                >
                  {isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <>
                      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-1" />
                      {!isDisable && (
                        <span className="absolute inset-0 rounded-full bg-white/30 dark:bg-black/30 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                      )}
                    </>
                  )}
                </Button>
              </div>

              {/* Form errors with smooth animation */}
              {form.formState.errors.value && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900">
                    <span className="size-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
                    {form.formState.errors.value.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Templates Section with staggered animations */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center gap-2.5 justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <Wand2 className="size-3.5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
                Quick Start
              </h3>
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROJECT_TEMPLATES.map((template, index) => (
              <Button
                key={template.title}
                variant="outline"
                size="sm"
                onClick={() => onSelect(template.prompt, template.title)}
                disabled={isPending}
                className={cn(
                  "h-auto py-4 px-4 flex flex-col items-start gap-2 transition-all duration-300 group relative overflow-hidden",
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl hover:scale-105 hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600",
                  "active:scale-95 active:translate-y-0",
                  selectedTemplate === template.title &&
                    "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-lg",
                  "animate-in fade-in zoom-in-95 duration-500"
                )}
                style={{
                  animationDelay: `${index * 40}ms`,
                }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

                <span className="text-2xl transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 relative z-10">
                  {template.emoji}
                </span>
                <span className="text-xs font-semibold text-left text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors relative z-10 leading-tight">
                  {template.title.replace("Build ", "")}
                </span>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Button>
            ))}
          </div>
        </div>
      </section>
    </Form>
  );
};
