import type { CreditReport, Tradeline } from "./types";

const sampleTradelines: Tradeline[] = [
  {
    id: "tl-1",
    creditor: "CAPITAL ONE BANK USA NA",
    accountNumberMasked: "****4521",
    type: "credit_card",
    balance: 1842,
    creditLimit: 3000,
    dateOpened: "2019-03",
    lastActivity: "2026-04",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "none" },
  },
  {
    id: "tl-2",
    creditor: "CHASE FREEDOM UNLIMITED",
    accountNumberMasked: "****8830",
    type: "credit_card",
    balance: 412,
    creditLimit: 5000,
    dateOpened: "2021-08",
    lastActivity: "2026-05",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "none" },
  },
  {
    id: "tl-3",
    creditor: "PORTFOLIO RECOVERY ASSOC",
    accountNumberMasked: "****1190",
    type: "collection",
    balance: 847,
    dateOpened: "2018-02",
    lastActivity: "2025-11",
    status: "collection",
    paymentStatus: "in_collections",
    hints: { accuracyIssue: "not_mine" },
  },
  {
    id: "tl-4",
    creditor: "MIDLAND CREDIT MGMT",
    accountNumberMasked: "****6633",
    type: "collection",
    balance: 2104,
    dateOpened: "2017-06",
    lastActivity: "2025-02",
    status: "collection",
    paymentStatus: "in_collections",
    hints: { accuracyIssue: "re_aged" },
  },
  {
    id: "tl-5",
    creditor: "DISCOVER IT CARD",
    accountNumberMasked: "****2207",
    type: "credit_card",
    balance: 0,
    creditLimit: 4500,
    dateOpened: "2020-11",
    lastActivity: "2026-03",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "none" },
  },
  {
    id: "tl-6",
    creditor: "ALLY AUTO FINANCE",
    accountNumberMasked: "****9912",
    type: "auto",
    balance: 14320,
    dateOpened: "2022-07",
    lastActivity: "2026-05",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "wrong_balance" },
  },
  {
    id: "tl-7",
    creditor: "NAVIENT STUDENT LOAN",
    accountNumberMasked: "****0044",
    type: "loan",
    balance: 8920,
    dateOpened: "2015-09",
    lastActivity: "2026-04",
    status: "open",
    paymentStatus: "30_late",
    hints: { accuracyIssue: "wrong_status" },
  },
  {
    id: "tl-8",
    creditor: "SYNCHRONY / AMAZON",
    accountNumberMasked: "****7711",
    type: "credit_card",
    balance: 215,
    creditLimit: 1500,
    dateOpened: "2023-01",
    lastActivity: "2026-05",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "none" },
  },
  {
    id: "tl-9",
    creditor: "LVNV FUNDING LLC",
    accountNumberMasked: "****4408",
    type: "collection",
    balance: 533,
    dateOpened: "2019-04",
    lastActivity: "2024-12",
    status: "collection",
    paymentStatus: "in_collections",
    hints: { accuracyIssue: "duplicate" },
  },
  {
    id: "tl-10",
    creditor: "WELLS FARGO HOME MORTGAGE",
    accountNumberMasked: "****2255",
    type: "mortgage",
    balance: 248_000,
    dateOpened: "2021-04",
    lastActivity: "2026-05",
    status: "open",
    paymentStatus: "current",
    hints: { accuracyIssue: "none" },
  },
];

export function createSampleReport(userId: string): CreditReport {
  return {
    id: `rpt-${Date.now().toString(36)}`,
    userId,
    source: "Sample",
    fileName: "sample-credit-report.json",
    uploadedAt: new Date().toISOString(),
    status: "processed",
    tradelines: sampleTradelines.map((t) => ({ ...t })),
  };
}

export function tradelineTypeLabel(type: Tradeline["type"]): string {
  switch (type) {
    case "credit_card": return "Credit Card";
    case "loan": return "Loan";
    case "collection": return "Collection";
    case "mortgage": return "Mortgage";
    case "auto": return "Auto Loan";
  }
}

export function formatMonthYear(value: string): string {
  // value: "2019-03"
  const [y, m] = value.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return value;
  return `${months[idx]} ${y}`;
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
