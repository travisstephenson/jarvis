import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

let client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: env.anthropicApiKey(),
      maxRetries: 5,
    });
  }
  return client;
}

export const MODEL = "claude-sonnet-4-6";

export async function callAgent(args: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: args.maxTokens ?? 4096,
    system: args.system,
    messages: [{ role: "user", content: args.user }],
  });

  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text += block.text;
  }
  return text;
}

export function parseJsonFromText<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1] : text.trim();
  return JSON.parse(candidate) as T;
}
