import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Prompt cannot be empty" }).max(5000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
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

      await inngest.send({
        name: "code-agent/run",
        data: { value: input.value },
      });

      return createdProject;
    }),
});
