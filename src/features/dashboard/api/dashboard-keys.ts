import type { TDashboardTrendRange } from "@/types/dashboard-stats";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (trendRange: TDashboardTrendRange) =>
    [...dashboardKeys.all, "stats", trendRange] as const,
};
