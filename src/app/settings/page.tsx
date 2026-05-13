"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const router = useRouter();
  const { state, ready, signOut, reset } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (ready && !state.user) router.replace("/login");
  }, [ready, state.user, router]);

  if (!ready || !state.user) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <span className="inline-block h-6 w-6 border-2 border-[color:var(--color-primary)] border-t-transparent rounded-full spin-slow" />
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 sm:py-12">
      <div className="app-container md:max-w-2xl">
        <h1 className="text-3xl font-semibold m-0 mb-6">Settings</h1>

        <Card className="p-5 sm:p-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-[color:var(--color-muted-foreground)]">Account</div>
          <div className="mt-3 space-y-3">
            <Row label="Full name" value={state.user.fullName} />
            <Row label="Email" value={state.user.email} />
            <Row label="Plan" value={state.user.hasLifetimeAccess ? "Lifetime Founder" : "Free"} />
          </div>
        </Card>

        <Card className="p-5 sm:p-6 mt-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-[color:var(--color-muted-foreground)]">Session</div>
          <p className="text-sm text-[color:var(--color-muted-foreground)] mt-2">
            Log out of this device. You can sign back in anytime.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => { signOut(); router.push("/"); }}>
              Log out
            </Button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 mt-4 border-[color:var(--color-destructive)]/30">
          <div className="text-xs uppercase tracking-wider font-semibold text-[color:var(--color-destructive)]">Danger zone</div>
          <p className="text-sm text-[color:var(--color-muted-foreground)] mt-2">
            Delete your account and all uploaded report data. This cannot be undone.
          </p>
          {confirmDelete ? (
            <div className="mt-4 flex gap-2">
              <Button variant="destructive" onClick={() => { reset(); router.push("/"); }}>
                Yes, delete everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                Delete my account
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0 border-[color:var(--color-border)]">
      <span className="text-sm text-[color:var(--color-muted-foreground)]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
