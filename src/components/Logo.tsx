import Link from "next/link";
import { ShieldIcon } from "./icons";

export function Logo({ href = "/", size = "md" }: { href?: string; size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-base" : "text-lg";
  const iconSize = size === "sm" ? 18 : 22;
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${text} text-[color:var(--color-foreground)] no-underline`}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[color:var(--color-primary)] text-white">
        <ShieldIcon size={iconSize} strokeWidth={2.2} />
      </span>
      LegalScan
    </Link>
  );
}
