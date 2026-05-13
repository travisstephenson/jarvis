"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] shadow-sm",
  secondary:
    "bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-border)]",
  outline:
    "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)]",
  ghost:
    "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)]",
  destructive:
    "bg-[color:var(--color-destructive)] text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  href?: string;
  loading?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  href,
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  const cls = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full spin-slow" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}
