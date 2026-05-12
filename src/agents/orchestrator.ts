import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { bus } from "@/lib/events";
import { db, schema } from "@/lib/db/client";
import { ensureRunDir, writeJson } from "./tools/filesystem";
import { strategist } from "./strategist";
import { scriptwriter } from "./scriptwriter";
import { visualDirector } from "./visual-director";
import { producer } from "./producer";
import { reviewer } from "./reviewer";
import type { ProductProfile, RunContext } from "./types";

export interface StartRunArgs {
  product: ProductProfile;
  selectHook?: (hooks: Awaited<ReturnType<typeof strategist>>) => number;
}

export async function startRun(args: StartRunArgs): Promise<string> {
  const runId = `run_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const outputDir = await ensureRunDir(runId);

  db.insert(schema.runs).values({
    id: runId,
    productProfile: args.product.id,
    status: "running",
    startedAt: new Date(),
  }).run();

  bus.emitEvent({
    runId, agent: "jarvis", kind: "run.start",
    message: `Run starting for ${args.product.name}`,
    data: { product: args.product.id }, timestamp: Date.now(),
  });

  void runPipeline(runId, outputDir, args).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    db.update(schema.runs).set({
      status: "failed", finishedAt: new Date(), errorMessage: message,
    }).where(eq(schema.runs.id, runId)).run();
    bus.emitEvent({
      runId, agent: "jarvis", kind: "run.failed",
      message, timestamp: Date.now(),
    });
  });

  return runId;
}

async function runPipeline(runId: string, outputDir: string, args: StartRunArgs) {
  const ctx: RunContext = { runId, product: args.product, outputDir };

  const hooks = await strategist(ctx);
  await writeJson(`${outputDir}/hooks.json`, hooks);

  const choice = args.selectHook ? args.selectHook(hooks) : 0;
  const chosen = hooks[choice] ?? hooks[0];

  db.update(schema.runs).set({ hookConcept: chosen.hook })
    .where(eq(schema.runs.id, runId)).run();

  const script = await scriptwriter(ctx, chosen);
  await writeJson(`${outputDir}/script.json`, script);
  db.insert(schema.contentAssets).values({
    runId, kind: "script", path: `${outputDir}/script.json`,
    payload: JSON.stringify(script), createdAt: new Date(),
  }).run();

  const shotPlan = await visualDirector(ctx, script);
  await writeJson(`${outputDir}/shot-plan.json`, shotPlan);

  const produced = await producer(ctx, script, shotPlan);
  db.insert(schema.contentAssets).values({
    runId, kind: "voiceover", path: produced.voiceoverPath, createdAt: new Date(),
  }).run();
  if (produced.rendered) {
    db.insert(schema.contentAssets).values({
      runId, kind: "video", path: produced.videoPath, createdAt: new Date(),
    }).run();
  }

  const review = await reviewer(ctx, script, shotPlan, produced.notes);
  await writeJson(`${outputDir}/review.json`, review);

  const status = "completed";
  db.update(schema.runs).set({
    status, finishedAt: new Date(),
    outputPath: produced.rendered ? produced.videoPath : outputDir,
  }).where(eq(schema.runs.id, runId)).run();

  bus.emitEvent({
    runId, agent: "jarvis", kind: "run.complete",
    message: review.shouldShip
      ? `Ready to ship — ${review.overall}/100`
      : `Needs revision — ${review.overall}/100`,
    data: { review, outputDir, videoPath: produced.videoPath, rendered: produced.rendered },
    timestamp: Date.now(),
  });
}
