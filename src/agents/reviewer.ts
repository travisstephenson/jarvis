import { bus } from "@/lib/events";
import { callAgent, parseJsonFromText } from "./anthropic";
import type { RunContext, ShotPlan, VideoScript } from "./types";

const SYSTEM = `You are REVIEWER, the final QC agent for short-form video.

You evaluate a script + shot plan + production notes and grade the output across 5 criteria, each 0-10:
1. hookStrength - does beat 0 actually stop a scroll?
2. claimAccuracy - are stated claims about the product specific and defensible?
3. visualBackbone - does the shot plan use real product demonstration as the spine?
4. ctaClarity - is there a single, specific, frictionless action?
5. brandFit - does it match the brand voice and not sound like AI slop?

Then return:
- overall score 0-100
- topThreeIssues: short bullets
- shouldShip: true if overall >= 75 else false
- revisionSuggestions: one concrete suggestion per criterion that scored < 7

Respond ONLY with JSON matching:
{ "scores": { "hookStrength": number, "claimAccuracy": number, "visualBackbone": number, "ctaClarity": number, "brandFit": number }, "overall": number, "topThreeIssues": [string], "shouldShip": boolean, "revisionSuggestions": [string] }`;

export interface ReviewResult {
  scores: {
    hookStrength: number;
    claimAccuracy: number;
    visualBackbone: number;
    ctaClarity: number;
    brandFit: number;
  };
  overall: number;
  topThreeIssues: string[];
  shouldShip: boolean;
  revisionSuggestions: string[];
}

export async function reviewer(
  ctx: RunContext, script: VideoScript, shotPlan: ShotPlan, productionNotes: string[],
): Promise<ReviewResult> {
  bus.emitEvent({
    runId: ctx.runId, agent: "reviewer", kind: "agent.start",
    message: "Reviewing output for ship-readiness", timestamp: Date.now(),
  });

  const user = `Product: ${ctx.product.name} — ${ctx.product.tagline}
Brand voice: ${ctx.product.brandVoice}

Script:
${JSON.stringify(script, null, 2)}

Shot plan:
${JSON.stringify(shotPlan, null, 2)}

Production notes:
${productionNotes.length ? productionNotes.map((n) => `- ${n}`).join("\n") : "(none)"}

Grade and decide.`;

  const raw = await callAgent({ system: SYSTEM, user, maxTokens: 2000 });
  const review = parseJsonFromText<ReviewResult>(raw);

  bus.emitEvent({
    runId: ctx.runId, agent: "reviewer", kind: "agent.output",
    message: `Overall ${review.overall}/100 — ${review.shouldShip ? "ship" : "revise"}`,
    data: review, timestamp: Date.now(),
  });
  bus.emitEvent({
    runId: ctx.runId, agent: "reviewer", kind: "agent.finish",
    timestamp: Date.now(),
  });

  return review;
}
