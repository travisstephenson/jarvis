"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldIcon,
  XIcon,
  ZapIcon,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import {
  formatCurrency,
  formatMonthYear,
  tradelineTypeLabel,
} from "@/lib/mock-data";
import { evaluateTradeline } from "@/lib/rules-engine";
import type { Tradeline } from "@/lib/types";

type QKey = "isMine" | "balanceCorrect" | "dateCorrect" | "statusCorrect" | "recognizesActivity";

function questionsForTradeline(t: Tradeline): { key: QKey; text: string }[] {
  const balanceText = `Is the reported balance of ${formatCurrency(t.balance)} correct?`;
  const dateText = `Is the date opened (${formatMonthYear(t.dateOpened)}) and the last activity date (${formatMonthYear(t.lastActivity)}) accurate?`;
  if (t.type === "collection") {
    return [
      { key: "isMine", text: "Is this account yours?" },
      { key: "balanceCorrect", text: balanceText },
      { key: "dateCorrect", text: dateText },
    ];
  }
  return [
    { key: "isMine", text: "Is this account yours?" },
    { key: "balanceCorrect", text: balanceText },
    { key: "dateCorrect", text: dateText },
    { key: "statusCorrect", text: "Is the reported account status correct?" },
    { key: "recognizesActivity", text: "Do you recognize all recent activity on this account?" },
  ];
}

export default function WizardPage() {
  const params = useParams<{ reportId: string }>();
  const router = useRouter();
  const { state, ready, setAnswer, setFlagged, setCurrentIndex } = useStore();

  const report = state.reports.find((r) => r.id === params.reportId);
  const progress = state.progress[params.reportId];
  const idx = progress?.currentIndex ?? 0;
  const tradeline = report?.tradelines[idx];
  const tlAnswers = (tradeline && progress?.answers[tradeline.id]) || {};

  const liveFlags = useMemo(
    () => (tradeline ? evaluateTradeline(tradeline, tlAnswers) : []),
    [tradeline, tlAnswers]
  );

  useEffect(() => {
    if (!ready) return;
    if (!state.user) router.replace("/login");
    else if (!report) router.replace("/scan");
  }, [ready, state.user, report, router]);

  if (!ready || !state.user || !report || !tradeline) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <span className="inline-block h-6 w-6 border-2 border-[color:var(--color-primary)] border-t-transparent rounded-full spin-slow" />
      </div>
    );
  }

  const total = report.tradelines.length;
  const isLast = idx === total - 1;
  const questions = questionsForTradeline(tradeline);

  // The current question is the first unanswered one.
  const answeredCount = questions.filter((q) => tlAnswers[q.key] !== undefined).length;
  // Once "isMine" is "no", subsequent questions are skipped.
  const shortCircuit = tlAnswers.isMine === "no";
  const visibleQuestions = shortCircuit ? questions.slice(0, 1) : questions.slice(0, answeredCount + 1);
  const allAnswered = shortCircuit || answeredCount >= questions.length;

  function answerQuestion(qKey: QKey, value: "yes" | "no") {
    setAnswer(report!.id, tradeline!.id, { [qKey]: value });
  }

  function recomputeAndAdvance(direction: 1 | -1) {
    // Recompute flagged items for the whole report after every step.
    const updatedAnswers = progress?.answers ?? {};
    const flagged = report!.tradelines.flatMap((t) =>
      evaluateTradeline(t, updatedAnswers[t.id])
    );
    setFlagged(report!.id, flagged);

    const nextIdx = idx + direction;
    if (direction === 1 && isLast) {
      router.push(`/scan/results/${report!.id}`);
      return;
    }
    if (nextIdx >= 0 && nextIdx < total) {
      setCurrentIndex(report!.id, nextIdx);
    }
  }

  return (
    <div className="flex-1 bg-[color:var(--color-background)]">
      {/* Slim header */}
      <div className="sticky top-0 z-20 bg-[color:var(--color-surface)]/95 backdrop-blur border-b border-[color:var(--color-border)]">
        <div className="app-container md:max-w-2xl flex items-center gap-3 h-14">
          <Link
            href="/scan"
            className="p-2 -ml-2 rounded-lg text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-surface-muted)]"
            aria-label="Exit wizard"
          >
            <XIcon />
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted-foreground)]">
                Account {idx + 1} of {total}
              </span>
              <span className="text-xs font-medium text-[color:var(--color-primary)] inline-flex items-center gap-1">
                <ShieldIcon size={14} /> Encrypted
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[color:var(--color-surface-muted)] overflow-hidden">
              <div
                className="h-full bg-[color:var(--color-primary)] transition-all"
                style={{ width: `${((idx + (allAnswered ? 1 : 0)) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="app-container md:max-w-2xl py-6">
        {/* Tradeline card */}
        <Card className="p-5 fade-in" key={tradeline.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[color:var(--color-muted-foreground)]">
                {tradelineTypeLabel(tradeline.type)}
              </div>
              <h2 className="text-xl font-semibold m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>
                {tradeline.creditor}
              </h2>
              <div className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
                {tradeline.accountNumberMasked}
              </div>
            </div>
            <StatusBadge tradeline={tradeline} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Field label="Balance" value={formatCurrency(tradeline.balance)} />
            {tradeline.creditLimit ? (
              <Field label="Limit" value={formatCurrency(tradeline.creditLimit)} />
            ) : (
              <Field label="Opened" value={formatMonthYear(tradeline.dateOpened)} />
            )}
            <Field label="Date Opened" value={formatMonthYear(tradeline.dateOpened)} />
            <Field label="Last Activity" value={formatMonthYear(tradeline.lastActivity)} />
          </div>
        </Card>

        {/* Questions */}
        <div className="mt-4 space-y-3">
          {visibleQuestions.map((q, qi) => {
            const value = tlAnswers[q.key];
            return (
              <Card key={q.key} className="p-4 fade-in" style={{ animationDelay: `${qi * 60}ms` }}>
                <div className="flex items-start gap-3">
                  <span className="h-7 w-7 rounded-full bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] font-semibold inline-flex items-center justify-center shrink-0 text-sm">
                    {qi + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{q.text}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <AnswerButton
                        selected={value === "yes"}
                        onClick={() => answerQuestion(q.key, "yes")}
                      >
                        Yes
                      </AnswerButton>
                      <AnswerButton
                        selected={value === "no"}
                        variant="no"
                        onClick={() => answerQuestion(q.key, "no")}
                      >
                        No
                      </AnswerButton>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live feedback if items flagged */}
        {liveFlags.length > 0 && (
          <div className="mt-4 rounded-xl border border-[color:var(--color-warning)]/30 bg-[color:var(--color-warning-soft)] p-4 fade-in">
            <div className="flex items-center gap-2 font-semibold text-[color:var(--color-warning)]">
              <ZapIcon size={16} /> Potentially disputable
            </div>
            <ul className="mt-2 space-y-1.5 list-none p-0 text-sm text-[color:var(--color-foreground)]">
              {liveFlags.map((f) => (
                <li key={f.id} className="flex items-start gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-warning)] mt-2 shrink-0" />
                  <span>
                    <span className="font-medium">{f.reasonLabel}</span>
                    <span className="text-[color:var(--color-muted-foreground)]"> · {f.fcraCitation}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[color:var(--color-muted-foreground)] mt-2">
              We'll show the full legal explanation and your dispute letter on the next screen.
            </p>
          </div>
        )}

        {/* Wizard nav */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => recomputeAndAdvance(-1)}
            disabled={idx === 0}
          >
            <ChevronLeftIcon size={18} /> Back
          </Button>
          <div className="text-xs text-[color:var(--color-muted-foreground)] hidden sm:block">
            {allAnswered ? "Great job. Tap Next to continue." : "Answer to continue."}
          </div>
          <Button
            onClick={() => recomputeAndAdvance(1)}
            disabled={!allAnswered}
          >
            {isLast ? "See results" : "Next"} <ChevronRightIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[color:var(--color-surface-muted)] px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-muted-foreground)] font-medium">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

function StatusBadge({ tradeline }: { tradeline: Tradeline }) {
  const map: Record<Tradeline["status"], { label: string; color: string; bg: string }> = {
    open: { label: "Open", color: "var(--color-success)", bg: "var(--color-success-soft)" },
    closed: { label: "Closed", color: "var(--color-muted-foreground)", bg: "var(--color-surface-muted)" },
    collection: { label: "Collection", color: "var(--color-destructive)", bg: "var(--color-destructive-soft)" },
    charge_off: { label: "Charge-Off", color: "var(--color-destructive)", bg: "var(--color-destructive-soft)" },
  };
  const s = map[tradeline.status];
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function AnswerButton({
  selected,
  variant = "yes",
  onClick,
  children,
}: {
  selected: boolean;
  variant?: "yes" | "no";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const selectedClass =
    variant === "yes"
      ? "border-[color:var(--color-success)] bg-[color:var(--color-success-soft)] text-[color:var(--color-success)]"
      : "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]";
  return (
    <button
      onClick={onClick}
      className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
        selected
          ? selectedClass
          : "border-[color:var(--color-border-strong)] bg-white text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)]"
      }`}
    >
      {children}
    </button>
  );
}
