"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { ChevronDownIcon, MenuIcon, UserIcon, XIcon } from "./icons";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, ready, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide nav on wizard for focus.
  const hideOnWizard = pathname?.includes("/scan/wizard");
  if (hideOnWizard) return null;

  const isAuthed = ready && !!state.user;
  const onLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-30 bg-[color:var(--color-surface)]/85 backdrop-blur border-b border-[color:var(--color-border)]">
      <div className="landing-container">
        <div className="h-16 flex items-center justify-between">
          <Logo href={isAuthed ? "/scan" : "/"} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {onLanding && !isAuthed && (
              <>
                <a href="#how-it-works" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] no-underline">How it works</a>
                <a href="#pricing" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] no-underline">Pricing</a>
                <a href="#faq" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] no-underline">FAQ</a>
              </>
            )}
            {isAuthed ? (
              <>
                <Link href="/scan" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] no-underline">Dashboard</Link>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-lg hover:bg-[color:var(--color-surface-muted)]"
                  >
                    <span className="h-7 w-7 rounded-full bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] inline-flex items-center justify-center">
                      <UserIcon size={16} />
                    </span>
                    <ChevronDownIcon size={14} />
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-lg overflow-hidden"
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-[color:var(--color-border)]">
                        <div className="text-sm font-medium truncate">{state.user?.fullName}</div>
                        <div className="text-xs text-[color:var(--color-muted-foreground)] truncate">{state.user?.email}</div>
                      </div>
                      <Link href="/settings" className="block px-4 py-2.5 text-sm hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" onClick={() => setMenuOpen(false)}>Settings</Link>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)]"
                        onClick={() => {
                          signOut();
                          setMenuOpen(false);
                          router.push("/");
                        }}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] no-underline">Log in</Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] no-underline text-sm font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-[color:var(--color-surface-muted)]"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 bg-[color:var(--color-surface)] shadow-xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[color:var(--color-border)]">
              <Logo size="sm" />
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 rounded-lg hover:bg-[color:var(--color-surface-muted)]">
                <XIcon />
              </button>
            </div>
            <nav className="flex-1 p-2 text-[15px]">
              {onLanding && !isAuthed && (
                <>
                  <a className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
                  <a className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
                  <a className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" href="#faq" onClick={() => setOpen(false)}>FAQ</a>
                  <div className="h-px bg-[color:var(--color-border)] my-2" />
                </>
              )}
              {isAuthed ? (
                <>
                  <Link href="/scan" className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link href="/settings" className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" onClick={() => setOpen(false)}>Settings</Link>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)]"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                      router.push("/");
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 rounded-lg hover:bg-[color:var(--color-surface-muted)] no-underline text-[color:var(--color-foreground)]" onClick={() => setOpen(false)}>Log in</Link>
                  <Link href="/signup" className="block px-4 py-3 rounded-lg bg-[color:var(--color-primary)] text-white no-underline mx-2" onClick={() => setOpen(false)}>Sign up</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
