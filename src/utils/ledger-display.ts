import type { ILedgerEntry } from "@/types/ledger";

// Monthly rent is shown on the 1st of its month; the stored due date is left untouched
export const getLedgerDisplayDate = (entry: ILedgerEntry): string => {
  const date = entry.dueDate ?? entry.createdAt;
  if (entry.entryType !== "monthly_rent" || !entry.dueDate) return date;
  return `${entry.dueDate.slice(0, 7)}-01`;
};
