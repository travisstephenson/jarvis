import { writeFile } from "node:fs/promises";
import { env } from "@/lib/env";

const ELEVENLABS_API = "https://api.elevenlabs.io/v1";

export interface SynthesizeArgs {
  text: string;
  voiceId: string;
  outPath: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export async function synthesizeVoice(args: SynthesizeArgs): Promise<{ path: string; durationSec: number | null }> {
  const apiKey = env.elevenlabsApiKey();
  if (!apiKey || !args.voiceId) {
    return synthesizeStub(args);
  }

  const url = `${ELEVENLABS_API}/text-to-speech/${args.voiceId}?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: args.text,
      model_id: args.modelId ?? "eleven_turbo_v2_5",
      voice_settings: {
        stability: args.stability ?? 0.5,
        similarity_boost: args.similarityBoost ?? 0.8,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs synth failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await writeFile(args.outPath, audioBuffer);
  return { path: args.outPath, durationSec: null };
}

async function synthesizeStub(args: SynthesizeArgs): Promise<{ path: string; durationSec: number }> {
  const wordsPerSecond = 2.5;
  const wordCount = args.text.trim().split(/\s+/).length;
  const durationSec = Math.max(1, Math.ceil(wordCount / wordsPerSecond));
  const placeholder = JSON.stringify({
    stub: true,
    note: "ElevenLabs key or voice ID missing; voiceover not synthesized.",
    text: args.text,
    estimatedDurationSec: durationSec,
  }, null, 2);
  await writeFile(args.outPath + ".stub.json", placeholder, "utf-8");
  return { path: args.outPath + ".stub.json", durationSec };
}
