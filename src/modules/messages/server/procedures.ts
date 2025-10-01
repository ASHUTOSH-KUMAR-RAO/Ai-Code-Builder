import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        updatedAt: "asc",
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
          projectId: z.string().min(1, { message: "Project  ID is required" })
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          createdAt: new Date(),
          updatedAt: new Date(),
          project: {
            // Replace 'projectId' with the actual project ID you want to associate
            connect: { id: "projectId" }
          },
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: { value: input.value },
        projectId : input.projectId
      });

      return createdMessage;
    }),
});
