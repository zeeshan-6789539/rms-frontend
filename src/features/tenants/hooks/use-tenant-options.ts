"use client";

import { useMemo } from "react";
import { useTenants } from "@/features/tenants/hooks/use-tenants";
import { MAX_PAGE_SIZE } from "@/config/pagination";

// One page of tenants is enough to label and pick a tenant in the lease form
export const useTenantOptions = (isEnabled = true) => {
  const { data, isPending } = useTenants(
    { page: 1, limit: MAX_PAGE_SIZE, status: true },
    isEnabled,
  );

  return useMemo(() => {
    const tenants = data?.items ?? [];

    return {
      options: tenants.map((tenant) => ({
        value: tenant.id,
        label: tenant.name,
      })),
      nameById: new Map(tenants.map((tenant) => [tenant.id, tenant.name])),
      isPending,
    };
  }, [data, isPending]);
};
