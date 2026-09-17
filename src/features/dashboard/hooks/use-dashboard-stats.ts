"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/api/dashboard-keys";
import { fetchDashboardStats } from "@/features/dashboard/api/dashboard-stats.api";
import type { IApiError } from "@/types/api";
import type { IDashboardStats } from "@/types/dashboard-stats";

export const useDashboardStats = () =>
  useQuery<IDashboardStats, IApiError>({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
  });
