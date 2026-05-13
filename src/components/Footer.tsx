import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] mt-auto">
      <div className="landing-container py-8 text-sm text-[color:var(--color-muted-foreground)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="m-0">© {new Date().getFullYear()} LegalScan. An educational software tool — not a credit repair organization.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[color:var(--color-foreground)] no-underline">Privacy</Link>
            <Link href="/terms" className="hover:text-[color:var(--color-foreground)] no-underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
