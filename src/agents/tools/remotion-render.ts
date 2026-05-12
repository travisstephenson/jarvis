import { join } from "node:path";
import type { ShotPlan, VideoScript } from "../types";

export interface RenderArgs {
  outDir: string;
  script: VideoScript;
  shotPlan: ShotPlan;
  voiceoverPath: string;
  shotImagePaths: Record<string, string>;
}

export interface RenderResult {
  status: "rendered" | "skipped";
  videoPath: string;
  note?: string;
}

export async function renderVideo(args: RenderArgs): Promise<RenderResult> {
  const videoPath = join(args.outDir, "video.mp4");

  try {
    const { bundle } = await import("@remotion/bundler");
    const { renderMedia, selectComposition } = await import("@remotion/renderer");

    const entryPoint = join(process.cwd(), "remotion", "index.ts");
    const bundleLocation = await bundle({ entryPoint });

    const inputProps = {
      script: args.script,
      shotPlan: args.shotPlan,
      voiceoverPath: args.voiceoverPath,
      shotImagePaths: args.shotImagePaths,
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "ShortVideo",
      inputProps,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: videoPath,
      inputProps,
    });

    return { status: "rendered", videoPath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "skipped",
      videoPath,
      note: `Render skipped: ${message}.`,
    };
  }
}
