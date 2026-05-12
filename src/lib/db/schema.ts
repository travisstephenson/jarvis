import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const runs = sqliteTable("runs", {
  id: text("id").primaryKey(),
  productProfile: text("product_profile").notNull(),
  hookConcept: text("hook_concept"),
  status: text("status", { enum: ["pending", "running", "completed", "failed"] }).notNull().default("pending"),
  startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp_ms" }),
  outputPath: text("output_path"),
  errorMessage: text("error_message"),
});

export const agentEvents = sqliteTable("agent_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runId: text("run_id").notNull().references(() => runs.id),
  agent: text("agent").notNull(),
  kind: text("kind").notNull(),
  message: text("message"),
  data: text("data"),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
});

export const contentAssets = sqliteTable("content_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runId: text("run_id").notNull().references(() => runs.id),
  kind: text("kind", { enum: ["script", "voiceover", "screencap", "video", "caption"] }).notNull(),
  path: text("path"),
  payload: text("payload"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export type Run = typeof runs.$inferSelect;
export type NewRun = typeof runs.$inferInsert;
export type AgentEvent = typeof agentEvents.$inferSelect;
export type NewAgentEvent = typeof agentEvents.$inferInsert;
export type ContentAsset = typeof contentAssets.$inferSelect;
