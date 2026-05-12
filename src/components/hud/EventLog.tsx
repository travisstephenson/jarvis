"use client";

import { useEffect, useRef } from "react";
import type { AgentEventPayload } from "@/lib/events";

export function EventLog({ events }: { events: AgentEventPayload[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [events.length]);

  return (
    <div className="hud-panel flex h-full flex-col p-5">
      <div className="hud-label mb-3 flex items-center justify-between">
        <span>EVENT STREAM</span>
        <span className="hud-readout">{events.length} events</span>
      </div>
      <div ref={ref} className="flex-1 space-y-1.5 overflow-y-auto pr-1 font-mono text-[11px]">
        {events.length === 0 ? (
          <div className="hud-readout">Awaiting input…</div>
        ) : (
          events.map((e, i) => (
            <div key={i} className="flex gap-3">
              <span className="hud-readout shrink-0">{new Date(e.timestamp).toTimeString().slice(0, 8)}</span>
              <span className="shrink-0 text-cyan-300">{e.agent.padEnd(16).slice(0, 16)}</span>
              <span className="shrink-0 text-amber-300/80">{e.kind.padEnd(20).slice(0, 20)}</span>
              <span className="flex-1 text-slate-200">{e.message ?? ""}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
