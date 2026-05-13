import type { CreditReport, FlaggedItem, User } from "./types";
import { formatMonthYear } from "./mock-data";

export type Bureau = "Experian" | "Equifax" | "TransUnion";

const BUREAU_ADDRESSES: Record<Bureau, string> = {
  Experian: "Experian\nP.O. Box 4500\nAllen, TX 75013",
  Equifax: "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374",
  TransUnion: "TransUnion LLC Consumer Dispute Center\nP.O. Box 2000\nChester, PA 19016",
};

export function generateLetter(opts: {
  bureau: Bureau;
  user: User;
  report: CreditReport;
  flagged: FlaggedItem[];
}): string {
  const { bureau, user, report, flagged } = opts;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const grouped = flagged.reduce<Record<string, FlaggedItem[]>>((acc, f) => {
    acc[f.tradelineId] = acc[f.tradelineId] || [];
    acc[f.tradelineId].push(f);
    return acc;
  }, {});

  const itemBlocks = Object.entries(grouped).map(([tradelineId, items], idx) => {
    const tradeline = report.tradelines.find((t) => t.id === tradelineId);
    if (!tradeline) return "";
    const reasons = items
      .map(
        (i) =>
          `   - ${i.reasonLabel} (${i.fcraCitation}): ${i.userExplanation}`
      )
      .join("\n");
    return `${idx + 1}. Creditor: ${tradeline.creditor}
   Account #: ${tradeline.accountNumberMasked}
   Date Opened: ${formatMonthYear(tradeline.dateOpened)}
   Reported Balance: $${tradeline.balance.toLocaleString()}

   Reason(s) for dispute:
${reasons}

   Requested Action: Investigate this item and, if it cannot be fully verified
   with the original signed instrument, remove it from my credit file in
   accordance with the FCRA.`;
  });

  return `${today}

${user.fullName}
[Your Street Address]
[Your City, State, ZIP]
SSN (last 4): xxxx
Date of Birth: [MM/DD/YYYY]

${BUREAU_ADDRESSES[bureau]}

Re: Formal Dispute of Inaccurate Information — Request for Investigation
    Consumer File: ${user.fullName}

To Whom It May Concern,

I am writing to formally dispute information appearing on my ${bureau} credit
report. Under the Fair Credit Reporting Act (15 U.S.C. § 1681 et seq.), I have
the right to an accurate credit file, and you have a duty to conduct a
reasonable investigation of any disputed item within 30 days.

The following items on my report are inaccurate, incomplete, or unverifiable,
and I am requesting that you investigate them and either correct or delete the
information from my file:

${itemBlocks.join("\n\n")}

Pursuant to FCRA § 1681i, please conduct a reasonable investigation of these
items. If the furnisher cannot produce verifiable documentation establishing
the accuracy and ownership of each disputed item, the law requires that the
item be deleted from my consumer file.

Please send me written confirmation of the results of your investigation,
including any updated copy of my credit report, within 30 days as required by
law.

Sincerely,


${user.fullName}

Enclosures:
  - Copy of government-issued photo ID
  - Copy of utility bill or bank statement for proof of address
`;
}
