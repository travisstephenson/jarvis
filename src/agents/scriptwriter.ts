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

CRITICAL — FACTUAL DISCIPLINE:
You may only state claims that are explicitly supported by the product profile provided. You MUST NOT:
- Invent specific performance numbers (e.g., "scans in under a minute", "saves 10 hours/week") unless they appear verbatim in the profile.
- Invent specific UI strings, report copy, error messages, or labels (e.g., "Trust signal missing above fold", "Value prop appears below scroll depth of 60%"). If you need to reference what the product shows on screen, describe it abstractly ("a ranked list of specific fixes") instead of fabricating exact strings.
- Invent product features or behaviors not described in the profile.
- Add proof points, customer quotes, or stats that aren't in the profile.

If a beat needs a specific detail you don't have, either (a) describe it abstractly, or (b) leave it out. Vague-but-true beats a specific-but-fabricated line every time, because the second creates expectation mismatch when viewers try the product.

Break the script into 4-6 beats. Each beat is one shot's worth of voiceover (3-8 seconds spoken).

For each beat, specify a "visualDirection" describing what's on screen during that voiceover. Prefer real product demonstrations over generic stock — for an analytics tool, that means real scans of real sites, scrolling dashboards, animated stat overlays. Avoid talking heads and avatars.

HASHTAG RULES:
- 5-8 hashtags total.
- Mix broad audience tags (#indiehacker, #saasfounder, #buildinpublic) with niche topical tags relevant to the product domain.
- BANNED hashtags (clash with siteamoeba's anti-analytics-theater voice): #growthhacking, #hustle, #grindset, #entrepreneurlife, #motivation, anything that signals hustle culture.

Respond ONLY with JSON matching:
{
  "hook": string,
  "beats": [{ "text": string, "visualDirection": string, "durationSec": number }],
  "cta": string,
  "totalDurationSec": number,
  "caption": string (under 150 chars, hook-style, plus the CTA),
  "hashtags": [string]
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
