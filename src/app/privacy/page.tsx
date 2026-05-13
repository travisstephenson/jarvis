export default function PrivacyPage() {
  return (
    <div className="flex-1 py-12">
      <div className="landing-container max-w-3xl prose-like">
        <h1 className="text-4xl font-semibold m-0">Privacy Policy</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">Last updated: today</p>

        <Section title="What we collect">
          <p>
            When you create an account, we collect the email address you provide and, optionally, your
            full name. When you upload a credit report file, we collect the contents of that file so we
            can help you scan it for legally disputable items.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            We use the data you provide solely to operate LegalScan: to authenticate your account, to
            parse your credit report and surface potentially disputable items under the FCRA, and to
            generate dispute letters on your behalf. We do not sell, rent, or share your data with third
            parties for marketing.
          </p>
        </Section>

        <Section title="Encryption & retention">
          <p>
            Data is encrypted in transit (TLS) and at rest. You can delete your account and all
            associated reports at any time from the Settings page. When you do, the data is purged from
            our active database within 30 days.
          </p>
        </Section>

        <Section title="Disclaimer">
          <p>
            LegalScan is an educational software tool. We are not a credit repair organization, a law
            firm, or a financial advisor. We do not provide legal advice. Use of this tool does not
            create an attorney-client relationship.
          </p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy? Email <span className="font-medium">privacy@legalscan.co</span>.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold m-0">{title}</h2>
      <div className="mt-2 text-[15px] text-[color:var(--color-foreground)] leading-relaxed [&_p]:m-0 [&_p+p]:mt-3">
        {children}
      </div>
    </section>
  );
}
