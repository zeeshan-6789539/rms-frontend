"use client";

import { useMemo } from "react";
import { useLeases } from "@/features/leases/hooks/use-leases";
import { MAX_PAGE_SIZE } from "@/config/pagination";

// One page of active leases is enough to label and pick a lease in the payment/ledger forms
export const useLeaseOptions = (isEnabled = true) => {
  const { data, isPending } = useLeases(
    { page: 1, limit: MAX_PAGE_SIZE, status: "active" },
    isEnabled,
  );

  return useMemo(() => {
    const leases = data?.items ?? [];

    return {
      options: leases.map((lease) => ({
        value: lease.id,
        label: `${lease.propertyName} – ${lease.tenantName}`,
      })),
      leaseById: new Map(leases.map((lease) => [lease.id, lease])),
      isPending,
    };
  }, [data, isPending]);
};
