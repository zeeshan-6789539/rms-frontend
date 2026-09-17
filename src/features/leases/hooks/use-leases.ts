"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { fetchLeases } from "@/features/leases/api/leases.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { ILease, ILeaseQueryParams } from "@/types/lease";

export const useLeases = (params: ILeaseQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<ILease>, IApiError>({
    queryKey: leaseKeys.list(params),
    queryFn: () => fetchLeases(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
