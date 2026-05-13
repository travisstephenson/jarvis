"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import { generateLetter, type Bureau } from "@/lib/letters";
import type { FlaggedItem } from "@/lib/types";

const BUREAUS: Bureau[] = ["Experian", "Equifax", "TransUnion"];

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResultsPage />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <span className="inline-block h-6 w-6 border-2 border-[color:var(--color-primary)] border-t-transparent rounded-full spin-slow" />
    </div>
  );
}

function ResultsPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("r") ?? "";
  const router = useRouter();
  const { state, ready, markPaid } = useStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const report = state.reports.find((r) => r.id === reportId);
  const progress = state.progress[reportId];
  const flagged = progress?.flagged ?? [];

  const groupedByTradeline = useMemo(() => {
    const map = new Map<string, FlaggedItem[]>();
    for (const f of flagged) {
      map.set(f.tradelineId, [...(map.get(f.tradelineId) ?? []), f]);
    }
    return map;
  }, [flagged]);

  useEffect(() => {
    if (!ready) return;
    if (!state.user) router.replace("/login");
    else if (!report) router.replace("/scan");
  }, [ready, state.user, report, router]);

  if (!ready || !state.user || !report || !progress) {
    return <LoadingSpinner />;
  }

  const totalItems = groupedByTradeline.size;
  const paid = progress.paid;

  if (totalItems === 0) {
    return (
      <div className="flex-1 py-10">
        <div className="app-container md:max-w-2xl">
          <Card className="p-7 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-[color:var(--color-success-soft)] text-[color:var(--color-success)] inline-flex items-center justify-center">
              <CheckCircleIcon size={28} />
            </div>
            <h1 className="text-2xl font-semibold mt-4 m-0">Good news.</h1>
            <p className="mt-2 text-[color:var(--color-muted-foreground)]">
              We didn't find any obvious disputable errors on your report. That's a great sign of a healthy file. Keep an eye on it — you can rescan any time.
            </p>
            <div className="mt-5">
              <Button href="/scan">Back to dashboard</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 sm:py-12">
      <div className="app-container md:max-w-3xl">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            <SparklesIcon size={14} /> Scan complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold mt-2 m-0">
            {paid ? "Your Dispute Plan is Ready." : `We found ${totalItems} potentially disputable item${totalItems === 1 ? "" : "s"}.`}
          </h1>
          <p className="mt-2 text-[color:var(--color-muted-foreground)]">
            {paid
              ? "Below is every item we flagged with the specific FCRA basis. Generate your letters to take action."
              : "Unlock the full legal details and generate your dispute letters to take action."}
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Tile value={totalItems.toString()} label="Items flagged" tone="warning" />
          <Tile value={flagged.length.toString()} label="FCRA violations" tone="primary" />
          <Tile value={report.tradelines.length.toString()} label="Accounts scanned" tone="neutral" />
        </div>

        {paid ? (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[color:var(--color-primary)]/30 bg-[color:var(--color-primary-soft)] p-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center">
                <FileTextIcon size={20} />
              </span>
              <div>
                <div className="font-semibold text-[color:var(--color-foreground)]">Your dispute letters are ready</div>
                <div className="text-xs text-[color:var(--color-muted-foreground)]">Three pre-formatted letters — one per bureau.</div>
              </div>
            </div>
            <Button onClick={() => setLetterOpen(true)}>Generate my dispute letters</Button>
          </div>
        ) : (
          <div className="mb-6">
            <PaywallCTA onClick={() => setPaywallOpen(true)} />
          </div>
        )}

        <div className="space-y-3">
          {Array.from(groupedByTradeline.entries()).map(([tradelineId, items]) => {
            const t = report.tradelines.find((x) => x.id === tradelineId);
            if (!t) return null;
            return (
              <Card key={tradelineId} className="overflow-hidden">
                <div className="p-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-[color:var(--color-muted-foreground)]">{t.accountNumberMasked}</div>
                      <div className="font-semibold mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{t.creditor}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--color-warning)] bg-[color:var(--color-warning-soft)] px-2 py-1 rounded-full whitespace-nowrap">
                      <AlertTriangleIcon size={12} /> {items.length} issue{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <ul className="divide-y divide-[color:var(--color-border)] list-none p-0 m-0">
                  {items.map((f) => (
                    <li key={f.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="h-8 w-8 rounded-lg bg-[color:var(--color-warning-soft)] text-[color:var(--color-warning)] inline-flex items-center justify-center shrink-0">
                          <ZapIcon size={16} />
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold">{f.reasonLabel}</div>
                          <div className="text-xs font-medium text-[color:var(--color-primary)] mt-0.5">
                            {f.fcraCitation}
                          </div>
                          <div className={`mt-2 text-sm text-[color:var(--color-muted-foreground)] ${paid ? "" : "paywall-blur"}`}>
                            <span className="font-medium text-[color:var(--color-foreground)]">Legal basis: </span>
                            {f.legalExplanation}
                          </div>
                          <div className={`mt-1 text-sm ${paid ? "" : "paywall-blur"}`}>
                            <span className="font-medium">Your answer: </span>
                            <span className="text-[color:var(--color-muted-foreground)]">{f.userExplanation}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {!paid && (
          <div className="mt-6">
            <PaywallCTA onClick={() => setPaywallOpen(true)} />
          </div>
        )}
      </div>

      <Modal open={paywallOpen} onClose={() => setPaywallOpen(false)} title="Unlock your results">
        <PaywallCheckout
          itemsCount={totalItems}
          onComplete={() => {
            markPaid(report.id);
            setPaywallOpen(false);
          }}
        />
      </Modal>

      <Modal open={letterOpen} onClose={() => setLetterOpen(false)} title="Your dispute letters" maxWidth="max-w-3xl">
        <LettersView reportId={report.id} />
      </Modal>
    </div>
  );
}

function Tile({ value, label, tone }: { value: string; label: string; tone: "warning" | "primary" | "neutral" }) {
  const styles =
    tone === "warning"
      ? "bg-[color:var(--color-warning-soft)] text-[color:var(--color-warning)]"
      : tone === "primary"
      ? "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]"
      : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)]";
  return (
    <div className={`rounded-xl p-4 ${styles}`}>
      <div className="text-2xl sm:text-3xl font-semibold leading-none">{value}</div>
      <div className="text-xs mt-1.5 font-medium opacity-80">{label}</div>
    </div>
  );
}

function PaywallCTA({ onClick }: { onClick: () => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-hover)] text-white">
        <div className="flex items-start gap-3">
          <span className="h-10 w-10 rounded-lg bg-white/20 inline-flex items-center justify-center shrink-0">
            <LockIcon />
          </span>
          <div className="flex-1">
            <div className="font-semibold text-lg">Unlock your dispute plan</div>
            <p className="text-sm text-white/85 mt-1">
              Get the full legal explanation for each item plus three ready-to-mail letters — one for each bureau.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClick}
            className="h-12 px-5 rounded-lg bg-white text-[color:var(--color-primary)] font-semibold hover:bg-white/95"
          >
            Unlock My Results — $29
          </button>
          <button
            onClick={onClick}
            className="h-12 px-5 rounded-lg border border-white/40 text-white font-medium hover:bg-white/10"
          >
            Or get Lifetime — $97
          </button>
        </div>
        <div className="mt-3 text-xs text-white/70 inline-flex items-center gap-2">
          <ShieldIcon size={14} /> Secure checkout · Refund if no items found
        </div>
      </div>
    </Card>
  );
}

function PaywallCheckout({ itemsCount, onComplete }: { itemsCount: number; onComplete: () => void }) {
  const [tier, setTier] = useState<"single" | "lifetime">("lifetime");
  const [processing, setProcessing] = useState(false);

  function pay() {
    setProcessing(true);
    setTimeout(onComplete, 1100);
  }

  return (
    <div className="p-5">
      <p className="text-sm text-[color:var(--color-muted-foreground)] mb-4">
        We found <span className="font-semibold text-[color:var(--color-foreground)]">{itemsCount} disputable item{itemsCount === 1 ? "" : "s"}</span>. Choose how you'd like to proceed.
      </p>
      <div className="space-y-3">
        <PlanOption
          selected={tier === "single"}
          onSelect={() => setTier("single")}
          title="Single Report Scan"
          price="$29"
          tag="one-time"
          features={["Unlock this scan", "Letters for all 3 bureaus", "Plain-English explanations"]}
        />
        <PlanOption
          selected={tier === "lifetime"}
          onSelect={() => setTier("lifetime")}
          title="Lifetime Access — Founder's Deal"
          price="$97"
          tag="forever"
          features={["Unlimited future scans", "All Pro features included", "Direct input on roadmap"]}
          highlight
        />
      </div>
      <div className="mt-5">
        <Button onClick={pay} fullWidth size="lg" loading={processing}>
          {processing ? "Processing secure payment..." : `Pay ${tier === "lifetime" ? "$97" : "$29"} — Unlock Results`}
        </Button>
        <p className="text-xs text-[color:var(--color-muted-foreground)] text-center mt-3">
          This is a mock payment for demo purposes. No real charge will occur.
        </p>
      </div>
    </div>
  );
}

function PlanOption({
  selected, onSelect, title, price, tag, features, highlight,
}: { selected: boolean; onSelect: () => void; title: string; price: string; tag: string; features: string[]; highlight?: boolean }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-colors ${
        selected
          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)]/60"
          : "border-[color:var(--color-border-strong)] bg-white hover:bg-[color:var(--color-surface-muted)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-5 w-5 rounded-full border-2 inline-flex items-center justify-center shrink-0 ${
          selected ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]" : "border-[color:var(--color-border-strong)]"
        }`}>
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{title}</div>
            <div className="text-right">
              <div className="font-semibold">{price}</div>
              <div className="text-xs text-[color:var(--color-muted-foreground)]">{tag}</div>
            </div>
          </div>
          {highlight && (
            <div className="text-xs font-medium text-[color:var(--color-primary)] mt-1">Most popular — 200 spots</div>
          )}
          <ul className="mt-2 space-y-1 list-none p-0 text-sm text-[color:var(--color-muted-foreground)]">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-[color:var(--color-success)]"><CheckCircleIcon size={14} /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

function LettersView({ reportId }: { reportId: string }) {
  const { state } = useStore();
  const report = state.reports.find((r) => r.id === reportId);
  const progress = state.progress[reportId];
  const user = state.user;
  const [bureau, setBureau] = useState<Bureau>("Experian");
  const [copied, setCopied] = useState(false);

  const letter = useMemo(() => {
    if (!report || !progress || !user) return "";
    return generateLetter({ bureau, user, report, flagged: progress.flagged });
  }, [bureau, report, progress, user]);

  function copy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function download() {
    if (typeof window === "undefined") return;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispute-letter-${bureau.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 sm:p-5">
      <div className="flex gap-1 p-1 bg-[color:var(--color-surface-muted)] rounded-lg overflow-x-auto no-scrollbar">
        {BUREAUS.map((b) => (
          <button
            key={b}
            onClick={() => setBureau(b)}
            className={`flex-1 min-w-fit px-4 h-9 rounded-md text-sm font-medium transition-colors ${
              bureau === b ? "bg-white shadow-sm" : "text-[color:var(--color-muted-foreground)]"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] overflow-hidden">
        <textarea
          readOnly
          value={letter}
          className="w-full block bg-[color:var(--color-surface-muted)] resize-none p-4 text-[13px] font-mono leading-relaxed min-h-[28rem] focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button onClick={copy} variant={copied ? "secondary" : "primary"} fullWidth>
          <CopyIcon size={16} /> {copied ? "Copied!" : "Copy letter"}
        </Button>
        <Button onClick={download} variant="outline" fullWidth>
          <DownloadIcon size={16} /> Download .txt
        </Button>
      </div>

      <div className="mt-4 rounded-lg bg-[color:var(--color-primary-soft)] p-4 text-sm">
        <div className="font-semibold inline-flex items-center gap-2 text-[color:var(--color-primary)]">
          <MailIcon size={16} /> How to send this letter
        </div>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-[color:var(--color-foreground)]">
          <li>Print the letter and sign it by hand. Attach a copy of your ID and proof of address.</li>
          <li>Mail it via <span className="font-medium">USPS certified mail with return receipt</span>. Keep your receipt.</li>
          <li>The bureau has 30–45 days to investigate and respond by mail.</li>
        </ol>
      </div>
    </div>
  );
}
