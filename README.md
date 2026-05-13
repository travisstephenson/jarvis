# LegalScan — Frontend Prototype

Mobile-first responsive web app that scans a credit report for legally disputable
errors and generates dispute letters. Frontend-only with mock data — no backend
wired up yet.

## Quick start

```sh
npm install
npm run dev
```

Open http://localhost:3000 in a browser (resize to phone width for the intended
look, or open dev tools → device mode).

## Demo flow

1. Landing page (`/`)
2. Click **Start Your Free Legal Scan** → `/signup`
3. Any email + password works (or **Sign up with Google** for instant demo) →
   redirects to `/scan`
4. Click **Use sample report** → wizard at `/scan/wizard/[reportId]`
5. Walk through the 10-account sample report answering the Q&A
6. Final screen at `/scan/results/[reportId]` shows flagged items behind a paywall
7. Click **Unlock** → mock checkout → unlocked results
8. **Generate my dispute letters** → modal with Experian / Equifax / TransUnion
   letters, copy and download as `.txt`

State is persisted in `localStorage` so refresh-resume works. Wipe it via
**Settings → Delete my account**.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 (CSS-first tokens in `globals.css`)
- Lora (headings) + Inter (UI) from Google Fonts
- Zero runtime dependencies beyond React/Next — icons are inline SVG
- No backend yet: mock store under `src/lib/store.tsx`, mock data under
  `src/lib/mock-data.ts`, rules engine under `src/lib/rules-engine.ts`

## File layout

```
src/
  app/
    page.tsx                          # landing
    login/page.tsx
    signup/page.tsx
    scan/page.tsx                     # dashboard
    scan/wizard/[reportId]/page.tsx   # Q&A wizard
    scan/results/[reportId]/page.tsx  # results + paywall + letters
    settings/page.tsx
    privacy/page.tsx
    terms/page.tsx
  components/
    ui/Button.tsx, Card.tsx, Modal.tsx
    Nav.tsx, Footer.tsx, Logo.tsx
    landing/FAQ.tsx
    auth/AuthShell.tsx
    icons.tsx
  lib/
    types.ts
    mock-data.ts        # sample 10-tradeline credit report
    rules-engine.ts     # FCRA-grounded dispute detection
    letters.ts          # bureau-specific letter template
    store.tsx           # localStorage-backed React context
```

## Next steps when you're ready for backend

The spec (`Legal_Dispute_Scanner_gameplan.pdf`) calls for Supabase + Stripe.
The frontend is structured so each side-effect (`signIn`, `addReport`,
`markPaid`, etc.) goes through the store and can be swapped to Supabase calls
without touching the page components.
