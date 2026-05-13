"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CreditReport, FlaggedItem, ReportProgress, StoreShape, User, WizardAnswers } from "./types";

const STORAGE_KEY = "legalscan:v1";

const empty: StoreShape = { user: null, reports: [], progress: {} };

function load(): StoreShape {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as StoreShape;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

function save(state: StoreShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

type StoreApi = {
  state: StoreShape;
  ready: boolean;
  signIn: (email: string, fullName?: string) => User;
  signOut: () => void;
  addReport: (report: CreditReport) => void;
  deleteReport: (reportId: string) => void;
  setAnswer: (
    reportId: string,
    tradelineId: string,
    answers: Partial<WizardAnswers[string]>
  ) => void;
  setFlagged: (reportId: string, flagged: FlaggedItem[]) => void;
  setCurrentIndex: (reportId: string, idx: number) => void;
  markPaid: (reportId: string) => void;
  reset: () => void;
};

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreShape>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(state);
  }, [state, ready]);

  const signIn = useCallback((email: string, fullName?: string): User => {
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      email,
      fullName: fullName || email.split("@")[0],
      hasLifetimeAccess: false,
    };
    setState((s) => ({ ...s, user }));
    return user;
  }, []);

  const signOut = useCallback(() => {
    setState({ user: null, reports: [], progress: {} });
  }, []);

  const addReport = useCallback((report: CreditReport) => {
    setState((s) => {
      const progress: ReportProgress = {
        reportId: report.id,
        answers: {},
        flagged: [],
        currentIndex: 0,
        paid: false,
      };
      return {
        ...s,
        reports: [report, ...s.reports.filter((r) => r.id !== report.id)],
        progress: { ...s.progress, [report.id]: progress },
      };
    });
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    setState((s) => {
      const { [reportId]: _omit, ...rest } = s.progress;
      return {
        ...s,
        reports: s.reports.filter((r) => r.id !== reportId),
        progress: rest,
      };
    });
  }, []);

  const setAnswer = useCallback<StoreApi["setAnswer"]>((reportId, tradelineId, answers) => {
    setState((s) => {
      const existing = s.progress[reportId] ?? {
        reportId, answers: {}, flagged: [], currentIndex: 0, paid: false,
      };
      const merged: ReportProgress = {
        ...existing,
        answers: {
          ...existing.answers,
          [tradelineId]: { ...existing.answers[tradelineId], ...answers },
        },
      };
      return { ...s, progress: { ...s.progress, [reportId]: merged } };
    });
  }, []);

  const setFlagged = useCallback<StoreApi["setFlagged"]>((reportId, flagged) => {
    setState((s) => {
      const existing = s.progress[reportId] ?? {
        reportId, answers: {}, flagged: [], currentIndex: 0, paid: false,
      };
      return { ...s, progress: { ...s.progress, [reportId]: { ...existing, flagged } } };
    });
  }, []);

  const setCurrentIndex = useCallback<StoreApi["setCurrentIndex"]>((reportId, idx) => {
    setState((s) => {
      const existing = s.progress[reportId] ?? {
        reportId, answers: {}, flagged: [], currentIndex: 0, paid: false,
      };
      return { ...s, progress: { ...s.progress, [reportId]: { ...existing, currentIndex: idx } } };
    });
  }, []);

  const markPaid = useCallback<StoreApi["markPaid"]>((reportId) => {
    setState((s) => {
      const existing = s.progress[reportId] ?? {
        reportId, answers: {}, flagged: [], currentIndex: 0, paid: false,
      };
      return {
        ...s,
        user: s.user ? { ...s.user, hasLifetimeAccess: true } : s.user,
        progress: { ...s.progress, [reportId]: { ...existing, paid: true } },
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(empty);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      state, ready, signIn, signOut, addReport, deleteReport,
      setAnswer, setFlagged, setCurrentIndex, markPaid, reset,
    }),
    [state, ready, signIn, signOut, addReport, deleteReport, setAnswer, setFlagged, setCurrentIndex, markPaid, reset]
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
