"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantKeys } from "@/features/tenants/api/tenant-keys";
import { deactivateTenant, restoreTenant } from "@/features/tenants/api/tenants.api";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { IStatusChangeArgs } from "@/types/mutation";
import type { ITenant } from "@/types/tenant";

export const useTenantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ITenant, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreTenant(id) : deactivateTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      // Leases are listed with their tenant's name, so their lists go stale too
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
