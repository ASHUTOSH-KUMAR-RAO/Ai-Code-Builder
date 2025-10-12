import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is Required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProjects = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProjects) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project Not Found",
        });
      }

      return existingProjects;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt cannot be empty" })
          .max(5000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ✅ FIXED: Proper credits error handling
      try {
        await consumeCredits();
      } catch (error) {
        console.error("Credits consumption error:", error);

        if (error instanceof Error) {
          // Check if it's a credits-related error
          const errorMessage = error.message.toLowerCase();

          if (
            errorMessage.includes("insufficient") ||
            errorMessage.includes("out of credits") ||
            errorMessage.includes("no credits") ||
            error.name === "InsufficientCreditsError"
          ) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message:
                "You have run out of credits. Please purchase more to continue.",
            });
          }

          // Any other technical error
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              error.message || "Failed to process credits. Please try again.",
          });
        }

        // Unknown error type
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      }

      // Create project with initial message
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      });

      // ✅ FIXED: Inngest event mein projectId aur projectName add kiya
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
          projectName: createdProject.name,
        },
      });

      console.log("Project created successfully:", createdProject.id);
      console.log("Inngest event sent successfully");

      return createdProject;
    }),
});
