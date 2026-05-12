import { bus } from "@/lib/events";
import { callAgent, parseJsonFromText } from "./anthropic";
import type { HookConcept, RunContext } from "./types";

const SYSTEM = `You are STRATEGIST, the daily content strategist agent in a JARVIS-style content engine.

Your job: propose 3 distinct short-form video hooks for the product, optimized for a single channel (TikTok / Reels / Shorts).

Constraints:
- Hooks must be 5-9 words, punchy, pattern-interrupt.
- Avoid generic SaaS language ("revolutionize", "game-changer", "unlock").
- Each hook must have a clear angle: pain point, contrarian take, curiosity gap, social proof, or live demonstration.
- Each must end in a concrete CTA tied to the product's primary action.

Respond ONLY with a JSON array of 3 objects matching this schema:
[{ "hook": string, "angle": string, "cta": string, "channel": "tiktok" }]`;

export async function strategist(ctx: RunContext): Promise<HookConcept[]> {
  bus.emitEvent({
    runId: ctx.runId, agent: "strategist", kind: "agent.start",
    message: "Generating daily hook concepts", timestamp: Date.now(),
  });

  const user = `Product: ${ctx.product.name}
URL: ${ctx.product.url}
Tagline: ${ctx.product.tagline}
Audience: ${ctx.product.audience}
Value props:
${ctx.product.valueProps.map((v) => `- ${v}`).join("\n")}
Primary CTA: ${ctx.product.primaryCTA}
Brand voice: ${ctx.product.brandVoice}

Generate 3 hook concepts for today's TikTok post.`;

  const raw = await callAgent({ system: SYSTEM, user, maxTokens: 1500 });
  const hooks = parseJsonFromText<HookConcept[]>(raw);

  bus.emitEvent({
    runId: ctx.runId, agent: "strategist", kind: "agent.output",
    message: `Proposed ${hooks.length} hooks`, data: hooks, timestamp: Date.now(),
  });
  bus.emitEvent({
    runId: ctx.runId, agent: "strategist", kind: "agent.finish",
    timestamp: Date.now(),
  });

  return hooks;
}
