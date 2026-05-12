import { bus } from "@/lib/events";
import { callAgent, parseJsonFromText } from "./anthropic";
import type { HookConcept, RunContext, VideoScript } from "./types";

const SYSTEM = `You are SCRIPTWRITER, a short-form vertical video scriptwriter.

You write 30-45 second TikTok / Reels / Shorts scripts that:
- Open with the hook in the first 1.5 seconds, no setup
- Use short, declarative sentences a person would actually say
- Show, don't tell — every line should imply a visual
- End with a single concrete CTA
- NEVER use AI-slop phrases ("In today's fast-paced world", "Let's dive in", "Unlock the power of")

Break the script into 4-6 beats. Each beat is one shot's worth of voiceover (3-8 seconds spoken).

For each beat, specify a "visualDirection" describing what's on screen during that voiceover. Prefer real product demonstrations over generic stock — for an analytics tool, that means real scans of real sites, scrolling dashboards, animated stat overlays. Avoid talking heads and avatars.

Respond ONLY with JSON matching:
{
  "hook": string,
  "beats": [{ "text": string, "visualDirection": string, "durationSec": number }],
  "cta": string,
  "totalDurationSec": number,
  "caption": string (under 150 chars, hook-style, plus the CTA),
  "hashtags": [string] (5-8, mix of broad + niche)
}`;

export async function scriptwriter(
  ctx: RunContext, chosen: HookConcept,
): Promise<VideoScript> {
  bus.emitEvent({
    runId: ctx.runId, agent: "scriptwriter", kind: "agent.start",
    message: `Writing script for: "${chosen.hook}"`, timestamp: Date.now(),
  });

  const user = `Product: ${ctx.product.name} (${ctx.product.url})
Tagline: ${ctx.product.tagline}
Audience: ${ctx.product.audience}
Value props:
${ctx.product.valueProps.map((v) => `- ${v}`).join("\n")}
Primary CTA: ${ctx.product.primaryCTA}
Brand voice: ${ctx.product.brandVoice}

Hook concept to expand:
- Hook: ${chosen.hook}
- Angle: ${chosen.angle}
- CTA: ${chosen.cta}

Write the script.`;

  const raw = await callAgent({ system: SYSTEM, user, maxTokens: 2500 });
  const script = parseJsonFromText<VideoScript>(raw);

  bus.emitEvent({
    runId: ctx.runId, agent: "scriptwriter", kind: "agent.output",
    message: `${script.beats.length} beats, ~${script.totalDurationSec}s`,
    data: script, timestamp: Date.now(),
  });
  bus.emitEvent({
    runId: ctx.runId, agent: "scriptwriter", kind: "agent.finish",
    timestamp: Date.now(),
  });

  return script;
}
