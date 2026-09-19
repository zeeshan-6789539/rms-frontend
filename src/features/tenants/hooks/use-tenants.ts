"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tenantKeys } from "@/features/tenants/api/tenant-keys";
import { fetchTenants } from "@/features/tenants/api/tenants.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { ITenantListItem, ITenantQueryParams } from "@/types/tenant";

export const useTenants = (params: ITenantQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<ITenantListItem>, IApiError>({
    queryKey: tenantKeys.list(params),
    queryFn: () => fetchTenants(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
