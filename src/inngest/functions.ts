import {
  createAgent,
  createNetwork,
  createTool,
  gemini,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";

// Type compatibility fix - Force the Zod schema to be compatible
const createCompatibleZodSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema as any; // Type assertion to bypass compatibility issues
};

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("create-sandbox", async () => {
      const sandbox = await Sandbox.create("innovate-nextjs-test-2");
      return sandbox.sandboxId;
    });

    try {
      const codeWriterAgent = createAgent({
        name: "Code writer",
        system:
          "You are an expert TypeScript programmer. Given a set of asks, you think step-by-step to plan clean, " +
          "idiomatic TypeScript code, with comments and tests as necessary. " +
          "Do not respond with anything else other than the following XML tags: " +
          "- If you would like to write code, add all code within the following tags (replace $filename and $contents appropriately): " +
          "  <file name='$filename.ts'>$contents</file>",
        model: gemini({ model: "gemini-1.5-flash" }),
        tools: [
          createTool({
            name: "terminal",
            description: "Run terminal commands in a sandboxed environment",
            parameters: createCompatibleZodSchema(
              z.object({
                command: z.string().min(1, "Command cannot be empty"),
              })
            ),
            handler: async ({ command }, { step }) => {
              return await step?.run("run-command", async () => {
                const buffers = { stdout: "", stderr: "" };

                try {
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    onStdout: (data: string) => {
                      buffers.stdout += data;
                    },
                    onStderr: (data: string) => {
                      buffers.stderr += data;
                    },
                  });

                  return {
                    success: true,
                    stdout: result.stdout || buffers.stdout,
                    stderr: result.stderr || buffers.stderr,
                    exitCode: result.exitCode || 0,
                  };
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : String(error);
                  console.error(`Command execution failed: ${errorMessage}`);

                  return {
                    success: false,
                    stdout: buffers.stdout,
                    stderr: buffers.stderr,
                    error: errorMessage,
                    exitCode: -1,
                  };
                }
              });
            },
          }),

          createTool({
            name: "createOrUpdateFiles",
            description: "Create or update files in the sandboxed environment",
            parameters: createCompatibleZodSchema(
              z.object({
                files: z
                  .array(
                    z.object({
                      path: z.string().min(1, "File path cannot be empty"),
                      content: z.string(),
                    })
                  )
                  .min(1, "At least one file is required"),
              })
            ),
            handler: async ({ files }, { step, network }) => {
              return await step?.run("create-or-update-files", async () => {
                try {
                  const updatedFiles = network?.state?.data?.files || {};
                  const sandbox = await getSandbox(sandboxId);

                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return {
                    success: true,
                    updatedFiles,
                    message: `Processed ${files.length} file(s)`,
                  };
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : String(error);
                  console.error(`File operations failed: ${errorMessage}`);

                  return {
                    success: false,
                    error: errorMessage,
                    message: "Failed to process files",
                  };
                }
              });
            },
          }),

          createTool({
            name: "readFile",
            description: "Read files from the sandboxed environment",
            parameters: createCompatibleZodSchema(
              z.object({
                files: z.array(z.string().min(1, "File path cannot be empty")),
              })
            ),
            handler: async ({ files }, { step }) => {
              return await step?.run("read-files", async () => {
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const contents: Record<string, string> = {};

                  // Read multiple files
                  for (const filePath of files) {
                    try {
                      const content = await sandbox.files.read(filePath);
                      contents[filePath] = content;
                    } catch (fileError) {
                      console.warn(
                        `Could not read file ${filePath}:`,
                        fileError
                      );
                      contents[filePath] = `Error reading file: ${fileError}`;
                    }
                  }

                  return {
                    success: true,
                    contents,
                    message: `Read ${files.length} file(s)`,
                  };
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : String(error);
                  console.error(`Read files failed: ${errorMessage}`);

                  return {
                    success: false,
                    error: errorMessage,
                    message: `Failed to read files: ${files.join(", ")}`,
                  };
                }
              });
            },
          }),
        ],

        lifecycle: {
          onResponse: async ({ result, network }) => {
            const lastAssistantMessageText =
              lastAssistantTextMessageContent(result);

            if (lastAssistantMessageText && network) {
              if (lastAssistantMessageText.includes("<file")) {
                network.state.data.summary = lastAssistantMessageText;
              }
            }

            return result;
          },
        },
      });

      const network = createNetwork({
        name: "coding-agent-network",
        agents: [codeWriterAgent],
        maxIter: 15,
        router: async ({ network }) => {
          // Simple router that always selects the first agent
          const summary = network.state.data.summary;
          if (summary) {
            // If we have a summary, we might want to continue or stop
            // For now, let's return undefined to stop iteration
            return undefined;
          }
          return codeWriterAgent;
        },
      });

      if (!event.data?.value) {
        throw new Error("Missing required 'value' in event data");
      }

      const result = await network.run(event.data.value);

      return {
        success: true,
        sandboxId,
        result,
        message: "Code generation completed successfully",
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.summary,
      };
    } catch (error) {
      console.error("Function execution failed:", error);

      // Cleanup sandbox on error
      try {
        const sandbox = await getSandbox(sandboxId);
        await sandbox.kill();
      } catch (cleanupError) {
        console.error("Failed to cleanup sandbox:", cleanupError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        sandboxId,
      };
    }
  }
);

// ! Basically hum yehi apne inngest developer server ko manage krte hai jaise yeha per line number 8 mein likha hai n 1s yedi hum 3s likh de to humko response inngest 3s baad dega to ye iska fayeda hota hai ,isiliye ye one of the best and trending tool in terms of Background jobs ke liye dekha jaye to ,aur ye raha iska docs yehi se saab kuch kr sekte ho https://www.inngest.com/docs

// ? Aur Pta hai ye isiliye market mein one of the best background job purpose ke liye tool hai n kyuki bahut time hum galti se tab close kr dete hai n then network connection lost ho jata hai but isme aisa nhi hota hai aab network connection lost ho jayega phir bhi aap content ko load kr sekte ho abhut easly way mein that's great features
