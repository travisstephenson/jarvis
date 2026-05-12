import { join } from "node:path";
import { bus } from "@/lib/events";
import { synthesizeVoice } from "./tools/elevenlabs";
import { capturePage } from "./tools/playwright-capture";
import { renderVideo } from "./tools/remotion-render";
import { env } from "@/lib/env";
import type { RunContext, ShotPlan, VideoScript } from "./types";

export interface ProducedAssets {
  voiceoverPath: string;
  shotImagePaths: Record<string, string>;
  videoPath: string;
  rendered: boolean;
  notes: string[];
}

export async function producer(
  ctx: RunContext, script: VideoScript, shotPlan: ShotPlan,
): Promise<ProducedAssets> {
  const notes: string[] = [];

  bus.emitEvent({
    runId: ctx.runId, agent: "producer", kind: "agent.start",
    message: "Producing voiceover + screen captures + video", timestamp: Date.now(),
  });

  const voiceoverText = [script.hook, ...script.beats.map((b) => b.text), script.cta].join(" ");
  const voicePath = join(ctx.outputDir, "voiceover.mp3");

  bus.emitEvent({
    runId: ctx.runId, agent: "producer", kind: "agent.tool_call",
    message: "Synthesizing voiceover with ElevenLabs", timestamp: Date.now(),
  });
  const voice = await synthesizeVoice({
    text: voiceoverText, voiceId: env.voiceNarration(), outPath: voicePath,
  });
  if (voice.path !== voicePath) notes.push("ElevenLabs not configured; wrote stub instead of MP3.");

  const shotImagePaths: Record<string, string> = {};
  for (let i = 0; i < shotPlan.shots.length; i++) {
    const shot = shotPlan.shots[i];
    if (shot.kind !== "screencap" || !shot.captureUrl) continue;
    const shotKey = `shot-${String(i).padStart(2, "0")}`;
    bus.emitEvent({
      runId: ctx.runId, agent: "producer", kind: "agent.tool_call",
      message: `Capturing ${shot.captureUrl}`, timestamp: Date.now(),
    });
    const cap = await capturePage({
      url: shot.captureUrl, outDir: ctx.outputDir,
      shotKey, selectorHint: shot.captureSelector,
    });
    shotImagePaths[shotKey] = cap.imagePath;
    if (cap.kind === "stub" && cap.note) notes.push(cap.note);
  }

  bus.emitEvent({
    runId: ctx.runId, agent: "producer", kind: "agent.tool_call",
    message: "Rendering video with Remotion", timestamp: Date.now(),
  });
  const render = await renderVideo({
    outDir: ctx.outputDir, script, shotPlan,
    voiceoverPath: voice.path, shotImagePaths,
  });
  if (render.status === "skipped" && render.note) notes.push(render.note);

  bus.emitEvent({
    runId: ctx.runId, agent: "producer", kind: "agent.output",
    message: render.status === "rendered" ? `Rendered ${render.videoPath}` : "Render skipped",
    data: { rendered: render.status === "rendered", notes }, timestamp: Date.now(),
  });
  bus.emitEvent({
    runId: ctx.runId, agent: "producer", kind: "agent.finish",
    timestamp: Date.now(),
  });

  return {
    voiceoverPath: voice.path,
    shotImagePaths,
    videoPath: render.videoPath,
    rendered: render.status === "rendered",
    notes,
  };
}
