import type { TPeriodFilter } from "@/types/query-params";

export interface IPeriodRange {
  start: Date;
  end: Date;
}

// "all" returns null so callers can skip filtering entirely
export const getPeriodRange = (period: TPeriodFilter): IPeriodRange | null => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  switch (period) {
    case "current_month":
      return { start: currentMonthStart, end: nextMonthStart };
    case "last_month":
      return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: currentMonthStart };
    case "last_3_months":
      return { start: new Date(now.getFullYear(), now.getMonth() - 2, 1), end: nextMonthStart };
    case "last_6_months":
      return { start: new Date(now.getFullYear(), now.getMonth() - 5, 1), end: nextMonthStart };
    default:
      return null;
  }
};
