import { bus } from "@/lib/events";
import { callAgent, parseJsonFromText } from "./anthropic";
import type { RunContext, ShotPlan, VideoScript } from "./types";

const SYSTEM = `You are VISUAL_DIRECTOR, an agent that turns a short-form script into a concrete shot list.

For an analytics product, the visual backbone is REAL product screen capture: scans of real websites, scrolling dashboards, score reveals, comparison views. The product showing itself working is the content. Avoid generic AI b-roll and stock footage.

For each beat in the script, choose one shot kind:
- "screencap": a captured browser interaction with the live product. Specify captureUrl (the URL the product should analyze or the dashboard route) and a short captureSelector hint describing what the user should see (e.g., "scan-results-panel", "score-gauge").
- "title_card": branded full-bleed text card with a single line. Use for hook (beat 0) and CTA (final beat) only.
- "graphic": animated overlay on a prior screencap (stat reveal, callout, redline). Reuse the previous beat's captured frame.
- "broll": only as last resort if the beat is conceptual and can't be shown.

Allocate timing so the sum equals script.totalDurationSec.

Respond ONLY with JSON:
{ "shots": [{ "kind": "screencap"|"title_card"|"graphic"|"broll", "description": string, "captureUrl"?: string, "captureSelector"?: string, "text"?: string, "startSec": number, "endSec": number }] }`;

export async function visualDirector(
  ctx: RunContext, script: VideoScript,
): Promise<ShotPlan> {
  bus.emitEvent({
    runId: ctx.runId, agent: "visual_director", kind: "agent.start",
    message: "Planning shot list", timestamp: Date.now(),
  });

  const user = `Product URL: ${ctx.product.url}
Product: ${ctx.product.name} — ${ctx.product.tagline}

Script:
${JSON.stringify(script, null, 2)}

Produce the shot plan.`;

  const raw = await callAgent({ system: SYSTEM, user, maxTokens: 2500 });
  const plan = parseJsonFromText<ShotPlan>(raw);

  bus.emitEvent({
    runId: ctx.runId, agent: "visual_director", kind: "agent.output",
    message: `${plan.shots.length} shots planned`,
    data: plan, timestamp: Date.now(),
  });
  bus.emitEvent({
    runId: ctx.runId, agent: "visual_director", kind: "agent.finish",
    timestamp: Date.now(),
  });

  return plan;
}
