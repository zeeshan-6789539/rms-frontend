"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantKeys } from "@/features/tenants/api/tenant-keys";
import { createTenant, updateTenant } from "@/features/tenants/api/tenants.api";
import type { IApiError } from "@/types/api";
import type { ISaveTenantArgs, ITenant } from "@/types/tenant";

export const useSaveTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<ITenant, IApiError, ISaveTenantArgs>({
    mutationFn: ({ id, payload }) =>
      id ? updateTenant(id, payload) : createTenant(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.all }),
  });
};
