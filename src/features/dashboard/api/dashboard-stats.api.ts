import { apiClient } from "@/lib/api-client";
import type { IDashboardStats } from "@/types/dashboard-stats";

export const fetchDashboardStats = async (): Promise<IDashboardStats> => {
  const { data } = await apiClient.get<IDashboardStats>("/dashboard/stats");
  return data;
};
