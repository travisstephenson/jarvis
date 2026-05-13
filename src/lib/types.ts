export type TradelineType = "credit_card" | "loan" | "collection" | "mortgage" | "auto";

export type Tradeline = {
  id: string;
  creditor: string;
  accountNumberMasked: string;
  type: TradelineType;
  balance: number;
  creditLimit?: number;
  dateOpened: string; // YYYY-MM
  lastActivity: string; // YYYY-MM
  status: "open" | "closed" | "collection" | "charge_off";
  paymentStatus: "current" | "30_late" | "60_late" | "90_late" | "in_collections";
  // Hints used by the wizard demo. In production the user supplies these.
  hints?: {
    accuracyIssue?: "not_mine" | "wrong_balance" | "wrong_date" | "wrong_status" | "duplicate" | "re_aged" | "none";
  };
};

export type CreditReport = {
  id: string;
  userId: string;
  source: "Credit Karma" | "Experian" | "Sample";
  fileName: string;
  uploadedAt: string;
  status: "uploaded" | "processed" | "completed";
  tradelines: Tradeline[];
};

export type WizardAnswers = {
  [tradelineId: string]: {
    isMine?: "yes" | "no";
    balanceCorrect?: "yes" | "no";
    dateCorrect?: "yes" | "no";
    statusCorrect?: "yes" | "no";
    recognizesActivity?: "yes" | "no";
  };
};

export type FlaggedItem = {
  id: string;
  tradelineId: string;
  reasonCode: string;
  reasonLabel: string;
  fcraCitation: string;
  legalExplanation: string;
  userExplanation: string;
};

export type ReportProgress = {
  reportId: string;
  answers: WizardAnswers;
  flagged: FlaggedItem[];
  currentIndex: number;
  paid: boolean;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  hasLifetimeAccess: boolean;
};

export type StoreShape = {
  user: User | null;
  reports: CreditReport[];
  progress: { [reportId: string]: ReportProgress };
};
