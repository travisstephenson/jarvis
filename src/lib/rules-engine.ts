import type { FlaggedItem, Tradeline, WizardAnswers } from "./types";

type Rule = {
  code: string;
  label: string;
  citation: string;
  explanation: string;
};

const RULES: Record<string, Rule> = {
  NOT_MINE: {
    code: "NOT_MINE",
    label: "Account Not Mine",
    citation: "FCRA § 1681i(a)",
    explanation:
      "Under the FCRA, credit bureaus must remove information they cannot verify belongs to you. If this account is not yours, the bureau is required to investigate and delete it within 30 days if it cannot be verified.",
  },
  INACCURATE_BALANCE: {
    code: "INACCURATE_BALANCE",
    label: "Inaccurate Balance",
    citation: "FCRA § 1681s-2(a)(1)(A)",
    explanation:
      "Furnishers are prohibited from reporting information they know — or have reasonable cause to believe — is inaccurate. A wrong balance must be corrected once disputed and verified.",
  },
  INACCURATE_DATE: {
    code: "INACCURATE_DATE",
    label: "Inaccurate Date Reported",
    citation: "FCRA § 1681c(c)(1)",
    explanation:
      "Dates of activity must accurately reflect when the account was opened, last paid, or first became delinquent. Reporting an inaccurate date can extend a debt's reporting period unlawfully.",
  },
  INACCURATE_STATUS: {
    code: "INACCURATE_STATUS",
    label: "Inaccurate Account Status",
    citation: "FCRA § 1681e(b)",
    explanation:
      "Credit bureaus are required to follow reasonable procedures to assure maximum possible accuracy. An incorrect account status (e.g., marked late when paid on time) violates this duty.",
  },
  RE_AGED_DEBT: {
    code: "RE_AGED_DEBT",
    label: "Potentially Re-Aged Debt",
    citation: "FCRA § 1681c(a)(4)",
    explanation:
      "Negative items generally cannot be reported beyond 7 years from the date of first delinquency. Updating the date of last activity to keep an old debt on the report — \"re-aging\" — is a violation.",
  },
  UNVERIFIED_COLLECTION: {
    code: "UNVERIFIED_COLLECTION",
    label: "Unverified Collection Account",
    citation: "FDCPA § 1692g; FCRA § 1681i",
    explanation:
      "When you dispute a collection, the debt collector must validate the debt by providing proof of ownership and the original account agreement. If they cannot, the item must be deleted.",
  },
  DUPLICATE_ACCOUNT: {
    code: "DUPLICATE_ACCOUNT",
    label: "Duplicate Reporting",
    citation: "FCRA § 1681e(b)",
    explanation:
      "The same debt cannot be reported by multiple collectors as separate accounts. Duplicate tradelines for the same underlying obligation harm your file unfairly and must be removed.",
  },
};

export function evaluateTradeline(
  tradeline: Tradeline,
  answers: WizardAnswers[string] | undefined
): FlaggedItem[] {
  if (!answers) return [];
  const flags: FlaggedItem[] = [];

  const push = (ruleCode: keyof typeof RULES, userExplanation: string) => {
    const r = RULES[ruleCode];
    flags.push({
      id: `${tradeline.id}-${r.code}`,
      tradelineId: tradeline.id,
      reasonCode: r.code,
      reasonLabel: r.label,
      fcraCitation: r.citation,
      legalExplanation: r.explanation,
      userExplanation,
    });
  };

  if (answers.isMine === "no") {
    push("NOT_MINE", "You indicated this account is not yours.");
    if (tradeline.type === "collection") {
      push(
        "UNVERIFIED_COLLECTION",
        "Because this is a collection account you don't recognize, the collector must validate the debt or remove it."
      );
    }
    // If not yours, other answers don't matter; return early.
    return flags;
  }

  if (answers.balanceCorrect === "no") {
    push("INACCURATE_BALANCE", `You indicated the reported balance is incorrect.`);
  }

  if (answers.dateCorrect === "no") {
    push("INACCURATE_DATE", "You indicated the date(s) reported on this account are not accurate.");
    // Heuristic: old collections with recent activity = re-aging.
    if (tradeline.type === "collection") {
      const openedYear = parseInt(tradeline.dateOpened.split("-")[0], 10);
      const lastYear = parseInt(tradeline.lastActivity.split("-")[0], 10);
      if (!Number.isNaN(openedYear) && !Number.isNaN(lastYear) && lastYear - openedYear >= 5) {
        push(
          "RE_AGED_DEBT",
          "This collection was opened years ago but shows recent activity — a common sign of unlawful re-aging."
        );
      }
    }
  }

  if (answers.statusCorrect === "no") {
    push("INACCURATE_STATUS", "You indicated the reported account status is inaccurate.");
  }

  if (answers.recognizesActivity === "no" && tradeline.type !== "collection") {
    push(
      "INACCURATE_STATUS",
      "You don't recognize the recent activity on this account, which suggests it may be misreported."
    );
  }

  return flags;
}
