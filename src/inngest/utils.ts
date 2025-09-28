import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  // Logic to retrieve the sandbox URL based on the sandboxId
  // This is a placeholder implementation; replace it with actual logic
  const sandbox = await Sandbox.connect(sandboxId);

  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageContent = result.output.findLastIndex(
    (msg) => msg.role === "assistant" && msg.type === "text"
  );

  const message = result.output[lastAssistantTextMessageContent] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}
