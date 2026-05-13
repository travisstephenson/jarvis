"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { AuthShell, Field, GoogleG } from "@/components/auth/AuthShell";
import { useStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setTimeout(() => {
      signIn(email, name || email.split("@")[0]);
      router.push("/scan");
    }, 350);
  }

  return (
    <AuthShell title="Create your account" subtitle="Start your free legal scan in seconds.">
      <Card className="p-6">
        <CardContent className="p-0">
          <button
            type="button"
            className="w-full h-11 rounded-lg border border-[color:var(--color-border-strong)] bg-white inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-[color:var(--color-surface-muted)]"
            onClick={() => { signIn("demo@user.com", "Demo User"); router.push("/scan"); }}
          >
            <GoogleG /> Sign up with Google
          </button>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[color:var(--color-border)]" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-[color:var(--color-surface)] text-[color:var(--color-muted-foreground)]">Or continue with email</span></div>
          </div>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Field label="Full name" value={name} onChange={setName} type="text" placeholder="Sarah Kim" />
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={submitting}>Sign up with Email</Button>
          </form>
          <p className="mt-4 text-sm text-center text-[color:var(--color-muted-foreground)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[color:var(--color-primary)] font-medium no-underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-center text-[color:var(--color-muted-foreground)]">
        By signing up you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </AuthShell>
  );
}
