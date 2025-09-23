import { createAgent,gemini } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      const codeWriterAgent = createAgent({
        name: "Code writer",
        system:
          "You are an expert TypeScript programmer. Given a set of asks, you think step-by-step to plan clean, " +
          "idiomatic TypeScript code, with comments and tests as necessary." +
          "Do not respond with anything else other than the following XML tags:" +
          "- If you would like to write code, add all code within the following tags (replace $filename and $contents appropriately):" +
          "  <file name='$filename.ts'>$contents</file>",
        model: gemini({ model: "gemini-1.5-flash" }), // ✅ Fixed model config
      });

      const { output } = await step.run("code-writer", async () => {
        return await codeWriterAgent.run(
          `Write a typescript function that removes unnecessary whitespace from: ${event.data.value}`
        );
      });

      console.log("Generated code:", output);

      return {
        success: true,
        generatedCode: output,
      };
    } catch (error) {
      console.error("Agent failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
);

// ! Basically hum yehi apne inngest developer server ko manage krte hai jaise yeha per line number 8 mein likha hai n 1s yedi hum 3s likh de to humko response inngest 3s baad dega to ye iska fayeda hota hai ,isiliye ye one of the best and trending tool in terms of Background jobs ke liye dekha jaye to ,aur ye raha iska docs yehi se saab kuch kr sekte ho https://www.inngest.com/docs

// ? Aur Pta hai ye isiliye market mein one of the best background job purpose ke liye tool hai n kyuki bahut time hum galti se tab close kr dete hai n then network connection lost ho jata hai but isme aisa nhi hota hai aab network connection lost ho jayega phir bhi aap content ko load kr sekte ho abhut easly way mein that's great features
