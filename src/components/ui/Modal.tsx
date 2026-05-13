"use client";

import { useEffect } from "react";
import { XIcon } from "../icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
};

export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-hidden bg-[color:var(--color-surface)] rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-border)] shrink-0">
          <h2 className="text-lg font-semibold m-0">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[color:var(--color-surface-muted)] text-[color:var(--color-muted-foreground)]"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
