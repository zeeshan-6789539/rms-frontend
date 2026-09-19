import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IDashboardStats, TDashboardTrendRange } from "@/types/dashboard-stats";

export const fetchDashboardStats = async (
  trendRange: TDashboardTrendRange,
): Promise<IDashboardStats> => {
  const { data } = await apiClient.get<IDashboardStats>("/dashboard/stats", {
    params: buildQueryParams({ trendRange }),
  });
  return data;
};
