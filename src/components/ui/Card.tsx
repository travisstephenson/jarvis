import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-5 pb-3 ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-5 pt-3 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-5 pt-3 border-t border-[color:var(--color-border)] ${className}`}>{children}</div>;
}
