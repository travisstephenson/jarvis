import { isAbsolute, join } from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import type { ShotPlan, VideoScript } from "../types";

export interface RenderArgs {
  outDir: string;
  script: VideoScript;
  shotPlan: ShotPlan;
  voiceoverPath: string;
  shotImagePaths: Record<string, string>;
}

function toFileUrl(p: string): string {
  if (!p) return "";
  if (p.startsWith("file://") || p.startsWith("http://") || p.startsWith("https://")) return p;
  const abs = isAbsolute(p) ? p : join(process.cwd(), p);
  if (!existsSync(abs)) return "";
  return pathToFileURL(abs).href;
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

    const voiceoverUrl = args.voiceoverPath.endsWith(".mp3") ? toFileUrl(args.voiceoverPath) : "";
    const shotImageUrls: Record<string, string> = {};
    for (const [k, p] of Object.entries(args.shotImagePaths)) {
      const url = toFileUrl(p);
      if (url) shotImageUrls[k] = url;
    }

    const inputProps = {
      script: args.script,
      shotPlan: args.shotPlan,
      voiceoverPath: voiceoverUrl,
      shotImagePaths: shotImageUrls,
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
