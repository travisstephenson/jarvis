"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  FileTextIcon,
  SparklesIcon,
  TrashIcon,
  UploadIcon,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import { createSampleReport } from "@/lib/mock-data";

export default function ScanPage() {
  const router = useRouter();
  const { state, ready, addReport, deleteReport } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not signed in
  useEffect(() => {
    if (ready && !state.user) router.replace("/login");
  }, [ready, state.user, router]);

  if (!ready || !state.user) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <span className="inline-block h-6 w-6 border-2 border-[color:var(--color-primary)] border-t-transparent rounded-full spin-slow" />
      </div>
    );
  }

  async function startSampleScan() {
    setLoading(true);
    setError(null);
    // Simulated processing delay so the loading state is visible.
    await new Promise((r) => setTimeout(r, 900));
    if (!state.user) {
      setLoading(false);
      return;
    }
    const report = createSampleReport(state.user.id);
    addReport(report);
    setLoading(false);
    router.push(`/scan/wizard?r=${report.id}`);
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Upload failed. Please make sure you are uploading the .json file from Credit Karma.");
      return;
    }
    setError(null);
    // For the frontend prototype, we don't actually parse uploaded JSON — we
    // generate a sample report so the wizard has real data to walk through.
    startSampleScan();
  }

  const reports = state.reports;

  return (
    <div className="flex-1 py-8 sm:py-12">
      <div className="app-container md:max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold m-0">Let's find what we can fix.</h1>
          <p className="mt-2 text-[color:var(--color-muted-foreground)]">
            Upload your credit report data, or try the built-in sample report to see how the scanner works.
          </p>
        </header>

        {/* Sample CTA */}
        <Card className="overflow-hidden">
          <div className="p-5 sm:p-6 flex items-start gap-4 bg-gradient-to-br from-[color:var(--color-primary-soft)] to-transparent">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center">
              <SparklesIcon />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Try with sample data</div>
              <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
                Skip the upload. We'll spin up a realistic 10-account credit report so you can experience the full flow.
              </p>
              <div className="mt-4">
                <Button onClick={startSampleScan} loading={loading}>
                  {loading ? "Loading sample report..." : "Use sample report"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Upload area */}
        <div className="mt-5">
          <UploadZone onFile={onFileChosen} disabled={loading} />
          {error && (
            <div className="mt-3 rounded-lg bg-[color:var(--color-destructive-soft)] text-[color:var(--color-destructive)] px-4 py-2.5 text-sm">
              {error}
            </div>
          )}
          <Guide />
        </div>

        {/* Previous scans */}
        {reports.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold m-0 mb-3">Previous scans</h2>
            <div className="divide-y divide-[color:var(--color-border)] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
              {reports.map((r) => {
                const progress = state.progress[r.id];
                const status = progress?.paid
                  ? { label: "Complete", color: "var(--color-success)" }
                  : progress && progress.flagged.length > 0
                  ? { label: "Review ready", color: "var(--color-primary)" }
                  : { label: "In progress", color: "var(--color-muted-foreground)" };
                const continueHref = progress?.paid
                  ? `/scan/results?r=${r.id}`
                  : progress && progress.flagged.length > 0 && progress.currentIndex >= r.tradelines.length - 1
                  ? `/scan/results?r=${r.id}`
                  : `/scan/wizard?r=${r.id}`;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 sm:px-5 py-4">
                    <div className="h-10 w-10 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] inline-flex items-center justify-center shrink-0">
                      <FileTextIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.fileName}</div>
                      <div className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">
                        {r.source} · {r.tradelines.length} accounts · {new Date(r.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "color-mix(in srgb, " + status.color + " 12%, transparent)", color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <Link href={continueHref} className="inline-flex items-center justify-center h-9 px-3 rounded-lg bg-[color:var(--color-surface-muted)] hover:bg-[color:var(--color-border)] text-sm font-medium no-underline text-[color:var(--color-foreground)] shrink-0">
                      Continue <ChevronRightIcon size={16} />
                    </Link>
                    <button
                      onClick={() => deleteReport(r.id)}
                      className="p-2 rounded-lg text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-destructive-soft)] hover:text-[color:var(--color-destructive)] shrink-0"
                      aria-label="Delete report"
                      title="Delete report"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function UploadZone({ onFile, disabled }: { onFile: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }) {
  return (
    <label
      className={`block rounded-xl border-2 border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-7 text-center cursor-pointer hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)]/30 transition-colors ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input type="file" accept=".json,application/json" className="sr-only" onChange={onFile} />
      <div className="mx-auto h-12 w-12 rounded-xl bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] inline-flex items-center justify-center">
        <UploadIcon />
      </div>
      <div className="mt-3 font-medium">Drag your .json file here or tap to browse</div>
      <div className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
        Download your report data from Credit Karma in 3 quick steps.
      </div>
    </label>
  );
}

function Guide() {
  return (
    <ol className="mt-5 grid sm:grid-cols-3 gap-3 list-none p-0">
      {[
        "Log in to Credit Karma",
        "Open Credit Score Details",
        "Tap Download Report Data",
      ].map((step, i) => (
        <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[color:var(--color-surface-muted)]">
          <span className="h-7 w-7 rounded-full bg-white border border-[color:var(--color-border)] inline-flex items-center justify-center text-sm font-semibold">{i + 1}</span>
          <span className="text-sm">{step}</span>
        </li>
      ))}
    </ol>
  );
}
