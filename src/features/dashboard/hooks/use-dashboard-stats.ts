"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/api/dashboard-keys";
import { fetchDashboardStats } from "@/features/dashboard/api/dashboard-stats.api";
import type { IApiError } from "@/types/api";
import type { IDashboardStats, TDashboardTrendRange } from "@/types/dashboard-stats";

export const useDashboardStats = (trendRange: TDashboardTrendRange) =>
  useQuery<IDashboardStats, IApiError>({
    queryKey: dashboardKeys.stats(trendRange),
    queryFn: () => fetchDashboardStats(trendRange),
    placeholderData: keepPreviousData,
  });
