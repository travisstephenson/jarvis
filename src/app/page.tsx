import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  AlertTriangleIcon,
  CheckIcon,
  DollarSignIcon,
  FileTextIcon,
  LockIcon,
  ScaleIcon,
  ScanIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "@/components/icons";
import { FAQ } from "@/components/landing/FAQ";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[color:var(--color-primary-soft)] to-[color:var(--color-background)] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="landing-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[color:var(--color-border)] text-xs font-medium text-[color:var(--color-primary)] mb-5">
                <SparklesIcon size={14} /> Founder's Launch — 200 spots available
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight m-0">
                Stop Guessing. <br /> Start Disputing.
              </h1>
              <p className="mt-5 text-lg text-[color:var(--color-muted-foreground)] max-w-xl">
                Our tool scans your credit report for legally disputable errors and generates the letters for you.
                No scams. No complexity. Just your rights, simplified.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button href="/signup" size="lg">Start Your Free Legal Scan</Button>
                <Button href="#how-it-works" variant="outline" size="lg">See how it works</Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[color:var(--color-muted-foreground)]">
                <li className="inline-flex items-center gap-1.5"><CheckIcon size={16} className="text-[color:var(--color-success)]" /> No monthly fees</li>
                <li className="inline-flex items-center gap-1.5"><CheckIcon size={16} className="text-[color:var(--color-success)]" /> FCRA-grounded</li>
                <li className="inline-flex items-center gap-1.5"><CheckIcon size={16} className="text-[color:var(--color-success)]" /> Letters in minutes</li>
              </ul>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 md:py-20">
        <div className="landing-container">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3 m-0">Credit Repair Is Broken.</h2>
          <p className="text-center text-[color:var(--color-muted-foreground)] max-w-2xl mx-auto">
            The current options exploit confusion. We built something different.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <ProblemCard
              icon={<DollarSignIcon />}
              title="Predatory Services"
              body="$100/mo for black-box tactics that can get you in trouble — and often dispute legitimate items by mistake."
            />
            <ProblemCard
              icon={<ScaleIcon />}
              title="Confusing Laws"
              body="The FCRA gives you rights, but reading it feels like homework for a law degree."
            />
            <ProblemCard
              icon={<AlertTriangleIcon />}
              title="Fear of Mistakes"
              body="Disputing the wrong way can backfire. Most people stay paralyzed."
            />
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="how-it-works" className="py-16 md:py-20 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)]">
        <div className="landing-container">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3 m-0">
            Your Legal Advantage, in 3 Simple Steps
          </h2>
          <p className="text-center text-[color:var(--color-muted-foreground)] max-w-2xl mx-auto">
            We don't repair your credit. We teach you exactly how to do it — and hand you the documents.
          </p>
          <ol className="grid md:grid-cols-3 gap-4 mt-10 list-none p-0">
            <StepCard
              n={1}
              icon={<ScanIcon />}
              title="Upload Your Report"
              body="Securely upload your credit report data from a free service like Credit Karma. Or try our sample report instantly."
            />
            <StepCard
              n={2}
              icon={<SparklesIcon />}
              title="Answer Simple Questions"
              body="Our wizard walks you through each account, asking plain-English questions. No legal jargon."
            />
            <StepCard
              n={3}
              icon={<FileTextIcon />}
              title="Generate Your Letters"
              body="Get professionally formatted dispute letters with the correct legal citations, ready to mail."
            />
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="landing-container">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 m-0">Why LegalScan Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={<ScaleIcon />} title="FCRA-Based Engine" body="Every flagged item cites the specific section of the law that supports it." />
            <FeatureCard icon={<SparklesIcon />} title="Educational Wizard" body="We explain the why behind each dispute — so you actually learn your rights." />
            <FeatureCard icon={<ShieldIcon />} title="Scam Filter" body="We filter out frivolous tactics that get disputes rejected and put your file at risk." />
            <FeatureCard icon={<DollarSignIcon />} title="One-Time Price" body="No subscriptions. No hidden fees. Pay once, dispute as much as you need." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-20 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)]">
        <div className="landing-container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold m-0">Get Lifetime Access</h2>
            <p className="mt-3 text-[color:var(--color-muted-foreground)]">
              No subscriptions. No hidden fees. Ever.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-7">
              <div className="text-sm font-medium text-[color:var(--color-muted-foreground)]">Single Report Scan</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">$29</span>
                <span className="text-[color:var(--color-muted-foreground)]">one-time</span>
              </div>
              <ul className="mt-5 space-y-2 list-none p-0 text-sm">
                <PricingLi>Scan one full credit report</PricingLi>
                <PricingLi>Generate letters for all 3 bureaus</PricingLi>
                <PricingLi>Plain-English dispute reasons</PricingLi>
              </ul>
              <Button href="/signup" variant="outline" fullWidth className="mt-6">Get started</Button>
            </Card>

            <Card className="p-7 border-2 border-[color:var(--color-primary)] relative">
              <div className="absolute -top-3 left-7 px-2.5 py-0.5 rounded-full bg-[color:var(--color-primary)] text-white text-xs font-semibold">
                Founder's Deal — 200 spots
              </div>
              <div className="text-sm font-medium text-[color:var(--color-primary)]">Lifetime Access</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">$97</span>
                <span className="text-[color:var(--color-muted-foreground)]">one-time, forever</span>
              </div>
              <ul className="mt-5 space-y-2 list-none p-0 text-sm">
                <PricingLi>Unlimited report scans</PricingLi>
                <PricingLi>All future Pro features included</PricingLi>
                <PricingLi>Ongoing monitoring (coming soon)</PricingLi>
                <PricingLi>Direct input on the roadmap</PricingLi>
              </ul>
              <Button href="/signup" fullWidth className="mt-6">Become a Founding Member</Button>
            </Card>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-[color:var(--color-foreground)] text-white">
        <div className="landing-container text-center">
          <h2 className="text-3xl md:text-4xl font-semibold m-0 text-white">Become a Founding Member.</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Get LegalScan for life. Lock in lifetime access for a one-time $97 and help fund an honest alternative.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] no-underline font-medium"
            >
              Start Your Free Legal Scan
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-white/30 text-white hover:bg-white/10 no-underline"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ProblemCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="p-6">
      <div className="h-10 w-10 rounded-lg bg-[color:var(--color-destructive-soft)] text-[color:var(--color-destructive)] inline-flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-lg m-0">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{body}</p>
    </Card>
  );
}

function StepCard({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <li>
      <Card className="p-6 h-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-9 w-9 rounded-full bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] font-semibold inline-flex items-center justify-center">
            {n}
          </span>
          <span className="h-9 w-9 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] inline-flex items-center justify-center">
            {icon}
          </span>
        </div>
        <h3 className="font-semibold text-lg m-0">{title}</h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{body}</p>
      </Card>
    </li>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="p-6">
      <div className="h-10 w-10 rounded-lg bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] inline-flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-base m-0">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{body}</p>
    </Card>
  );
}

function PricingLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[color:var(--color-success)]"><CheckIcon size={18} /></span>
      <span className="text-[color:var(--color-foreground)]">{children}</span>
    </li>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-xs">
        {/* Phone frame */}
        <div className="rounded-[2.2rem] bg-[color:var(--color-foreground)] p-2 shadow-2xl">
          <div className="rounded-[1.8rem] bg-[color:var(--color-background)] overflow-hidden aspect-[9/19] flex flex-col">
            <div className="h-7 flex items-center justify-center">
              <div className="h-1 w-16 rounded-full bg-[color:var(--color-foreground)]/20" />
            </div>
            <div className="px-4 pt-2 pb-3 border-b border-[color:var(--color-border)] flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center"><ShieldIcon size={16} /></span>
              <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-serif)" }}>LegalScan</span>
            </div>
            <div className="flex-1 px-4 py-4 overflow-hidden">
              <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-muted-foreground)] font-medium">
                Account 4 of 10
              </div>
              <div className="h-1.5 mt-1.5 rounded-full bg-[color:var(--color-surface-muted)] overflow-hidden">
                <div className="h-full w-[40%] bg-[color:var(--color-primary)]" />
              </div>
              <div className="mt-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-muted-foreground)]">Collection</div>
                <div className="text-sm font-semibold mt-0.5">MIDLAND CREDIT MGMT</div>
                <div className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">****6633 · $2,104</div>
              </div>
              <div className="mt-4 text-sm font-medium">Is this account yours?</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg border border-[color:var(--color-border-strong)] inline-flex items-center justify-center text-sm">Yes</div>
                <div className="h-10 rounded-lg bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center text-sm font-medium">No</div>
              </div>
              <div className="mt-4 rounded-lg bg-[color:var(--color-warning-soft)] border border-[color:var(--color-warning)]/30 p-3">
                <div className="text-[11px] font-semibold text-[color:var(--color-warning)] inline-flex items-center gap-1">
                  <ZapIcon size={12} /> Potentially disputable
                </div>
                <div className="text-xs text-[color:var(--color-foreground)] mt-1">
                  Possible re-aged debt — FCRA § 1681c(a)(4)
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Floating badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--color-success)] text-white text-xs font-semibold shadow-lg">
          <LockIcon size={14} /> Encrypted &amp; private
        </div>
      </div>
    </div>
  );
}
