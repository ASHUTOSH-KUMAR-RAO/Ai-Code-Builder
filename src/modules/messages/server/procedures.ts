import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
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

  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt cannot be empty" })
          .max(5000, { message: "Prompt is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if project exists, if not create it
        let project = await prisma.project.findUnique({
          where: { id: input.projectId },
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
