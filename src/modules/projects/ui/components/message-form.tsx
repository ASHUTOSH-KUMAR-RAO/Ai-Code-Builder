import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import TextAreaAutosize from "react-textarea-autosize";

import { useState } from "react";

import { z } from "zod";

import { toast } from "sonner";

import { ArrowUp, Loader2Icon } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { Form, FormField } from "@/components/ui/form";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value Is Required" })
    .max(1000, { message: "Value is To Long" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId: data.projectId })
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const isPending = createMessage.isPending;
  const isDisable = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextAreaAutosize
              disabled={isPending}
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none outline-none bg-transparent"
              placeholder="What Would You Like To Build..?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted font-mono px-1.5 text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span> Enter
            </kbd>
            &nbsp; to submit
          </div>
          <Button
            disabled={isDisable}
            className={cn(
              "size-8 rounded-full cursor-pointer",
              isDisable && "bg-muted-foreground border"
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUp />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
