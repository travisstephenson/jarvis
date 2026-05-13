"use client";

import { useState } from "react";
import { ChevronDownIcon } from "../icons";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this legal?",
    a: "Yes, 100%. The Fair Credit Reporting Act (FCRA) is a federal law that gives you the right to dispute inaccurate information on your credit report. We help you identify what's disputable and exercise that right yourself.",
  },
  {
    q: "Is this a credit repair service?",
    a: "No. We are an educational software tool. We do not contact the bureaus for you. We empower you with the information and documents to do it yourself — which is more effective and keeps you in control.",
  },
  {
    q: "Do you guarantee my score will go up?",
    a: "No one can legally guarantee a score increase. We guarantee that we will help you find potentially inaccurate items based on consumer law. Successfully removing errors will very likely improve your score.",
  },
  {
    q: "Why a one-time fee?",
    a: "Because we hate predatory subscriptions as much as you do. Our goal is to give you the tools you need to fix your report, not lock you into a monthly payment.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your data is encrypted in transit and at rest. We never share or sell your data, and you can delete it from your account at any time.",
  },
  {
    q: "What if I don't find any errors?",
    a: "That's great news — it means your report is accurate. Our fee is for the comprehensive legal scan itself, which provides peace of mind either way.",
  },
  {
    q: "What file format do I need to upload?",
    a: "For our initial launch, we support the standard JSON data file that you can download for free from Credit Karma. (For testing, we also include a built-in sample report.)",
  },
  {
    q: "What happens after I send the letters?",
    a: "The credit bureaus have 30 to 45 days to investigate your dispute and respond. You will receive their findings by mail.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="landing-container max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3 m-0">Common Questions</h2>
        <p className="text-center text-[color:var(--color-muted-foreground)]">Everything skeptical-you wants to know.</p>
        <div className="mt-10 divide-y divide-[color:var(--color-border)] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
          {FAQS.map((item, i) => (
            <Item key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[color:var(--color-surface-muted)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""} text-[color:var(--color-muted-foreground)]`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1 text-sm text-[color:var(--color-muted-foreground)]">{a}</div>
      )}
    </div>
  );
}
