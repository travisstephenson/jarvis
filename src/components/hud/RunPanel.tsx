"use client";

import { useEffect, useMemo, useState } from "react";
import type { AgentEventPayload } from "@/lib/events";
import { AgentStatus } from "./AgentStatus";
import { EventLog } from "./EventLog";
import { HexBackground } from "./HexBackground";

interface Hook {
  hook: string;
  angle: string;
  cta: string;
  channel: string;
}

interface Beat {
  text: string;
  visualDirection: string;
  durationSec: number;
}

interface Script {
  hook: string;
  beats: Beat[];
  cta: string;
  totalDurationSec: number;
  caption: string;
  hashtags: string[];
}

interface ReviewBundle {
  review: { overall: number; shouldShip: boolean; topThreeIssues: string[]; revisionSuggestions: string[] };
  rendered: boolean;
  videoPath: string;
  outputDir: string;
}

export function RunPanel({ profileId, profileLabel }: { profileId: string; profileLabel: string }) {
  const [runId, setRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<AgentEventPayload[]>([]);
  const [starting, setStarting] = useState(false);
  const [done, setDone] = useState(false);
  const [view, setView] = useState<"script" | "review">("script");

  useEffect(() => {
    if (!runId) return;
    const es = new EventSource(`/api/events/${runId}`);
    es.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data) as AgentEventPayload;
        setEvents((prev) => [...prev, event]);
        if (event.kind === "run.complete" || event.kind === "run.failed") {
          setDone(true);
          es.close();
        }
      } catch { /* ignore parse errors */ }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [runId]);

  const startRun = async () => {
    setStarting(true);
    setEvents([]);
    setDone(false);
    setView("script");
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileId }),
      });
      const json = await res.json();
      setRunId(json.runId);
    } finally {
      setStarting(false);
    }
  };

  const hooks = useMemo(() => {
    const evt = events.find((e) => e.agent === "strategist" && e.kind === "agent.output");
    return (evt?.data as Hook[] | undefined) ?? [];
  }, [events]);

  const script = useMemo(() => {
    const evt = events.find((e) => e.agent === "scriptwriter" && e.kind === "agent.output");
    return evt?.data as Script | undefined;
  }, [events]);

  const completion = useMemo(() => {
    const evt = events.find((e) => e.kind === "run.complete");
    return evt?.data as ReviewBundle | undefined;
  }, [events]);

  const isRunning = runId !== null && !done;

  return (
    <div className="relative grid min-h-screen grid-cols-12 gap-4 p-6">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <HexBackground />
      </div>

      <header className="col-span-12 flex items-end justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="hud-label">CONTENT COMMAND // {profileLabel}</div>
          <h1 className="text-3xl font-extrabold tracking-tight">J A R V I S</h1>
          <div className="hud-readout mt-1">Multi-agent short-form video pipeline</div>
        </div>
        <button
          className="hud-button"
          onClick={startRun}
          disabled={starting || isRunning}
        >
          {isRunning ? "RUNNING…" : "GENERATE TODAY"}
        </button>
      </header>

      <aside className="col-span-3 space-y-4">
        <AgentStatus events={events} />

        <div className="hud-panel p-5">
          <div className="hud-label mb-3">RUN INFO</div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <Row k="RUN ID" v={runId ?? "—"} />
            <Row k="STATUS" v={runId ? (done ? "COMPLETE" : "ACTIVE") : "IDLE"} />
            <Row k="EVENTS" v={String(events.length)} />
          </div>
        </div>

        {hooks.length > 0 && (
          <div className="hud-panel p-5">
            <div className="hud-label mb-3">HOOK CANDIDATES</div>
            <ol className="space-y-2 text-sm">
              {hooks.map((h, i) => (
                <li key={i} className={`border-l-2 pl-3 ${i === 0 ? "border-cyan-400" : "border-cyan-500/30"}`}>
                  <div className={`font-medium ${i === 0 ? "text-cyan-100" : "text-slate-400"}`}>{h.hook}</div>
                  <div className="hud-readout">{h.angle}{i === 0 && " · selected"}</div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>

      <main className="col-span-6">
        <div className="hud-panel flex h-full flex-col p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="hud-label">CENTRAL TASK</div>
            {script && completion && (
              <div className="flex gap-2">
                <ViewTab active={view === "script"} onClick={() => setView("script")}>SCRIPT</ViewTab>
                <ViewTab active={view === "review"} onClick={() => setView("review")}>REVIEW</ViewTab>
              </div>
            )}
          </div>
          {!runId ? (
            <IdleView profileLabel={profileLabel} />
          ) : !script ? (
            <RunningView events={events} />
          ) : view === "script" ? (
            <ScriptView script={script} completion={completion} />
          ) : completion ? (
            <ReviewView c={completion} />
          ) : (
            <RunningView events={events} />
          )}
        </div>
      </main>

      <section className="col-span-3 h-[calc(100vh-9rem)]">
        <EventLog events={events} />
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="hud-readout">{k}</span>
      <span className="text-slate-200">{v}</span>
    </div>
  );
}

function ViewTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 font-mono text-[11px] tracking-widest border ${
        active
          ? "border-cyan-400 text-cyan-100 bg-cyan-400/10"
          : "border-cyan-500/30 text-slate-400 hover:text-cyan-200"
      } rounded`}
    >
      {children}
    </button>
  );
}

function IdleView({ profileLabel }: { profileLabel: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="hud-label mb-2">READY</div>
      <div className="text-2xl font-semibold text-cyan-100">{profileLabel} content pipeline standing by</div>
      <div className="hud-readout mt-3 max-w-md">
        Press <span className="text-cyan-300">GENERATE TODAY</span> to spin up the 5-agent pipeline.
      </div>
    </div>
  );
}

function RunningView({ events }: { events: AgentEventPayload[] }) {
  const latest = events[events.length - 1];
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="hud-label mb-2 hud-pulse">EXECUTING</div>
      <div className="text-2xl font-semibold text-cyan-100">
        {latest?.message ?? "Spinning up agents…"}
      </div>
      <div className="hud-readout mt-3">Agent: {latest?.agent ?? "—"}</div>
    </div>
  );
}

function ScriptView({ script, completion }: { script: Script; completion?: ReviewBundle }) {
  const copyText = `${script.caption}\n\n${script.hashtags.join(" ")}`;
  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="mb-4">
        <div className="hud-label mb-1">HOOK · 0:00</div>
        <div className="text-2xl font-bold text-cyan-100">{script.hook}</div>
      </div>

      <div className="mb-4">
        <div className="hud-label mb-2">VOICEOVER · {script.totalDurationSec}s total</div>
        <ol className="space-y-3">
          {script.beats.map((beat, i) => {
            const start = script.beats.slice(0, i).reduce((s, b) => s + b.durationSec, 0);
            return (
              <li key={i} className="border-l-2 border-cyan-500/40 pl-3">
                <div className="hud-readout">
                  {formatTime(start)} – {formatTime(start + beat.durationSec)} · {beat.durationSec}s
                </div>
                <div className="mt-0.5 text-slate-100">{beat.text}</div>
                <div className="hud-readout mt-1 italic">{beat.visualDirection}</div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mb-4">
        <div className="hud-label mb-1">CTA</div>
        <div className="text-lg font-semibold text-cyan-300">{script.cta}</div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="hud-label">CAPTION + HASHTAGS</div>
          <CopyButton text={copyText} />
        </div>
        <div className="rounded border border-cyan-500/20 bg-black/30 p-3 text-sm text-slate-200">
          <div className="mb-2">{script.caption}</div>
          <div className="text-cyan-300">{script.hashtags.join(" ")}</div>
        </div>
      </div>

      {completion && (
        <div className="mt-6 flex items-center justify-between border-t border-cyan-500/20 pt-3">
          <div className="hud-readout">
            Output: <span className="text-cyan-300">{completion.rendered ? completion.videoPath : completion.outputDir}</span>
          </div>
          <div className={`font-mono text-xs tracking-widest ${completion.review.shouldShip ? "text-emerald-400" : "text-amber-400"}`}>
            {completion.review.overall}/100 · {completion.review.shouldShip ? "READY" : "NEEDS WORK"}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewView({ c }: { c: ReviewBundle }) {
  const score = c.review.overall;
  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="hud-label">VERDICT</div>
          <div className="mt-1 text-2xl font-bold">{c.review.shouldShip ? "READY TO SHIP" : "NEEDS REVISION"}</div>
        </div>
        <ScoreRing value={score} />
      </div>

      <div className="mb-3 hud-label">TOP ISSUES</div>
      <ul className="mb-4 space-y-1.5 text-sm">
        {c.review.topThreeIssues.map((issue, i) => (
          <li key={i} className="border-l-2 border-amber-400/60 pl-3 text-slate-200">{issue}</li>
        ))}
      </ul>

      {c.review.revisionSuggestions.length > 0 && (
        <>
          <div className="mb-3 hud-label">REVISION SUGGESTIONS</div>
          <ul className="space-y-1.5 text-sm">
            {c.review.revisionSuggestions.map((s, i) => (
              <li key={i} className="border-l-2 border-cyan-400/60 pl-3 text-slate-200">{s}</li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 hud-readout border-t border-cyan-500/20 pt-3">
        Output folder: <span className="text-cyan-300">{c.outputDir}</span>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded border border-cyan-500/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cyan-200 hover:bg-cyan-500/10"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function formatTime(sec: number): string {
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function ScoreRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const stroke = pct >= 75 ? "#5BE3FF" : pct >= 50 ? "#FFB547" : "#FF6B7D";
  const c = 2 * Math.PI * 38;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="38" stroke="rgba(91,227,255,0.15)" strokeWidth="6" fill="none" />
        <circle
          cx="50" cy="50" r="38"
          stroke={stroke} strokeWidth="6" fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: stroke }}>{pct}</span>
        <span className="hud-readout">/100</span>
      </div>
    </div>
  );
}
