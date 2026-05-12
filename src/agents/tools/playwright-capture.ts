import { join } from "node:path";

export interface CaptureArgs {
  url: string;
  outDir: string;
  shotKey: string;
  selectorHint?: string;
  width?: number;
  height?: number;
}

export interface CaptureResult {
  kind: "screenshot" | "stub";
  imagePath: string;
  note?: string;
}

export async function capturePage(args: CaptureArgs): Promise<CaptureResult> {
  const outPath = join(args.outDir, `${args.shotKey}.png`);

  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        viewport: { width: args.width ?? 1080, height: args.height ?? 1920 },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(args.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(2_500);
      await page.screenshot({ path: outPath, fullPage: false });
      return { kind: "screenshot", imagePath: outPath };
    } finally {
      await browser.close();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      kind: "stub",
      imagePath: outPath,
      note: `Capture skipped: ${message}. Run \`npx playwright install chromium\` to enable.`,
    };
  }
}
