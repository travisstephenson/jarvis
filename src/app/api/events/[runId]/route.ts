import { bus, type AgentEventPayload } from "@/lib/events";
import { db, schema } from "@/lib/db/client";
import { eq, asc } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (event: AgentEventPayload) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const replay = db.select().from(schema.agentEvents)
        .where(eq(schema.agentEvents.runId, runId))
        .orderBy(asc(schema.agentEvents.id))
        .all();

      for (const row of replay) {
        send({
          runId,
          agent: row.agent,
          kind: row.kind as AgentEventPayload["kind"],
          message: row.message ?? undefined,
          data: row.data ? JSON.parse(row.data) : undefined,
          timestamp: row.timestamp.getTime(),
        });
      }

      const listener = (event: AgentEventPayload) => {
        if (event.runId !== runId) return;
        send(event);
        if (event.kind === "run.complete" || event.kind === "run.failed") {
          setTimeout(() => {
            bus.off("event", listener);
            try { controller.close(); } catch { /* already closed */ }
          }, 100);
        }
      };
      bus.on("event", listener);

      const heartbeat = setInterval(() => {
        try { controller.enqueue(encoder.encode(`: heartbeat\n\n`)); }
        catch { clearInterval(heartbeat); }
      }, 15_000);

      const cleanup = () => {
        clearInterval(heartbeat);
        bus.off("event", listener);
      };
      _req.signal?.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
