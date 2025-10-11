import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragments: true,
        },
      });
      return messages;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt cannot be empty" })
          .max(5000, { message: "Prompt is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if project exists, if not create it
        let project = await prisma.project.findUnique({
          where: {
            id: input.projectId,
            userId: ctx.auth.userId, // ✅ Ownership check
          },
        });

        if (!project) {
          console.log(
            "Project not found, creating new project with ID:",
            input.projectId
          );
          project = await prisma.project.create({
            data: {
              id: input.projectId,
              name: `Project ${new Date().toLocaleDateString()}`,
              userId: ctx.auth.userId, // ✅ FIX: userId add kiya!
            },
          });
          console.log("Project created successfully:", project.id);
        } else {
          console.log("Project found:", project.id);
        }

        // Create user message with validated projectId
        const createdMessage = await prisma.message.create({
          data: {
            content: input.value,
            role: "USER",
            type: "RESULT",
            project: {
              connect: { id: project.id },
            },
          },
        });

        console.log("Message created successfully:", createdMessage.id);

        // Send event to Inngest with projectId inside data
        await inngest.send({
          name: "code-agent/run",
          data: {
            value: input.value,
            projectId: project.id,
            projectName: project.name,
          },
        });

        console.log("Inngest event sent successfully");

        return createdMessage;
      } catch (error) {
        console.error("Error in message.create mutation:", error);
        throw new Error(
          `Failed to create message: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});
