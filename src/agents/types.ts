export interface ProductProfile {
  id: string;
  name: string;
  url: string;
  tagline: string;
  audience: string;
  valueProps: string[];
  primaryCTA: string;
  brandVoice: string;
}

export interface HookConcept {
  hook: string;
  angle: string;
  cta: string;
  channel: "tiktok" | "reels" | "shorts";
}

export interface VideoScript {
  hook: string;
  beats: Array<{
    text: string;
    visualDirection: string;
    durationSec: number;
  }>;
  cta: string;
  totalDurationSec: number;
  caption: string;
  hashtags: string[];
}

export interface ShotPlan {
  shots: Array<{
    kind: "screencap" | "graphic" | "title_card" | "broll";
    description: string;
    captureUrl?: string;
    captureSelector?: string;
    text?: string;
    startSec: number;
    endSec: number;
  }>;
}

export interface RunContext {
  runId: string;
  product: ProductProfile;
  outputDir: string;
}
