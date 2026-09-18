"use client";

import { useQuery } from "@tanstack/react-query";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { fetchLease } from "@/features/leases/api/leases.api";
import type { IApiError } from "@/types/api";
import type { ILease } from "@/types/lease";

export const useLease = (id: string, isEnabled = true) =>
  useQuery<ILease, IApiError>({
    queryKey: leaseKeys.detail(id),
    queryFn: () => fetchLease(id),
    enabled: isEnabled,
  });
