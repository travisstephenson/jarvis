"use client";

import type { AgentEventPayload } from "@/lib/events";

const AGENTS = [
  { id: "strategist", label: "STRATEGIST", role: "hooks" },
  { id: "scriptwriter", label: "SCRIPTWRITER", role: "script" },
  { id: "visual_director", label: "VISUAL DIR.", role: "shot list" },
  { id: "producer", label: "PRODUCER", role: "render" },
  { id: "reviewer", label: "REVIEWER", role: "qc" },
];

type Status = "idle" | "running" | "done" | "error";

export function AgentStatus({ events }: { events: AgentEventPayload[] }) {
  const statusFor = (id: string): Status => {
    const own = events.filter((e) => e.agent === id);
    if (own.some((e) => e.kind === "agent.error")) return "error";
    if (own.some((e) => e.kind === "agent.finish")) return "done";
    if (own.some((e) => e.kind === "agent.start")) return "running";
    return "idle";
  };

  return (
    <div className="hud-panel p-5">
      <div className="hud-label mb-3">AGENT STATUS</div>
      <div className="space-y-2">
        {AGENTS.map((a) => {
          const status = statusFor(a.id);
          return (
            <div key={a.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <StatusDot status={status} />
                <span className="font-mono tracking-widest text-[12px]">{a.label}</span>
              </div>
              <span className="hud-readout">{labelFor(status, a.role)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function labelFor(status: Status, role: string): string {
  switch (status) {
    case "running": return "ACTIVE";
    case "done": return "DONE";
    case "error": return "ERROR";
    default: return role.toUpperCase();
  }
}

function StatusDot({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    idle: "bg-slate-700",
    running: "bg-cyan-400 hud-pulse",
    done: "bg-emerald-400",
    error: "bg-rose-500",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`} />;
}
