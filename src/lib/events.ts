import { EventEmitter } from "node:events";
import { db, schema } from "./db/client";

export type AgentEventKind =
  | "agent.start"
  | "agent.thought"
  | "agent.tool_call"
  | "agent.tool_result"
  | "agent.output"
  | "agent.finish"
  | "agent.error"
  | "run.start"
  | "run.complete"
  | "run.failed";

export interface AgentEventPayload {
  runId: string;
  agent: string;
  kind: AgentEventKind;
  message?: string;
  data?: unknown;
  timestamp: number;
}

class JarvisBus extends EventEmitter {
  emitEvent(event: AgentEventPayload) {
    db.insert(schema.agentEvents).values({
      runId: event.runId,
      agent: event.agent,
      kind: event.kind,
      message: event.message ?? null,
      data: event.data !== undefined ? JSON.stringify(event.data) : null,
      timestamp: new Date(event.timestamp),
    }).run();

    this.emit("event", event);
    this.emit(`run:${event.runId}`, event);
  }
}

const globalForBus = globalThis as unknown as { __jarvisBus?: JarvisBus };
export const bus = globalForBus.__jarvisBus ?? (globalForBus.__jarvisBus = new JarvisBus());
bus.setMaxListeners(100);
